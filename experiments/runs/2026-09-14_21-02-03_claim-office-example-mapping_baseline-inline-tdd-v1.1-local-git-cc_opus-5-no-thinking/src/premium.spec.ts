import { describe, it, expect } from 'vitest';
import { quotePremium } from './premium.js';

const newcomer = { yearsWithMHPCO: 0 };
const loyal = { yearsWithMHPCO: 2 };

/** Premium for a customer's very first contract in the scenario. */
const firstContract = (items: Parameters<typeof quotePremium>[1], customer = newcomer) =>
  quotePremium(customer, items, 0);

describe('processing fee', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(firstContract([])).toBe(5);
  });
});

describe('item-specific modifiers', () => {
  it('adds a 50% curse surcharge to the cursed item base premium', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(firstContract([{ type: 'sword', cursed: true, enchantment: 3 }])).toBe(165);
  });

  it('adds a 30% surcharge at exactly enchantment 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(firstContract([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('adds no enchantment surcharge below level 5', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(firstContract([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('stacks curse and high enchantment on the same item', () => {
    // 100 base + 50 curse + 30 enchantment + 10 first insurance + 5 fee
    expect(firstContract([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195);
  });

  it('applies the curse surcharge only to the cursed item, not the policy total', () => {
    // 160 policy base + 50 curse (50% of the sword only) + 16 first insurance + 5 fee
    expect(
      firstContract([
        { type: 'sword', cursed: true, enchantment: 3 },
        { type: 'amulet', enchantment: 1 },
      ]),
    ).toBe(231);
  });
});

describe('policy-wide modifiers', () => {
  it('grants the loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(firstContract([{ type: 'sword', enchantment: 1 }], loyal)).toBe(95);
  });

  it('discounts 15% on each contract after the first', () => {
    // 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(quotePremium(newcomer, [{ type: 'sword', enchantment: 1 }], 1)).toBe(100);
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional premium up', () => {
    // 3 potions: 120 base - 24 loyalty + 12 first insurance = 108 + 5 fee = 113
    // with a follow-up contract: 108 - 18 = 90 ... choose a case that yields .5
    // staff 80 + amulet 60 = 140 base, loyalty -28, first +14 => 126, follow-up -21
    // => 105 + 5 = 110 (whole). Use a single potion with curse for a fraction:
    // 40 base + 20 curse + 4 first = 64 - 8 loyalty = 56 + 5 = 61 (whole).
    // A .5 fraction arises from an odd base with a 15% follow-up discount:
    // rune 25 + 2.5 first = 27.5 - 3.75 follow-up = 23.75 + 5 = 28.75 -> 29
    expect(quotePremium(newcomer, [{ type: 'rune' }], 1)).toBe(29);
  });
});

describe('integration examples', () => {
  it('prices a newcomer with a cursed sword at 165 G', () => {
    expect(
      quotePremium({ yearsWithMHPCO: 0 }, [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
      ], 0),
    ).toBe(165);
  });

  it("prices a long-standing customer's second contract at 160 G", () => {
    expect(
      quotePremium({ yearsWithMHPCO: 3 }, [
        { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
      ], 1),
    ).toBe(160);
  });
});
