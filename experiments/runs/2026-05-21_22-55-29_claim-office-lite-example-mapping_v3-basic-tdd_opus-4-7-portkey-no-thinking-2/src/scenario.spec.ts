import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('runScenario', () => {
  it('empty steps -> empty results', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] }))
      .toEqual({ results: [] });
  });

  it('empty item quote -> 5 G', () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    })).toEqual({ results: [{ premium: 5 }] });
  });

  it('first quote uses first-insurance surcharge; subsequent quotes use follow-up discount', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 3 }] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      ],
    });
    // first: 100 + 50 curse - 20 loyalty + 10 first = 140 + 5 = 145
    // second: 100 + 50 curse + 30 enchant - 20 loyalty + 10 first - 15 followup = 155 + 5 = 160
    expect(out.results).toEqual([{ premium: 145 }, { premium: 160 }]);
  });

  it('quote then claim references policy by index', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100 });
  });

  it('unknown item type in quote -> throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow();
  });

  it('claim with unknown item -> throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim with damage to item not in policy -> throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim referring to non-existent policy -> throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim policy index pointing to a non-quote step -> throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
        { op: 'claim', policy: 1, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    })).toThrow();
  });
});
