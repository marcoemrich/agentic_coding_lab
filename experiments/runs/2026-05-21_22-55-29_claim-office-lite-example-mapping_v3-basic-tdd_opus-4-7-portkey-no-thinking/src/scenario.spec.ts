import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('scenario', () => {
  it('schema example: quote amulet then claim', () => {
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
    // amulet, loyal (5 yrs), first contract: base 60, +6 first-ins, -12 loyalty, +5 fee = 59
    expect(out.results[0]).toEqual({ premium: 59 });
    // claim: amulet damage 200 - 100 deductible = 100
    expect(out.results[1]).toEqual({ payout: 100 });
  });

  it('contract count increments per quote', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    // first quote: loyal, first contract: 100+50+30-20+10 = 170 +5 = 175
    expect(out.results[0]).toEqual({ premium: 175 });
    // second quote per spec example: 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });
});
