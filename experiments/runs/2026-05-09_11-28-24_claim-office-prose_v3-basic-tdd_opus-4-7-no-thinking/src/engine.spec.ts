import { describe, it, expect } from 'vitest';
import { runScenario } from './engine.js';
import type { Scenario } from './types.js';

describe('runScenario', () => {
  it('handles a single quote step (example 1)', () => {
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
    const result = runScenario(scenario);
    // 100 base * 1.10 first = 110, +5 = 115
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it('handles a quote and two claims referring to it (example 2)', () => {
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
    // Quote: 60 * 0.8 (loyalty) * 1.10 (first) = 52.8, +5 = 57.8 -> 58
    // Claim 1: amulet not dragon, enchantment 2 -> 0 reimbursement, payout 0, cap remains 1200
    // Claim 2: same -> 0, cap remains 1200
    const result = runScenario(scenario);
    expect(result.results.length).toBe(3);
    expect(result.results[0]).toEqual({ premium: 58 });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(result.results[2]).toEqual({ payout: 0, remainingCap: 1200 });
  });

  it('contract index increments with each quote (repeat discount applies)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = runScenario(scenario);
    // First: 100 * 1.10 = 110, +5 = 115
    // Second: 100 * 0.85 = 85, +5 = 90
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 90 });
  });

  it('claims update remaining cap across consecutive claims on same policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 0, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 1500 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 1000 }],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    // Insurance sum 1000, cap 2000
    // Claim 1: 1500 - 100 = 1400, cap remaining 600
    // Claim 2: 900, capped at 600, remaining 0
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});
