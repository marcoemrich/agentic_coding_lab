import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import { ClaimError } from './errors.js';

describe('scenario processing', () => {
  it('returns one result per step, in order', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    // amulet: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('counts earlier quotes as previous contracts for the discount', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });

    // first: 100 + 50 curse - 20 loyalty + 10 first insurance + 5 = 145
    // second: the long-standing customer's second contract from the prompt
    expect(results).toEqual([{ premium: 145 }, { premium: 160 }]);
  });

  it('carries the cap across successive claims on one policy', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
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

  it('rejects a quote with an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow();
  });

  it('rejects a claim against a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(ClaimError);
  });
});
