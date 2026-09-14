import { describe, it, expect } from 'vitest';
import { quote } from './quote.js';

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    expect(quote([])).toBe(5);
  });

  it('charges base premium for a plain sword', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('charges base premium for a plain amulet', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });

  it('charges base premium for a staff', () => {
    expect(quote([{ type: 'staff' }])).toBe(93);
  });

  it('charges base premium for a potion', () => {
    expect(quote([{ type: 'potion' }])).toBe(49);
  });

  it('rejects an unknown item type', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });

  it('charges 25 G per component', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('charges a block premium of 60 G for exactly 3 alike components', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
  });

  it('treats moonstones as components too', () => {
    expect(quote([{ type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }])).toBe(71);
  });

  it('adds a 50% risk surcharge for a cursed item', () => {
    expect(quote([{ type: 'sword', cursed: true }])).toBe(165);
  });

  it('adds a 30% surcharge at enchantment level 5', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('adds no enchantment surcharge below level 5', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('gives a 20% loyalty discount at exactly 2 years with MHPCO', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 })).toBe(95);
  });

  it('adds a 10% first insurance surcharge on the policy base premium', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('gives a 15% discount on a follow-up contract', () => {
    expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 0 }, 1)).toBe(100);
  });

  it('rounds a fractional premium up, in the MHPCO favour', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'amulet' }];
    expect(quote(items, { yearsWithMHPCO: 3 }, 1)).toBe(88);
  });
});
