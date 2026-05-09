import { describe, expect, it } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('schema example 1: single quote', () => {
    const out = runScenario({
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
    expect(out.results).toEqual([{ premium: 115 }]);
  });

  it('schema example 2: quote followed by two claims', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            {
              type: 'amulet',
              material: 'silver',
              enchantment: 2,
              cursed: false,
            },
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
    // Quote: 60 * 0.8 * 1.1 + 5 = 57.8 -> 58
    // Claim1: 200 - 100 = 100 payout; cap 1200 -> 1100
    // Claim2: 250 - 100 = 150 payout; cap 1100 -> 950
    expect(out.results).toEqual([
      { premium: 58 },
      { payout: 100, remainingCap: 1100 },
      { payout: 150, remainingCap: 950 },
    ]);
  });

  it('applies per-contract discount on second quote for same customer', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    });
    // 1st: 100 * 1.1 + 5 = 115
    // 2nd: 100 * 0.85 + 5 = 90
    expect(out.results).toEqual([{ premium: 115 }, { premium: 90 }]);
  });
});
