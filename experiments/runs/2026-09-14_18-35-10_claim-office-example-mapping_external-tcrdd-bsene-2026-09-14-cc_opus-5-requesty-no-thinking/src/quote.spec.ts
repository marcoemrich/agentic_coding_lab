import { describe, expect, it } from 'vitest';

import { quote } from './quote';

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toBe(5);
  });

  it('charges base premium plus first insurance surcharge and fee for a plain sword', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('uses the price list base premium per item type', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
    expect(quote([{ type: 'staff' }])).toBe(93);
    expect(quote([{ type: 'potion' }])).toBe(49);
  });

  it('adds a 50% risk surcharge for cursed items', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });

  it('adds a 30% surcharge from enchantment level 5 upwards', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('grants a 20% loyalty discount from two years of business', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 1 })).toBe(115);
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 })).toBe(95);
  });

  it('grants a 15% discount on every contract after the first', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 0 }, 1)).toBe(100);
  });

  it('prices a long-standing customer second contract', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    expect(quote(items, { yearsWithMHPCO: 3 }, 1)).toBe(160);
  });

  it('prices components at 25 G base premium each', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
    expect(quote([{ type: 'moonstone' }])).toBe(33);
  });

  it('offers a block price for exactly three alike components', () => {
    const runes = (n: number) => Array.from({ length: n }, () => ({ type: 'rune' }));
    expect(quote(runes(3))).toBe(71);
  });

  it('rejects items with an unknown type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});
