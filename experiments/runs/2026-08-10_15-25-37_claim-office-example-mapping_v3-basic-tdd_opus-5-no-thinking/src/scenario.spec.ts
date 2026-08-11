import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';

describe('scenario runner', () => {
  it('returns one result per step, in order', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });

    // amulet 60 base − 12 loyalty + 6 first insurance + 5 fee = 59
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('treats each quote after the first as a follow-up contract', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  it('tracks the cap of each policy separately across claims', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('applies the curse surcharge only to the cursed item on a multi-item policy', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] }],
    });

    // 160 base + 50 curse (of the sword alone) + 16 first insurance + 5 fee
    expect(results[0]).toEqual({ premium: 231 });
  });

  it('charges the block premium but insures the components at full value', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, ...Array(3).fill({ type: 'rune' })] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 5000 }] },
        },
      ],
    });

    // insurance sum 1000 + 3×250 = 1750, so the cap is 3500
    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });

  it('charges only the processing fee for an empty item list', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });

    expect(results[0]).toEqual({ premium: 5 });
  });

  it('rejects a quote with an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow();
  });

  it('rejects a claim against a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
});
