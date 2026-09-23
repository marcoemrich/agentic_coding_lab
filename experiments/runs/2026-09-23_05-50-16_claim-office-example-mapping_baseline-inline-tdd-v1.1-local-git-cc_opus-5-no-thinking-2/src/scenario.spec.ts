import { describe, it, expect } from 'vitest';
import { runScenario, ScenarioError } from './scenario';

describe('insurance sum and cap', () => {
  it('sums the insurance values of all items and caps at twice the sum', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });

  it('bases the cap on unmodified insurance values, not on premium modifiers', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] } },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  it('counts the full insurance sum of a component block', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 100 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
});

describe('scenario sequencing', () => {
  it('applies the follow-up discount from the second quote on', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  it('carries the remaining cap across successive claims on the same policy', () => {
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
});

describe('rejected scenarios', () => {
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
});

describe('multiple items of the same type', () => {
  it('sums the insurance values of two swords', () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 100 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });

  it('rejects more sword damages than swords insured', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(ScenarioError);
  });
});
