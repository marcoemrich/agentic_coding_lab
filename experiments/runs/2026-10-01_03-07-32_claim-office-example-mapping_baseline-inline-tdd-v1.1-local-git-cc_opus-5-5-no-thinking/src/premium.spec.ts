import { describe, it, expect } from 'vitest';
import { basePremium, quotePremium } from './premium';
import { Item } from './items';

const rune = { type: 'rune' };
const moonstone = { type: 'moonstone' };
const newcomer = { yearsWithMHPCO: 0 };

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
  ])('%i runes have base premium %i', (count, expected) => {
    expect(basePremium(Array(count).fill(rune))).toBe(expected);
  });

  it('does not form a block from different component types', () => {
    expect(basePremium([rune, rune, moonstone])).toBe(75);
  });

  it('forms separate blocks per component type', () => {
    expect(basePremium([rune, rune, rune, moonstone, moonstone, moonstone])).toBe(120);
  });

  it('rejects unknown item types', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});

describe('quote premium', () => {
  const quote = (items: Item[], years = 0, followUp = false) =>
    quotePremium(items, { yearsWithMHPCO: years }, followUp);

  it('charges only the processing fee for an empty item list', () => {
    expect(quotePremium([], newcomer, false)).toBe(5);
  });

  it('newcomer with a cursed sword pays 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });

  it("long-standing customer's second contract with cursed enchanted sword pays 160 G", () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }], 3, true)).toBe(160);
  });

  it('applies the curse surcharge only to the cursed item', () => {
    // 100 + 50 + 60 = 210; +10% of 160 = 16 -> 226 + 5
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });

  it('applies high enchantment surcharge at exactly 5', () => {
    // 100 + 30 + 10 + 5
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('applies both surcharges for cursed sword at enchantment 5', () => {
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('does not apply high enchantment surcharge at 4', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('applies loyalty discount at exactly 2 years', () => {
    // 100 - 20 + 10 + 5
    expect(quote([{ type: 'sword' }], 2)).toBe(95);
  });

  it('does not apply loyalty discount below 2 years', () => {
    expect(quote([{ type: 'sword' }], 1)).toBe(115);
  });

  it('applies follow-up discount', () => {
    // 100 + 10 - 15 + 5
    expect(quote([{ type: 'sword' }], 0, true)).toBe(100);
  });

  it('rounds the final premium up', () => {
    // rune 25: +2.5 first = 27.5 + 5 = 32.5 -> 33
    expect(quote([{ type: 'rune' }])).toBe(33);
  });
});
