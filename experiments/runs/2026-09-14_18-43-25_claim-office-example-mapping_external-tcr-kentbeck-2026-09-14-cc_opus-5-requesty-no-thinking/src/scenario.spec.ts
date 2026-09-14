import { describe, expect, it } from 'vitest';
import { runScenario, type Scenario } from './scenario';

describe('scenario runner', () => {
  it('runs the schema example', () => {
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
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(runScenario(scenario)).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('treats the second quote as a follow-up contract', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'potion' }] },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario)[1]).toEqual({ premium: 160 });
  });

  it('rejects unknown item types in a quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });

  it('rejects a claim against a step that created no policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'claim', policy: 3, incident: { cause: 'fire', damages: [] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
