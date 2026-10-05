import { describe, expect, it } from 'vitest';
import { processScenario, type Scenario } from './office';
type Items = Extract<Scenario['steps'][number], { op: 'quote' }>['items'];
type Damages = Extract<Scenario['steps'][number], { op: 'claim' }>['incident']['damages'];
const claim = (items: Items, damages: Damages) => processScenario({
  customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items },
    { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
  ],
}).results[1];

describe('claims', () => {
  it.each([
    [{ type: 'sword', material: 'steel', enchantment: 3 }, 500, 400, 1600],
    [{ type: 'rune' }, 200, 100, 400],
    [{ type: 'sword' }, 50, 0, 2000],
    [{ type: 'sword' }, 100, 0, 2000],
    [{ type: 'sword' }, 0, 0, 2000],
  ])('reimburses ordinary damage with a nonnegative payout: %j, %i', (item, amount, payout, remainingCap) => {
    expect(claim([item], [{ itemType: item.type, amount }])).toEqual({ payout, remainingCap });
  });
  it.each([
    ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700], ['steel', 9, 1000, 400],
    ['steel', 7, 1000, 900], ['steel', 8, 901, 350],
  ])('handles material=%s enchantment=%i damage=%i', (material, enchantment, amount, payout) => {
    expect(claim([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }]))
      .toEqual({ payout, remainingCap: 2000 - payout });
  });
  it('rounds the final payout only, after summing fractional damages', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], [
      { itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 },
    ])).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it.each([
    [[{ type: 'sword' }, { type: 'sword' }], 4000],
    [[{ type: 'sword' }, { type: 'amulet' }], 3200],
    [[{ type: 'sword', cursed: true }], 2000],
    [[{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    [[{ type: 'staff' }, { type: 'potion' }, { type: 'moonstone' }], 2900],
    [[], 0],
  ])('bases the cap on unmodified insurance values: %j', (items, cap) => {
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: cap });
  });
  it('handles two same-type damages separately in policy order', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword' }], [
      { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 },
    ])).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it('exhausts the cap across claims and keeps policies independent by step index', () => {
    const damage = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: damage },
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: damage },
      { op: 'claim', policy: 0, incident: damage },
      { op: 'claim', policy: 2, incident: damage },
    ] }).results).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { premium: 100 },
      { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
      { payout: 1400, remainingCap: 600 },
    ]);
  });
  it.each([
    [{ itemType: 'amulet', amount: 200 }],
    [{ itemType: 'broomstick', amount: 200 }],
    [{ itemType: 'sword', amount: -200 }],
    [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }],
  ])('rejects an invalid claim: %j', (...damages) => {
    expect(() => claim([{ type: 'sword' }], damages)).toThrow();
  });
  it('deducts once per damaged item, not once per incident', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });
});
