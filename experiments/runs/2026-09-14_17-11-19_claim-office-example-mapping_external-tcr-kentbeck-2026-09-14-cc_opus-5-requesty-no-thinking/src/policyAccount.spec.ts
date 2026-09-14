import { describe, expect, it } from 'vitest';
import { ClaimError } from './claim.js';
import { Policy } from './policyAccount.js';

const incident = (...damages: { itemType: string; amount: number }[]) => ({
  cause: 'dragon attack',
  damages,
});

describe('policy claims', () => {
  it('applies the deductible once per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    const result = policy.claim(
      incident({ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }),
    );
    expect(result.payout).toBe(600);
  });

  it('treats each entry for a repeated item type as its own damage', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);
    const result = policy.claim(
      incident({ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }),
    );
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(3200);
  });

  it('caps the total payout at twice the insurance sum across claims', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim(incident({ itemType: 'sword', amount: 1500 }))).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
    expect(policy.claim(incident({ itemType: 'sword', amount: 1500 }))).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  it('bases the cap on unmodified insurance values', () => {
    const policy = new Policy([{ type: 'sword', cursed: true }]);
    expect(policy.claim(incident({ itemType: 'sword', amount: 5000 }))).toEqual({
      payout: 2000,
      remainingCap: 0,
    });
  });

  it('rejects damage to an item the policy does not cover', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim(incident({ itemType: 'amulet', amount: 300 }))).toThrow(ClaimError);
  });

  it('rejects damage to an item of unknown type', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim(incident({ itemType: 'broomstick', amount: 300 }))).toThrow(
      ClaimError,
    );
  });

  it('caps a policy of several items at twice their combined insurance value', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.claim(incident({ itemType: 'sword', amount: 99999 })).payout).toBe(3200);
  });

  it('bases the cap on insurance values untouched by the block discount', () => {
    const policy = new Policy([
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);
    expect(policy.claim(incident({ itemType: 'sword', amount: 99999 })).payout).toBe(3500);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() =>
      policy.claim(
        incident({ itemType: 'sword', amount: 300 }, { itemType: 'sword', amount: 300 }),
      ),
    ).toThrow(ClaimError);
  });

  it('rounds the payout down', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 9 }]);
    expect(policy.claim(incident({ itemType: 'sword', amount: 901 })).payout).toBe(350);
  });
});
