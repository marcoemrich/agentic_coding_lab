import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('schema example 1: single quote', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  it('schema example 2: quote then two claims', () => {
    const out = runScenario({
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
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'spell mishap', damages: [{ itemType: 'amulet', amount: 250 }] },
        },
      ],
    });
    expect(out).toEqual({
      results: [
        { premium: 58 },
        { payout: 0, remainingCap: 1200 },
        { payout: 0, remainingCap: 1200 },
      ],
    });
  });

  it('contract index increments per quote and changes subsequent discount', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', enchantment: 0, cursed: false }] },
      ],
    });
    // First: 100*1.10 + 5 = 115
    // Second: 100*0.85 + 5 = 90
    expect(out.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
