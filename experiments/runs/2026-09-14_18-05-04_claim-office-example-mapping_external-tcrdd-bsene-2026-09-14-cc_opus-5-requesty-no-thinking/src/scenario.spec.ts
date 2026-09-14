import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('quotes each step and counts contracts for the follow-up discount', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 145 }, { premium: 160 }]);
  });

  it('settles a claim against the policy created by an earlier quote step', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
