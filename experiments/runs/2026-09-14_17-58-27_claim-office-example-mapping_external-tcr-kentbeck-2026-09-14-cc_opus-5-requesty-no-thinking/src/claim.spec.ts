import { describe, expect, it } from 'vitest';
import { damagePayout } from './claim.js';

describe('damage payout', () => {
  it('reimburses a plain item in full minus the deductible', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 3 }, 500)).toBe(400);
  });

  it('reimburses a component in full minus the deductible', () => {
    expect(damagePayout({ type: 'rune' }, 200)).toBe(100);
  });

  it('halves the damage from enchantment 8', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
  });

  it('never pays less than zero', () => {
    expect(damagePayout({ type: 'sword' }, 50)).toBe(0);
  });

  it('reimburses dragon material in full minus the deductible', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  it('lets the 50 % rule win over dragon material', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
  });

  it('keeps fractions until the payout is rounded', () => {
    expect(damagePayout({ type: 'sword', enchantment: 8 }, 901)).toBe(350.5);
  });
});
