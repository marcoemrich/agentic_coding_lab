import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('quotes a policy and processes a claim against it by step index', () => {
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
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it("applies the follow-up discount to the customer's second quote", () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'potion' }] },
        { op: 'quote' as const, items: [sword] },
      ],
    };
    // first: 40 - 8 loyalty + 4 first insurance + 5 fee = 41; second: integration example 160
    expect(runScenario(scenario).results).toEqual([{ premium: 41 }, { premium: 160 }]);
  });

  it.each([3, 1, -1])('rejects a claim referencing step %i, which is not a quote', (policy) => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        {
          op: 'claim' as const,
          policy,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/policy/i);
  });
});
