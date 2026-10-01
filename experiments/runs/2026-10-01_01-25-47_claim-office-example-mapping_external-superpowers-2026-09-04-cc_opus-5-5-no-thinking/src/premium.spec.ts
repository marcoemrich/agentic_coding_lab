import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';

const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

describe('basePremium', () => {
  it.each([
    ['sword', 100],
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('a single %s has base premium %i G', (type, expected) => {
    expect(basePremium([{ type }])).toBe(expected);
  });

  const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));

  it.each([
    [2, 50],
    [3, 60],
    [4, 100],
    [7, 175],
  ])('%i runes have base premium %i G (block only for exactly 3)', (count, expected) => {
    expect(basePremium(runes(count))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms separate blocks for 3 runes and 3 moonstones', () => {
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));
    expect(basePremium([...runes(3), ...moonstones])).toBe(120);
  });
});

describe('quotePremium', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer)).toBe(5);
  });

  it('adds the 10 % first-insurance surcharge and the fee for a plain sword', () => {
    expect(quotePremium([{ type: 'sword' }], newcomer)).toBe(115);
  });

  it('newcomer with a cursed steel sword (enchantment 3) pays 165 G', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quotePremium([sword], newcomer)).toBe(165);
  });

  it('applies the curse surcharge only to the cursed item of a multi-item policy', () => {
    // 160 base + 50 curse (of sword only) + 16 first insurance (of 160) + 5 fee
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(quotePremium(items, newcomer)).toBe(231);
  });

  it.each([
    // [enchantment, cursed, expected] — 100 base + 10 first insurance + 5 fee = 115
    [5, false, 145], // +30 high enchantment
    [5, true, 195], // +30 high enchantment +50 curse
    [4, false, 115], // no high enchantment
    [4, true, 165], // curse only
  ])('sword with enchantment %i (cursed: %s) costs %i G', (enchantment, cursed, expected) => {
    expect(quotePremium([{ type: 'sword', enchantment, cursed }], newcomer)).toBe(expected);
  });

  it.each([
    [1, 115], // no loyalty discount
    [2, 95], // exactly 2 years: 100 - 20 loyalty + 10 first insurance + 5 fee
  ])('customer with %i years pays %i G for a plain sword', (yearsWithMHPCO, expected) => {
    const customer = { yearsWithMHPCO, previousContracts: 0 };
    expect(quotePremium([{ type: 'sword' }], customer)).toBe(expected);
  });

  it("long-standing customer's second contract for a cursed sword (enchantment 7) costs 160 G", () => {
    const customer = { yearsWithMHPCO: 3, previousContracts: 1 };
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quotePremium([sword], customer)).toBe(160);
  });

  it('rounds a fractional premium up to whole G', () => {
    // 25 base + 2.5 first insurance + 5 fee = 32.5
    expect(quotePremium([{ type: 'rune' }], newcomer)).toBe(33);
  });

  it('rejects an item with an unknown type', () => {
    expect(() => quotePremium([{ type: 'broomstick' }], newcomer)).toThrow(/broomstick/);
    expect(() => quotePremium([{ type: 'constructor' }], newcomer)).toThrow(/constructor/);
  });
});
