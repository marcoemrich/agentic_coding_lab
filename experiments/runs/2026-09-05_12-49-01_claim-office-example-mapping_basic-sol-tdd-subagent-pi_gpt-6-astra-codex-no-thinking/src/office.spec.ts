import { expect, it } from 'vitest';

it('staff insurance 800 yields cap 1600', () => {
  expect(results([quote(items('staff', 1)), claim([])])[1]).toEqual({ payout: 0, remainingCap: 1600 });
});
it('potion insurance 400 yields cap 800', () => {
  expect(results([quote(items('potion', 1)), claim([])])[1]).toEqual({ payout: 0, remainingCap: 800 });
});
it('moonstone insurance 250 yields cap 500', () => {
  expect(results([quote(items('moonstone', 1)), claim([])])[1]).toEqual({ payout: 0, remainingCap: 500 });
});
import { spawnSync } from 'node:child_process';

function run(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8' });
}
function quote(items: unknown[]) { return { op: 'quote', items }; }
function items(type: string, count: number) { return Array.from({ length: count }, () => ({ type })); }
function claim(damages: { itemType: string; amount: number }[], policy = 0) {
  return { op: 'claim', policy, incident: { cause: 'dragon attack', damages } };
}
function results(steps: unknown[], years = 0) {
  const output = run(steps, years);
  expect(output.status, output.stderr).toBe(0);
  return JSON.parse(output.stdout).results;
}

