import { describe, expect, test } from 'vitest';
import { insuranceSum } from './policy.js';

describe('insurance sum', () => {
  test('a single sword is insured at its list value', () => {
    expect(insuranceSum([{ type: 'sword' }])).toBe(1000);
  });

  test('the insurance sum is the sum of the item values', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  test('two swords are insured at twice the sword value', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  test('the block discount affects the premium only, not the insurance sum', () => {
    const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    expect(insuranceSum([{ type: 'sword' }, ...runes])).toBe(1750);
  });

  test('premium modifiers do not raise the insurance sum', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});
