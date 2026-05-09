import { describe, expect, it } from 'vitest';
import { runScenario } from './engine.js';

describe('runScenario', () => {
  it('handles a single quote', () => {
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
    expect(result.results).toEqual([{ premium: 115 }]);
  });

  it('processes quote then claims using policy index', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'dragon', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'sword', amount: 600 }],
          },
        },
      ],
    });

    // sword 100 * 0.8 (loyalty) * 1.10 (first) + 5 = 88 + 5 = 93
    expect(result.results[0]).toEqual({ premium: 93 });
    // 600 - 100 = 500; remainingCap 2000 - 500 = 1500
    expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
  });

  it('applies subsequent-contract discount on later quotes', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          ],
        },
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // sword 100, *1.10 = 110, +5 = 115
    expect(result.results[0]).toEqual({ premium: 115 });
    // amulet 60, *0.85 (subsequent) = 51, +5 = 56
    expect(result.results[1]).toEqual({ premium: 56 });
  });
});
