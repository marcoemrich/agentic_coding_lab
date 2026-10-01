import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('base premium', () => {
  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes -> %i G', (n, expected) => {
    expect(basePremium(runes(n))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms separate blocks per component type', () => {
    expect(basePremium([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))])).toBe(120);
  });

  it('uses the price list for main items', () => {
    expect(basePremium([{ type: 'sword' }, { type: 'amulet' }, { type: 'staff' }, { type: 'potion' }])).toBe(280);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('quote premium', () => {
  const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });

  it('newcomer with a cursed sword pays 165 G', () => {
    expect(quotePremium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer)).toBe(165);
  });

  it('long-standing customer second contract pays 160 G', () => {
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], {
        yearsWithMHPCO: 3,
        previousContracts: 1,
      }),
    ).toBe(160);
  });

  it('applies cursed surcharge only to the cursed item', () => {
    // 100 + 60 + 50 curse + 16 first insurance + 5 fee
    expect(quotePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }], newcomer)).toBe(231);
  });

  it('applies loyalty discount at exactly 2 years', () => {
    // 100 - 20 + 10 + 5
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2, previousContracts: 0 })).toBe(95);
  });

  it('does not apply loyalty discount below 2 years', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1, previousContracts: 0 })).toBe(115);
  });

  it('applies high enchantment surcharge at exactly 5', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 5 }], newcomer)).toBe(145);
    expect(quotePremium([{ type: 'sword', enchantment: 5, cursed: true }], newcomer)).toBe(195);
  });

  it('does not apply high enchantment surcharge at 4', () => {
    expect(quotePremium([{ type: 'sword', enchantment: 4 }], newcomer)).toBe(115);
  });

  it('rounds fractional premiums up', () => {
    // rune: 25 + 2.5 first insurance + 5 fee = 32.5 -> 33
    expect(quotePremium([{ type: 'rune' }], newcomer)).toBe(33);
  });
});
