import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('processes a quote followed by a claim on its policy', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 95 }, { payout: 400, remainingCap: 1600 }],
    });
  });
});
