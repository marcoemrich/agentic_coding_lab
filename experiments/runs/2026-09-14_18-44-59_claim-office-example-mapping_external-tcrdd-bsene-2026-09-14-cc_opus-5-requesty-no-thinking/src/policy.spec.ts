import { describe, it, expect } from 'vitest';
import { insuranceSum } from './policy';

describe('insuranceSum', () => {
  it('sums the insurance values of all items, ignoring block discounts', () => {
    const items = [
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(insuranceSum(items)).toBe(1750);
  });

  it('sums two items of the same type', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  it('is unaffected by premium modifiers such as a curse', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });

  it('sums a sword and an amulet', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });
});
