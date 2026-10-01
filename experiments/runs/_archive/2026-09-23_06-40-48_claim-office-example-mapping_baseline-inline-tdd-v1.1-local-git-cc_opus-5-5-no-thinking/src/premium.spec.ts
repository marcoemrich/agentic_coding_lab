import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';

const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

describe('base premium', () => {
  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
    ['rune', 25],
    ['moonstone', 25],
  ])('%s has base premium %i', (type, expected) => {
    expect(basePremium([{ type }])).toBe(expected);
  });

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes -> %i', (n, expected) => {
    expect(basePremium(runes(n))).toBe(expected);
  });

  it('alike means same type', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('two separate blocks', () => {
    expect(basePremium([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))])).toBe(120);
  });

  it('rejects unknown item type', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

const newcomer = { yearsWithMHPCO: 0 };
const noMods = (items: { type: string; enchantment?: number; cursed?: boolean }[]) =>
  quotePremium(items, newcomer, 0);

describe('quote premium', () => {
  it('empty item list -> fee only', () => {
    expect(noMods([])).toBe(5);
  });

  it('newcomer with a cursed sword -> 165', () => {
    expect(noMods([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true } as never])).toBe(165);
  });

  it('long-standing customer second contract -> 160', () => {
    expect(
      quotePremium([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], { yearsWithMHPCO: 3 }, 1),
    ).toBe(160);
  });

  it('curse surcharge applies only to cursed item', () => {
    // 160 base + 50 curse + 16 first = 226 + 5
    expect(noMods([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });

  it('enchantment exactly 5 adds surcharge', () => {
    // 100 + 30 + 10 + 5
    expect(noMods([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('enchantment 5 and cursed stacks both', () => {
    expect(noMods([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('enchantment 4 adds no surcharge', () => {
    expect(noMods([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('exactly 2 years gets loyalty discount', () => {
    // 100 - 20 + 10 + 5
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('1 year gets no loyalty discount', () => {
    expect(quotePremium([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
  });

  it('rounds up fractional premiums', () => {
    // potion 40, 2 runes 50 -> 90? use potion + 1 rune: 65 base, +6.5 first = 71.5 +5 = 76.5 -> 77
    expect(noMods([{ type: 'potion' }, { type: 'rune' }])).toBe(77);
  });
});
