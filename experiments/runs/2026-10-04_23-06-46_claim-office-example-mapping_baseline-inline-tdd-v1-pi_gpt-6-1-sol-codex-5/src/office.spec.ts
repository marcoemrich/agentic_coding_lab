import { describe, expect, it } from 'vitest';
import { processScenario, type Item } from './office';

const quote = (items: Item[], years = 0) => processScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];

describe('quotes', () => {
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('prices %s with first insurance and fee', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('prices exactly %i runes without splitting larger groups', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
  });
  it('does not group different component types', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('groups each exact trio independently', () => {
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type }))))).toEqual({ premium: 137 });
  });
  it.each([[false, 4, 115], [true, 4, 165], [false, 5, 145], [true, 5, 195], [true, 7, 195]])('applies additive item risks: cursed=%s enchantment=%i', (cursed, enchantment, premium) => {
    expect(quote([{ type: 'sword', cursed, enchantment }])).toEqual({ premium });
  });
  it('applies risk only to the affected item, not the policy', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('applies loyalty at %i years', (years, premium) => {
    expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
  });
  it('discounts every follow-up quote but keeps first insurance on each item', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
      { op: 'quote', items: [{ type: 'sword' }] },
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }, { premium: 80 }]);
  });
  it('rounds only the final premium, retaining fractional item charges', () => {
    expect(quote([{ type: 'rune', cursed: true }, { type: 'moonstone', cursed: true }])).toEqual({ premium: 85 });
  });
  it('charges only the processing fee for an empty policy', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
});
