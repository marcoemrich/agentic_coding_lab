import { describe, expect, it } from 'vitest';
import { runScenario, type Item } from './office';

const components = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const quote = (items: Item[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];

describe('component blocks', () => {
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('prices %i runes with only exact triples discounted', (count, premium) => {
    expect(quote(components('rune', count))).toEqual({ premium });
  });
  it('does not combine different types', () => expect(quote([...components('rune', 2), { type: 'moonstone' }])).toEqual({ premium: 88 }));
  it('discounts separate triples', () => expect(quote([...components('rune', 3), ...components('moonstone', 3)])).toEqual({ premium: 137 }));
});

describe('base premiums and initial assessment', () => {
  it.each(['broomstick', 'toString', '__proto__'])('rejects unknown type %s', type => expect(() => quote([{ type }])).toThrow());
  it('charges only the fee for no items', () => expect(quote([])).toEqual({ premium: 5 }));
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('prices %s', (type, premium) => {
    expect(quote([{ type: String(type) }])).toEqual({ premium });
  });
});

describe('premium modifiers', () => {
  it.each([[false, 4, 115], [true, 4, 165], [false, 5, 145], [true, 5, 195]])('curse %s and enchantment %i', (cursed, enchantment, premium) => {
    expect(quote([{ type: 'sword', cursed, enchantment }])).toEqual({ premium });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('loyalty at %i years', (years, premium) => {
    expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
  });
  it('limits item risk to the affected item and uses policy base for loyalty', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }], 2)).toEqual({ premium: 199 });
  });
  it('applies first insurance and follow-up discounts additively on every later quote', () => {
    const items = [{ type: 'sword', cursed: true, enchantment: 7 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items }, { op: 'quote', items }, { op: 'quote', items },
    ] }).results).toEqual([{ premium: 175 }, { premium: 160 }, { premium: 160 }]);
  });
  it('keeps fractional modifiers until final rounding', () => {
    expect(quote([{ type: 'rune', cursed: true }, { type: 'moonstone', cursed: true }])).toEqual({ premium: 85 });
  });
});
