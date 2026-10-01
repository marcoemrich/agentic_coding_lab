import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('running a scenario', () => {
  it('returns one result per step, in order', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // 60 base - 12 loyalty + 6 first + 5 fee = 59 ; payout 200 - 100 = 100, cap 1200 - 100
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });

  it('counts earlier quotes so later ones get the follow-up discount', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  it('refers each claim to the policy created by the given quote step', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects a claim that refers to a step which is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 7, incident: { cause: 'fire', damages: [] } }],
      }),
    ).toThrow(/7/);
  });
});
