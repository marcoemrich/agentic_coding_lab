import { describe, expect, it } from 'vitest';
import { ClaimError, damagePayout } from './claim.js';

describe('damage payout', () => {
  it('reimburses in full minus the deductible when no clause applies', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 3 }, 500)).toBe(400);
    expect(damagePayout({ type: 'rune' }, 200)).toBe(100);
  });

  it('halves damage to highly enchanted items before the deductible', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  it('never pays out less than nothing', () => {
    expect(damagePayout({ type: 'rune' }, 50)).toBe(0);
  });

  it('rejects negative damage amounts', () => {
    expect(() => damagePayout({ type: 'sword' }, -200)).toThrow(ClaimError);
  });
});
