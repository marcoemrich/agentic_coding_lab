import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('running a scenario', () => {
  it('runs the schema example', () => {
    expect(
      runScenario({
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
      }),
    ).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('discounts every quote after the first as a follow-up contract', () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    // first contract: 100 + 50 + 30 - 20 + 10 = 170 + 5 = 175
    // second contract: ... - 15 = 155 + 5 = 160
    expect(results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('rejects a claim that references a step which is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
        ],
      }),
    ).toThrow(/policy/i);
  });

  it('propagates an unknown item type as an error', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(/unknown item type/i);
  });
});
