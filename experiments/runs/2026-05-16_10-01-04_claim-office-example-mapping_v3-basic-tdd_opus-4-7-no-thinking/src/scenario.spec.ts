import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('quote + claim from the prompt schema example', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
          ]
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }]
          }
        }
      ]
    });
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toHaveProperty('premium');
    expect(result.results[1]).toMatchObject({ payout: 100, remainingCap: 1100 });
    // amulet val 600, cap 1200. payout 100, remaining 1100.
  });

  it('treats each quote step as a new contract for follow-up discount', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first quote: cursed sword steel enchant 3 => loyalty + first ins, no follow-up
        // 100 + 50 - 20 + 10 = 140 + 5 = 145
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        // second quote: same item, with follow-up discount
        // 100 + 50 - 20 + 10 - 15 = 125 + 5 = 130. Wait, the prompt example uses enchant 7 not 3.
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ]
    });
    expect(result.results[0]).toMatchObject({ premium: 145 });
    expect(result.results[1]).toMatchObject({ premium: 160 });
  });
});
