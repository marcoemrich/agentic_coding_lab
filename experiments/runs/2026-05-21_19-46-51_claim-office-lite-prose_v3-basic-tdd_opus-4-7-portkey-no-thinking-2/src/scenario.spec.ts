import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('quote-only scenario matches schema example 1', () => {
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

  it('quote + claim scenario matches schema example 2', () => {
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
      ],
    });
    expect(out).toEqual({ results: [{ premium: 58 }, { payout: 100 }] });
  });

  it('contract index counts only quote steps (per-customer policy count)', () => {
    const out = runScenario({
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
    });
    // First contract: 100 × 1.10 + 5 = 115
    // Second contract: 100 × 0.85 + 5 = 90
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });

  it('claim references the correct prior quote by index', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }],
        },
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'dragon', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 1,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] },
        },
      ],
    });
    // First quote: 100 × 1.30 × 1.10 + 5 = 148
    // Second quote: 60 × 0.85 + 5 = 56
    // Claim on policy 1: dragon amulet, 300 - 100 = 200
    expect(out.results[2]).toEqual({ payout: 200 });
  });
});
