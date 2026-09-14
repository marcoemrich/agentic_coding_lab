import { describe, it, expect } from 'vitest';
import { basePremium } from './pricing.js';

describe('base premium per item type', () => {
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

  it('sums the base premiums of several main items', () => {
    expect(basePremium([{ type: 'sword' }, { type: 'amulet' }])).toBe(160);
  });
});

describe('components and the block of 3 alike', () => {
  it('prices a single component at 25 G', () => {
    expect(basePremium([{ type: 'rune' }])).toBe(25);
  });

  it('prices 2 runes at 50 G', () => {
    expect(basePremium([{ type: 'rune' }, { type: 'rune' }])).toBe(50);
  });

  it('prices exactly 3 runes as a block at 60 G', () => {
    expect(basePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('prices 4 runes at 100 G - a block requires exactly 3', () => {
    expect(basePremium(Array(4).fill({ type: 'rune' }))).toBe(100);
  });

  it('prices 7 runes at 175 G', () => {
    expect(basePremium(Array(7).fill({ type: 'rune' }))).toBe(175);
  });

  it('forms no block across different component types', () => {
    expect(
      basePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }]),
    ).toBe(75);
  });

  it('forms two separate blocks for 3 runes and 3 moonstones', () => {
    expect(
      basePremium([
        ...Array(3).fill({ type: 'rune' }),
        ...Array(3).fill({ type: 'moonstone' }),
      ]),
    ).toBe(120);
  });
});

describe('unknown item types', () => {
  it('rejects an unknown type', () => {
    expect(() => basePremium([{ type: 'broomstick' }])).toThrow(/broomstick/);
  });
});
