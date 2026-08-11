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

    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('treats each quote after the first as a follow-up contract', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  it('carries the remaining cap across successive claims on one policy', () => {
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

  it('rejects a claim referring to a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('rejects an unknown item type in a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });
});
