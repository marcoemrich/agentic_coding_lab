import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('quotes a policy and settles a claim against it', () => {
    const results = runScenario({
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
    });
    // quote: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 -> 1100 remaining
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});
