import { describe, it, expect } from 'vitest';
import { damagePayout } from './claim.js';

const sword = (over: Record<string, unknown> = {}) => ({
  type: 'sword',
  material: 'steel',
  enchantment: 3,
  cursed: false,
  ...over,
});

describe('payout for a single damage', () => {
  it('reimburses in full minus the 100 G deductible when no clause applies', () => {
    expect(damagePayout(sword(), 500)).toBe(400);
  });

  it('reimburses a rune in full minus the deductible — it has no enchantment or material', () => {
    expect(damagePayout({ type: 'rune' }, 200)).toBe(100);
  });

  it('reimburses dragon material in full, then the deductible', () => {
    expect(damagePayout(sword({ material: 'dragon', enchantment: 5 }), 800)).toBe(700);
  });

  it('halves the damage at enchantment 9, then the deductible', () => {
    expect(damagePayout(sword({ enchantment: 9 }), 1000)).toBe(400);
  });

  it('halves the damage at exactly enchantment 8', () => {
    expect(damagePayout(sword({ material: 'dragon', enchantment: 8 }), 1000)).toBe(400);
  });

  it('lets the 50 % rule win over dragon material', () => {
    expect(damagePayout(sword({ material: 'dragon', enchantment: 9 }), 1000)).toBe(400);
  });

  it('applies no high-enchantment clause below 8', () => {
    expect(damagePayout(sword({ enchantment: 7 }), 500)).toBe(400);
  });

  it('never pays out below zero when the damage is under the deductible', () => {
    expect(damagePayout(sword(), 50)).toBe(0);
  });
});
