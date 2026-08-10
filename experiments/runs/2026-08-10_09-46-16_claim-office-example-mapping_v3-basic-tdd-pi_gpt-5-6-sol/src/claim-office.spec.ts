import { describe, expect, it } from 'vitest';
import { processScenario } from './claim-office.js';

const run = (yearsWithMHPCO: number, steps: Parameters<typeof processScenario>[0]['steps']) =>
  processScenario({ customer: { yearsWithMHPCO }, steps });

describe('quotes', () => {
  it('uses the price list and charges the first-insurance assessment and fee', () => {
    expect(run(0, [{ op: 'quote', items: [
      { type: 'sword' }, { type: 'amulet' }, { type: 'staff' }, { type: 'potion' },
    ] }])).toEqual({ results: [{ premium: 313 }] });
  });

  it.each([
    [2, 50], [3, 60], [4, 100], [7, 175],
  ])('prices %i alike components at %i before policy modifiers', (count, base) => {
    const items = Array.from({ length: count }, () => ({ type: 'rune' as const }));
    expect(run(0, [{ op: 'quote', items }]).results[0]).toEqual({ premium: Math.ceil(base + base * 0.1 + 5) });
  });

  it('groups component blocks by exact type', () => {
    const items = [...Array(3).fill({ type: 'rune' }), ...Array(3).fill({ type: 'moonstone' })];
    expect(run(0, [{ op: 'quote', items }]).results[0]).toEqual({ premium: 137 });
  });

  it('applies item risk only to affected items and thresholds inclusively', () => {
    expect(run(0, [{ op: 'quote', items: [
      { type: 'sword', cursed: true, enchantment: 5 }, { type: 'amulet', enchantment: 4 },
    ] }])).toEqual({ results: [{ premium: 261 }] });
  });

  it('applies loyalty and follow-up modifiers to base while assessing every quote', () => {
    expect(run(3, [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    ])).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  it('charges only the fee for no items and rounds premium up', () => {
    expect(run(0, [
      { op: 'quote', items: [] },
      { op: 'quote', items: [{ type: 'rune', cursed: true }] },
    ])).toEqual({ results: [{ premium: 5 }, { premium: 42 }] });
  });
});

describe('claims', () => {
  it('deducts once per damage, including components', () => {
    expect(run(0, [
      { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }, { type: 'rune' }] },
      { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
        { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
        { itemType: 'rune', amount: 200 },
      ] } },
    ])).toEqual({ results: [{ premium: 209 }, { payout: 700, remainingCap: 3000 }] });
  });

  it('halves enchantment 8 damage before deductible, including dragon material', () => {
    expect(run(0, [
      { op: 'quote', items: [
        { type: 'sword', material: 'dragon', enchantment: 8 },
        { type: 'sword', material: 'dragon', enchantment: 5 },
        { type: 'sword', material: 'steel', enchantment: 9 },
      ] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
        { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 800 },
        { itemType: 'sword', amount: 1000 },
      ] } },
    ])).toEqual({ results: [{ premium: 425 }, { payout: 1500, remainingCap: 4500 }] });
  });

  it('tracks and exhausts the cap across successive claims', () => {
    expect(run(0, [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'one', damages: [{ itemType: 'sword', amount: 1500 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'two', damages: [{ itemType: 'sword', amount: 1500 }] } },
    ])).toEqual({ results: [
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ] });
  });

  it('rounds the aggregate payout down only at the end', () => {
    expect(run(0, [
      { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
      { op: 'claim', policy: 0, incident: { cause: 'odd', damages: [{ itemType: 'sword', amount: 901 }] } },
    ]).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it('rejects an uninsured duplicate damage', () => {
    expect(() => run(0, [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
        { itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 },
      ] } },
    ])).toThrow(/uninsured/);
  });

  it('rejects negative damage', () => {
    expect(() => run(0, [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'error', damages: [
        { itemType: 'sword', amount: -200 },
      ] } },
    ])).toThrow(/amount/);
  });
});

describe('input validation', () => {
  it('rejects unknown quote item types', () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    } as never)).toThrow(/broomstick/);
  });

  it('rejects claims referring to non-quote and future steps', () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'claim', policy: 1, incident: { cause: 'x', damages: [] } },
      { op: 'quote', items: [] },
    ] } as never)).toThrow(/Policy/);
  });
});
