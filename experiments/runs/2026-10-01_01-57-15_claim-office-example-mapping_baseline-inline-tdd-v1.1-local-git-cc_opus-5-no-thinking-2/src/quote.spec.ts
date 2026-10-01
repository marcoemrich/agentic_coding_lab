import { describe, it, expect } from 'vitest';
import { quotePremium } from './quote.js';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 3 };

const sword = (over: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) => ({
  type: 'sword',
  material: 'steel',
  enchantment: 3,
  cursed: false,
  ...over,
});

describe('quote premium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, 0)).toBe(5);
  });

  it('adds a 10 % first insurance surcharge and the fee to a plain sword', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quotePremium([sword()], newcomer, 0)).toBe(115);
  });

  describe('item-specific surcharges', () => {
    it('adds 50 % of the cursed item base premium', () => {
      // 100 base + 50 curse + 10 first insurance + 5 fee
      expect(quotePremium([sword({ cursed: true })], newcomer, 0)).toBe(165);
    });

    it('adds 30 % for enchantment of exactly 5', () => {
      // 100 base + 30 high enchantment + 10 first insurance + 5 fee
      expect(quotePremium([sword({ enchantment: 5 })], newcomer, 0)).toBe(145);
    });

    it('adds no high-enchantment surcharge at enchantment 4', () => {
      expect(quotePremium([sword({ enchantment: 4 })], newcomer, 0)).toBe(115);
    });

    it('stacks curse and high enchantment at enchantment exactly 5', () => {
      // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
      expect(quotePremium([sword({ enchantment: 5, cursed: true })], newcomer, 0)).toBe(195);
    });

    it('applies the curse surcharge only to the cursed item, not the policy total', () => {
      // 160 policy base + 50 curse (of the sword alone) + 16 first insurance + 5 fee
      const items = [sword({ cursed: true }), { type: 'amulet' }];
      expect(quotePremium(items, newcomer, 0)).toBe(231);
    });
  });

  describe('policy-wide modifiers', () => {
    it('grants a 20 % loyalty discount at exactly 2 years', () => {
      // 100 base - 20 loyalty + 10 first insurance + 5 fee
      expect(quotePremium([sword()], { yearsWithMHPCO: 2 }, 0)).toBe(95);
    });

    it('grants no loyalty discount below 2 years', () => {
      expect(quotePremium([sword()], { yearsWithMHPCO: 1 }, 0)).toBe(115);
    });

    it('grants a 15 % discount on each contract after the first', () => {
      // 100 base + 10 first insurance - 15 follow-up + 5 fee
      expect(quotePremium([sword()], newcomer, 1)).toBe(100);
    });
  });

  describe('integration examples', () => {
    it('quotes 165 G for a newcomer with a cursed sword', () => {
      expect(quotePremium([sword({ cursed: true })], newcomer, 0)).toBe(165);
    });

    it("quotes 160 G for a long-standing customer's second contract", () => {
      const items = [sword({ cursed: true, enchantment: 7 })];
      expect(quotePremium(items, loyal, 1)).toBe(160);
    });
  });
});

describe('rounding of the final premium only', () => {
  it('rounds a fractional premium up, keeping intermediates as fractions', () => {
    // 3 runes form a block: 60 base; each component carries 20.
    // One cursed rune adds 10; loyalty -12; first insurance +6 => 64 + 5 fee = 69
    const items = [{ type: 'rune', cursed: true }, { type: 'rune' }, { type: 'rune' }];
    expect(quotePremium(items, { yearsWithMHPCO: 2 }, 0)).toBe(69);
  });

  it('rounds up a premium whose exact value is fractional', () => {
    // 7 runes: 175 base; loyalty -35; first insurance +17.5 => 157.5 + 5 = 162.5 -> 163
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(quotePremium(items, { yearsWithMHPCO: 2 }, 0)).toBe(163);
  });
});
