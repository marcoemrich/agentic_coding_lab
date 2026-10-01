import { describe, it, expect } from 'vitest';
import { runScenario, ScenarioError } from './claimOffice';

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });

  it.each([
    // base + 10 % first insurance + 5 G fee
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('prices a plain %s at its base premium plus first-insurance surcharge and fee', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });

  describe('building block of 3 alike components', () => {
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

    it.each([
      // [count, base premium, final premium = ceil(base * 1.1) + 5]
      [2, 50, 60],
      [3, 60, 71],
      [4, 100, 115],
      [7, 175, 198],
    ])('%i runes have base premium %i G', (count, _base, premium) => {
      expect(quote(runes(count))).toEqual({ premium });
    });

    it('does not form a block from different component types (2 runes + 1 moonstone = 75 G base)', () => {
      expect(quote([...runes(2), { type: 'moonstone' }])).toEqual({ premium: 88 });
    });

    it('forms separate blocks per component type (3 runes + 3 moonstones = 120 G base)', () => {
      const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
      expect(quote([...runes(3), ...moonstones])).toEqual({ premium: 137 });
    });
  });

  describe('modifiers', () => {
    it('newcomer with a cursed steel sword (enchantment 3) pays 165 G', () => {
      expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
    });

    it('applies the curse surcharge only to the cursed item, first insurance to the policy base', () => {
      // 160 base + 50 curse + 16 first insurance + 5 fee
      expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
    });

    it.each([
      // [enchantment, cursed, premium]
      [5, false, 145], // 100 + 30 high enchantment + 10 first + 5
      [5, true, 195], // 100 + 50 curse + 30 high enchantment + 10 first + 5
      [4, false, 115], // no high-enchantment surcharge
      [4, true, 165], // curse only
    ])('sword with enchantment %i, cursed=%s pays %i G', (enchantment, cursed, premium) => {
      expect(quote([{ type: 'sword', enchantment, cursed }])).toEqual({ premium });
    });

    it.each([
      [2, 95], // 100 - 20 loyalty + 10 first + 5
      [1, 115], // no loyalty discount
    ])('customer with %i years with MHPCO pays %i G for a plain sword', (years, premium) => {
      expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
    });

    it("long-standing customer's second contract for a cursed sword (enchantment 7) costs 160 G", () => {
      const { results } = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: 'quote', items: [{ type: 'amulet' }] },
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        ],
      });
      expect(results[1]).toEqual({ premium: 160 });
    });
  });
});

const claimsAgainst = (items: Item[], ...damageLists: { itemType: string; amount: number }[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: 'quote', items },
      ...damageLists.map((damages) => ({
        op: 'claim' as const,
        policy: 0,
        incident: { cause: 'dragon attack', damages },
      })),
    ],
  }).results.slice(1);

describe('claim', () => {
  it('reimburses a regular sword in full minus the 100 G deductible', () => {
    const [result] = claimsAgainst(
      [{ type: 'sword', material: 'steel', enchantment: 3 }],
      [{ itemType: 'sword', amount: 500 }],
    );
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it.each([
    // [material, enchantment, damage, payout]
    ['steel', 9, 1000, 400], // 50 % rule, then deductible
    ['dragon', 9, 1000, 400], // both clauses; 50 % rule wins
    ['dragon', 8, 1000, 400], // threshold is inclusive
    ['dragon', 5, 800, 700], // dragon material only: full reimbursement
  ])('%s sword with enchantment %i, damage %i G -> payout %i G', (material, enchantment, amount, payout) => {
    const [result] = claimsAgainst([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }]);
    expect(result).toMatchObject({ payout });
  });

  it('reimburses a rune (no enchantment, no material) in full minus deductible', () => {
    const [result] = claimsAgainst([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]);
    expect(result).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('applies the deductible once per damaged item (sword 500 G + amulet 300 G -> 600 G)', () => {
    const [result] = claimsAgainst(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    // cap = 2 * (1000 + 600) = 3200
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });

  describe('cap', () => {
    it('caps successive claims at twice the insurance sum (sword: 2000 G)', () => {
      const results = claimsAgainst(
        [{ type: 'sword' }],
        [{ itemType: 'sword', amount: 1500 }],
        [{ itemType: 'sword', amount: 1500 }],
      );
      expect(results).toEqual([
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });

    it('bases the cap on the unmodified insurance value of a cursed sword (2000 G)', () => {
      const [result] = claimsAgainst([{ type: 'sword', cursed: true }], [{ itemType: 'sword', amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 1900 });
    });

    it('counts block components at full insurance value (sword + 3 runes: sum 1750 G, cap 3500 G)', () => {
      const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
      const [result] = claimsAgainst([{ type: 'sword' }, ...runes], [{ itemType: 'rune', amount: 200 }]);
      expect(result).toEqual({ payout: 100, remainingCap: 3400 });
    });

    it('covers two swords as separate items, each damage with its own deductible (cap 4000 G)', () => {
      const [result] = claimsAgainst(
        [{ type: 'sword' }, { type: 'sword' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 700 },
        ],
      );
      expect(result).toEqual({ payout: 1000, remainingCap: 3000 });
    });
  });

  it('rounds a payout of 350.5 G down to 350 G', () => {
    // enchantment 9: 50 % of 901 = 450.5, minus 100 deductible = 350.5
    const [result] = claimsAgainst([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('invalid input', () => {
  it('rejects a quote with an unknown item type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });

  it('rejects an item type that only exists on the object prototype', () => {
    expect(() => quote([{ type: 'toString' }])).toThrow(/toString/);
  });

  it.each(['amulet', 'broomstick'])('rejects a claim for a %s that the policy does not cover', (itemType) => {
    expect(() => claimsAgainst([{ type: 'sword' }], [{ itemType, amount: 200 }])).toThrow(ScenarioError);
  });

  it('rejects the whole claim when it has more sword damages than insured swords', () => {
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ];
    expect(() => claimsAgainst([{ type: 'sword' }], damages)).toThrow(ScenarioError);
  });

  it('rejects a claim with a negative damage amount', () => {
    expect(() => claimsAgainst([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(ScenarioError);
  });

  it('rejects a claim referring to a step that is not a quote', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages: [] } }],
    };
    expect(() => runScenario(scenario)).toThrow(ScenarioError);
  });
});
