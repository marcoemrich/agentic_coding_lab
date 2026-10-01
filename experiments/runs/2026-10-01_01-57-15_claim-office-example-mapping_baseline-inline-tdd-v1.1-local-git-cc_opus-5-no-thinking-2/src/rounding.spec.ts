import { describe, it, expect } from 'vitest';
import { roundPremium, roundPayout } from './rounding.js';

describe('rounding in the MHPCO favour', () => {
  it('rounds a premium of 197.5 G up to 198 G', () => {
    expect(roundPremium(197.5)).toBe(198);
  });

  it('leaves a whole premium untouched', () => {
    expect(roundPremium(165)).toBe(165);
  });

  it('rounds a payout of 350.5 G down to 350 G', () => {
    expect(roundPayout(350.5)).toBe(350);
  });

  it('leaves a whole payout untouched', () => {
    expect(roundPayout(400)).toBe(400);
  });
});
