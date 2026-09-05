import { expect, it } from 'vitest';
import { runScenario, type Item, type Damage, type Step } from './office';
const claim = (damages: Damage[], policy = 0): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const process = (items: Item[], ...claims: Step[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, ...claims] }).results.slice(1);
it.each([
  ['steel', 3, 500, 400], ['dragon', 8, 1000, 400], ['dragon', 9, 1000, 400],
  ['dragon', 5, 800, 700], ['steel', 9, 1000, 400], ['steel', 8, 901, 350],
  ['steel', 7, 100, 0], ['steel', 3, 0, 0], ['steel', 3, 50, 0],
])('%s enchantment %i damage %i', (material, enchantment, amount, payout) => {
  expect(process([{ type: 'sword', material, enchantment }], claim([{ itemType: 'sword', amount }]))).toEqual([{ payout, remainingCap: 2000 - payout }]);
});
it('reimburses ordinary components', () => expect(process([{ type: 'rune' }], claim([{ itemType: 'rune', amount: 200 }]))).toEqual([{ payout: 100, remainingCap: 400 }]));
it('deducts once per damaged item', () => expect(process([{ type: 'sword' }, { type: 'amulet' }], claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }]))).toEqual([{ payout: 600, remainingCap: 2600 }]));
it('sums fractional payouts before rounding down', () => expect(process([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }], claim([{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }]))).toEqual([{ payout: 701, remainingCap: 2499 }]));
it('covers duplicate items and deducts separately', () => expect(process([{ type: 'sword' }, { type: 'sword' }], claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }]))).toEqual([{ payout: 600, remainingCap: 3400 }]));
it('exhausts the cap across claims, independent of premium modifiers', () => expect(process([{ type: 'sword', cursed: true }], ...[1500, 1500, 1500].map(amount => claim([{ itemType: 'sword', amount }])))).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]));
it('uses full component insurance values despite block pricing', () => expect(process([{ type: 'sword' }, ...Array.from({ length: 3 }, () => ({ type: 'rune' }))], claim([]))).toEqual([{ payout: 0, remainingCap: 3500 }]));
it.each([['staff', 1600], ['potion', 800], ['moonstone', 500]])('%s insurance sum', (type, remainingCap) => expect(process([{ type }], claim([]))).toEqual([{ payout: 0, remainingCap }]));
it('indexes policies by step, not quote count, and keeps caps independent', () => {
  expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items: [{ type: 'sword' }] }, claim([{ itemType: 'sword', amount: 1500 }]),
    { op: 'quote', items: [{ type: 'amulet' }] }, claim([{ itemType: 'amulet', amount: 200 }], 2), claim([], 0),
  ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 600 }]);
});
