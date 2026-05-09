import { describe, it, expect } from 'vitest';
import { Scenario, Output } from './types.js';

// Mock implementation for testing the logic
import { calculatePremium, calculateInsuranceSum } from './pricing.js';
import { processClaimForPolicy } from './claims.js';
import { Policy } from './types.js';

describe('End-to-End Scenario Tests', () => {
  it('processes quote-only scenario', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
      ],
    };

    // Calculate premium
    const premium = calculatePremium(scenario.steps[0].items, scenario.customer, true);
    expect(premium).toBe(115); // 100 base + 10% first + 5 fee = 115

    const output: Output = {
      results: [{ premium }],
    };
    expect(output.results).toHaveLength(1);
    expect(output.results[0]).toHaveProperty('premium');
  });

  it('processes quote followed by claims scenario', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'spell mishap',
            damages: [{ itemType: 'amulet', amount: 250 }],
          },
        },
      ],
    };

    // Quote
    const premium = calculatePremium(
      scenario.steps[0].items,
      scenario.customer,
      true
    );
    const insuranceSum = calculateInsuranceSum(scenario.steps[0].items);
    const policy: Policy = {
      items: scenario.steps[0].items,
      insuranceSum,
      totalPayoutCap: insuranceSum * 2,
      usedPayout: 0,
    };

    // First claim
    const claim1 = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 200 },
    ]);
    policy.usedPayout += claim1.payout;

    // Second claim
    const claim2 = processClaimForPolicy(policy, [
      { itemType: 'amulet', amount: 250 },
    ]);
    policy.usedPayout += claim2.payout;

    expect(premium).toBeGreaterThan(0);
    expect(claim1.payout).toBeGreaterThan(0);
    expect(claim2.payout).toBeGreaterThan(0);
  });

  it('processes complex scenario with multiple items and modifiers', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 5, cursed: true },
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
            { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
            { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
            { type: 'rune', material: 'gold', enchantment: 0, cursed: false },
          ],
        },
      ],
    };

    const premium = calculatePremium(
      scenario.steps[0].items,
      scenario.customer,
      true
    );
    const insuranceSum = calculateInsuranceSum(scenario.steps[0].items);

    // Should have all items counted
    expect(insuranceSum).toBe(1000 + 600 + 750); // sword + amulet + 3 runes

    expect(premium).toBeGreaterThan(0);
  });

  it('processes claims on items with special material and enchantment', () => {
    const policy: Policy = {
      items: [
        { type: 'staff', material: 'dragon', enchantment: 10, cursed: false },
      ],
      insuranceSum: 800,
      totalPayoutCap: 1600,
      usedPayout: 0,
    };

    // Dragon material should take priority
    const result = processClaimForPolicy(policy, [
      { itemType: 'staff', amount: 300 },
    ]);

    // Dragon material gets 100% reimbursement
    expect(result.payout).toBe(200); // 300 - 100 deductible
  });

  it('handles cap correctly with multiple claims', () => {
    const policy: Policy = {
      items: [
        { type: 'potion', material: 'glass', enchantment: 2, cursed: false },
      ],
      insuranceSum: 400,
      totalPayoutCap: 800,
      usedPayout: 0,
    };

    // First claim: 600 damage, 100 deductible = 500 payout
    const result1 = processClaimForPolicy(policy, [
      { itemType: 'potion', amount: 600 },
    ]);
    expect(result1.payout).toBe(500);
    policy.usedPayout += result1.payout;

    // Second claim: 400 damage, 100 deductible = 300, but cap is 300 (800 - 500)
    const result2 = processClaimForPolicy(policy, [
      { itemType: 'potion', amount: 400 },
    ]);
    expect(result2.payout).toBe(300);
  });
});
