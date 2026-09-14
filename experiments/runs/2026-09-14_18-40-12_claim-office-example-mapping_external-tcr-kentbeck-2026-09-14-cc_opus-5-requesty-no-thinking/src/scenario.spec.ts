import { describe, it, expect } from 'vitest';
import { Scenario, runScenario } from './scenario';

describe('running a scenario', () => {
  it('quotes and claims in order', () => {
    const scenario: Scenario = {
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
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('discounts follow-up contracts after the first quote', () => {
    const sword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        { op: 'quote', items: [sword] },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 41 }, { premium: 160 }]);
  });

  it('rejects a claim against a policy that does not exist', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim',
          policy: 3,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it('rejects a quote with an unknown item type', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
