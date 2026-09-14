import { describe, expect, it } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('returns a premium for each quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote' as const, items: [{ type: 'sword', cursed: true }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });

  it('processes a claim against the policy created by an earlier quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('applies the follow-up contract discount from the second quote on', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote' as const, items: [sword] },
        { op: 'quote' as const, items: [sword] },
      ],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });
});
