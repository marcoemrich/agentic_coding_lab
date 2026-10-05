import { describe, expect, it } from 'vitest';
import { processScenario, type Scenario } from './office';

type Items = Extract<Scenario['steps'][number], { op: 'quote' }>['items'];
const quote = (items: Items, years = 0) => processScenario({
  customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }],
}).results[0];

describe('quotes', () => {
  it.each([
    ['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49],
    ['rune', 33], ['moonstone', 33],
  ])('prices a first insurance for %s', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
  it.each([
    [2, 60], [3, 71], [4, 115], [7, 198],
  ])('prices exactly %i runes (block only for three)', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
  });
  it('does not combine different component types into a block', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('allows a separate block of each component type', () => {
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type }))))).toEqual({ premium: 137 });
  });
  it.each([
    [false, 4, 115], [true, 4, 165], [false, 5, 145], [true, 5, 195],
    [true, 3, 165],
  ])('uses additive item risks: cursed=%s enchantment=%i', (cursed, enchantment, premium) => {
    expect(quote([{ type: 'sword', cursed, enchantment }])).toEqual({ premium });
  });
  it('applies item risk only to the affected item', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('applies loyalty at %i years', (years, premium) => {
    expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
  });
  it('uses the policy base for loyalty, not the risk-adjusted amount', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }], 2)).toEqual({ premium: 199 });
  });
  it('discounts every follow-up contract while still assessing new items', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }, { premium: 160 }]);
  });
  it('keeps fractional modifiers until final premium rounding', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [] },
      { op: 'quote', items: [{ type: 'rune', cursed: true, enchantment: 5 }, { type: 'moonstone' }] },
    ] }).results).toEqual([{ premium: 5 }, { premium: 73 }]);
    // 47.5 policy portion + 12.5 curse + 7.5 enchantment + 5 fee = 72.5.
  });
  it('charges only the processing fee for no items', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
});
