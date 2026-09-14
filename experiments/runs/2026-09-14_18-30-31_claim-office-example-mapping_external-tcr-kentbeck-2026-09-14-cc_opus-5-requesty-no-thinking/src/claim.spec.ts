import { describe, expect, it } from 'vitest';
import { ClaimError, damagePayout, insuranceSum, Policy } from './claim.js';

describe('insurance sum', () => {
  it('sums the unmodified item values', () => {
    expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
    expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
    expect(
      insuranceSum([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(1750);
  });
});

describe('damage payout', () => {
  it('reimburses fully minus the deductible', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 3 }, 500)).toBe(400);
    expect(damagePayout({ type: 'rune' }, 200)).toBe(100);
  });

  it('halves damage for items with enchantment at least eight', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
  });

  it('reimburses dragon material below the enchantment threshold in full', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  it('never pays out below zero', () => {
    expect(damagePayout({ type: 'rune' }, 50)).toBe(0);
  });
});

describe('policy claims', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });

  it('caps the total payout at twice the insurance sum', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('treats repeated damage entries as separate damages', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);
    const result = policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ]);
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ]),
    ).toThrow(ClaimError);
  });

  it('rejects damages to items outside the policy', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 200 }])).toThrow(ClaimError);
    expect(() => policy.claim([{ itemType: 'broomstick', amount: 200 }])).toThrow(ClaimError);
  });

  it('rejects negative damage amounts', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow(ClaimError);
  });

  it('rounds the payout down', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 9 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });
});
