import { describe, it, expect } from 'vitest';
import { insuranceSum, cap } from './policy.js';

describe('insurance sum and cap', () => {
  it('sums the insurance values of the covered items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  it('counts each of two alike items separately', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
    expect(cap([{ type: 'sword' }, { type: 'sword' }])).toBe(4000);
  });

  it('insures components at 250 G each, unaffected by the block discount', () => {
    const items = [
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ];
    expect(insuranceSum(items)).toBe(1750);
  });

  it('caps the payout at twice the insurance sum', () => {
    expect(cap([{ type: 'sword' }, { type: 'amulet' }])).toBe(3200);
  });

  it('bases the cap on the unmodified insurance value of a cursed item', () => {
    expect(cap([{ type: 'sword', cursed: true }])).toBe(2000);
  });
});
