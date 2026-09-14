import { describe, it, expect } from 'vitest';
import { quotePremium, insuranceSum } from './premium';

describe('quotePremium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, 0)).toBe(5);
  });

  it('adds the base premium of a plain sword plus the first insurance surcharge', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(115);
  });

  it('adds a 50% risk surcharge for a cursed item', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(165);
  });

  it('adds a 30% surcharge at exactly enchantment 5', () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(145);
  });

  it('applies the 20% loyalty discount at exactly 2 years', () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        { yearsWithMHPCO: 2 },
        0,
      ),
    ).toBe(95);
  });

  it('applies a 15% discount on each contract after the first', () => {
    // 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance
    // - 15 follow-up = 155 + 5 fee
    expect(
      quotePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        1,
      ),
    ).toBe(160);
  });

  it('charges 25 G base premium per component', () => {
    // 2 runes -> 50 base + 5 first insurance + 5 fee
    expect(quotePremium([{ type: 'rune' }, { type: 'rune' }], { yearsWithMHPCO: 0 }, 0)).toBe(60);
  });

  it('offers a block of exactly 3 alike components at 60 G', () => {
    // 3 runes -> 60 base + 6 first insurance + 5 fee
    expect(
      quotePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }], { yearsWithMHPCO: 0 }, 0),
    ).toBe(71);
  });

  it('treats only components of the same type as alike', () => {
    // 2 runes + 1 moonstone -> 75 base (no block) + 7.5 first insurance
    // + 5 fee = 87.5 -> 88 rounded in MHPCO's favour
    expect(
      quotePremium(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        { yearsWithMHPCO: 0 },
        0,
      ),
    ).toBe(88);
  });

  it('rejects an item with an unknown type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], { yearsWithMHPCO: 0 }, 0)).toThrow();
  });
});

describe('insuranceSum', () => {
  it('sums the insurance values of the items, ignoring block discounts', () => {
    // sword 1000 + 3 runes at 250 = 1750
    expect(
      insuranceSum([
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
      ]),
    ).toBe(1750);
  });
});
