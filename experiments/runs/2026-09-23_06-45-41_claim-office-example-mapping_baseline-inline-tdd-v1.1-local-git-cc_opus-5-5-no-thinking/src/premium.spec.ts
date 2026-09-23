import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('base premium', () => {
  it('uses price list for main items', () => {
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
  ])('%i runes -> %i G', (n, expected) => {
    expect(basePremium(runes(n))).toBe(expected);
  });

  it('only blocks components of the exact same type', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(basePremium([...runes(3), ...moonstones])).toBe(120);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});


describe('quote premium with modifiers', () => {
  const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

  it('empty item list costs only the processing fee', () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });

  it('newcomer with a cursed sword pays 165 G', () => {
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer)).toBe(165);
  });

  it('long-standing customer second contract, cursed enchanted sword pays 160 G', () => {
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], {
        yearsWithMHPCO: 3,
        previousContracts: 1,
      }),
    ).toBe(160);
  });

  it('curse surcharge only applies to the cursed item', () => {
    // 160 base + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], newcomer)).toBe(231);
  });

  it('enchantment threshold is inclusive at 5', () => {
    // 100 + 30 + 10 + 5
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer)).toBe(115);
    expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer)).toBe(195);
  });

  it('loyalty discount applies at exactly 2 years', () => {
    // 100 - 20 + 10 + 5
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(95);
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1, previousContracts: 0 })).toBe(115);
  });

  it('rounds the final premium up', () => {
    // 25 + 12.5 curse + 2.5 first insurance + 5 fee = 45
    expect(quotePremium([{ type: 'rune', cursed: true }], newcomer)).toBe(45);
    // 25 + 12.5 curse + 2.5 first insurance - 3.75 follow-up + 5 fee = 41.25 -> 42
    expect(quotePremium([{ type: 'rune', cursed: true }], { yearsWithMHPCO: 0, previousContracts: 1 })).toBe(42);
  });
});
