import { describe, expect, it } from 'vitest';
import { runScenario, type Item, type Step } from './office';

const quote = (items: Item[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];

const claimStep = (damages: { itemType: string; amount: number }[], policy = 0): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const claims = (items: Item[], ...steps: Step[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, ...steps] }).results.slice(1);

describe('rejected inputs', () => {
  it.each(['broomstick', 'toString', '__proto__'])('rejects unknown quote type %s', type => {
    expect(() => quote([{ type }])).toThrow(/unknown item/i);
  });
  it.each([
    [{ itemType: 'amulet', amount: 200 }],
    [{ itemType: 'broomstick', amount: 200 }],
    [{ itemType: 'sword', amount: 200 }, { itemType: 'sword', amount: 300 }],
  ])('rejects uninsured or excess damage entries %j', (...damages) => {
    expect(() => claims([{ type: 'sword' }], claimStep(damages))).toThrow(/not insured/i);
  });
  it('rejects negative damage', () => {
    expect(() => claims([{ type: 'sword' }], claimStep([{ itemType: 'sword', amount: -200 }]))).toThrow(/amount/i);
  });
  it.each([-1, 1, 99])('rejects invalid policy index %i', policy => {
    expect(() => claims([{ type: 'sword' }], claimStep([], policy))).toThrow(/policy/i);
  });
});

describe('policy caps', () => {
  it('exhausts a cap across successive claims', () => {
    const damage = claimStep([{ itemType: 'sword', amount: 1500 }]);
    expect(claims([{ type: 'sword' }], damage, damage, damage)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it.each([
    [[{ type: 'sword' }, { type: 'amulet' }], 3200],
    [[{ type: 'sword', cursed: true }], 2000],
    [[{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }], 3500],
    [[{ type: 'sword' }, { type: 'sword' }], 4000],
    [[{ type: 'staff' }, { type: 'potion' }], 2400],
  ] as [Item[], number][])('uses insurance values for %j', (items, cap) => {
    expect(claims(items, claimStep([{ itemType: items[0].type, amount: 10000 }]))).toEqual([{ payout: cap, remainingCap: 0 }]);
  });
  it('uses step indices and keeps policy caps independent', () => {
    expect(claims([{ type: 'sword' }], claimStep([]), { op: 'quote', items: [{ type: 'amulet' }] }, claimStep([{ itemType: 'amulet', amount: 200 }], 2), claimStep([{ itemType: 'sword', amount: 500 }]))).toEqual([{ payout: 0, remainingCap: 2000 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 400, remainingCap: 1600 }]);
  });
});

describe('claim reimbursement', () => {
  it.each([
    ['steel', 3, 500, 400], ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400], ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400], ['steel', 7, 500, 400],
    ['steel', 8, 901, 350], ['steel', 3, 50, 0], ['steel', 3, 100, 0],
  ])('%s enchantment %i damage %i', (material, enchantment, amount, payout) => {
    expect(claims([{ type: 'sword', material, enchantment }], claimStep([{ itemType: 'sword', amount }]))).toEqual([{ payout, remainingCap: 2000 - payout }]);
  });
  it('reimburses ordinary components', () => {
    expect(claims([{ type: 'rune' }], claimStep([{ itemType: 'rune', amount: 200 }]))).toEqual([{ payout: 100, remainingCap: 400 }]);
  });
  it('deducts once per damaged item', () => {
    expect(claims([{ type: 'sword' }, { type: 'amulet' }], claimStep([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }]))).toEqual([{ payout: 600, remainingCap: 2600 }]);
  });
  it('supports duplicate insured items and rounds after summing', () => {
    expect(claims([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 9 }], claimStep([{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }]))).toEqual([{ payout: 701, remainingCap: 3299 }]);
  });
  it('matches duplicate types in policy order', () => {
    expect(claims([{ type: 'sword', enchantment: 8 }, { type: 'sword' }], claimStep([{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 500 }]))).toEqual([{ payout: 800, remainingCap: 3200 }]);
  });
});

describe('modifiers', () => {
  it.each([[0, 115], [1, 115], [2, 95], [3, 95]])('loyalty at %i years', (years, premium) => {
    expect(quote([{ type: 'sword' }], years)).toEqual({ premium });
  });
  it.each([[4, false, 115], [4, true, 165], [5, false, 145], [5, true, 195]])('enchantment %i cursed %s', (enchantment, cursed, premium) => {
    expect(quote([{ type: 'sword', enchantment, cursed }])).toEqual({ premium });
  });
  it('limits risk surcharges to the affected item', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
  it('stacks all modifiers additively on a second contract', () => {
    const items = [{ type: 'sword', cursed: true, enchantment: 7 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: 'quote', items }, { op: 'quote', items }, { op: 'quote', items }] }).results).toEqual([{ premium: 175 }, { premium: 160 }, { premium: 160 }]);
  });
  it('rounds only the final premium', () => {
    expect(quote([{ type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 60 });
  });
});

describe('base premiums and first assessment', () => {
  it.each([['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49], ['rune', 33], ['moonstone', 33]])('prices %s', (type, premium) => {
    expect(quote([{ type }])).toEqual({ premium });
  });
  it.each([[2, 60], [3, 71], [4, 115], [7, 198]])('prices exactly %i runes', (count, premium) => {
    expect(quote(Array.from({ length: count }, () => ({ type: 'rune' })))).toEqual({ premium });
  });
  it('does not group different component types', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('allows independent component blocks', () => {
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type }))))).toEqual({ premium: 137 });
  });
  it('charges only the fee for an empty policy', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
});
