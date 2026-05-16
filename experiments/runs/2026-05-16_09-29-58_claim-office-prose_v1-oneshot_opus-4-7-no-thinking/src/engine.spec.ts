import { describe, it, expect } from 'vitest';
import { runScenario } from './engine.js';
import { Scenario } from './types.js';

describe('runScenario', () => {
  it('handles quote-only scenario (schema example 1 shape)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({ premium: 115 });
  });

  it('handles quote + two claims against the same policy (schema example 2 shape)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
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
    const { results } = runScenario(scenario);
    // amulet base 60, loyalty -20%, first contract +10% => 60*0.9 = 54. +5 = 59.
    expect(results[0]).toEqual({ premium: 59 });
    // cap = 2 * 600 = 1200. Claim 1: 200-100 = 100 payout, 1100 remaining.
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    // Claim 2: 250-100 = 150 payout, 950 remaining.
    expect(results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });

  it('treats successive quotes as subsequent contracts', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    };
    const { results } = runScenario(scenario);
    // First: 100 * 1.1 = 110, +5 = 115.
    expect(results[0]).toEqual({ premium: 115 });
    // Second: 100 * 0.85 = 85, +5 = 90.
    expect(results[1]).toEqual({ premium: 90 });
  });

  it('throws when claim references an unknown policy step index', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim',
          policy: 42,
          incident: { damages: [{ itemType: 'sword', amount: 100 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/unknown policy/);
  });
});
