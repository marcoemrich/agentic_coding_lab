import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('running a scenario', () => {
  it('returns one result per step, in order', () => {
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

    // amulet base 60 - loyalty 12 + first 6 = 54 + 5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });

  it('discounts every contract after the first', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    // first: 100 + 50 curse + 30 high - 20 loyalty + 10 first + 5 fee = 175
    // second: additionally -15 follow-up => 160
    expect(results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('tracks the remaining cap across successive claims on one policy', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });

    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rejects a claim that references a step which is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 7,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/policy/);
  });
});
