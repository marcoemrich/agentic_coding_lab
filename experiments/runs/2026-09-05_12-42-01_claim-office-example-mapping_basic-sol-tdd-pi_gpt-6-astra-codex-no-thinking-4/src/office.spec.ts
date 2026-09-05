import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const item = (type: string, extra = {}) => ({ type, ...extra });
const copies = (type: string, count: number) => Array.from({ length: count }, () => item(type));
const quote = (items: object[]) => ({ op: 'quote', items });
const claim = (damages: object[], policy = 0) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
function run(steps: object[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8' });
}
function results(steps: object[], years = 0) {
  const output = run(steps, years);
  expect(output.status, output.stderr).toBe(0);
  return JSON.parse(output.stdout).results;
}
function rejected(steps: object[]) {
  const output = run(steps);
  expect(output.status).not.toBe(0);
  expect(output.stderr.trim()).not.toBe('');
  expect(output.stdout).toBe('');
}

describe('claim-office', () => {
  it('39 damage below deductible pays zero without increasing cap', () => {
    expect(results([quote([item('sword')]), claim([damage('sword', 50)])])[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('01 empty items premium 5', () => {
    expect(results([quote([])])).toEqual([{ premium: 5 }]);
  });
  it('02 sword base 100 gives premium 115', () => {
    expect(results([quote([item('sword')])])).toEqual([{ premium: 115 }]);
  });
  it('03 amulet staff potion bases 60 80 40 give premium 203', () => {
    expect(results([quote(['amulet', 'staff', 'potion'].map(type => item(type)))])).toEqual([{ premium: 203 }]);
  });
  it('04 two runes base 50 gives premium 60', () => {
    expect(results([quote(copies('rune', 2))])).toEqual([{ premium: 60 }]);
  });
  it('05 three runes base 60 gives premium 71', () => {
    expect(results([quote(copies('rune', 3))])).toEqual([{ premium: 71 }]);
  });
  it('06 four runes base 100 gives premium 115', () => {
    expect(results([quote(copies('rune', 4))])).toEqual([{ premium: 115 }]);
  });
  it('07 seven runes base 175 gives premium 198 rounding 197.5 up', () => {
    expect(results([quote(copies('rune', 7))])).toEqual([{ premium: 198 }]);
  });
  it('08 two runes and moonstone base 75 gives premium 88', () => {
    expect(results([quote([...copies('rune', 2), item('moonstone')])])).toEqual([{ premium: 88 }]);
  });
  it('09 three runes and three moonstones base 120 gives premium 137', () => {
    expect(results([quote([...copies('rune', 3), ...copies('moonstone', 3)])])).toEqual([{ premium: 137 }]);
  });
  it('10 newcomer cursed sword enchantment 3 premium 165', () => {
    expect(results([quote([item('sword', { cursed: true, material: 'steel', enchantment: 3 })])])).toEqual([{ premium: 165 }]);
  });
  it('11 cursed sword and plain amulet base 160 risk 50 premium 231', () => {
    expect(results([quote([item('sword', { cursed: true }), item('amulet')])])).toEqual([{ premium: 231 }]);
  });
  it('12 exactly two years loyalty premium 95', () => {
    expect(results([quote([item('sword')])], 2)).toEqual([{ premium: 95 }]);
  });
  it('13 enchantment 5 surcharge premium 145', () => {
    expect(results([quote([item('sword', { enchantment: 5 })])])).toEqual([{ premium: 145 }]);
  });
  it('14 cursed enchantment 5 both surcharges premium 195', () => {
    expect(results([quote([item('sword', { enchantment: 5, cursed: true })])])).toEqual([{ premium: 195 }]);
  });
  it('15 enchantment 4 plain premium 115 cursed premium 165', () => {
    expect(results([quote([item('sword', { enchantment: 4 })])])).toEqual([{ premium: 115 }]);
    expect(results([quote([item('sword', { enchantment: 4, cursed: true })])])).toEqual([{ premium: 165 }]);
  });
  it('16 loyal second quote cursed enchantment 7 premium 160 first 175', () => {
    const sword = item('sword', { cursed: true, material: 'steel', enchantment: 7 });
    expect(results([quote([sword]), quote([sword])], 3)).toEqual([{ premium: 175 }, { premium: 160 }]);
  });
  it('17 regular steel sword enchantment 3 damage 500 payout 400 cap 1600', () => {
    expect(results([quote([item('sword', { material: 'steel', enchantment: 3 })]), claim([damage('sword', 500)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('18 rune damage 200 payout 100 cap 400', () => {
    expect(results([quote([item('rune')]), claim([damage('rune', 200)])])[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('19 dragon sword enchantment 8 damage 1000 payout 400', () => {
    expect(results([quote([item('sword', { material: 'dragon', enchantment: 8 })]), claim([damage('sword', 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('20 sword 500 and amulet 300 damages payout 600 cap 2600', () => {
    expect(results([quote([item('sword'), item('amulet')]), claim([damage('sword', 500), damage('amulet', 300)])])[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('21 dragon sword enchantment 9 damage 1000 payout 400', () => {
    expect(results([quote([item('sword', { material: 'dragon', enchantment: 9 })]), claim([damage('sword', 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('22 dragon sword enchantment 5 damage 800 payout 700', () => {
    expect(results([quote([item('sword', { material: 'dragon', enchantment: 5 })]), claim([damage('sword', 800)])])[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('23 steel sword enchantment 9 damage 1000 payout 400', () => {
    expect(results([quote([item('sword', { material: 'steel', enchantment: 9 })]), claim([damage('sword', 1000)])])[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('24 two swords sum 2000 cap 4000 separate deductibles payout 600', () => {
    expect(results([quote(copies('sword', 2)), claim([damage('sword', 500), damage('sword', 300)])])[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it('25 excess sword damages reject whole claim with nonzero stderr no stdout', () => {
    rejected([quote([item('sword')]), claim([damage('sword', 500), damage('sword', 300)])]);
  });
  it('26 sword and amulet sum 1600 cap 3200', () => {
    expect(results([quote([item('sword'), item('amulet')]), claim([])])[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it('27 cursed sword premium 165 cap 2000', () => {
    expect(results([quote([item('sword', { cursed: true })]), claim([])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it('28 sword and rune block sum 1750 cap 3500', () => {
    expect(results([quote([item('sword'), ...copies('rune', 3)]), claim([])])[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it('29 successive sword claims 1500 pay 1400 then 600 remaining 0', () => {
    expect(results([quote([item('sword')]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)])])).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it('30 fractional payout 350.5 rounds down to 350', () => {
    expect(results([quote([item('sword', { enchantment: 8 })]), claim([damage('sword', 901)])])[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('31 fractional item payouts retained until final total 701', () => {
    const sword = item('sword', { enchantment: 8 });
    expect(results([quote([sword, sword]), claim([damage('sword', 901), damage('sword', 901)])])[1]).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it('32 unknown quote type rejects nonzero stderr no stdout', () => {
    rejected([quote([item('broomstick')])]);
  });
  it('33 uninsured amulet claim rejects nonzero stderr no stdout', () => {
    rejected([quote([item('sword')]), claim([damage('amulet', 200)])]);
  });
  it('34 unknown damage type rejects nonzero stderr no stdout', () => {
    rejected([quote([item('sword')]), claim([damage('broomstick', 200)])]);
  });
  it('35 negative damage rejects nonzero stderr no stdout', () => {
    rejected([quote([item('sword')]), claim([damage('sword', -200)])]);
  });
  it('36 schema example loyal amulet premium 59 payout 100 remaining 1100', () => {
    expect(results([quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]), { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [damage('amulet', 200)] } }], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it('37 policy references use step index not quote count', () => {
    expect(results([quote([item('sword')]), claim([damage('sword', 200)]), quote([item('sword')]), claim([damage('sword', 500)], 2), claim([])])).toEqual([{ premium: 115 }, { payout: 100, remainingCap: 1900 }, { premium: 100 }, { payout: 400, remainingCap: 1600 }, { payout: 0, remainingCap: 1900 }]);
  });
  it('38 staff potion moonstone insurance values total 1450 cap 2900', () => {
    expect(results([quote(['staff', 'potion', 'moonstone'].map(type => item(type))), claim([])])[1]).toEqual({ payout: 0, remainingCap: 2900 });
  });
});
