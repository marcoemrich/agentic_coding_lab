import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import type { Scenario } from './types.js';

describe('runScenario', () => {
  it('handles example 1 — single quote', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  it('handles example 2 — quote followed by two claims', () => {
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
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'spell mishap',
            damages: [{ itemType: 'amulet', amount: 250 }],
          },
        },
      ],
    };
    const out = runScenario(scenario);
    // amulet 60, loyalty 0.8 = 48, first 1.10 = 52.8, +5 = 57.8 -> 58
    // claim 1: 200 - 100 = 100, cap 1200 -> 1100
    // claim 2: 250 - 100 = 150, cap -> 950
    expect(out.results).toEqual([
      { premium: 58 },
      { payout: 100, remainingCap: 1100 },
      { payout: 150, remainingCap: 950 },
    ]);
  });

  it('charges first-contract surcharge on first quote, discount on subsequent', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    };
    const out = runScenario(scenario);
    // First: 100 * 1.10 + 5 = 115
    // Second: 100 * 0.85 + 5 = 90
    expect(out.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
