import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('produces a quote then a claim result', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty('premium');
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('treats the first quote as non-follow-up and later quotes as follow-ups', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    });
    // first quote: 100 + 50 + 30 - 20 loyalty + 10 first = 170 + 5 = 175
    expect(out.results[0]).toEqual({ premium: 175 });
    // second quote is a follow-up: 170 - 15 + 5 = 160
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  it('rejects an unknown item type in a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow();
  });

  it('rejects a claim against an item not in the policy', () => {
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

  it('rejects a negative damage amount', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });

  it('quotes an empty item list as the processing fee only', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
});
