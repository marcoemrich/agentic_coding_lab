import { describe, expect, it } from 'vitest';
import { runScenario, type Item, type Step } from './office.js';

const quote = (items: Array<{type: string; cursed?: boolean; enchantment?: number; material?: string}>, yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];

const claims = (items: Item[], damages: Array<{ itemType: string; amount: number }>, extra: Step[] = []) =>
  runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items },
    { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
    ...extra,
  ] }).results;

describe('quotes', () => {
  it('prices each item and the processing fee, including an empty list', () => {
    expect(quote([])).toEqual({ premium: 5 });
    expect(quote([{ type: 'sword' }])).toEqual({ premium: 115 });
    expect(quote([{ type: 'amulet' }, { type: 'staff' }, { type: 'potion' }])).toEqual({ premium: 203 });
  });
  it('only blocks exactly three components of the same type', () => {
    for (const [count, premium] of [[2, 60], [3, 71], [4, 115], [7, 198]]) {
      expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
    }
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
    expect(quote([...Array(3).fill({ type: 'rune' }), ...Array(3).fill({ type: 'moonstone' })])).toEqual({ premium: 137 });
  });
  it('scopes item surcharges and policy discounts to their respective bases', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
    expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }], 2)).toEqual({ premium: 175 });
    expect(quote([{ type: 'sword', cursed: true, enchantment: 4 }], 2)).toEqual({ premium: 145 });
    expect(quote([{ type: 'sword', cursed: true, enchantment: 3 }])).toEqual({ premium: 165 });
  });
  it('applies the follow-up discount and first-insurance surcharge together', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it('rounds only the final premium up', () => {
    expect(quote([{ type: 'rune', cursed: true }])).toEqual({ premium: 45 });
  });
});

describe('claims', () => {
  it('deducts once per damage event, including components, not once per incident', () => {
    expect(claims([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
    ])[1]).toEqual({ payout: 600, remainingCap: 2600 });
    expect(claims([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('prioritizes the high-enchantment clause over dragon material at level 8', () => {
    for (const [material, enchantment, amount, payout] of [
      ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
      ['dragon', 5, 800, 700], ['steel', 9, 1000, 400],
      ['steel', 3, 500, 400],
    ] as const) {
      expect(claims([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }])[1])
        .toEqual({ payout, remainingCap: 2000 - payout });
    }
  });
  it('rounds fractional payout down at the end and never pays negative amounts', () => {
    expect(claims([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
    expect(claims([{ type: 'sword' }], [{ itemType: 'sword', amount: 20 }])[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('tracks the policy cap across multiple claims and bases it on insurance values', () => {
    const second: Step = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
    expect(claims([{ type: 'sword' }], [{ itemType: 'sword', amount: 1500 }], [second]).slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
    expect(claims([{ type: 'sword', cursed: true }, ...Array(3).fill({ type: 'rune' })], [])[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it('allows duplicate insured items but never more damage entries than covered items', () => {
    expect(claims([{ type: 'sword' }, { type: 'sword' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 },
    ])[1]).toEqual({ payout: 600, remainingCap: 3400 });
    expect(() => claims([{ type: 'sword' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 },
    ])).toThrow(/Uninsured/);
  });
  it('rejects invalid item types, uninsured damage, negative amounts and missing policies', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/Unknown item/);
    expect(() => claims([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }])).toThrow(/Uninsured/);
    expect(() => claims([{ type: 'sword' }], [{ itemType: 'broomstick', amount: 200 }])).toThrow(/Uninsured/);
    expect(() => claims([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(/Invalid damage/);
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
    ] })).toThrow(/Unknown policy/);
  });
});
