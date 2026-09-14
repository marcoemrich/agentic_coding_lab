import { describe, expect, it } from 'vitest';
import { createPolicy, processClaim } from './claim';
import type { Item } from './premium';

const incident = (...damages: Array<[string, number]>) => ({
  cause: 'dragon attack',
  damages: damages.map(([itemType, amount]) => ({ itemType, amount })),
});

describe('claim processing', () => {
  it('reimburses fully minus the deductible for a regular item', () => {
    const policy = createPolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(processClaim(policy, incident(['sword', 500])).payout).toBe(400);
  });

  it('reimburses components without special clauses', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    expect(processClaim(policy, incident(['rune', 200])).payout).toBe(100);
  });

  it('applies the deductible once per damaged item', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(processClaim(policy, incident(['sword', 500], ['amulet', 300])).payout).toBe(600);
  });

  it('halves reimbursement at enchantment 8 or above, before the deductible', () => {
    const dragon8: Item = { type: 'sword', material: 'dragon', enchantment: 8 };
    expect(processClaim(createPolicy([dragon8]), incident(['sword', 1000])).payout).toBe(400);

    const dragon9: Item = { type: 'sword', material: 'dragon', enchantment: 9 };
    expect(processClaim(createPolicy([dragon9]), incident(['sword', 1000])).payout).toBe(400);

    const steel9: Item = { type: 'sword', material: 'steel', enchantment: 9 };
    expect(processClaim(createPolicy([steel9]), incident(['sword', 1000])).payout).toBe(400);
  });

  it('reimburses dragon material below the enchantment threshold in full', () => {
    const dragon5: Item = { type: 'sword', material: 'dragon', enchantment: 5 };
    expect(processClaim(createPolicy([dragon5]), incident(['sword', 800])).payout).toBe(700);
  });

  it('caps the total payout at twice the insurance sum', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(policy.remainingCap).toBe(2000);
    expect(processClaim(policy, incident(['sword', 1500]))).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(processClaim(policy, incident(['sword', 1500]))).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('treats repeated item types as separate damages', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    expect(policy.remainingCap).toBe(4000);
    expect(processClaim(policy, incident(['sword', 500], ['sword', 300])).payout).toBe(600);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() => processClaim(policy, incident(['sword', 500], ['sword', 300]))).toThrow();
  });

  it('rejects damage to an item outside the policy', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() => processClaim(policy, incident(['amulet', 500]))).toThrow();
    expect(() => processClaim(policy, incident(['broomstick', 500]))).toThrow();
  });

  it('rejects negative damage amounts', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() => processClaim(policy, incident(['sword', -200]))).toThrow();
  });

  it('rounds the payout down in the office favour', () => {
    const policy = createPolicy([{ type: 'sword', enchantment: 9 }]);
    expect(processClaim(policy, incident(['sword', 901])).payout).toBe(350);
  });
});
