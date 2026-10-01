import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

const cursedSteelSword = { type: 'sword', material: 'steel', enchantment: 3, cursed: true };

describe('scenario', () => {
  it('quotes a policy and pays a claim against it', () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [cursedSteelSword] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    });
    expect(output).toEqual({ results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }] });
  });

  it('grants the follow-up discount on every quote after the first', () => {
    const enchantedCursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const output = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        { op: 'quote', items: [enchantedCursedSword] },
      ],
    });
    // potion: 40 + 4 first insurance − 8 loyalty = 36 + 5 fee
    expect(output.results).toEqual([{ premium: 41 }, { premium: 160 }]);
  });

  it('rejects a claim against a step that did not create a policy', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 3, incident: { cause: 'fire', damages: [] } }],
      }),
    ).toThrow(/policy/i);
  });
});
