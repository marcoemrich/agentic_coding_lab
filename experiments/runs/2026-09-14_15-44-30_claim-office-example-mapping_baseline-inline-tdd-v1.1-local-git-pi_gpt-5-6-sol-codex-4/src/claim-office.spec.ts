import { describe, expect, it } from 'vitest';
import { processScenario, quotePremium, type Item } from './claim-office.js';

describe('quotes', () => {
  it.each([
    [[], 5],
    [[{ type: 'rune' }, { type: 'rune' }], 60],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 71],
    [[{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 115],
  ] as const)('prices components %#', (items, premium) => {
    expect(quotePremium(items, 0, 0)).toBe(premium);
  });

  it('keeps blocks separate by exact component type', () => {
    const items: Item[] = [
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ];
    expect(quotePremium(items, 0, 0)).toBe(137);
  });

  it('applies item modifiers only to affected bases and policy modifiers to base', () => {
    const items: Item[] = [
      { type: 'sword', cursed: true, enchantment: 5 },
      { type: 'amulet', cursed: false, enchantment: 2 },
    ];
    expect(quotePremium(items, 3, 1)).toBe(205);
  });

  it('rounds premiums upward only at the end', () => {
    expect(quotePremium([{ type: 'rune', cursed: true }], 0, 0)).toBe(45);
  });

  it('prices the two integration examples', () => {
    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 3 }], 0, 0)).toBe(165);
    expect(quotePremium([{ type: 'sword', cursed: true, enchantment: 7 }], 3, 1)).toBe(160);
  });
});

describe('claims and policy state', () => {
  it('applies clauses, a deductible per damage, and tracks the cap', () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote' as const, items: [
          { type: 'sword', material: 'dragon', enchantment: 9 },
          { type: 'amulet', material: 'silver', enchantment: 2 },
        ] },
        { op: 'claim' as const, policy: 0, incident: { cause: 'attack', damages: [
          { itemType: 'sword', amount: 1000 },
          { itemType: 'amulet', amount: 300 },
        ] } },
        { op: 'claim' as const, policy: 0, incident: { cause: 'again', damages: [
          { itemType: 'sword', amount: 6000 },
        ] } },
      ],
    };
    expect(processScenario(scenario).results).toEqual([
      { premium: 211 },
      { payout: 600, remainingCap: 2600 },
      { payout: 2600, remainingCap: 0 },
    ]);
  });

  it('rounds a fractional payout down at the end', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'magic', damages: [{ itemType: 'sword', amount: 901 }],
        } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('supports duplicate insured types with separate deductibles', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it.each([
    { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] },
    { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } }] },
    { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 1 }] } },
    ] },
    { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -1 }] } },
    ] },
  ])('rejects invalid scenarios %#', scenario => {
    expect(() => processScenario(scenario)).toThrow();
  });
});
