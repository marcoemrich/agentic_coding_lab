import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('runs a single quote step', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        },
      ],
    });
    // sword 100 * 1.3 ench? 3 < 5, so 100; +10% first = 110; +5 = 115
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });

  it('handles quote then claim referencing policy by index', () => {
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
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    });
    // amulet 60 * 0.8 loyalty = 48 * 1.1 first = 52.8 + 5 = 57.8 -> 58
    // claim: amulet ench 2 not high, not dragon -> 0; - 100 -> 0
    expect(out).toEqual({ results: [{ premium: 58 }, { payout: 0 }] });
  });

  it('increments contract index across multiple quotes', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    });
    // first sword: 100 * 1.1 + 5 = 115
    // second sword: 100 * 0.85 + 5 = 90
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });

  it('claims do not change contract index for next quote', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
    expect(out.results[2]).toEqual({ premium: 90 });
  });
});
