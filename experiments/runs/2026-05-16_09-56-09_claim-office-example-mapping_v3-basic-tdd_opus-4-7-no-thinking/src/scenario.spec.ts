import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import type { Scenario } from './types.js';

describe('runScenario - simple', () => {
  it('quote + claim from spec schema example', () => {
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
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    };
    const result = runScenario(scenario);
    // Premium: amulet base 60. Customer 5 years: -20% loyalty + 10% first ins = -10% on 60 = -6
    // 60 - 6 = 54 + 5 fee = 59 → 59. priorContracts at first quote = 0.
    expect(result.results[0]).toEqual({ premium: 59 });
    // Payout: 200 - 100 = 100. cap = 600*2 = 1200. remainingCap = 1200 - 100 = 1100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('multiple quotes track prior contracts', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 1, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    };
    const result = runScenario(scenario);
    // Second quote per integration example = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('claim on unknown policy index throws', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'claim',
          policy: 0,
          incident: { damages: [{ itemType: 'sword', amount: 100 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
