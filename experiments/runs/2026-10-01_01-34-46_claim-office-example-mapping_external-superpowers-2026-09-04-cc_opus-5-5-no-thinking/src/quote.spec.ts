import { describe, it, expect } from 'vitest';
import { quote } from './quote';

const newcomer = { yearsWithMHPCO: 0 };
const firstContract = { previousContracts: 0 };

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([], newcomer, firstContract)).toBe(5);
  });

  it('adds base premium and first-insurance surcharge for a plain sword', () => {
    // 100 base + 10 first insurance + 5 fee
    expect(quote([{ type: 'sword' }], newcomer, firstContract)).toBe(115);
  });

  it.each([
    // base + 10% first insurance + 5 fee
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('uses the price list base premium for a %s', (type, premium) => {
    expect(quote([{ type }], newcomer, firstContract)).toBe(premium);
  });

  it('adds a 50% curse surcharge for a newcomer with a cursed sword', () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee
    const item = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };
    expect(quote([item], newcomer, firstContract)).toBe(165);
  });

  it('applies the curse surcharge only to the cursed item of a multi-item policy', () => {
    // 160 base + 50 curse (sword only) + 16 first insurance + 5 fee
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet', cursed: false }];
    expect(quote(items, newcomer, firstContract)).toBe(231);
  });

  it.each([
    // 100 base + 30 high enchantment + 10 first insurance + 5 fee
    [{ type: 'sword', enchantment: 5 }, 145],
    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
    [{ type: 'sword', enchantment: 5, cursed: true }, 195],
    // 100 base + 10 first insurance + 5 fee
    [{ type: 'sword', enchantment: 4 }, 115],
    [{ type: 'sword', enchantment: 4, cursed: true }, 165],
  ])('applies the high-enchantment surcharge from level 5 on: %o', (item, premium) => {
    expect(quote([item], newcomer, firstContract)).toBe(premium);
  });

  it.each([
    // 100 base - 20 loyalty + 10 first insurance + 5 fee
    [2, 95],
    // no loyalty below 2 years
    [1, 115],
  ])('applies the loyalty discount from 2 years on (%i years)', (yearsWithMHPCO, premium) => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO }, firstContract)).toBe(premium);
  });

  it('stacks all modifiers for a long-standing customer\'s second contract', () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee
    const item = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    expect(quote([item], { yearsWithMHPCO: 3 }, { previousContracts: 1 })).toBe(160);
  });

  const runes = (count: number) => Array.from({ length: count }, () => ({ type: 'rune' }));

  it.each([
    // base premium -> base + 10% first insurance + 5 fee
    [2, 60], // 50 base
    [3, 71], // 60 base (block)
    [4, 115], // 100 base (no block: requires exactly 3)
  ])('prices %i runes with the block of 3 alike components', (count, premium) => {
    expect(quote(runes(count), newcomer, firstContract)).toBe(premium);
  });

  const moonstones = (count: number) => Array.from({ length: count }, () => ({ type: 'moonstone' }));

  it('forms no block from components of different types', () => {
    // 75 base + 7.5 first insurance + 5 fee = 87.5 -> rounded up
    expect(quote([...runes(2), ...moonstones(1)], newcomer, firstContract)).toBe(88);
  });

  it('forms a separate block per component type', () => {
    // 120 base + 12 first insurance + 5 fee
    expect(quote([...runes(3), ...moonstones(3)], newcomer, firstContract)).toBe(137);
  });

  it('rounds the final premium up in the MHPCO\'s favor', () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5
    expect(quote(runes(7), newcomer, firstContract)).toBe(198);
  });

  it('rejects an item of unknown type', () => {
    expect(() => quote([{ type: 'broomstick' }], newcomer, firstContract)).toThrow(/broomstick/);
  });
});
