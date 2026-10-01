import { describe, it, expect } from 'vitest';
import { runScenario, type Item } from './claimOffice';

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
});

describe('main item base premiums (newcomer: +10% first insurance, +5 G fee)', () => {
  it.each([
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('a plain %s costs %i G', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
});

describe('item-specific modifiers', () => {
  it('newcomer with a cursed steel sword (enchantment 3) pays 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({
      premium: 165,
    });
  });
});

describe('high-enchantment threshold', () => {
  it.each([
    [5, false, 145],
    [5, true, 195],
    [4, false, 115],
    [4, true, 165],
  ])('sword with enchantment %i, cursed=%s costs %i G', (enchantment, cursed, premium) => {
    expect(quote([{ type: 'sword', enchantment, cursed }])).toEqual({ premium });
  });
});

describe('loyalty discount', () => {
  it.each([
    [1, 115],
    [2, 95],
    [3, 95],
  ])('customer with %i years pays %i G for a plain sword', (years, premium) => {
    expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
  });
});

describe('follow-up contract discount', () => {
  it("long-standing customer's second quote for a cursed enchantment-7 sword costs 160 G", () => {
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

describe('components and building blocks (newcomer: base × 1.1 + 5, rounded up)', () => {
  const many = (type: string, n: number) => Array.from({ length: n }, () => ({ type }));

  it.each([
    ['2 runes (base 50)', many('rune', 2), 60],
    ['3 runes (block, base 60)', many('rune', 3), 71],
    ['4 runes (no block, base 100)', many('rune', 4), 115],
    ['7 runes (base 175)', many('rune', 7), 198],
    ['2 runes + 1 moonstone (base 75)', [...many('rune', 2), { type: 'moonstone' }], 88],
    ['3 runes + 3 moonstones (two blocks, base 120)', [...many('rune', 3), ...many('moonstone', 3)], 137],
  ])('%s', (_label, items, premium) => {
    expect(quote(items)).toEqual({ premium });
  });
});

describe('modifier scope on multi-item policies', () => {
  it('curse surcharge applies only to the cursed sword: 160 + 50 + 16 first insurance + 5 = 231 G', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
});

describe('quote validation', () => {
  it('rejects an item of unknown type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

type Damage = { itemType: string; amount: number };
const claimStep = (damages: Damage[], policy = 0) => ({
  op: 'claim' as const,
  policy,
  incident: { cause: 'dragon attack', damages },
});
const claims = (items: Item[], ...damageLists: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: 'quote', items }, ...damageLists.map((d) => claimStep(d))],
  }).results.slice(1);

describe('claim: standard reimbursement', () => {
  it('regular steel sword (enchantment 3), damage 500 G → payout 400 G', () => {
    expect(claims([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual([
      { payout: 400, remainingCap: 1600 },
    ]);
  });
});

describe('claim: enchantment threshold vs. dragon material', () => {
  it.each([
    ['dragon', 9, 1000, 400],
    ['dragon', 8, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword, enchantment %i, damage %i G → payout %i G', (material, enchantment, amount, payout) => {
    const [result] = claims([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }]);
    expect(result).toMatchObject({ payout });
  });
});

describe('claim: rounding in the MHPCO favour', () => {
  it('a payout of 350.5 G (50% of 901 − 100) is rounded down to 350 G', () => {
    const [result] = claims([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }]);
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
});

describe('claim: deductible per damaged item', () => {
  it('dragon attack on sword (500 G) and amulet (300 G) → payout 600 G', () => {
    const [result] = claims(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    expect(result).toMatchObject({ payout: 600 });
  });

  it('rune damaged by 200 G → payout 100 G', () => {
    const [result] = claims([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]);
    expect(result).toMatchObject({ payout: 100 });
  });

  it('two insured swords both damaged → each damage has its own deductible, cap 4000 G', () => {
    const [result] = claims(
      [{ type: 'sword' }, { type: 'sword' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 700 },
      ],
    );
    expect(result).toEqual({ payout: 1000, remainingCap: 3000 });
  });
});

describe('claim: cap', () => {
  it.each([
    ['sword + amulet (insurance sum 1600 G)', [{ type: 'sword' }, { type: 'amulet' }], 3200],
    ['cursed sword (insurance value unaffected by premium)', [{ type: 'sword', cursed: true }], 2000],
    ['sword + 3 runes block (insurance sum 1750 G)', [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
  ])('%s → cap %i G', (_label, items: Item[], cap) => {
    const [result] = claims(items, [{ itemType: 'sword', amount: 100 }]);
    expect(result).toEqual({ payout: 0, remainingCap: cap });
  });

  it('two successive 1500 G claims on a sword exhaust the 2000 G cap', () => {
    const results = claims([{ type: 'sword' }], [{ itemType: 'sword', amount: 1500 }], [{ itemType: 'sword', amount: 1500 }]);
    expect(results).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});

describe('claim validation', () => {
  it.each([
    ['an amulet damaged when only a sword is insured', [{ itemType: 'amulet', amount: 300 }], /amulet/],
    ['an item of unknown type', [{ itemType: 'broomstick', amount: 300 }], /broomstick/],
    [
      'two sword damages when only one sword is insured',
      [
        { itemType: 'sword', amount: 300 },
        { itemType: 'sword', amount: 300 },
      ],
      /sword/,
    ],
    ['a negative damage amount', [{ itemType: 'sword', amount: -200 }], /-200/],
  ])('rejects %s', (_label, damages: Damage[], message) => {
    expect(() => claims([{ type: 'sword' }], damages)).toThrow(message);
  });
});

describe('claim policy reference', () => {
  it('rejects a claim whose policy index is not a quote step', () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [claimStep([{ itemType: 'sword', amount: 300 }], 0)] };
    expect(() => runScenario(scenario)).toThrow(/policy 0/);
  });
});
