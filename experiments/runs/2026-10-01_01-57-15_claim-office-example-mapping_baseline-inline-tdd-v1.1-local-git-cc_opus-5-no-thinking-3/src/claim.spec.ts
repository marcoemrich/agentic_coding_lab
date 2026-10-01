import { describe, it, expect } from 'vitest';
import { damagePayout, createPolicy, processClaim, roundPayout } from './claim.js';

describe('payout for a single damage', () => {
  it('reimburses a regular sword in full, minus the deductible', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 3 }, 500)).toBe(400);
  });

  it('reimburses a rune in full, minus the deductible', () => {
    expect(damagePayout({ type: 'rune' }, 200)).toBe(100);
  });

  it('halves damage to an item with enchantment 8, then applies the deductible', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toBe(400);
  });

  it('halves damage for a high enchantment even on dragon material', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000)).toBe(400);
  });

  it('reimburses dragon material in full when enchantment is below 8', () => {
    expect(damagePayout({ type: 'sword', material: 'dragon', enchantment: 5 }, 800)).toBe(700);
  });

  it('halves damage to a highly enchanted steel sword', () => {
    expect(damagePayout({ type: 'sword', material: 'steel', enchantment: 9 }, 1000)).toBe(400);
  });

  it('never pays out less than nothing when damage is below the deductible', () => {
    expect(damagePayout({ type: 'rune' }, 50)).toBe(0);
  });
});

describe('processing a claim against a policy', () => {
  const policyOf = (items: { type: string; material?: string; enchantment?: number }[]) =>
    createPolicy(items);

  it('applies the deductible once per damaged item', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'amulet' }]);
    const result = processClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(result.payout).toBe(600);
  });

  it('treats two damages to two insured swords as separate events', () => {
    const policy = policyOf([{ type: 'sword' }, { type: 'sword' }]);
    const result = processClaim(policy, {
      cause: 'dragon attack',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    expect(result.payout).toBe(800);
  });

  it('caps the payout at twice the insurance sum across successive claims', () => {
    const policy = policyOf([{ type: 'sword' }]);

    const first = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects a damage to an item that is not part of the policy', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] }),
    ).toThrow(/not part of the policy/i);
  });

  it('rejects more damages of a type than the policy covers', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, {
        cause: 'dragon attack',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      }),
    ).toThrow(/not part of the policy/i);
  });

  it('rejects a negative damage amount', () => {
    const policy = policyOf([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] }),
    ).toThrow(/negative/i);
  });

  it('rounds the payout down, in the MHPCO favour', () => {
    expect(roundPayout(350.5)).toBe(350);
    expect(roundPayout(350.9)).toBe(350);
  });
});
