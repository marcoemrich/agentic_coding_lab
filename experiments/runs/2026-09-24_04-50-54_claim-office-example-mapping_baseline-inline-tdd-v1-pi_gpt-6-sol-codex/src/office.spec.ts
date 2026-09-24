import { describe, expect, it } from 'vitest';
import { runScenario } from './office.js';

const quote = (items: Array<{type: string; material?: string; enchantment?: number; cursed?: boolean}>, yearsWithMHPCO = 0) =>
  runScenario({customer: {yearsWithMHPCO}, steps: [{op: 'quote', items}]}).results[0];

describe('quotes', () => {
  it('charges only the processing fee for an empty policy', () => {
    expect(quote([])).toEqual({premium: 5});
  });
  it.each([
    ['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49],
    ['rune', 33], ['moonstone', 33],
  ])('prices one %s including initial assessment and fee', (type, premium) => {
    expect(quote([{type: String(type)}])).toEqual({premium});
  });
  it.each([
    [2, 60], [3, 71], [4, 115], [7, 198],
  ])('prices %i runes with a block only for exactly three', (count, premium) => {
    expect(quote(Array.from({length: count}, () => ({type: 'rune'})))).toEqual({premium});
  });
  it('groups components by exact type, not family', () => {
    expect(quote([{type: 'rune'}, {type: 'rune'}, {type: 'moonstone'}])).toEqual({premium: 88});
    expect(quote([...Array.from({length: 3}, () => ({type: 'rune'})),
      ...Array.from({length: 3}, () => ({type: 'moonstone'}))])).toEqual({premium: 137});
  });
  it('applies item modifiers to each affected base, and history modifiers to the total base', () => {
    expect(quote([{type: 'sword', cursed: true}, {type: 'amulet'}])).toEqual({premium: 231});
    expect(quote([{type: 'sword', cursed: true, enchantment: 5}])).toEqual({premium: 195});
    expect(quote([{type: 'sword', cursed: true, enchantment: 4}])).toEqual({premium: 165});
    expect(quote([{type: 'sword'}], 2)).toEqual({premium: 95});
  });
  it('uses the discounted component base when adding a surcharge to one item in a block', () => {
    expect(quote([{type: 'rune', cursed: true}, {type: 'rune'}, {type: 'rune'}]))
      .toEqual({premium: 81}); // 60 base + 10 curse + 6 assessment + 5 fee
  });
  it('charges initial assessment on each quote including a follow-up contract', () => {
    const scenario = {customer: {yearsWithMHPCO: 3}, steps: [
      {op: 'quote' as const, items: [{type: 'amulet'}]},
      {op: 'quote' as const, items: [{type: 'sword', cursed: true, enchantment: 7}]},
    ]};
    expect(runScenario(scenario).results).toEqual([{premium: 59}, {premium: 160}]);
  });
  it('rejects unknown item types', () => {
    expect(() => quote([{type: 'broomstick'}])).toThrow(/broomstick/);
  });
});

describe('claims', () => {
  const claim = (items: Array<{type: string; material?: string; enchantment?: number; cursed?: boolean}>,
    damages: Array<{itemType: string; amount: number}>) => runScenario({customer: {yearsWithMHPCO: 0}, steps: [
    {op: 'quote', items}, {op: 'claim', policy: 0, incident: {cause: 'dragon attack', damages}},
  ]}).results[1];

  it('deducts 100 for each damaged item, including components', () => {
    expect(claim([{type: 'sword', material: 'steel', enchantment: 3}, {type: 'amulet'}],
      [{itemType: 'sword', amount: 500}, {itemType: 'amulet', amount: 300}]))
      .toEqual({payout: 600, remainingCap: 2600});
    expect(claim([{type: 'rune'}], [{itemType: 'rune', amount: 200}]))
      .toEqual({payout: 100, remainingCap: 400});
    expect(claim([{type: 'sword'}], [{itemType: 'sword', amount: 20}]))
      .toEqual({payout: 0, remainingCap: 2000});
  });
  it('uses half damage before deductible at enchantment 8 even for dragon material', () => {
    expect(claim([{type: 'sword', material: 'dragon', enchantment: 8}],
      [{itemType: 'sword', amount: 1000}])).toEqual({payout: 400, remainingCap: 1600});
    expect(claim([{type: 'sword', material: 'dragon', enchantment: 9}],
      [{itemType: 'sword', amount: 1000}])).toEqual({payout: 400, remainingCap: 1600});
    expect(claim([{type: 'sword', material: 'steel', enchantment: 9}],
      [{itemType: 'sword', amount: 1000}])).toEqual({payout: 400, remainingCap: 1600});
    expect(claim([{type: 'sword', material: 'dragon', enchantment: 5}],
      [{itemType: 'sword', amount: 800}])).toEqual({payout: 700, remainingCap: 1300});
  });
  it('rounds the total fractional payout down', () => {
    expect(claim([{type: 'sword', enchantment: 8}], [{itemType: 'sword', amount: 901}]))
      .toEqual({payout: 350, remainingCap: 1650});
  });
  it('caps successive claims using unmodified item insurance values', () => {
    expect(runScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: 'quote', items: [{type: 'sword', cursed: true}]},
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: [{itemType: 'sword', amount: 1500}]}},
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: [{itemType: 'sword', amount: 1500}]}},
    ]}).results).toEqual([{premium: 165}, {payout: 1400, remainingCap: 600}, {payout: 600, remainingCap: 0}]);
    expect(claim([{type: 'sword'}, {type: 'rune'}, {type: 'rune'}, {type: 'rune'}], []))
      .toEqual({payout: 0, remainingCap: 3500});
  });
  it('keeps caps separate per policy and counts only quotes as contracts', () => {
    expect(runScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: 'quote', items: [{type: 'sword'}, {type: 'amulet'}]},
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: [{itemType: 'sword', amount: 2000}]}},
      {op: 'quote', items: [{type: 'sword'}]},
      {op: 'claim', policy: 2, incident: {cause: 'fire', damages: [{itemType: 'sword', amount: 300}]}},
    ]}).results).toEqual([
      {premium: 181}, {payout: 1900, remainingCap: 1300},
      {premium: 100}, {payout: 200, remainingCap: 1800},
    ]);
  });
  it('accepts two insured items of the same type as separate damage events', () => {
    expect(claim([{type: 'sword'}, {type: 'sword'}],
      [{itemType: 'sword', amount: 500}, {itemType: 'sword', amount: 500}]))
      .toEqual({payout: 800, remainingCap: 3200});
  });
  it('rejects excess, uninsured, unknown, or negative damages and invalid policy references', () => {
    expect(() => claim([{type: 'sword'}], [{itemType: 'sword', amount: 500}, {itemType: 'sword', amount: 500}])).toThrow();
    expect(() => claim([{type: 'sword'}], [{itemType: 'amulet', amount: 300}])).toThrow();
    expect(() => claim([{type: 'sword'}], [{itemType: 'broomstick', amount: 300}])).toThrow();
    expect(() => claim([{type: 'sword'}], [{itemType: 'sword', amount: -200}])).toThrow();
    expect(() => runScenario({customer: {yearsWithMHPCO: 0}, steps: [
      {op: 'claim', policy: 0, incident: {cause: 'fire', damages: []}},
    ]})).toThrow();
  });
});
