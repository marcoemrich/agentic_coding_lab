import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import { PolicyError } from './claim.js';
import { UnknownItemError } from './premium.js';
import type { Scenario } from './types.js';

describe('runScenario', () => {
  it('processes the schema example (quote then claim)', () => {
    const scenario: Scenario = {
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
    };
    const results = runScenario(scenario);
    // amulet base 60, loyalty -12, first ins +6, fee 5 = 59
    expect(results[0]).toEqual({ premium: 59 });
    // amulet damage 200 full - 100 = 100
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('increments contract index across successive quotes', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    };
    const results = runScenario(scenario);
    expect(results[0]).toEqual({ premium: 115 }); // first contract
    expect(results[1]).toEqual({ premium: 100 }); // follow-up -15
  });

  it('tracks cap across successive claims on the same policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    };
    const results = runScenario(scenario);
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects an unknown item type in a quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    };
    expect(() => runScenario(scenario)).toThrow(UnknownItemError);
  });

  it('rejects a claim referencing a non-quote / missing policy index', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim',
          policy: 5,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 100 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(PolicyError);
  });

  it('rejects a claim whose damage item is not in the policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 100 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(PolicyError);
  });
});
