import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function cli(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8' });
}
function quote(items: unknown[]) { return { op: 'quote', items }; }
function results(steps: unknown[], years = 0) { const run = cli(steps, years); expect(run.stderr).toBe(''); expect(run.status).toBe(0); return JSON.parse(run.stdout).results; }

it('staff cap 1600, potion cap 800, moonstone cap 500', () => {
  for (const [type, remainingCap] of [['staff', 1600], ['potion', 800], ['moonstone', 500]]) expect(results([quote([{ type }]), claim([])])[1]).toEqual({ payout: 0, remainingCap });
});
it('premium intermediate fractions: two cursed runes premium 85, not 86', () => { expect(results([quote([{ type: 'rune', cursed: true }, { type: 'rune', cursed: true }])])).toEqual([{ premium: 85 }]); });
it('empty quote costs 5 G', () => { expect(results([quote([])])).toEqual([{ premium: 5 }]); });
it('main item prices: sword 115, amulet 71, staff 93, potion 49', () => {
  for (const [type, premium] of [['sword', 115], ['amulet', 71], ['staff', 93], ['potion', 49]]) {
    expect(results([quote([{ type }])])).toEqual([{ premium }]);
  }
});
function items(type: string, count: number) { return Array.from({ length: count }, () => ({ type })); }
it('2 runes base 50, premium 60', () => { expect(results([quote(items('rune', 2))])).toEqual([{ premium: 60 }]); });
it('3 runes base 60, premium 71', () => { expect(results([quote(items('rune', 3))])).toEqual([{ premium: 71 }]); });
it('4 runes base 100, premium 115', () => { expect(results([quote(items('rune', 4))])).toEqual([{ premium: 115 }]); });
it('7 runes base 175, premium 198 rounds 197.5 up', () => { expect(results([quote(items('rune', 7))])).toEqual([{ premium: 198 }]); });
it('2 runes and moonstone base 75, premium 88', () => { expect(results([quote([...items('rune', 2), { type: 'moonstone' }])])).toEqual([{ premium: 88 }]); });
it('3 runes and 3 moonstones base 120, premium 137', () => { expect(results([quote([...items('rune', 3), ...items('moonstone', 3)])])).toEqual([{ premium: 137 }]); });
it('newcomer cursed sword premium 165', () => { expect(results([quote([{ type: 'sword', cursed: true, material: 'steel', enchantment: 3 }])])).toEqual([{ premium: 165 }]); });
it('cursed sword and plain amulet base 160, risk 50, premium 231', () => { expect(results([quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])])).toEqual([{ premium: 231 }]); });
it('exactly 2 years loyalty gives sword premium 95', () => { expect(results([quote([{ type: 'sword' }])], 2)).toEqual([{ premium: 95 }]); });
it('enchantment 5 sword premium 145 and cursed 195', () => {
  for (const cursed of [false, true]) expect(results([quote([{ type: 'sword', enchantment: 5, cursed }])])).toEqual([{ premium: cursed ? 195 : 145 }]);
});
it('enchantment 4 sword premium 115 and cursed 165', () => {
  for (const cursed of [false, true]) expect(results([quote([{ type: 'sword', enchantment: 4, cursed }])])).toEqual([{ premium: cursed ? 165 : 115 }]);
});
it('second quote for loyal customer cursed enchantment 7 sword premium 160', () => {
  expect(results([quote([]), quote([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }])], 3)).toEqual([{ premium: 5 }, { premium: 160 }]);
});
function claim(damages: unknown[], policy = 0) { return { op: 'claim', policy, incident: { cause: 'dragon attack', damages } }; }
it('regular steel enchantment 3 sword damage 500 pays 400, cap 1600', () => {
  expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3 }]), claim([{ itemType: 'sword', amount: 500 }])])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
});
it('rune damage 200 pays 100, cap 400', () => { expect(results([quote([{ type: 'rune' }]), claim([{ itemType: 'rune', amount: 200 }])])[1]).toEqual({ payout: 100, remainingCap: 400 }); });
it('dragon enchantment 8 damage 1000 pays 400', () => { expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 }); });
it('dragon enchantment 9 damage 1000 pays 400', () => { expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 }); });
it('dragon enchantment 5 damage 800 pays 700', () => { expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 5 }]), claim([{ itemType: 'sword', amount: 800 }])])[1]).toEqual({ payout: 700, remainingCap: 1300 }); });
it('steel enchantment 9 damage 1000 pays 400', () => { expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 1000 }])])[1]).toEqual({ payout: 400, remainingCap: 1600 }); });
it('sword 500 and amulet 300 damages pay 600, cap 2600', () => { expect(results([quote([{ type: 'sword' }, { type: 'amulet' }]), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])])[1]).toEqual({ payout: 600, remainingCap: 2600 }); });
it('two swords have cap 4000 and separate deductibles', () => { expect(results([quote(items('sword', 2)), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])])[1]).toEqual({ payout: 600, remainingCap: 3400 }); });
it('cursed sword premium 165 has unmodified cap 2000', () => { expect(results([quote([{ type: 'sword', cursed: true }]), claim([])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]); });
it('sword and rune block insurance 1750 gives cap 3500', () => { expect(results([quote([{ type: 'sword' }, ...items('rune', 3)]), claim([])])).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]); });
it('successive 1500 damages pay 1400 then 600, exhausting cap', () => { expect(results([quote([{ type: 'sword' }]), claim([{ itemType: 'sword', amount: 1500 }]), claim([{ itemType: 'sword', amount: 1500 }])])).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]); });
it('fractional payout 350.5 rounds down to 350', () => { expect(results([quote([{ type: 'sword', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 901 }])])[1]).toEqual({ payout: 350, remainingCap: 1650 }); });
it('intermediate payout fractions retained until final rounding', () => { expect(results([quote([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])])[1]).toEqual({ payout: 701, remainingCap: 3299 }); });
function rejects(steps: unknown[]) { const run = cli(steps); expect(run.status).not.toBe(0); expect(run.stderr.length).toBeGreaterThan(0); expect(run.stdout).toBe(''); }
it('unknown quote type rejects with stderr and no stdout', () => { rejects([quote([{ type: 'broomstick' }])]); });
it('uninsured amulet rejects whole claim', () => { rejects([quote([{ type: 'sword' }]), claim([{ itemType: 'amulet', amount: 200 }])]); });
it('unknown damage type rejects whole claim', () => { rejects([quote([{ type: 'sword' }]), claim([{ itemType: 'broomstick', amount: 200 }])]); });
it('excess sword damage entries reject whole claim', () => { rejects([quote([{ type: 'sword' }]), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])]); });
it('negative damage rejects with stderr', () => { rejects([quote([{ type: 'sword' }]), claim([{ itemType: 'sword', amount: -200 }])]); });
it('schema example silver amulet premium 59, payout 100, cap 1100', () => { expect(results([quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]), { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]); });
it('policy reference uses step index, not quote count', () => {
  expect(results([quote([{ type: 'sword' }]), claim([{ itemType: 'sword', amount: 500 }]), quote([{ type: 'amulet' }]), claim([{ itemType: 'amulet', amount: 200 }], 2), claim([], 0)])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 0, remainingCap: 1600 }]);
});
