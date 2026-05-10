import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import type { Scenario } from './types.js';

describe('runScenario', () => {
  it('runs a single quote step', () => {
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
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  it('runs quote + two non-qualifying claims', () => {
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
    expect(out.results.length).toBe(3);
    expect(out.results[0]).toEqual({ premium: 58 });
    // amulet enchant=2, silver: not qualifying -> 0 payout
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
    expect(out.results[2]).toEqual({ payout: 0, remainingCap: 1200 });
  });

  it('applies subsequent contract discount to second quote in scenario', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results[0]).toEqual({ premium: 115 }); // first
    // 100 * 0.85 = 85 + 5 = 90
    expect(out.results[1]).toEqual({ premium: 90 });
  });

  it('shares cap across claims on same policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'dragon', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    };
    const out = runScenario(scenario);
    // Cap = 2000
    // First: 1500 - 100 = 1400, remaining = 600
    // Second: 1500 - 100 = 1400 -> capped to 600, remaining = 0
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});
