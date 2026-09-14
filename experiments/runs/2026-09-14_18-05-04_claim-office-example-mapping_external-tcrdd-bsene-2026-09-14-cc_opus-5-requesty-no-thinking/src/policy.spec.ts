import { describe, it, expect } from 'vitest';
import { insuranceSum } from './policy';

describe('policy', () => {
  it('sums the insurance values of the covered items', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
  });
});
