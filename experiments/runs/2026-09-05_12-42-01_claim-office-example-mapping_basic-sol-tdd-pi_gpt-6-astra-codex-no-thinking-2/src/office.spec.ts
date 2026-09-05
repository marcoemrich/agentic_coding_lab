import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
const quote = (items: Item[]) => ({ op: 'quote', items });
const claim = (damages: { itemType: string; amount: number }[], policy = 0) =>
  ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const items = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
function cli(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('node', ['--import', 'tsx', 'src/cli.ts'], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
  });
}
function results(steps: unknown[], years = 0) {
  const run = cli(steps, years);
  expect(run.status, run.stderr).toBe(0);
  return JSON.parse(run.stdout).results;
}
function premium(list: Item[], years = 0) {
  return results([quote(list)], years)[0].premium;
}
function payout(item: Item, amount: number) {
  return results([quote([item]), claim([{ itemType: item.type, amount }])])[1];
}
function rejects(steps: unknown[]) {
  const run = cli(steps);
  expect(run.status).not.toBe(0);
  expect(run.stderr.length).toBeGreaterThan(0);
  expect(run.stdout).toBe('');
}

it('staff potion moonstone caps are 1600 800 500', () => {
  expect(['staff', 'potion', 'moonstone'].map(type => results([quote([{ type }]), claim([])])[1].remainingCap))
    .toEqual([1600, 800, 500]);
});
it('claim-office executable reads stdin and writes premium 5', () => {
  const run = spawnSync('./claim-office', [], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [quote([])] }), encoding: 'utf8' });
  expect(run.status, run.stderr).toBe(0);
  expect(run.stdout.trim()).toBe('{"results":[{"premium":5}]}');
});
it('one year has no loyalty and enchantment 5 plain sword costs 145', () => {
  expect(premium([{ type: 'sword' }], 1)).toBe(115);
  expect(premium([{ type: 'sword', enchantment: 5 }], 1)).toBe(145);
});
it('multi-item follow-up modifiers use base and preserve premium fractions', () => {
  expect(results([quote([]), quote([{ type: 'sword', cursed: true, enchantment: 5 }, { type: 'amulet' }, ...items('rune', 2)])], 2)[1])
    .toEqual({ premium: 243 });
});
it('duplicate swords match distinct enchantments in insured order', () => {
  expect(results([quote([{ type: 'sword', enchantment: 9 }, { type: 'sword', enchantment: 3 }]),
    claim([{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 }])])[1])
    .toEqual({ payout: 1300, remainingCap: 2700 });
});
it('below deductible and exhausted cap pay zero', () => {
  expect(results([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 50 }]),
    claim([{ itemType: 'sword', amount: 3000 }]), claim([{ itemType: 'sword', amount: 500 }])]))
    .toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }, { payout: 2000, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
});

