import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function run(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', [], { input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8' });
}
function results(steps: unknown[], years = 0) {
  const output = run(steps, years);
  expect(output.status, output.stderr).toBe(0);
  return JSON.parse(output.stdout).results;
}
const quote = (items: unknown[]) => ({ op: 'quote', items });
const item = (type: string, extra = {}) => ({ type, ...extra });
const copies = (type: string, count: number) => Array.from({ length: count }, () => item(type));
const claim = (damages: unknown[], policy = 0) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });

it('01 empty quote premium 5', () => {
  expect(results([quote([])])).toEqual([{ premium: 5 }]);
});
it('02 sword premium 115', () => {
  expect(results([quote([item('sword')])])).toEqual([{ premium: 115 }]);
});
it('03 amulet staff potion premiums 71 93 49', () => {
  expect(['amulet', 'staff', 'potion'].map(type => results([quote([item(type)])])[0].premium)).toEqual([71, 93, 49]);
});
it('04 two runes base 50 premium 60', () => {
  expect(results([quote(copies('rune', 2))])).toEqual([{ premium: 60 }]);
});
it('05 three runes base 60 premium 71', () => {
  expect(results([quote(copies('rune', 3))])).toEqual([{ premium: 71 }]);
});
it('06 four runes base 100 premium 115', () => {
  expect(results([quote(copies('rune', 4))])).toEqual([{ premium: 115 }]);
});
it('07 seven runes base 175 premium 198 rounding up', () => {
  expect(results([quote(copies('rune', 7))])).toEqual([{ premium: 198 }]);
});
it('08 mixed two runes moonstone base 75 premium 88', () => {
  expect(results([quote([...copies('rune', 2), item('moonstone')])])).toEqual([{ premium: 88 }]);
});
it('09 two separate blocks base 120 premium 137', () => {
  expect(results([quote([...copies('rune', 3), ...copies('moonstone', 3)])])).toEqual([{ premium: 137 }]);
});
it('10 cursed newcomer sword premium 165', () => {
  expect(results([quote([item('sword', { cursed: true, material: 'steel', enchantment: 3 })])])).toEqual([{ premium: 165 }]);
});
it('11 cursed sword plain amulet premium 231', () => {
  expect(results([quote([item('sword', { cursed: true }), item('amulet')])])).toEqual([{ premium: 231 }]);
});
it('12 exactly two years loyalty sword premium 95', () => {
  expect(results([quote([item('sword')])], 2)).toEqual([{ premium: 95 }]);
});
it('13 enchantment five cursed sword premium 195', () => {
  expect(results([quote([item('sword', { cursed: true, enchantment: 5 })])])).toEqual([{ premium: 195 }]);
});
it('14 enchantment four plain and cursed premiums 115 165', () => {
  expect([false, true].map(cursed => results([quote([item('sword', { cursed, enchantment: 4 })])])[0].premium)).toEqual([115, 165]);
});
it('15 longstanding second quote cursed enchantment seven premium 160', () => {
  expect(results([quote([]), quote([item('sword', { cursed: true, material: 'steel', enchantment: 7 })])], 3)).toEqual([{ premium: 5 }, { premium: 160 }]);
});
it('16 regular steel enchantment three damage 500 payout 400 cap 1600', () => {
  expect(results([quote([item('sword', { material: 'steel', enchantment: 3 })]), claim([damage('sword', 500)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('17 rune damage 200 payout 100 cap 400', () => {
  expect(results([quote([item('rune')]), claim([damage('rune', 200)])])[1]).toEqual({ payout: 100, remainingCap: 400 });
});
it('18 dragon enchantment eight damage 1000 payout 400', () => {
  expect(results([quote([item('sword', { material: 'dragon', enchantment: 8 })]), claim([damage('sword', 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('19 sword and amulet damages 500 300 payout 600 cap 2600', () => {
  expect(results([quote([item('sword'), item('amulet')]), claim([damage('sword', 500), damage('amulet', 300)])])[1]).toEqual({ payout: 600, remainingCap: 2600 });
});
it('20 dragon enchantment nine damage 1000 payout 400', () => {
  expect(results([quote([item('sword', { material: 'dragon', enchantment: 9 })]), claim([damage('sword', 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('21 dragon enchantment five damage 800 payout 700', () => {
  expect(results([quote([item('sword', { material: 'dragon', enchantment: 5 })]), claim([damage('sword', 800)])])[1]).toEqual({ payout: 700, remainingCap: 1300 });
});
it('22 steel enchantment nine damage 1000 payout 400', () => {
  expect(results([quote([item('sword', { material: 'steel', enchantment: 9 })]), claim([damage('sword', 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
});
it('23 two swords insurance 2000 separate deductibles payout 600 cap 3400', () => {
  expect(results([quote(copies('sword', 2)), claim([damage('sword', 500), damage('sword', 300)])])[1]).toEqual({ payout: 600, remainingCap: 3400 });
});
it('24 excess sword damage entries rejected atomically nonzero stderr', () => {
  const output = run([quote([item('sword')]), claim([damage('sword', 500), damage('sword', 300)])]);
  expect(output.status).not.toBe(0);
  expect(output.stderr).not.toBe('');
  expect(output.stdout).toBe('');
});
it('25 cursed premium 165 does not raise cap 2000', () => {
  expect(results([quote([item('sword', { cursed: true })]), claim([])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
});
it('26 sword and rune block insurance 1750 cap 3500', () => {
  expect(results([quote([item('sword'), ...copies('rune', 3)]), claim([])])).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
});
it('27 successive claims payout 1400 then 600 remaining zero', () => {
  expect(results([quote([item('sword')]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)])])).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
});
it('28 fractional payout 350.5 rounds down 350', () => {
  expect(results([quote([item('sword', { enchantment: 8 })]), claim([damage('sword', 901)])])[1]).toEqual({ payout: 350, remainingCap: 1650 });
});
it('29 intermediate payout fractions retained until final total', () => {
  expect(results([quote([item('sword', { enchantment: 8 }), item('sword', { enchantment: 9 })]), claim([damage('sword', 901), damage('sword', 901)])])[1]).toEqual({ payout: 701, remainingCap: 3299 });
});
it('30 unknown quote type rejected nonzero stderr no stdout', () => {
  const output = run([quote([item('broomstick')])]);
  expect(output.status).not.toBe(0);
  expect(output.stderr).not.toBe('');
  expect(output.stdout).toBe('');
});
it('31 uninsured amulet damage rejected nonzero stderr', () => {
  const output = run([quote([item('sword')]), claim([damage('amulet', 200)])]);
  expect(output.status).not.toBe(0);
  expect(output.stderr).not.toBe('');
  expect(output.stdout).toBe('');
});
it('32 unknown damaged type rejected nonzero stderr', () => {
  const output = run([quote([item('sword')]), claim([damage('broomstick', 200)])]);
  expect(output.status).not.toBe(0);
  expect(output.stderr).not.toBe('');
  expect(output.stdout).toBe('');
});
it('33 negative damage rejected nonzero stderr', () => {
  const output = run([quote([item('sword')]), claim([damage('sword', -200)])]);
  expect(output.status).not.toBe(0);
  expect(output.stderr).not.toBe('');
  expect(output.stdout).toBe('');
});
it('34 schema example amulet premium 59 payout 100 remaining 1100', () => {
  expect(results([quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]), { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [damage('amulet', 200)] } }], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
});
it('35 policy references step index across intervening claims', () => {
  expect(results([quote([item('sword')]), claim([damage('sword', 500)]), quote([item('amulet')]), claim([damage('amulet', 200)], 2), claim([damage('sword', 500)])])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 400, remainingCap: 1200 }]);
});
it('37 staff potion moonstone caps 1600 800 500', () => {
  expect(['staff', 'potion', 'moonstone'].map(type => results([quote([item(type)]), claim([])])[1].remainingCap)).toEqual([1600, 800, 500]);
});
it('38 enchanted sword plain amulet risk scope premium 211', () => {
  expect(results([quote([item('sword', { enchantment: 5 }), item('amulet')])])).toEqual([{ premium: 211 }]);
});
it('39 intermediate premium fractions retained final premium 37', () => {
  expect(results([quote([]), quote([item('rune', { cursed: true })])], 2)).toEqual([{ premium: 5 }, { premium: 37 }]);
});

it('36 small damage cannot produce negative payout', () => {
  expect(results([quote([item('sword')]), claim([damage('sword', 50)])])[1]).toEqual({ payout: 0, remainingCap: 2000 });
});
