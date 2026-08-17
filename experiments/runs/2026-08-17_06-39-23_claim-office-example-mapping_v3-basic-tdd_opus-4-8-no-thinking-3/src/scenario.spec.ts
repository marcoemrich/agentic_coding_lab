import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('processes a quote then a claim against its policy', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // amulet 60 base; loyalty -12 (5yrs) + first ins 6 = 54 + 5 = 59
    expect(result.results[0]).toEqual({ premium: 59 });
    // amulet ench 2: full 200 - 100 deductible = 100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('treats the first quote as first insurance and later quotes as follow-ups', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    // second contract cursed ench7 3yrs: 100+50+30-20+10-15 = 155 + 5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  it('throws for an unknown item type in a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow();
  });

  it('throws when a claim references a non-quote policy step', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 200 }] } },
        ],
      }),
    ).toThrow();
  });
});