it('empty list costs 5 G', () => {
  expect(results([quote([])])).toEqual([{ premium: 5 }]);
});
it('main item prices: sword 115, amulet 71, staff 93, potion 49', () => {
  expect(['sword', 'amulet', 'staff', 'potion'].map(type => premium([{ type }]))).toEqual([115, 71, 93, 49]);
});
it('2 runes base 50, premium 60', () => {
  expect(premium(items('rune', 2))).toBe(60);
});
it('3 runes base 60, premium 71', () => {
  expect(premium(items('rune', 3))).toBe(71);
});
it('4 runes base 100, premium 115', () => {
  expect(premium(items('rune', 4))).toBe(115);
});
it('7 runes base 175, premium 198 rounded up', () => {
  expect(premium(items('rune', 7))).toBe(198);
});
it('2 runes and 1 moonstone base 75, premium 88', () => {
  expect(premium([...items('rune', 2), ...items('moonstone', 1)])).toBe(88);
});
it('3 runes and 3 moonstones base 120, premium 137', () => {
  expect(premium([...items('rune', 3), ...items('moonstone', 3)])).toBe(137);
});
it('newcomer cursed sword enchantment 3 costs 165', () => {
  expect(premium([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
});
it('cursed sword and plain amulet cost 231 with item-scoped curse', () => {
  expect(premium([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
});
it('exactly 2 years loyalty costs 95 for sword', () => {
  expect(premium([{ type: 'sword' }], 2)).toBe(95);
});
it('enchantment 5 cursed sword costs 195 with additive surcharges', () => {
  expect(premium([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
});
it('enchantment 4 plain sword costs 115 and cursed costs 165', () => {
  expect([false, true].map(cursed => premium([{ type: 'sword', enchantment: 4, cursed }]))).toEqual([115, 165]);
});
it('second quote at 3 years cursed enchantment 7 sword costs 160', () => {
  expect(results([quote([]), quote([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }])], 3))
    .toEqual([{ premium: 5 }, { premium: 160 }]);
});
it('regular steel enchantment 3 sword damage 500 pays 400 cap 1600', () => {
  expect(payout({ type: 'sword', material: 'steel', enchantment: 3 }, 500)).toEqual({ payout: 400, remainingCap: 1600 });
});
it('rune damage 200 pays 100 cap 400', () => {
  expect(payout({ type: 'rune' }, 200)).toEqual({ payout: 100, remainingCap: 400 });
});
it('dragon enchantment 8 damage 1000 pays 400', () => {
  expect(payout({ type: 'sword', material: 'dragon', enchantment: 8 }, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
});
it('dragon enchantment 9 damage 1000 pays 400', () => {
  expect(payout({ type: 'sword', material: 'dragon', enchantment: 9 }, 1000).payout).toBe(400);
});
it('dragon enchantment 5 damage 800 pays 700', () => {
  expect(payout({ type: 'sword', material: 'dragon', enchantment: 5 }, 800).payout).toBe(700);
});
it('steel enchantment 9 damage 1000 pays 400', () => {
  expect(payout({ type: 'sword', material: 'steel', enchantment: 9 }, 1000).payout).toBe(400);
});
it('sword 500 and amulet 300 damage pays 600 cap 2600', () => {
  expect(results([quote([{ type: 'sword' }, { type: 'amulet' }]), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])])[1])
    .toEqual({ payout: 600, remainingCap: 2600 });
});
it('two swords insure 2000 cap 4000 and separate damage deductibles', () => {
  expect(results([quote(items('sword', 2)), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])])[1])
    .toEqual({ payout: 600, remainingCap: 3400 });
});
it('cursed sword premium 165 retains cap 2000', () => {
  expect(results([quote([{ type: 'sword', cursed: true }]), claim([])]))
    .toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
});
it('sword plus 3 runes insure 1750 cap 3500', () => {
  expect(results([quote([...items('sword', 1), ...items('rune', 3)]), claim([])])[1])
    .toEqual({ payout: 0, remainingCap: 3500 });
});
it('successive 1500 claims pay 1400 then 600 leaving zero cap', () => {
  const damage = [{ itemType: 'sword', amount: 1500 }];
  expect(results([quote(items('sword', 1)), claim(damage), claim(damage)]))
    .toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
});
it('fractional payout 350.5 rounds down to 350', () => {
  expect(payout({ type: 'sword', enchantment: 8 }, 901)).toEqual({ payout: 350, remainingCap: 1650 });
});
it('fractional item payouts sum before final rounding', () => {
  expect(results([quote([{ type: 'sword', enchantment: 8 }, { type: 'amulet', enchantment: 8 }]),
    claim([{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }])])[1])
    .toEqual({ payout: 701, remainingCap: 2499 });
});
it('schema scenario amulet at 5 years costs 59 and damage 200 pays 100', () => {
  expect(results([quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]),
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }], 5))
    .toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
});
it('policy reference is step index rather than quote number', () => {
  expect(results([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 500 }]),
    quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 200 }], 2), claim([])]))
    .toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 100 },
      { payout: 100, remainingCap: 1900 }, { payout: 0, remainingCap: 1600 }]);
});
it('unknown quote item exits nonzero with stderr and no stdout results', () => {
  rejects([quote([{ type: 'broomstick' }])]);
});
it('uninsured amulet damage exits nonzero with stderr', () => {
  rejects([quote(items('sword', 1)), claim([{ itemType: 'amulet', amount: 200 }])]);
});
it('unknown damage type exits nonzero with stderr', () => {
  rejects([quote(items('sword', 1)), claim([{ itemType: 'broomstick', amount: 200 }])]);
});
it('excess sword damage entries reject entire claim', () => {
  rejects([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])]);
});
it('negative damage exits nonzero with stderr', () => {
  rejects([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: -200 }])]);
});
