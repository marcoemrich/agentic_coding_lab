import { describe, it, expect } from 'vitest';
import { runScenario, type Scenario } from './scenario.js';

describe('scenario', () => {
  it('returns a premium for each quote step', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });

  it('settles a claim against the policy created by an earlier quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
