import { describe, it, expect } from 'vitest';
import { quotePremium, policyBasePremium, itemSurcharges } from './premium.js';

const newCustomer = { yearsWithMHPCO: 0 };

describe('base premiums', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newCustomer, 0)).toBe(5);
  });

  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('charges the price-list base premium for a %s', (type, expected) => {
    expect(policyBasePremium([{ type }])).toBe(expected);
  });

  it('sums the base premiums of several main items', () => {
    expect(policyBasePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });
});

const repeat = (type: string, count: number) =>
  Array.from({ length: count }, () => ({ type }));

describe('component blocks', () => {
  it('charges 25 G per component below a block', () => {
    expect(policyBasePremium(repeat('rune', 2))).toBe(50);
  });

  it('charges the block price for exactly 3 alike components', () => {
    expect(policyBasePremium(repeat('rune', 3))).toBe(60);
  });

  it('charges singly again for 4 components, since a block requires exactly 3', () => {
    expect(policyBasePremium(repeat('rune', 4))).toBe(100);
  });

  it('charges singly for 7 components', () => {
    expect(policyBasePremium(repeat('rune', 7))).toBe(175);
  });

  it('forms no block from components of different types', () => {
    expect(policyBasePremium([...repeat('rune', 2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms two separate blocks from 3 runes and 3 moonstones', () => {
    expect(policyBasePremium([...repeat('rune', 3), ...repeat('moonstone', 3)])).toBe(120);
  });
});

describe('item-specific surcharges', () => {
  it('adds 50 % of the cursed item base premium, not of the policy total', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(policyBasePremium(items)).toBe(160);
    expect(itemSurcharges(items)).toBe(50);
  });

  it('adds a 30 % surcharge at exactly enchantment 5', () => {
    expect(itemSurcharges([{ type: 'sword', enchantment: 5 }])).toBe(30);
  });

  it('adds no enchantment surcharge below enchantment 5', () => {
    expect(itemSurcharges([{ type: 'sword', enchantment: 4 }])).toBe(0);
  });

  it('stacks the curse and enchantment surcharges on one item', () => {
    expect(itemSurcharges([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(80);
  });

  it('applies surcharges per component, ignoring the block discount', () => {
    expect(itemSurcharges([{ type: 'rune', cursed: true }])).toBe(12.5);
  });
});

describe('policy-wide modifiers and the final premium', () => {
  it('quotes a newcomer with a cursed sword at 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(165);
  });

  it("quotes a long-standing customer's second contract at 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('grants no loyalty discount below 2 years', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    // 3 runes block 60 + curse 12.5 + first insurance 6 = 78.5 + 5 fee = 83.5 -> 84
    const items = [
      { type: 'rune', cursed: true },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(quotePremium(items, { yearsWithMHPCO: 0 }, 0)).toBe(84);
  });
});
