import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('handles a single quote step (example 1)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  it('handles example 2: quote then two claims', () => {
    const result = runScenario({
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
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'spell mishap',
            damages: [{ itemType: 'amulet', amount: 250 }],
          },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 58 });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    expect(result.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });

  it('applies the subsequent-contract discount on the second quote', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    });
    // First: 100 ×1.1 = 110, +5 = 115
    // Second: 100 ×0.85 = 85, +5 = 90
    expect(result.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
