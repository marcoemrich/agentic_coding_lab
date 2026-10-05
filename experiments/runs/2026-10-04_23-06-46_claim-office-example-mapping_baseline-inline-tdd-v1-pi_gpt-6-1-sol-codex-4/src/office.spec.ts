import { describe, expect, it } from 'vitest';
import { processScenario } from './office';
import type { Item, ItemType } from './office';

function quote(items: Item[], years = 0) {
  return processScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
}

function claim(items: Item[], damages: { itemType: ItemType; amount: number }[]) {
  return processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
  ] }).results[1];
}

describe('input schema', () => {
  it.each([
    null,
    {},
    { customer: {}, steps: [] },
    { customer: { yearsWithMHPCO: '2' }, steps: [] },
    { customer: { yearsWithMHPCO: 2.5 }, steps: [] },
    { customer: { yearsWithMHPCO: 0 }, steps: {} },
    ...[
      { op: 'renew', items: [] },
      { op: 'quote', items: [{ type: 'sword', cursed: 'false' }] },
      { op: 'quote', items: [{ type: 'sword', enchantment: 5.5 }] },
      { op: 'quote', items: [{ type: 'sword', material: 1 }] },
      { op: 'claim', policy: '0', incident: { cause: 'fire', damages: [] } },
      { op: 'claim', policy: 0, incident: { damages: [] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1.5 }] } },
    ].map(step => ({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, step] })),
  ])('rejects malformed schema input %j', input => {
    expect(() => processScenario(input)).toThrow();
  });
});

describe('invalid operations', () => {
  it.each(['broomstick', 'toString', '__proto__'])('rejects unknown quote type %s', type => {
    expect(() => quote([{ type: type as ItemType }])).toThrow(/type/i);
  });
  it.each(['amulet', 'broomstick'])('rejects uninsured damage type %s', type => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: type as ItemType, amount: 200 }])).toThrow(/insured/i);
  });
  it('rejects more damages of a type than covered items', () => {
    expect(() => claim([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
    ])).toThrow(/insured/i);
  });
  it('rejects negative damage amounts', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(/amount/i);
  });
  it.each([-1, 1, 2])('rejects an invalid or future policy index %i', policy => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy, incident: { cause: 'fire', damages: [] } },
    ] })).toThrow(/policy/i);
  });
  it('rejects references to claim steps rather than quotes', () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
      { op: 'claim', policy: 1, incident: { cause: 'fire', damages: [] } },
    ] })).toThrow(/policy/i);
  });
});

describe('policy limits and repeated item types', () => {
  it.each([
    [[{ type: 'sword' }, { type: 'amulet' }], 3200],
    [[{ type: 'sword', cursed: true }], 2000],
    [[{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    [[{ type: 'sword' }, { type: 'sword' }], 4000],
  ] as [Item[], number][])('bases the cap on every unmodified insurance value: %j', (items, cap) => {
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: cap });
  });
  it('exhausts the cap over successive claims and never pays more afterwards', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'sword' as const, amount: 1500 }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident },
      { op: 'claim', policy: 0, incident },
      { op: 'claim', policy: 0, incident },
    ] }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
    ]);
  });
  it('matches repeated types in policy order with a deductible for each damage', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 3 }], [
      { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 },
    ])).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it('uses quote step indexes, keeps caps separate, and does not count claims as contracts', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'sword' as const, amount: 1500 }] };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident },
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 2, incident },
      { op: 'claim', policy: 0, incident },
      { op: 'quote', items: [{ type: 'sword' }] },
    ] }).results).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { premium: 100 },
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { premium: 100 },
    ]);
  });
});

describe('claim reimbursements', () => {
  it.each([
    [{ type: 'sword', material: 'steel', enchantment: 3 }, 500, 400, 1600],
    [{ type: 'rune' }, 200, 100, 400],
    [{ type: 'sword', material: 'dragon', enchantment: 8 }, 1000, 400, 1600],
    [{ type: 'sword', material: 'dragon', enchantment: 9 }, 1000, 400, 1600],
    [{ type: 'sword', material: 'dragon', enchantment: 5 }, 800, 700, 1300],
    [{ type: 'sword', material: 'steel', enchantment: 9 }, 1000, 400, 1600],
    [{ type: 'sword', enchantment: 7 }, 1000, 900, 1100],
    [{ type: 'sword', enchantment: 8 }, 901, 350, 1650],
    [{ type: 'sword' }, 99, 0, 2000],
    [{ type: 'sword', enchantment: 8 }, 100, 0, 2000],
  ] as [Item, number, number, number][])('reimburses %j damage %i', (item, amount, payout, remainingCap) => {
    expect(claim([item], [{ itemType: item.type, amount }])).toEqual({ payout, remainingCap });
  });
  it('deducts once per damage entry, not once per incident', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('keeps fractional reimbursements until the final payout', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], [
      { itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 },
    ])).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it('handles an empty damage report', () => {
    expect(claim([{ type: 'sword' }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe('premium modifiers', () => {
  it.each([
    [{ type: 'sword', cursed: true, enchantment: 3 }, 0, 165],
    [{ type: 'sword', cursed: true, enchantment: 4 }, 0, 165],
    [{ type: 'sword', enchantment: 5 }, 0, 145],
    [{ type: 'sword', cursed: true, enchantment: 5 }, 0, 195],
    [{ type: 'sword' }, 1, 115],
    [{ type: 'sword' }, 2, 95],
  ] as [Item, number, number][])('applies thresholds and additive surcharges to %j, years %i', (item, years, premium) => {
    expect(quote([item], years)).toEqual({ premium });
  });
  it('only surcharges the affected item; policy discounts use the base sum', () => {
    const items: Item[] = [{ type: 'sword', cursed: true }, { type: 'amulet' }];
    expect(quote(items)).toEqual({ premium: 231 });
    expect(quote(items, 2)).toEqual({ premium: 199 });
  });
  it('discounts subsequent contracts but still assesses each new item', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it('rounds only the final premium up, including 197.5', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'rune' }], 2)).toEqual({ premium: 168 });
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [] },
      { op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'rune' }, { type: 'rune' }] },
    ] }).results[1]).toEqual({ premium: 198 });
  });
});

describe('component blocks', () => {
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('quotes %i runes with exact-three blocks only', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
  });
  it('does not group different types together', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('allows a separate block for each component type', () => {
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type: type as ItemType }))))).toEqual({ premium: 137 });
  });
});

describe('base premiums and insurance assessment', () => {
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('quotes a %s', (type, premium) => {
    expect(quote([{ type: type as ItemType }])).toEqual({ premium });
  });
  it('charges only the processing fee for an empty policy', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
});