it('empty quote costs 5 G', () => {
  expect(results([quote([])])).toEqual([{ premium: 5 }]);
});
it('sword base 100 gives premium 115', () => {
  expect(results([quote([{ type: 'sword' }])])).toEqual([{ premium: 115 }]);
});
it('amulet base 60 gives premium 71', () => {
  expect(results([quote(items('amulet', 1))])).toEqual([{ premium: 71 }]);
});
it('staff base 80 gives premium 93', () => {
  expect(results([quote(items('staff', 1))])).toEqual([{ premium: 93 }]);
});
it('potion base 40 gives premium 49', () => {
  expect(results([quote(items('potion', 1))])).toEqual([{ premium: 49 }]);
});
it('two runes base 50 gives premium 60', () => {
  expect(results([quote(items('rune', 2))])).toEqual([{ premium: 60 }]);
});
it('three runes base 60 gives premium 71', () => {
  expect(results([quote(items('rune', 3))])).toEqual([{ premium: 71 }]);
});
it('four runes base 100 gives premium 115', () => {
  expect(results([quote(items('rune', 4))])).toEqual([{ premium: 115 }]);
});
it('seven runes base 175 rounds premium 197.5 to 198', () => {
  expect(results([quote(items('rune', 7))])).toEqual([{ premium: 198 }]);
});
it('two runes and moonstone base 75 gives premium 88', () => {
  expect(results([quote([...items('rune', 2), ...items('moonstone', 1)])])).toEqual([{ premium: 88 }]);
});
it('three runes and three moonstones base 120 gives premium 137', () => {
  expect(results([quote([...items('rune', 3), ...items('moonstone', 3)])])).toEqual([{ premium: 137 }]);
});
it('cursed newcomer sword enchantment 3 costs 165', () => {
  expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])])).toEqual([{ premium: 165 }]);
});
it('cursed sword and plain amulet base 160 risk 50 costs 231', () => {
  expect(results([quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])])).toEqual([{ premium: 231 }]);
});
it('exactly two years loyalty gives sword premium 95', () => {
  expect(results([quote(items('sword', 1))], 2)).toEqual([{ premium: 95 }]);
});
it('enchantment five adds 30 giving premium 145', () => {
  expect(results([quote([{ type: 'sword', enchantment: 5 }])])).toEqual([{ premium: 145 }]);
});
it('cursed enchantment five adds both risks giving premium 195', () => {
  expect(results([quote([{ type: 'sword', enchantment: 5, cursed: true }])])).toEqual([{ premium: 195 }]);
});
it('enchantment four no risk gives premium 115', () => {
  expect(results([quote([{ type: 'sword', enchantment: 4 }])])).toEqual([{ premium: 115 }]);
});
it('cursed enchantment four gives premium 165', () => {
  expect(results([quote([{ type: 'sword', enchantment: 4, cursed: true }])])).toEqual([{ premium: 165 }]);
});
it('second loyal quote cursed enchantment seven costs 160', () => {
  expect(results([quote([]), quote([{ type: 'sword', material: 'steel', cursed: true, enchantment: 7 }])], 3)).toEqual([{ premium: 5 }, { premium: 160 }]);
});
it('regular steel sword enchantment three damage 500 pays 400', () => {
  expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3 }]), claim([{ itemType: 'sword', amount: 500 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('rune damage 200 pays 100', () => {
  expect(results([quote(items('rune', 1)), claim([{ itemType: 'rune', amount: 200 }])])[1]).toEqual({ payout: 100, remainingCap: 400 });
});
it('dragon sword enchantment eight damage 1000 pays 400', () => {
  expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('dragon sword enchantment nine damage 1000 pays 400', () => {
  expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('dragon sword enchantment five damage 800 pays 700', () => {
  expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 5 }]), claim([{ itemType: 'sword', amount: 800 }])])[1]).toEqual({ payout: 700, remainingCap: 1300 });
});
it('steel sword enchantment nine damage 1000 pays 400', () => {
  expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('sword 500 and amulet 300 damage pays 600 with cap 2600', () => {
  expect(results([quote([...items('sword', 1), ...items('amulet', 1)]), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])])[1]).toEqual({ payout: 600, remainingCap: 2600 });
});
it('two swords insurance 2000 cap 4000 with separate deductibles', () => {
  expect(results([quote(items('sword', 2)), claim([]), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])]).slice(1)).toEqual([{ payout: 0, remainingCap: 4000 }, { payout: 800, remainingCap: 3200 }]);
});
it('sword and amulet insurance 1600 cap 3200', () => {
  expect(results([quote([...items('sword', 1), ...items('amulet', 1)]), claim([])])[1]).toEqual({ payout: 0, remainingCap: 3200 });
});
it('cursed sword premium 165 retains cap 2000', () => {
  expect(results([quote([{ type: 'sword', cursed: true }]), claim([])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
});
it('sword and rune block insurance 1750 cap 3500', () => {
  expect(results([quote([...items('sword', 1), ...items('rune', 3)]), claim([])])[1]).toEqual({ payout: 0, remainingCap: 3500 });
});
it('successive sword claims pay 1400 then 600 then zero', () => {
  const incident = claim([{ itemType: 'sword', amount: 1500 }]);
  expect(results([quote(items('sword', 1)), incident, incident, incident]).slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
});
it('payout 350.5 rounds down to 350', () => {
  expect(results([quote([{ type: 'sword', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 901 }])])[1]).toEqual({ payout: 350, remainingCap: 1650 });
});
it('fractional item payouts sum before rounding', () => {
  expect(results([quote([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])])[1]).toEqual({ payout: 701, remainingCap: 3299 });
});
it('damage below deductible pays zero', () => {
  expect(results([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 50 }])])[1]).toEqual({ payout: 0, remainingCap: 2000 });
});
it('policy references step index not quote ordinal', () => {
  expect(results([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 500 }]), quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 200 }], 2)])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 100 }, { payout: 100, remainingCap: 1900 }]);
});
function expectRejected(output: ReturnType<typeof run>) {
  expect(output.status).not.toBe(0);
  expect(output.stderr.length).toBeGreaterThan(0);
  expect(output.stdout).toBe('');
}

it('unknown quote type exits nonzero with stderr and no stdout', () => {
  expectRejected(run([quote([{ type: 'broomstick' }])]));
});
it('uninsured amulet claim exits nonzero with stderr', () => {
  expectRejected(run([quote(items('sword', 1)), claim([{ itemType: 'amulet', amount: 200 }])]));
});
it('unknown damage type exits nonzero with stderr', () => {
  expectRejected(run([quote(items('sword', 1)), claim([{ itemType: 'broomstick', amount: 200 }])]));
});
it('negative damage exits nonzero with stderr', () => {
  expectRejected(run([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: -200 }])]));
});
it('excess sword damage entries reject entire scenario', () => {
  expectRejected(run([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])]));
});
it('schema example silver amulet premium 59 payout 100 cap 1100', () => {
  expect(results([quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]), { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
});
