import { describe, it, expect } from 'vitest';
import { runScenario, ScenarioError } from './scenario.js';

describe('scenario sequencing', () => {
  it('runs the schema example', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59
    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  it('applies the follow-up discount from the second quote onwards', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[0]).toEqual({ premium: 175 }); // no follow-up discount yet
    expect(results[1]).toEqual({ premium: 160 }); // spec integration example
  });

  it('carries the cap across successive claims on the same policy', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('keeps separate caps for separate policies', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 1, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(results[2]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[3]).toEqual({ payout: 1400, remainingCap: 600 });
  });
});

describe('scenario rejections', () => {
  it('rejects a quote with an unknown item type', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
      }),
    ).toThrow(ScenarioError);
  });

  it('rejects a claim referring to a step that is not a quote', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
      }),
    ).toThrow(ScenarioError);
  });

  it('rejects a claim with a negative damage amount', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      }),
    ).toThrow(ScenarioError);
  });

  it('rejects an unknown operation', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'refund' } as never],
      }),
    ).toThrow(ScenarioError);
  });

  it('rejects a scenario without steps', () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 } } as never)).toThrow(ScenarioError);
  });
});
