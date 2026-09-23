import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario';

describe('runScenario', () => {
  it('runs the schema example', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // 60 - 12 + 6 + 5 = 59; payout 100, cap 1200 - 100
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  it('applies follow-up discount from the second quote on', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [cursedSword] },
        { op: 'quote', items: [cursedSword] },
      ],
    });
    expect(result.results).toEqual([{ premium: 175 }, { premium: 160 }]);
  });

  it('tracks the cap per policy across claims', () => {
    const claim = { op: 'claim', policy: 0, incident: { cause: 'troll', damages: [{ itemType: 'sword', amount: 1500 }] } };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }, claim, claim],
    });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rejects unknown item types in a quote', () => {
    expect(() =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }),
    ).toThrow(/broomstick/);
  });

  it('rejects claims referencing a step that is not a quote', () => {
    const claim = { op: 'claim', policy: 1, incident: { cause: 'x', damages: [] } };
    expect(() =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }, claim] }),
    ).toThrow();
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ ...claim, policy: 5 }] })).toThrow();
  });

  it('rejects unknown operations and malformed input', () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'cancel' }] })).toThrow();
    expect(() => runScenario({ steps: [] })).toThrow();
    expect(() => runScenario(null)).toThrow();
  });
});
