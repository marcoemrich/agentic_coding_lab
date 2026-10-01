import { describe, it, expect } from 'vitest';
import { insuranceSum, payoutCap } from './policy.js';

describe('insurance sum', () => {
  it('sums the insurance values of the insured items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });

  it('insures each component at 250 G, unaffected by the block discount', () => {
    expect(
      insuranceSum([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(1750);
  });

  it('counts two items of the same type twice', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
  });

  it('ignores premium modifiers', () => {
    expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
  });
});

describe('payout cap', () => {
  it('caps the total payout at twice the insurance sum', () => {
    expect(payoutCap([{ type: 'sword' }, { type: 'amulet' }])).toBe(3200);
  });

  it('bases the cap on the unmodified insurance value', () => {
    expect(payoutCap([{ type: 'sword', cursed: true }])).toBe(2000);
  });
});
