import { describe, expect, it } from 'vitest';
import { ClaimError } from './claim.js';
import { UnknownItemError } from './policy.js';
import { Scenario, runScenario } from './scenario.js';

describe('scenario runner', () => {
  it('quotes and claims against the policy of an earlier step', () => {
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

  it('discounts every contract after the first', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 95 }, { premium: 160 }]);
  });

  it('rejects an unknown item type in a quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };
    expect(() => runScenario(scenario)).toThrow(UnknownItemError);
  });

  it('rejects a claim against an uncovered item', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(ClaimError);
  });

  it('rejects a claim referring to a missing policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim',
          policy: 3,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 300 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(ClaimError);
  });

  it('rejects a negative damage amount', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(ClaimError);
  });
});
