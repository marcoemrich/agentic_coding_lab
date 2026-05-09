import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import { Scenario } from './types.js';

describe('runScenario', () => {
  it('returns one result per step', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword' }],
        },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results).toHaveLength(1);
    expect(out.results[0]).toEqual({ premium: 115 });
  });

  it('handles a quote followed by claims (example 2 shape)', () => {
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
    const out = runScenario(scenario);
    expect(out.results).toHaveLength(3);
    // Quote: 60 * 0.8 * 1.10 + 5 = 57.8 -> 58
    expect(out.results[0]).toEqual({ premium: 58 });
    // Claim 1: 200 - 100 = 100; cap 1200 - 100 = 1100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    // Claim 2: 250 - 100 = 150; cap 1100 - 150 = 950
    expect(out.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });

  it('subsequent contracts get the 15% repeat discount', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    };
    const out = runScenario(scenario);
    // 1st: 100*1.10 + 5 = 115
    // 2nd: 100*0.85 + 5 = 90
    expect(out.results[0]).toEqual({ premium: 115 });
    expect(out.results[1]).toEqual({ premium: 90 });
  });
});
