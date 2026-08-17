import { describe, it, expect } from 'vitest';
import { roundInOfficeFavor } from './rounding';

describe('roundInOfficeFavor', () => {
  it('rounds premiums up', () => {
    expect(roundInOfficeFavor(197.5, 'premium')).toBe(198);
    expect(roundInOfficeFavor(197.1, 'premium')).toBe(198);
  });

  it('rounds payouts down', () => {
    expect(roundInOfficeFavor(350.5, 'payout')).toBe(350);
    expect(roundInOfficeFavor(350.9, 'payout')).toBe(350);
  });

  it('leaves whole amounts unchanged', () => {
    expect(roundInOfficeFavor(160, 'premium')).toBe(160);
    expect(roundInOfficeFavor(160, 'payout')).toBe(160);
  });
});
