import { describe, expect, it } from 'vitest';
import { runScenario, Scenario } from './scenario';

describe('runScenario', () => {
  it('returns a result per step for a quote followed by a claim on that policy', () => {
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
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('treats every quote after the first as a follow-up contract', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    };

    const output = runScenario(scenario);

    expect(output).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });

  it('rejects a claim that does not refer to an earlier quote step', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
    };

    const run = () => runScenario(scenario);

    expect(run).toThrow('No policy was created by step 0');
  });
});
