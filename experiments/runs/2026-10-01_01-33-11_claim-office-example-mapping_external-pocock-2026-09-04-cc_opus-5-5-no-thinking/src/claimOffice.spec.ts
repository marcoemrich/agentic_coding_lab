import { describe, it, expect } from 'vitest';
import { runScenario, type Item } from './claimOffice';

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });

  it('prices a plain sword for a newcomer with first-insurance surcharge and fee', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }])).toEqual({ premium: 115 });
  });

  it('newcomer with a cursed sword pays 165', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });

  it('adds the high-enchantment surcharge at exactly enchantment 5', () => {
    // 100 + 30 high enchantment + 10 first insurance + 5 fee
    expect(quote([{ type: 'sword', enchantment: 5 }])).toEqual({ premium: 145 });
  });

  it('applies both curse and high-enchantment surcharges to a cursed enchantment-5 sword', () => {
    // 100 + 50 + 30 + 10 + 5
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });

  it('adds no high-enchantment surcharge at enchantment 4', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toEqual({ premium: 115 });
  });

  it('applies the curse surcharge only to the cursed item on a multi-item policy', () => {
    // base 160, curse +50 (of sword's 100) = 210; first insurance +16 (of 160); fee 5
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });

  it('uses the price list base premiums for staff and potion', () => {
    // base 120, +12 first insurance, +5 fee
    expect(quote([{ type: 'staff' }, { type: 'potion' }])).toEqual({ premium: 137 });
  });

  it('grants the loyalty discount to a customer with exactly 2 years', () => {
    // 100 - 20 loyalty + 10 first insurance + 5 fee
    expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 });
  });

  it('grants no loyalty discount below 2 years', () => {
    expect(quote([{ type: 'sword' }], 1)).toEqual({ premium: 115 });
  });

  it("long-standing customer's second contract for a cursed enchantment-7 sword pays 160", () => {
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

describe('component building blocks', () => {
  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));
  // newcomer premium = ceil(base × 1.1) + 5 fee
  it.each([
    [2, 50, 60],
    [3, 60, 71],
    [4, 100, 115],
    [7, 175, 198],
  ])('%i runes have base premium %i (premium %i)', (count, _base, premium) => {
    expect(quote(runes(count))).toEqual({ premium });
  });

  it('does not form a block from 2 runes + 1 moonstone (base 75)', () => {
    expect(quote([...runes(2), { type: 'moonstone' }])).toEqual({ premium: 88 });
  });

  it('forms two separate blocks from 3 runes + 3 moonstones (base 120)', () => {
    expect(quote([...runes(3), { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }])).toEqual({
      premium: 137,
    });
  });
});

type Damage = { itemType: string; amount: number };
const claims = (items: Item[], ...claimDamages: Damage[][]) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: 'quote', items },
      ...claimDamages.map((damages) => ({
        op: 'claim' as const,
        policy: 0,
        incident: { cause: 'dragon attack', damages },
      })),
    ],
  }).results.slice(1);
const claim = (items: Item[], damages: Damage[]) => claims(items, damages)[0];

describe('claim', () => {
  it('reimburses a regular sword in full minus the deductible', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword with enchantment %i and damage %i pays out %i', (material, enchantment, amount, payout) => {
    expect(claim([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }])).toMatchObject({ payout });
  });

  it('rounds a fractional payout down in the MHPCO favor (350.5 → 350)', () => {
    // 50 % of 901 = 450.5, minus 100 deductible = 350.5
    expect(claim([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }])).toMatchObject({ payout: 350 });
  });

  it('reimburses a rune in full minus the deductible', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });

  it('applies the deductible once per damaged item', () => {
    expect(
      claim(
        [{ type: 'sword' }, { type: 'amulet' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ],
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('treats two damaged swords on a two-sword policy as separate damages', () => {
    expect(
      claim(
        [{ type: 'sword' }, { type: 'sword' }],
        [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 700 },
        ],
      ),
    ).toEqual({ payout: 1000, remainingCap: 3000 });
  });

  it('bases the cap on the unmodified insurance value of a cursed sword', () => {
    expect(claim([{ type: 'sword', cursed: true }], [{ itemType: 'sword', amount: 100 }])).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });

  it('counts each block component at full insurance value in the insurance sum', () => {
    // 1000 + 3 × 250 = 1750, cap 3500
    expect(
      claim([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], [{ itemType: 'rune', amount: 100 }]),
    ).toEqual({ payout: 0, remainingCap: 3500 });
  });

  it('reduces a claim to the remaining cap once it is exhausted', () => {
    const sword = [{ type: 'sword' }];
    const damage = [{ itemType: 'sword', amount: 1500 }];
    expect(claims(sword, damage, damage)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});

describe('invalid scenarios', () => {
  it('rejects a quote with an unknown item type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });

  it.each([
    ['an amulet when only a sword is insured', [{ itemType: 'amulet', amount: 200 }]],
    ['an unknown item type', [{ itemType: 'broomstick', amount: 200 }]],
    [
      'two swords when only one is insured',
      [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 200 },
      ],
    ],
  ])('rejects a claim for %s', (_, damages) => {
    expect(() => claim([{ type: 'sword' }], damages)).toThrow(/not covered/);
  });

  it('rejects a claim with a negative damage amount', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(/amount/);
  });
});
