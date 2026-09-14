import { describe, expect, it } from 'vitest';

import { insuranceSum } from './policy';

describe('insuranceSum', () => {
  it('sums the insurance values of the insured items', () => {
    expect(insuranceSum([{ type: 'sword' }])).toBe(1000);
  });

  it('adds up all insured items, unaffected by block discounts', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
    expect(
      insuranceSum([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(1750);
    expect(insuranceSum([{ type: 'staff' }, { type: 'potion' }])).toBe(1200);
  });
});
