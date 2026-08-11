import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('scenario runner', () => {
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

    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });

  it('counts contracts so that later quotes get the follow-up discount', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    });

    // first: 100 - 20 + 10 + 5 = 95; second is the integration example: 160
    expect(results).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  it('keeps a separate cap per policy', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 1,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });

    expect(results[2]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[3]).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it('rejects a claim referring to a step that is not a quote', () => {
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
    ).toThrow();
  });

  it('rejects an unknown item type in a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow();
  });
});
