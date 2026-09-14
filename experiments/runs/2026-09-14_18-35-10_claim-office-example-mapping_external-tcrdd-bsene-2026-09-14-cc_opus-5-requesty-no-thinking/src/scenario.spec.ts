import { describe, expect, it } from 'vitest';

import { runScenario } from './scenario';

describe('runScenario', () => {
  it('returns a premium for every quote step', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }],
    });
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });

  it('processes a claim against the policy of an earlier quote step', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
