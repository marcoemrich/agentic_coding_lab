import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('base premium', () => {
  it('uses the price list for main items', () => {
    expect(basePremium([{ type: 'sword' }])).toBe(100);
    expect(basePremium([{ type: 'amulet' }])).toBe(60);
    expect(basePremium([{ type: 'staff' }])).toBe(80);
    expect(basePremium([{ type: 'potion' }])).toBe(40);
  });

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes → %i G (block only for exactly 3)', (n, expected) => {
    expect(basePremium(runes(n))).toBe(expected);
  });

  it('does not form blocks across different component types', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms separate blocks per component type', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(basePremium([...runes(3), ...moonstones])).toBe(120);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('quote premium', () => {
  const newcomer = { yearsWithMHPCO: 0 };

  it('empty item list costs only the processing fee', () => {
    expect(quotePremium([], newcomer, false)).toBe(5);
  });

  it('newcomer with a cursed sword pays 165 G', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    expect(quotePremium(items, newcomer, false)).toBe(165);
  });

  it("long-standing customer's second contract pays 160 G", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quotePremium(items, { yearsWithMHPCO: 3 }, true)).toBe(160);
  });

  it('applies the curse surcharge only to the cursed item', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium(items, newcomer, false)).toBe(231);
  });

  it('applies the loyalty discount at exactly 2 years', () => {
    // 100 − 20 + 10 + 5
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, false)).toBe(95);
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, false)).toBe(115);
  });

  it('applies high enchantment surcharge from level 5', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer, false)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer, false)).toBe(115);
    expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer, false)).toBe(195);
  });

  it('rounds fractional premiums up', () => {
    // one rune: 25 + 2.5 first insurance + 5 fee = 32.5 → 33
    expect(quotePremium([{ type: 'rune' }], newcomer, false)).toBe(33);
  });
});
