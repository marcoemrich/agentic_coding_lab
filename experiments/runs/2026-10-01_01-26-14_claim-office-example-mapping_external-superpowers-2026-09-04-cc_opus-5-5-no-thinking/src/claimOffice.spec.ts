import { describe, expect, it } from 'vitest';
import { runScenario, type Item, type Scenario } from './claimOffice';

const newcomer = { yearsWithMHPCO: 0 };

function quote(items: Item[], customer = newcomer): number {
  const { results } = runScenario({ customer, steps: [{ op: 'quote', items }] });
  return (results[0] as { premium: number }).premium;
}

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toBe(5);
  });
});

describe('quote: main items', () => {
  it('charges base premium plus 10% first insurance plus fee for a plain sword', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }])).toBe(115);
  });

  it.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('uses the price list base premium for a plain %s', (type, premium) => {
    expect(quote([{ type }])).toBe(premium);
  });
});

describe('quote: validation', () => {
  it('rejects an item with an unknown type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('quote: components', () => {
  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

  it.each([
    [2, 60], // 50 base + 5 first insurance + 5 fee
    [3, 71], // 60 block base + 6 + 5
    [4, 115], // 100 base (no block) + 10 + 5
  ])('charges %i runes with the exactly-3 block rule', (n, premium) => {
    expect(quote(runes(n))).toBe(premium);
  });

  it('does not form a block from different component types (2 runes + 1 moonstone = 75 base)', () => {
    expect(quote([...runes(2), { type: 'moonstone' }])).toBe(88); // 75 + 7.5 + 5 = 87.5
  });

  it('forms a separate block per component type (3 runes + 3 moonstones = 120 base)', () => {
    expect(quote([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))])).toBe(137);
  });

  it('rounds a fractional premium up in the MHPCO favour (7 runes: 175 + 17.5 + 5 = 197.5)', () => {
    expect(quote(runes(7))).toBe(198);
  });
});

describe('quote: item-specific modifiers', () => {
  it('adds the 50% curse surcharge on the cursed item only, not the policy total', () => {
    // 160 base + 50 curse (of the sword) + 16 first insurance (of 160) + 5 fee
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });

  it.each([
    [4, false, 115], // 100 + 10 + 5
    [5, false, 145], // 100 + 30 high enchantment + 10 + 5
    [4, true, 165], // 100 + 50 curse + 10 + 5
    [5, true, 195], // 100 + 50 + 30 + 10 + 5
  ])('sword with enchantment %i (cursed: %s) costs %i', (enchantment, cursed, premium) => {
    expect(quote([{ type: 'sword', enchantment, cursed }])).toBe(premium);
  });
});

describe('quote: policy-wide modifiers', () => {
  it.each([
    [1, 115], // 100 + 10 + 5
    [2, 95], // 100 - 20 loyalty + 10 + 5
  ])('customer with %i years with MHPCO pays %i for a plain sword', (yearsWithMHPCO, premium) => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO })).toBe(premium);
  });

  it('gives a 15% follow-up discount on every contract after the first', () => {
    const sword = { op: 'quote' as const, items: [{ type: 'sword' }] };
    const { results } = runScenario({ customer: newcomer, steps: [sword, sword, sword] });
    // 115, then 100 + 10 first insurance - 15 follow-up + 5
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
  });
});

describe('quote: integration examples', () => {
  it('newcomer with a cursed sword pays 165', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });

  it("long-standing customer's second contract for a cursed, enchanted sword pays 160", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    // 100 + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
    expect(results[1]).toEqual({ premium: 160 });
  });
});

function claims(items: Item[], ...damageLists: { itemType: string; amount: number }[][]) {
  const steps = [
    { op: 'quote', items },
    ...damageLists.map((damages) => ({ op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } })),
  ];
  return runScenario({ customer: newcomer, steps } as Scenario).results.slice(1);
}

describe('claim', () => {
  it('reimburses the damage minus the 100 G deductible when no special clause applies', () => {
    const [result] = claims([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }]);
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
});

describe('claim: deductible and cap', () => {
  it('applies the deductible once per damaged item', () => {
    const [result] = claims(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    // cap 2 x (1000 + 600) = 3200
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('reimburses component damage minus deductible, capped on the component insurance value', () => {
    const [result] = claims([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 400 }); // cap 2 x 250 = 500
  });

  it('bases the cap on the unblocked insurance value of components', () => {
    const runes = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];
    const [result] = claims([{ type: 'sword' }, ...runes], [{ itemType: 'sword', amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 3400 }); // cap 2 x (1000 + 3 x 250) = 3500
  });

  it('reduces a claim to the remaining cap once the cap is exhausted', () => {
    const results = claims([{ type: 'sword' }], [{ itemType: 'sword', amount: 1500 }], [{ itemType: 'sword', amount: 1500 }]);
    expect(results).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    const [result] = claims([{ type: 'sword', cursed: true }], [{ itemType: 'sword', amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 1900 });
  });
});

describe('claim: special clauses', () => {
  it.each([
    ['steel', 9, 1000, 400], // 50% first, then deductible
    ['dragon', 9, 1000, 400], // both clauses: the 50% rule wins
    ['dragon', 8, 1000, 400], // threshold is inclusive
    ['dragon', 5, 800, 700], // dragon material only: full reimbursement
    ['steel', 7, 800, 700], // no special clause
  ])('%s sword with enchantment %i, damage %i -> payout %i', (material, enchantment, amount, payout) => {
    const [result] = claims([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }]);
    expect(result).toMatchObject({ payout });
  });

  it('rounds a fractional payout down in the MHPCO favour (50% of 901 = 450.5, minus 100)', () => {
    const [result] = claims([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }]);
    expect(result).toMatchObject({ payout: 350 });
  });
});

describe('claim: multiple items of the same type', () => {
  it('treats each damage entry as a separate damage to a separate insured item', () => {
    const [result] = claims(
      [
        { type: 'sword', enchantment: 9 },
        { type: 'sword', enchantment: 3 },
      ],
      [
        { itemType: 'sword', amount: 1000 },
        { itemType: 'sword', amount: 1000 },
      ],
    );
    // (500 - 100) + (1000 - 100); cap 2 x 2000 = 4000
    expect(result).toEqual({ payout: 1300, remainingCap: 2700 });
  });
});

describe('claim: validation', () => {
  it.each([
    ['an item not covered by the policy', [{ itemType: 'amulet', amount: 200 }], /amulet/],
    ['an unknown item type', [{ itemType: 'broomstick', amount: 200 }], /broomstick/],
    [
      'more damages of a type than insured items',
      [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ],
      /sword/,
    ],
    ['a negative damage amount', [{ itemType: 'sword', amount: -200 }], /-200/],
  ])('rejects the whole claim for %s', (_case, damages, message) => {
    expect(() => claims([{ type: 'sword' }], damages)).toThrow(message);
  });
});

describe('claim: policy reference and small damages', () => {
  it('rejects a claim referencing a step that is not a quote', () => {
    const scenario = {
      customer: newcomer,
      steps: [{ op: 'claim', policy: 3, incident: { cause: 'fire', damages: [] } }],
    } as Scenario;
    expect(() => runScenario(scenario)).toThrow(/policy/i);
  });

  it('pays nothing (rather than a negative amount) for damage below the deductible', () => {
    const [result] = claims(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 50 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    expect(result).toEqual({ payout: 200, remainingCap: 3000 });
  });
});
