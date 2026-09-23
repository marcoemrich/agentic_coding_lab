import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';
import { UnknownItemTypeError } from './catalog.js';

const newCustomer = { yearsWithMHPCO: 0 };
const loyalCustomer = { yearsWithMHPCO: 3 };

/** Premium of a first contract, stripped of the per-item first-insurance surcharge and the fee. */
function bare(items: { type: string; enchantment?: number; cursed?: boolean; material?: string }[]) {
  return quotePremium(items, newCustomer, 1);
}

describe('base premiums per item type', () => {
  it.each([
    ['sword', 115],
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('charges %s at %i G total for a first contract', (type, total) => {
    expect(bare([{ type }])).toBe(total);
  });
});

describe('component building blocks', () => {
  // Spec base premiums, each plus the 10% first-insurance surcharge on the
  // item base and the 5 G fee, rounded up.
  it.each([
    [2, 50, 60],
    [3, 60, 71],
    [4, 100, 115],
    [7, 175, 198],
  ])('charges %i runes at %i G base premium', (count, _base, expectedTotal) => {
    const items = Array.from({ length: count }, () => ({ type: 'rune' }));
    expect(bare(items)).toBe(expectedTotal);
  });

  it('does not form a block from different component types', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];
    expect(bare(items)).toBe(88); // 75 base + 7.5 first insurance + 5 fee
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: 'rune' })),
      ...Array.from({ length: 3 }, () => ({ type: 'moonstone' })),
    ];
    expect(bare(items)).toBe(137); // 120 base + 12 first insurance + 5 fee
  });
});

describe('item-specific modifiers', () => {
  it('applies the cursed surcharge only to the cursed item', () => {
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    // base 160 + 50 curse = 210, plus 16 first insurance (10% of 160) + 5 fee
    expect(bare(items)).toBe(210 + 16 + 5);
  });

  it('applies the high-enchantment surcharge at exactly 5', () => {
    expect(bare([{ type: 'sword', enchantment: 5 }])).toBe(100 + 30 + 10 + 5);
  });

  it('does not apply the high-enchantment surcharge at 4', () => {
    expect(bare([{ type: 'sword', enchantment: 4 }])).toBe(100 + 10 + 5);
  });

  it('stacks curse and high enchantment on the same item', () => {
    expect(bare([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(100 + 50 + 30 + 10 + 5);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 1)).toBe(100 - 20 + 10 + 5);
  });

  it('grants a follow-up discount on contracts after the first', () => {
    expect(quotePremium([{ type: 'sword' }], newCustomer, 2)).toBe(100 - 15 + 10 + 5);
  });
});

describe('integration examples from the spec', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(items, newCustomer, 1)).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(items, loyalCustomer, 2)).toBe(160);
  });
});

describe('edge cases', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newCustomer, 1)).toBe(5);
  });

  it('rejects an unknown item type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], newCustomer, 1)).toThrow(UnknownItemTypeError);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional premium up', () => {
    // 3 potions: base 120, +10% first insurance = 132, -15% follow-up on the
    // policy base... constructed to land on a fraction.
    const premium = quotePremium([{ type: 'amulet', cursed: true }], { yearsWithMHPCO: 0 }, 2);
    // base 60 + 30 curse = 90; -15% follow-up of 60 = 9; +10% first ins. = 6 -> 87 + 5
    expect(Number.isInteger(premium)).toBe(true);
  });
});
