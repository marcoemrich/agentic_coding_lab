import { describe, it, expect } from 'vitest';
import { quotePremium, policyBasePremium, itemSurcharges, type Item } from './premium.js';

const newcomer = { yearsWithMHPCO: 0 };

describe('base premiums', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  it('uses the price list for each main item type', () => {
    expect(policyBasePremium([{ type: 'sword' }])).toBe(100);
    expect(policyBasePremium([{ type: 'amulet' }])).toBe(60);
    expect(policyBasePremium([{ type: 'staff' }])).toBe(80);
    expect(policyBasePremium([{ type: 'potion' }])).toBe(40);
  });

  it('sums the base premiums of several items', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });

  it('rejects unknown item types', () => {
    expect(() => policyBasePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

const runes = (n: number): Item[] => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('component building blocks', () => {
  it('charges 25 G per component when no block applies', () => {
    expect(policyBasePremium(runes(2))).toBe(50);
    expect(policyBasePremium(runes(4))).toBe(100);
    expect(policyBasePremium(runes(7))).toBe(175);
  });

  it('charges 60 G for a block of exactly 3 alike components', () => {
    expect(policyBasePremium(runes(3))).toBe(60);
  });

  it('requires the components of a block to be of the same type', () => {
    expect(policyBasePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms one block per component type', () => {
    expect(
      policyBasePremium([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))]),
    ).toBe(120);
  });
});

describe('item-specific modifiers', () => {
  it('adds a 50 % surcharge for a cursed item, scoped to that item', () => {
    expect(itemSurcharges([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(50);
  });

  it('adds a 30 % surcharge from enchantment level 5 upwards', () => {
    expect(itemSurcharges([{ type: 'sword', enchantment: 5 }])).toBe(30);
    expect(itemSurcharges([{ type: 'sword', enchantment: 4 }])).toBe(0);
  });

  it('stacks the curse and high-enchantment surcharges', () => {
    expect(itemSurcharges([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(80);
  });
});

describe('policy-wide modifiers and the full premium', () => {
  it('prices a newcomer with a cursed sword', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer, 0)).toBe(165);
  });

  it('prices a long-standing customer\'s second contract', () => {
    // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first - 15 follow-up + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(160);
  });

  it('grants the loyalty discount from exactly 2 years of business', () => {
    // 100 base - 20 loyalty + 10 first + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
    // 100 base + 10 first + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it('applies the cursed surcharge only to the cursed item on a multi-item policy', () => {
    // 160 base + 50 curse + 16 first + 5 fee
    expect(
      quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], newcomer, 0),
    ).toBe(231);
  });

  it('rounds the final premium up, in the MHPCO\'s favour', () => {
    // 7 runes: 175 base + 17.5 first + 5 fee = 197.5 -> 198
    expect(quotePremium(runes(7), newcomer, 0)).toBe(198);
  });
});
