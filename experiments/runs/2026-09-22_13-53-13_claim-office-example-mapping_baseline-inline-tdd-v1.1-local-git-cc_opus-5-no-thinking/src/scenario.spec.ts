import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('running a scenario', () => {
  it('processes the schema example', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    };
    // premium: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('applies the follow-up discount from the second quote onwards', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword', enchantment: 7, cursed: true }] },
        {
          op: 'quote' as const,
          items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
  });

  it('rejects a quote with an unknown item type', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote' as const, items: [{ type: 'broomstick' }] }],
    };
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });

  it('rejects a claim referring to an unknown policy step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim' as const,
          policy: 3,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it('carries the remaining cap across successive claims on one policy', () => {
    const claimStep = {
      op: 'claim' as const,
      policy: 0,
      incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        claimStep,
        claimStep,
      ],
    };
    expect(runScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
});
