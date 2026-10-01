import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('running a scenario', () => {
  it('quotes and then settles a claim against that policy', () => {
    const result = runScenario({
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
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 - 100 = 100
    expect(result).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  it('applies the follow-up discount from the second quote onwards', () => {
    const cursedSword = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: cursedSword },
        { op: 'quote', items: cursedSword },
      ],
    });
    expect(result.results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('exhausts the cap across successive claims on the same policy', () => {
    const result = runScenario({
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
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rejects a quote containing an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/broomstick/);
  });

  it('rejects a claim against a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 3,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/polic/i);
  });
});
