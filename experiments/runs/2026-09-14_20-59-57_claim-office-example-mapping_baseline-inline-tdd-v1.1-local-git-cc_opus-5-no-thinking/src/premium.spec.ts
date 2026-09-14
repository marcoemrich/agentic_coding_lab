import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 3 };

describe('processing fee', () => {
  it('charges only the fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });
});

describe('item-specific modifiers', () => {
  it('adds 50 % for a cursed item', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }], newcomer, 0)).toBe(
      165,
    );
  });

  it('adds 30 % at exactly enchantment 5', () => {
    // 100 base + 30 high ench + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, 0)).toBe(
      145,
    );
  });

  it('adds no high-enchantment surcharge below 5', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, 0)).toBe(
      115,
    );
  });

  it('stacks curse and high enchantment on the same item', () => {
    // 100 base + 50 curse + 30 high ench + 10 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', cursed: true, enchantment: 5 }],
        newcomer,
        0,
      ),
    ).toBe(195);
  });

  it('applies an item surcharge to that item only, not the policy total', () => {
    // 160 policy base + 50 curse (of the sword alone) + 16 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', cursed: true }, { type: 'amulet' }],
        newcomer,
        0,
      ),
    ).toBe(231);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('grants no loyalty discount below 2 years', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(
      115,
    );
  });

  it('discounts 15 % on each contract after the first', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium([{ type: 'sword' }], newcomer, 1)).toBe(100);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds the final premium up', () => {
    // 2 runes = 50 base; + 5 first insurance - 10 loyalty - 7.5 follow-up
    // = 37.5; + 5 fee = 42.5 -> 43
    expect(
      quotePremium([{ type: 'rune' }, { type: 'rune' }], loyal, 1),
    ).toBe(43);
  });

  it('keeps intermediate amounts fractional', () => {
    // policy-wide percentages come off the policy base (80), never off the
    // surcharge-inflated subtotal: 80 + 24 high ench + 8 first + 5 fee = 117
    expect(quotePremium([{ type: 'staff', enchantment: 6 }], newcomer, 0)).toBe(
      117,
    );
  });
});

describe('integration examples', () => {
  it('prices a newcomer with a cursed sword', () => {
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        newcomer,
        0,
      ),
    ).toBe(165);
  });

  it("prices a long-standing customer's second contract", () => {
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        loyal,
        1,
      ),
    ).toBe(160);
  });
});
