import { describe, expect, it } from 'vitest';
import { parseScenario, processScenario, quotePremium, type Item, type Scenario } from './claim-office.js';

const item = (type: Item['type'], additions: Partial<Item> = {}): Item => ({ type, ...additions });
const scenario = (steps: Scenario['steps'], yearsWithMHPCO = 0): Scenario => ({
  customer: { yearsWithMHPCO }, steps,
});

describe('premium', () => {
  it('prices component blocks only when there are exactly three alike components', () => {
    expect(quotePremium([item('rune'), item('rune')], 0, 0)).toBe(60);
    expect(quotePremium([item('rune'), item('rune'), item('rune')], 0, 0)).toBe(71);
    expect(quotePremium([item('rune'), item('rune'), item('moonstone')], 0, 0)).toBe(88);
    expect(quotePremium(Array.from({ length: 7 }, () => item('rune')), 0, 0)).toBe(198);
  });

  it('applies item and policy modifiers with final upward rounding', () => {
    expect(quotePremium([item('sword', { cursed: true, enchantment: 3 })], 0, 0)).toBe(165);
    expect(quotePremium([item('sword', { cursed: true, enchantment: 7 })], 3, 1)).toBe(160);
    expect(quotePremium([], 10, 3)).toBe(5);
  });
});

describe('claims', () => {
  it('applies clauses, per-damage deductibles, and tracks the policy cap', () => {
    const result = processScenario(scenario([
      { op: 'quote', items: [item('sword', { material: 'dragon', enchantment: 9 }), item('amulet')] },
      { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
        { itemType: 'sword', amount: 1000 }, { itemType: 'amulet', amount: 300 },
      ] } },
      { op: 'claim', policy: 0, incident: { cause: 'again', damages: [{ itemType: 'sword', amount: 4000 }] } },
    ]));
    expect(result.results.slice(1)).toEqual([
      { payout: 600, remainingCap: 2600 },
      { payout: 1900, remainingCap: 700 },
    ]);
  });

  it('limits successive payouts to the cap', () => {
    const result = processScenario(scenario([
      { op: 'quote', items: [item('sword')] },
      { op: 'claim', policy: 0, incident: { cause: 'one', damages: [{ itemType: 'sword', amount: 1500 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'two', damages: [{ itemType: 'sword', amount: 1500 }] } },
    ]));
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  it('rejects uninsured, excess, and negative damages', () => {
    expect(() => processScenario(scenario([
      { op: 'quote', items: [item('sword')] },
      { op: 'claim', policy: 0, incident: { cause: 'x', damages: [
        { itemType: 'sword', amount: 1 }, { itemType: 'sword', amount: 1 },
      ] } },
    ]))).toThrow(/not covered/);
    expect(() => parseScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -1 }] } },
    ] })).toThrow(/negative/);
  });
});
