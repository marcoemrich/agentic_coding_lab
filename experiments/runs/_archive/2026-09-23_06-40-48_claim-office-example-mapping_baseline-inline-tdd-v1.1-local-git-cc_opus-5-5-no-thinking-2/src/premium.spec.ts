import { describe, it, expect } from 'vitest';
import { quotePremium, componentBasePremium } from './premium';

const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

describe('component base premium', () => {
  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes → %i G', (count, expected) => {
    const items = Array.from({ length: count }, () => ({ type: 'rune' }));
    expect(componentBasePremium(items)).toBe(expected);
  });

  it('2 runes + 1 moonstone → 75 G (different types, no block)', () => {
    expect(componentBasePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(75);
  });

  it('3 runes + 3 moonstones → 120 G (two blocks)', () => {
    const items = [...Array(3).fill({ type: 'rune' }), ...Array(3).fill({ type: 'moonstone' })];
    expect(componentBasePremium(items)).toBe(120);
  });
});

describe('quotePremium', () => {
  it('empty item list → 5 G fee only', () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });

  it('newcomer with a cursed sword → 165 G', () => {
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer)).toBe(165);
  });

  it('long-standing customer second contract, cursed ench 7 sword → 160 G', () => {
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], {
        yearsWithMHPCO: 3,
        previousContracts: 1,
      }),
    ).toBe(160);
  });

  it('curse surcharge applies only to the cursed item', () => {
    // 100 + 60 + 50 = 210; +16 first insurance = 226; +5 = 231
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], newcomer)).toBe(231);
  });

  it('exactly 2 years → loyalty discount applies', () => {
    // 100 - 20 + 10 + 5 = 95
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(95);
  });

  it('enchantment 5 → high enchantment surcharge; with curse both apply', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer)).toBe(100 + 30 + 10 + 5);
    expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer)).toBe(100 + 50 + 30 + 10 + 5);
  });

  it('enchantment 4 → no high enchantment surcharge', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer)).toBe(115);
  });

  it('rounds fractional premium up', () => {
    // potion 40 + 4 first = 44; amulet+potion: 100*... use staff 80 + rune 25 = 105 base, +10.5 = 115.5 + 5 = 120.5 → 121
    expect(quotePremium([{ type: 'staff' }, { type: 'rune' }], newcomer)).toBe(121);
  });

  it('rejects unknown item type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], newcomer)).toThrow(/broomstick/);
  });
});
