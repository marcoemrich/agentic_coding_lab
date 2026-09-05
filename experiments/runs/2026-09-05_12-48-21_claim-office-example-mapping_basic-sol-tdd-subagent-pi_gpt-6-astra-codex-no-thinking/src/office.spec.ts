import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
const cli = (steps: Step[]) => spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps }), encoding: 'utf8' });
const rejectsClaim = (damages: { itemType: string; amount: number }[]) => {
  const result = cli([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages } }]);
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
};
import { runScenario, type Item, type Step } from './office.js';

const quote = (items: Item[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
const copies = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const claim = (items: Item[], damages: { itemType: string; amount: number }[]) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } }] }).results[1];

it('empty items premium 5', () => { expect(quote([])).toEqual({ premium: 5 }); });
it('main item prices sword 115 amulet 71 staff 93 potion 49', () => {
  for (const [type, premium] of [['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49]] as const) expect(quote([{ type }])).toEqual({ premium });
});
it('2 runes base 50 premium 60', () => { expect(quote(copies('rune', 2))).toEqual({ premium: 60 }); });
it('3 runes base 60 premium 71', () => { expect(quote(copies('rune', 3))).toEqual({ premium: 71 }); });
it('4 runes base 100 premium 115', () => { expect(quote(copies('rune', 4))).toEqual({ premium: 115 }); });
it('7 runes base 175 premium 198 rounding up', () => { expect(quote(copies('rune', 7))).toEqual({ premium: 198 }); });
it('2 runes and moonstone base 75 premium 88', () => { expect(quote([...copies('rune', 2), { type: 'moonstone' }])).toEqual({ premium: 88 }); });
it('3 runes and 3 moonstones base 120 premium 137', () => { expect(quote([...copies('rune', 3), ...copies('moonstone', 3)])).toEqual({ premium: 137 }); });
it('newcomer cursed sword premium 165', () => { expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 }); });
it('cursed sword plain amulet item scope premium 231', () => { expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 }); });
it('exactly 2 years loyalty sword premium 95', () => { expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 }); expect(quote([{ type: 'sword' }], 1)).toEqual({ premium: 115 }); });
it('enchantment 5 cursed sword premium 195', () => { expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }])).toEqual({ premium: 195 }); });
it('enchantment 4 plain sword 115 cursed sword 165', () => { expect(quote([{ type: 'sword', enchantment: 4 }])).toEqual({ premium: 115 }); expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toEqual({ premium: 165 }); });
it('second quote new cursed enchanted sword premium 160', () => {
  expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: 'quote', items: [] }, { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] }] }).results).toEqual([{ premium: 5 }, { premium: 160 }]);
});
it('standard steel enchantment 3 damage 500 payout 400', () => { expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('rune damage 200 payout 100', () => { expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }); });
it('dragon enchantment 8 damage 1000 payout 400', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('dragon enchantment 9 damage 1000 payout 400', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('dragon enchantment 5 damage 800 payout 700', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 }); });
it('steel enchantment 9 damage 1000 payout 400', () => { expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('sword 500 amulet 300 deductibles payout 600 cap remaining 2600', () => { expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 }); });
it('two swords sum 2000 cap 4000 separate deductibles', () => { expect(claim(copies('sword', 2), [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 }); });
it('sword and 3 runes insurance sum 1750 cap 3500', () => { expect(claim([{ type: 'sword' }, ...copies('rune', 3)], [])).toEqual({ payout: 0, remainingCap: 3500 }); });
it('successive 1500 claims pay 1400 then 600 exhaust cap', () => {
  const damageStep: Step = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
  expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword', cursed: true }] }, damageStep, damageStep, damageStep] }).results).toEqual([{ premium: 165 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
});
it('fractional payout 350.5 rounds down to 350', () => { expect(claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 }); });
it('intermediate payout fractions retained until final rounding', () => { expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])).toEqual({ payout: 701, remainingCap: 3299 }); });
it('damage below deductible pays zero', () => { expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 }); });
it('schema example amulet premium 59 payout 100 remaining 1100', () => { expect(runScenario({ customer: { yearsWithMHPCO: 5 }, steps: [{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }] }).results).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]); });
it('CLI quote unknown type exits nonzero stderr no stdout', () => { const result = cli([{ op: 'quote', items: [{ type: 'broomstick' }] }]); expect(result.status).not.toBe(0); expect(result.stderr.trim()).not.toBe(''); expect(result.stdout).toBe(''); });
it('CLI uninsured amulet rejects entire claim', () => { rejectsClaim([{ itemType: 'amulet', amount: 200 }]); });
it('CLI unknown damaged type rejects entire claim', () => { rejectsClaim([{ itemType: 'broomstick', amount: 200 }]); });
it('CLI excess same-type damages rejects entire claim', () => { rejectsClaim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }]); });
it('CLI negative damage rejects entire claim', () => { rejectsClaim([{ itemType: 'sword', amount: -200 }]); });
it('CLI successful scenario JSON results in step order', () => {
  const result = cli([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } }, { op: 'quote', items: [{ type: 'amulet' }] }, { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }]);
  expect(result.status).toBe(0); expect(result.stderr).toBe('');
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }] });
});

it('remaining price-list insurance caps staff 1600 potion 800 moonstone 500', () => {
  for (const [type, remainingCap] of [['staff', 1600], ['potion', 800], ['moonstone', 500]] as const) expect(claim([{ type }], [])).toEqual({ payout: 0, remainingCap });
});
