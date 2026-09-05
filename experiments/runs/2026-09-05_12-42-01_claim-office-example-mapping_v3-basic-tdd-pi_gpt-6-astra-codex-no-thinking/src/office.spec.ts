import { describe, expect, it } from 'vitest';
import { runScenario, type Item } from './office';

const quote = (items: Item[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];

describe('base premiums and exact component blocks', () => {
  it('charges only the fee for no items', () => expect(quote([])).toEqual({ premium: 5 }));
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('%s price', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('%i runes', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
  });
  it('does not combine different component types', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('discounts each exact group separately', () => {
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type }))))).toEqual({ premium: 137 });
  });
});
