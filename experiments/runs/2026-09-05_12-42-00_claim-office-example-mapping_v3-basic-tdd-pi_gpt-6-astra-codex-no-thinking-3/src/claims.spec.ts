import { expect, it, describe } from 'vitest';
import { runScenario, type Item, type Step } from './office';
const claim = (damages: { itemType: string; amount: number }[], policy = 0): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const run = (items: Item[], ...steps: Step[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, ...steps] }).results;

describe('policy caps and repeated types', () => {
  it('exhausts the cap across successive claims', () => {
    const damage = claim([{ itemType: 'sword', amount: 1500 }]);
    expect(run([{ type: 'sword' }], damage, damage, damage).slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
    ]);
  });
  it.each([
    [[{ type: 'sword' }, { type: 'sword' }], 4000],
    [[{ type: 'sword' }, { type: 'amulet' }], 3200],
    [[{ type: 'sword', cursed: true }], 2000],
    [[{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    [[], 0],
  ] as [Item[], number][])('bases cap on insurance values, not premiums: %j', (items, remainingCap) => {
    expect(run(items, claim([]))[1]).toEqual({ payout: 0, remainingCap });
  });
  it('treats repeated types as separate insured items in policy order', () => {
    expect(run([{ type: 'sword', enchantment: 8 }, { type: 'sword' }], claim([
      { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 },
    ]))[1]).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it('uses step indices and keeps policy caps independent', () => {
    expect(run([{ type: 'sword' }], claim([{ itemType: 'sword', amount: 5000 }]),
      { op: 'quote', items: [{ type: 'amulet' }] }, claim([{ itemType: 'amulet', amount: 200 }], 2), claim([])
    )).toEqual([{ premium: 115 }, { payout: 2000, remainingCap: 0 }, { premium: 62 },
      { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 0 }]);
  });
});

describe('claim rejection', () => {
  it.each([
    [{ itemType: 'amulet', amount: 200 }],
    [{ itemType: 'broomstick', amount: 200 }],
    [{ itemType: 'sword', amount: -200 }],
    [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 200 }],
  ])('rejects invalid damage entries %j', (...damages) => {
    expect(() => run([{ type: 'sword' }], claim(damages))).toThrow();
  });
  it.each([-1, 1, 20])('rejects invalid policy index %i', policy => {
    expect(() => run([{ type: 'sword' }], claim([], policy))).toThrow();
  });
  it('rejects a reference to a claim step', () => {
    expect(() => run([{ type: 'sword' }], claim([]), claim([], 1))).toThrow();
  });
});

describe('reimbursement and deductible', () => {
  it.each([
    ['steel', 3, 500, 400], ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700], ['steel', 9, 1000, 400], ['steel', 7, 500, 400],
    ['steel', 8, 901, 350], ['steel', 0, 50, 0], ['steel', 8, 100, 0], ['steel', 0, 0, 0],
  ])('%s enchantment %i damage %i pays %i', (material, enchantment, amount, payout) => {
    expect(run([{ type: 'sword', material, enchantment }], claim([{ itemType: 'sword', amount }]))[1]).toEqual({ payout, remainingCap: 2000 - payout });
  });
  it('reimburses components normally', () => {
    expect(run([{ type: 'rune' }], claim([{ itemType: 'rune', amount: 200 }]))[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('deducts once per damaged item', () => {
    expect(run([{ type: 'sword' }, { type: 'amulet' }], claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }]))[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('rounds only the final total payout', () => {
    expect(run([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], claim([{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }]))[1]).toEqual({ payout: 701, remainingCap: 2499 });
  });
});
