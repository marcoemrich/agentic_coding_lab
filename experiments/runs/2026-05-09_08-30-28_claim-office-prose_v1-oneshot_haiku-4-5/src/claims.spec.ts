import { describe, it, expect } from 'vitest';
import { processClaimForPolicy } from './claims.js';
import { Policy, Item } from './types.js';

describe('Claims Processing', () => {
  it('applies deductible to claim', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 600,
      totalPayoutCap: 1200,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 200 },
    ]);

    // 200 - 100 deductible = 100 payout
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1100); // 1200 - 100
  });

  it('applies full deductible even if damage is less than deductible', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 1000,
      totalPayoutCap: 2000,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'sword', amount: 50 },
    ]);

    // 50 < 100 deductible, so no payout
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it('applies 50% reimbursement for high enchantment (level >= 8)', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 8, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 1000,
      totalPayoutCap: 2000,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'sword', amount: 200 },
    ]);

    // 200 * 0.5 = 100, minus 100 deductible = 0
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it('applies 50% reimbursement for high enchantment with higher damage', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 8, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 1000,
      totalPayoutCap: 2000,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'sword', amount: 400 },
    ]);

    // 400 * 0.5 = 200, minus 100 deductible = 100 payout
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1900);
  });

  it('applies 100% reimbursement for dragon material', () => {
    const items: Item[] = [
      { type: 'sword', material: 'dragon', enchantment: 3, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 1000,
      totalPayoutCap: 2000,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'sword', amount: 200 },
    ]);

    // 200 - 100 deductible = 100 payout
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(1900);
  });

  it('caps payout at twice the insurance sum', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 600, // 2x = 1200
      totalPayoutCap: 1200,
      usedPayout: 1100, // Already used 1100
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 500 },
    ]);

    // 500 - 100 deductible = 400, but cap is 100 (1200 - 1100)
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(0);
  });

  it('handles multiple damages in single claim', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 1600,
      totalPayoutCap: 3200,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'sword', amount: 150 },
      { itemType: 'amulet', amount: 200 },
    ]);

    // Sword: 150 - 100 = 50
    // Amulet: 200 - 100 = 100
    // Total: 150
    expect(result.payout).toBe(150);
    expect(result.remainingCap).toBe(3050); // 3200 - 150
  });

  it('handles damage to non-existent items', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 1000,
      totalPayoutCap: 2000,
      usedPayout: 0,
    };

    const result = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 200 },
    ]);

    // No payout for non-existent item
    expect(result.payout).toBe(0);
    expect(result.remainingCap).toBe(2000);
  });

  it('handles sequential claims and tracks remaining cap', () => {
    const items: Item[] = [
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    const policy: Policy = {
      items,
      insuranceSum: 600,
      totalPayoutCap: 1200,
      usedPayout: 0,
    };

    // First claim
    const result1 = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 200 },
    ]);
    expect(result1.payout).toBe(100);
    expect(result1.remainingCap).toBe(1100);

    // Update policy
    policy.usedPayout += result1.payout;

    // Second claim
    const result2 = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 250 },
    ]);
    expect(result2.payout).toBe(150);
    expect(result2.remainingCap).toBe(950);
  });
});
