import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('runs the schema example', () => {
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
    // amulet 60 base - 20 % loyalty 12 + 10 % first insurance 6 = 54 + 5 = 59
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });

  it('counts earlier quotes as prior contracts for the follow-up discount', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1 }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  it('rejects a claim referring to an unknown policy step', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 7, incident: { cause: 'fire', damages: [] } }],
      }),
    ).toThrow(/policy/i);
  });
});
