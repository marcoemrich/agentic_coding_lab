import { describe, expect, it } from 'vitest';
import { quote } from './quote.js';

const newcomer = { yearsWithMHPCO: 0 };

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([], newcomer, 0)).toBe(5);
  });

  it('charges base premium plus first insurance surcharge for a plain sword', () => {
    expect(quote([{ type: 'sword' }], newcomer, 0)).toBe(115);
  });

  it('uses the price list base premium per item type', () => {
    expect(quote([{ type: 'amulet' }], newcomer, 0)).toBe(71);
    expect(quote([{ type: 'staff' }], newcomer, 0)).toBe(93);
    expect(quote([{ type: 'potion' }], newcomer, 0)).toBe(49);
  });

  it('adds a 50 % curse surcharge on the cursed item base premium', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], newcomer, 0)).toBe(165);
  });

  it('adds a 30 % surcharge from enchantment level 5 upwards', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }], newcomer, 0)).toBe(115);
    expect(quote([{ type: 'sword', enchantment: 5 }], newcomer, 0)).toBe(145);
  });

  it('stacks curse and high-enchantment surcharges', () => {
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }], newcomer, 0)).toBe(195);
  });

  it('grants a 20 % loyalty discount from 2 years of business upwards', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 1 }, 0)).toBe(115);
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 }, 0)).toBe(95);
  });

  it('grants a 15 % discount on every contract after the first', () => {
    expect(quote([{ type: 'sword' }], newcomer, 1)).toBe(100);
  });

  it("computes the long-standing customer's second contract", () => {
    const item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quote([item], { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('charges 25 G base premium per component', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }], newcomer, 0)).toBe(60);
  });

  it('offers a building block price for exactly 3 alike components', () => {
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));
    expect(quote(runes(3), newcomer, 0)).toBe(71);
    expect(quote(runes(4), newcomer, 0)).toBe(115);
  });

  it('rounds the final premium up, in the MHPCO favour', () => {
    const runes = Array.from({ length: 7 }, () => ({ type: 'rune' }));
    expect(quote(runes, newcomer, 0)).toBe(198);
  });

  it('rejects an item of unknown type', () => {
    expect(() => quote([{ type: 'broomstick' }], newcomer, 0)).toThrow(/broomstick/);
  });

  it('forms blocks per component type, not across types', () => {
    const rune = { type: 'rune' };
    const moonstone = { type: 'moonstone' };
    expect(quote([rune, rune, moonstone], newcomer, 0)).toBe(88);
    expect(quote([rune, rune, rune, moonstone, moonstone, moonstone], newcomer, 0)).toBe(137);
  });
});
