import { describe, it, expect } from 'vitest';
import { quote } from './quote';

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toBe(5);
  });

  it('quotes a plain sword at base 100 plus first insurance plus fee', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('quotes a plain amulet at base 60', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });

  it('quotes staff and potion from the price list', () => {
    expect(quote([{ type: 'staff' }])).toBe(93);
    expect(quote([{ type: 'potion' }])).toBe(49);
  });

  it('adds a 50% curse surcharge on the cursed item base premium', () => {
    expect(quote([{ type: 'sword', cursed: true }])).toBe(165);
  });

  it('adds a 30% surcharge from enchantment level 5 upwards', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('grants a 20% loyalty discount from 2 years of business', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 })).toBe(95);
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 1 })).toBe(115);
  });

  it('grants a 15% discount on each contract after the first', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 0 }, 1)).toBe(100);
  });

  it('prices components at 25 G base each', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('offers a block price of 60 G for exactly 3 alike components', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
  });

  it('rejects an unknown item type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});
