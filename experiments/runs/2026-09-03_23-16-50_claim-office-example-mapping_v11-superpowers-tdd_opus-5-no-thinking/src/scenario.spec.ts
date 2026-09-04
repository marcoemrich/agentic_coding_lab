import { describe, expect, test } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  test('returns one result per step, in order', () => {
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

    // amulet: 60 base − 12 loyalty + 6 first insurance = 54 + 5 fee
    // claim: 200 − 100 deductible = 100; cap 1200 − 100
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  test('a claim refers to the policy created by its quote step', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'amulet' }] },
        {
          op: 'claim',
          policy: 1,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] },
        },
      ],
    });

    // the claim draws on the amulet policy (cap 1200), not the sword one
    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });

  test('each quote after the first is a follow-up contract', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    });

    // first: 100 + 10 first insurance + 5 = 115
    // second: 100 + 10 − 15 follow-up + 5 = 100
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
});
