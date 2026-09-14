import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('returns a premium for each quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote' as const, items: [{ type: 'sword', cursed: true }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });

  it('settles a claim against the policy created by an earlier quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it('carries the depleted cap over to the next claim on the same policy', () => {
    const claim = {
      op: 'claim' as const,
      policy: 0,
      incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: 'quote' as const, items: [{ type: 'sword' }] }, claim, claim],
    };
    expect(runScenario(scenario).results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('treats each damage entry of a duplicated item type separately', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim' as const,
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 300 },
            ],
          },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  it('counts only quote steps as contracts', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
        { op: 'quote' as const, items: [{ type: 'sword' }] },
      ],
    };
    expect(runScenario(scenario).results[2]).toEqual({ premium: 100 });
  });
});
