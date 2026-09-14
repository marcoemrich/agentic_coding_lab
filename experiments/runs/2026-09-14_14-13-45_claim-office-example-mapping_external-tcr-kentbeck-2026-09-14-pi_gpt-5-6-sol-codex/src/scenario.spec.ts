import { describe, expect, it } from 'vitest';
import { runScenario } from './claim-office';

describe('scenario processing', () => {
  it('processes quotes and claims sequentially', () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    })).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('counts only earlier quote operations as contracts', () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'scratch', damages: [] } },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    }).results).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }, { premium: 100 }]);
  });

  it.each([
    [{ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }],
    [{ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }] }],
    [{ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'dance' }] }],
    [{ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: 'sword' }] }],
  ])('rejects an invalid scenario', (scenario) => {
    expect(() => runScenario(scenario)).toThrow();
  });
});
