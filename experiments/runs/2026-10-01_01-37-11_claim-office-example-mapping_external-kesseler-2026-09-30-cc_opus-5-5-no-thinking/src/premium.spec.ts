import { describe, it, expect } from 'vitest';
import { basePremium } from './premium';

describe('base premium', () => {
  it('is 0 for an empty item list', () => {
    const items: never[] = [];

    const result = basePremium(items);

    expect(result).toBe(0);
  });

  it('is 100 for a sword', () => {
    const items = [{ type: 'sword' }];

    const result = basePremium(items);

    expect(result).toBe(100);
  });

  it.each([
    ['amulet', 60],
    ['staff', 80],
    ['potion', 40],
  ])('is the price-list base premium for a %s', (type, expected) => {
    const items = [{ type }];

    const result = basePremium(items);

    expect(result).toBe(expected);
  });

  it('is 25 per component for 2 runes', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }];

    const result = basePremium(items);

    expect(result).toBe(50);
  });

  it('is the block price of 60 for exactly 3 runes', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const result = basePremium(items);

    expect(result).toBe(60);
  });

  it.each([
    [4, 100],
    [7, 175],
  ])('has no block discount for %i runes', (count, expected) => {
    const items = Array.from({ length: count }, () => ({ type: 'rune' }));

    const result = basePremium(items);

    expect(result).toBe(expected);
  });

  it('forms no block from components of different types', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];

    const result = basePremium(items);

    expect(result).toBe(75);
  });

  it('forms a separate block for each component type', () => {
    const items = [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ];

    const result = basePremium(items);

    expect(result).toBe(120);
  });
});
