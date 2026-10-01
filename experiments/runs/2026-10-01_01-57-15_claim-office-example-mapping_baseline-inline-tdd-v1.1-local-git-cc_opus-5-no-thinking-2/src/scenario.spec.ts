import { describe, it, expect } from 'vitest';
import { runScenario, ScenarioError } from './scenario.js';

const sword = (over: Record<string, unknown> = {}) => ({
  type: 'sword',
  material: 'steel',
  enchantment: 3,
  cursed: false,
  ...over,
});

describe('running a scenario', () => {
  it('quotes a single policy', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [sword({ cursed: true })] }],
    });
    expect(out).toEqual({ results: [{ premium: 165 }] });
  });

  it('applies the 15 % follow-up discount from the second quote on', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [sword()] },
        { op: 'quote', items: [sword({ cursed: true, enchantment: 7 })] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  it('pays a claim against an earlier policy and reports the remaining cap', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('applies the deductible once per damaged item', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [sword(), { type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'amulet', amount: 300 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toMatchObject({ payout: 600 });
  });

  it('treats two damages of the same type as separate damages with their own deductible', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [sword(), sword()] },
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
    });
    expect(out.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  describe('cap exhaustion across successive claims', () => {
    it('reduces a later payout to the remaining cap', () => {
      const out = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [sword()] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        ],
      });
      expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe('rejected scenarios', () => {
    it('rejects an unknown item type in a quote', () => {
      expect(() =>
        runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }),
      ).toThrow(ScenarioError);
    });

    it('rejects a damage to an item that is not part of the policy', () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: 'quote', items: [sword()] },
            { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
          ],
        }),
      ).toThrow(ScenarioError);
    });

    it('rejects a damage with an unknown item type', () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: 'quote', items: [sword()] },
            { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } },
          ],
        }),
      ).toThrow(ScenarioError);
    });

    it('rejects more damages of a type than the policy covers', () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: 'quote', items: [sword()] },
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

    it('rejects a negative damage amount', () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: 'quote', items: [sword()] },
            { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
          ],
        }),
      ).toThrow(ScenarioError);
    });

    it('rejects a claim referring to a step that is not a policy', () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }],
        }),
      ).toThrow(ScenarioError);
    });
  });
});
