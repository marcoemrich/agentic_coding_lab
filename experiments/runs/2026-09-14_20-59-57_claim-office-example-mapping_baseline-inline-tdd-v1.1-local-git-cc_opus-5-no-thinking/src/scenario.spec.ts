import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('scenario processing', () => {
  it('returns one result per step, in order', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            {
              type: 'amulet',
              material: 'silver',
              enchantment: 2,
              cursed: false,
            },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });

    // amulet: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 damage - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('counts each quote as a contract for the follow-up discount', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
          ],
        },
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // first contract: 100 + 50 curse + 30 ench - 20 loyalty + 10 first + 5 = 175
    // second contract: the same, less 15 follow-up = 160
    expect(results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('carries the cap across successive claims on one policy', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [{ itemType: 'sword', amount: 1500 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [{ itemType: 'sword', amount: 1500 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects a scenario quoting an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow();
  });

  it('rejects a claim against an item outside the policy', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [{ itemType: 'amulet', amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
