import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('scenario runner', () => {
  it('returns one result per step, in order', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toEqual({ premium: 59 });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('counts quote steps only when applying the follow-up discount', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 300 }] } },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    // the second quote is the customer's second contract despite the claim between
    expect(out.results[2]).toEqual({ premium: 160 });
  });

  it('draws the cap down across claims against the same policy', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('rejects a quote containing an unknown item type', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow();
  });

  it('rejects a claim against a step that is not a quote', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'claim', policy: 7, incident: { cause: 'fire', damages: [] } }],
    })).toThrow();
  });
});
