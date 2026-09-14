import { describe, it, expect } from 'vitest';
import { runScenario } from './scenario.js';
import type { Scenario } from './scenario.js';

describe('scenario sequencing', () => {
  it('returns one result per step, in order', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    const results = runScenario(scenario);
    expect(results).toHaveLength(2);
    // 60 base - 12 loyalty + 6 first insurance + 5 fee
    expect(results[0]).toEqual({ premium: 59 });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('treats the second quote in a scenario as a follow-up contract', () => {
    const cursedSword = { type: 'sword', material: 'steel', enchantment: 7, cursed: true };
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [cursedSword] },
        { op: 'quote', items: [cursedSword] },
      ],
    };
    const [first, second] = runScenario(scenario);
    expect(first).toEqual({ premium: 175 });
    expect(second).toEqual({ premium: 160 });
  });

  it('caps a policy at twice its insurance sum across successive claims', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    };
    const [, first, second] = runScenario(scenario);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('keeps the caps of two policies independent', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 1, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    };
    const results = runScenario(scenario);
    expect(results[2]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[3]).toEqual({ payout: 1400, remainingCap: 600 });
  });

  it('rejects a claim against a step that is not a policy', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'claim', policy: 7, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});
