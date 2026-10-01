import { describe, it, expect } from 'vitest';
import { basePremium, type Item } from './premium.js';

describe('base premium per item', () => {
  it('prices a sword at 100 G', () => {
    expect(basePremium([{ type: 'sword' }])).toBe(100);
  });

  it('prices an amulet at 60 G', () => {
    expect(basePremium([{ type: 'amulet' }])).toBe(60);
  });

  it('prices a staff at 80 G', () => {
    expect(basePremium([{ type: 'staff' }])).toBe(80);
  });

  it('prices a potion at 40 G', () => {
    expect(basePremium([{ type: 'potion' }])).toBe(40);
  });

  it('sums the base premiums of several items', () => {
    expect(basePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });

  it('prices an empty item list at 0 G', () => {
    expect(basePremium([])).toBe(0);
  });
});

describe('component base premiums and the block of 3 alike components', () => {
  it('prices a single rune at 25 G', () => {
    expect(basePremium([{ type: 'rune' }])).toBe(25);
  });

  it('prices 2 runes at 50 G', () => {
    expect(basePremium(runes(2))).toBe(50);
  });

  it('prices 3 runes at 60 G because the block applies', () => {
    expect(basePremium(runes(3))).toBe(60);
  });

  it('prices 4 runes at 100 G because a block requires exactly 3', () => {
    expect(basePremium(runes(4))).toBe(100);
  });

  it('prices 7 runes at 175 G', () => {
    expect(basePremium(runes(7))).toBe(175);
  });

  it('forms no block from components of different types', () => {
    expect(basePremium([...runes(2), { type: 'moonstone' }])).toBe(75);
  });

  it('forms one block per component type', () => {
    expect(basePremium([...runes(3), ...moonstones(3)])).toBe(120);
  });
});

function runes(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: 'rune' }));
}

function moonstones(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: 'moonstone' }));
}

describe('unknown item types', () => {
  it('rejects an item with an unknown type', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});
