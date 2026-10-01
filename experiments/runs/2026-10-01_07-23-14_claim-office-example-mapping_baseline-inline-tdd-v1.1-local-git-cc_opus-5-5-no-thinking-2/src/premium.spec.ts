import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';

const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

describe('base premium', () => {
  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('%s has base premium %i', (type, expected) => {
    expect(basePremium([{ type }])).toBe(expected);
  });

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes -> %i G', (n, expected) => {
    expect(basePremium(Array.from({ length: n }, () => ({ type: 'rune' })))).toBe(expected);
  });

  it('2 runes + 1 moonstone -> 75 G (no block across types)', () => {
    expect(basePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(75);
  });

  it('3 runes + 3 moonstones -> 120 G (two blocks)', () => {
    const items = [...Array(3).fill({ type: 'rune' }), ...Array(3).fill({ type: 'moonstone' })];
    expect(basePremium(items)).toBe(120);
  });

  it('unknown item type throws', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('quote premium', () => {
  it('empty item list -> only processing fee', () => {
    expect(quotePremium([], { yearsWithMHPCO: 5, previousContracts: 3 })).toBe(5);
  });

  it('newcomer with cursed sword -> 165 G', () => {
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer)).toBe(165);
  });

  it("long-standing customer's second contract -> 160 G", () => {
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], {
        yearsWithMHPCO: 3,
        previousContracts: 1,
      }),
    ).toBe(160);
  });

  it('curse surcharge applies only to the cursed item', () => {
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], newcomer)).toBe(231);
  });

  it('exactly 2 years -> loyalty discount applies', () => {
    // 100 - 20 + 10 + 5
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(95);
  });

  it('enchantment exactly 5 -> high enchantment surcharge, plus curse if cursed', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer)).toBe(195);
  });

  it('enchantment 4 -> no high enchantment surcharge', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer)).toBe(115);
  });

  it('rounds fractional premiums up', () => {
    // rune 25 + 2.5 first insurance + 5 fee = 32.5 -> 33
    expect(quotePremium([{ type: 'rune' }], newcomer)).toBe(33);
  });
});
