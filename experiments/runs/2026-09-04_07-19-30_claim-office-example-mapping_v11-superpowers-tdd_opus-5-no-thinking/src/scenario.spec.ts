import { describe, expect, test } from 'vitest';
import { runScenario } from './scenario.js';

describe('running a scenario', () => {
  test('a quote step yields a premium', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote' as const, items: [{ type: 'sword' }] }],
    };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
  });

  test('a claim refers to the policy created by an earlier quote step', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote' as const,
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    };
    // amulet: base 60 − 12 loyalty + 6 first insurance + 5 fee = 59
    // claim: 200 − 100 deductible = 100; cap 1200 − 100 = 1100
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });

  test('the cap is tracked across successive claims on the same policy', () => {
    const damages = [{ itemType: 'sword', amount: 1500 }];
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        { op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages } },
        { op: 'claim' as const, policy: 0, incident: { cause: 'flood', damages } },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  test('the cap is twice the insurance sum of a multi-item policy', () => {
    // sword + amulet → insurance sum 1600, cap 3200; a 4000 G loss on the
    // sword is capped at 3200 rather than at the sword's own value.
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }, { type: 'amulet' }] },
        {
          op: 'claim' as const,
          policy: 0,
          incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 4000 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });

  test('a claim against a policy that no step created is rejected', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim' as const,
          policy: 3,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/policy 3/);
  });

  test('each quote after the first receives the follow-up discount', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote' as const, items: [{ type: 'sword' }] },
        {
          op: 'quote' as const,
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    };
    // first: 100 − 20 loyalty + 10 first insurance + 5 = 95
    // second: the prompt's long-standing-customer integration example
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 95 }, { premium: 160 }],
    });
  });
});
