import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('quotes a policy and processes a claim against it', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; cap 1200, payout 200 - 100
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('grants the follow-up discount on every quote after the first', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [sword] },
        { op: 'quote', items: [sword] },
      ],
    });
    // first: 100 + 50 + 30 - 20 + 10 + 5 = 175; second additionally - 15 follow-up
    expect(result.results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('rejects a claim that does not reference a quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy: 1, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
