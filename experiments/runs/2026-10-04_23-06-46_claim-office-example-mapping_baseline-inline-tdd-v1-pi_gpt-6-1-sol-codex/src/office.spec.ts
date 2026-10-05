import { describe, expect, it } from 'vitest';
import { processScenario, type Item, type Step } from './office';

const claimStep = (damages: { itemType: string; amount: number }[], policy = 0): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const claim = (items: Item[], damages: { itemType: string; amount: number }[]) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, claimStep(damages)] }).results[1];

const quote = (items: Item[], years = 0) => processScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];

describe('claims', () => {
  it('exhausts a cumulative cap across successive claims', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      claimStep([{ itemType: 'sword', amount: 1500 }]),
      claimStep([{ itemType: 'sword', amount: 1500 }]),
      claimStep([{ itemType: 'sword', amount: 1500 }]),
    ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it.each([
    [[{ type: 'sword' }, { type: 'amulet' }], 3200],
    [[{ type: 'sword', cursed: true }], 2000],
    [[{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    [[{ type: 'sword' }, { type: 'sword' }], 4000],
  ] as [Item[], number][])('caps payout by unmodified insurance values %j', (items, cap) => {
    expect(claim(items, [{ itemType: 'sword', amount: 10000 }])).toEqual({ payout: cap, remainingCap: 0 });
  });
  it('tracks policies by step index independently, and claims do not count as contracts', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      claimStep([{ itemType: 'sword', amount: 500 }]),
      { op: 'quote', items: [{ type: 'amulet' }] },
      claimStep([{ itemType: 'amulet', amount: 200 }], 2),
      claimStep([], 0),
    ] }).results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 1600 }]);
  });
  it('deducts once per damaged item, even within the same incident', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('covers duplicate items separately, matching damages in policy order', () => {
    expect(claim([{ type: 'sword', enchantment: 3 }, { type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 }])).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it.each([
    [{ itemType: 'amulet', amount: 500 }],
    [{ itemType: 'broomstick', amount: 500 }],
    [{ itemType: 'sword', amount: -200 }],
    [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }],
  ])('rejects invalid damages %j', (...damages) => {
    expect(() => claim([{ type: 'sword' }], damages)).toThrow();
  });
  it.each([-1, 1, 99])('rejects policy reference %i', policy => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [] }, claimStep([], policy)] })).toThrow(/policy/i);
  });
  it.each([['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400], ['dragon', 5, 800, 700], ['steel', 9, 1000, 400], ['steel', 7, 1000, 900], ['steel', 8, 901, 350]])('handles %s material at enchantment %i', (material, enchantment, amount, payout) => {
    expect(claim([{ type: 'sword', material, enchantment }], [{ itemType: 'sword', amount }])).toEqual({ payout, remainingCap: 2000 - payout });
  });
  it('rounds down only after summing fractional reimbursements', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }])).toEqual({ payout: 701, remainingCap: 2499 });
  });
  it('reimburses standard damage less the deductible', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it.each([0, 50, 100])('never pays negative amounts for damage %i', amount => {
    expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount }])).toEqual({ payout: 0, remainingCap: 2000 });
  });
});

describe('quotes', () => {
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('prices a new %s', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('prices exactly %i runes with no repeated blocks', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
  });
  it('groups components by exact type', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type }))))).toEqual({ premium: 137 });
  });
  it.each([
    [false, 4, 115], [true, 4, 165], [false, 5, 145], [true, 5, 195],
  ])('adds independent item risks: cursed=%s enchantment=%i', (cursed, enchantment, premium) => {
    expect(quote([{ type: 'sword', cursed, enchantment }])).toEqual({ premium });
  });
  it('applies risks to the affected item base, not the whole policy', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
  it('keeps fractional premiums until the final rounding', () => {
    expect(quote([{ type: 'rune', cursed: true }, { type: 'moonstone', cursed: true }])).toEqual({ premium: 85 });
  });
  it.each([[1, 115], [2, 95], [3, 95]])('applies loyalty at %i years', (years, premium) => {
    expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
  });
  it('counts previous quotes, keeps first-insurance surcharge, and stacks discounts additively', () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7, material: 'steel' }] },
      { op: 'quote', items: [{ type: 'sword' }] },
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }, { premium: 80 }]);
  });
  it('rejects unknown item types', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(/unknown/i);
  });
  it('charges only the processing fee for an empty policy', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
});
