import { describe, expect, it } from 'vitest';
import { processClaim } from './claims.js';
import type { Policy } from './types.js';

function makePolicy(items: Policy['items'], insuranceSum: number): Policy {
  return { items, insuranceSum, remainingCap: 2 * insuranceSum };
}

describe('processClaim', () => {
  it('returns 0 payout for a non-qualifying item', () => {
    const policy = makePolicy(
      [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
      600
    );
    const result = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(1200);
  });

  it('reimburses 50% for items with enchantment >= 8 minus deductible', () => {
    const policy = makePolicy(
      [{ type: 'amulet', material: 'silver', enchantment: 9, cursed: false }],
      600
    );
    const result = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 500 }],
    });
    // 500 * 0.5 = 250 - 100 = 150
    expect(result.payout).toBe(150);
    expect(result.remainingCap).toBe(1050);
  });

  it('fully reimburses dragon-material items minus deductible', () => {
    const policy = makePolicy(
      [{ type: 'sword', material: 'dragon', enchantment: 0, cursed: false }],
      1000
    );
    const result = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 600 }],
    });
    // 600 - 100 = 500
    expect(result.payout).toBe(500);
    expect(result.remainingCap).toBe(1500);
  });

  it('caps payout at twice the insurance sum', () => {
    const policy = makePolicy(
      [{ type: 'sword', material: 'dragon', enchantment: 0, cursed: false }],
      1000
    );
    // First claim eats most of the cap
    processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 1900 }],
    });
    // remainingCap should now be 2000 - (1900 - 100) = 2000 - 1800 = 200
    expect(policy.remainingCap).toBe(200);

    const second = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    // eligible 1000, deductible 100, would be 900, but cap is 200
    expect(second.payout).toBe(200);
    expect(second.remainingCap).toBe(0);
  });

  it('returns 0 if damage is fully consumed by deductible', () => {
    const policy = makePolicy(
      [{ type: 'sword', material: 'dragon', enchantment: 0, cursed: false }],
      1000
    );
    const result = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 50 }],
    });
    // 50 - 100 = -50 -> 0
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });
});
