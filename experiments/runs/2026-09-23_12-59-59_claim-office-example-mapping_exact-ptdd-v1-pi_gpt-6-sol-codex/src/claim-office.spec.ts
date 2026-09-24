import { describe, it, expect } from 'vitest';
import { spawnSync } from 'node:child_process';

const scenario = (steps: unknown[], yearsWithMHPCO = 0) => ({ customer: { yearsWithMHPCO }, steps });
const quote = (items: unknown[]) => ({ op: 'quote', items });
const claim = (policy: number, damages: unknown[]) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const item = (type: string, extras = {}) => ({ type, ...extras });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
function run(steps: unknown[], yearsWithMHPCO = 0) {
  const output = spawnSync('node_modules/.bin/tsx', ['src/cli.ts'], {
    input: JSON.stringify(scenario(steps, yearsWithMHPCO)), encoding: 'utf8',
  });
  return { ...output, results: output.status === 0 ? JSON.parse(output.stdout).results : undefined };
}
function premiums(items: unknown[], years = 0) {
  return run([quote(items)], years).results?.[0].premium;
}

describe('MHPCO claim office CLI', () => {
  it('empty quote costs only 5 G processing fee', () => { expect(premiums([])).toBe(5); });
  it('plain sword quote costs 115 G (100 base + 10 first insurance + 5 fee)', () => { expect(premiums([item('sword')])).toBe(115); });
  it('plain amulet quote costs 71 G (60 base + 6 first insurance + 5 fee)', () => { expect(premiums([item('amulet')])).toBe(71); });
  it('plain staff quote costs 93 G (80 base + 8 first insurance + 5 fee)', () => { expect(premiums([item('staff')])).toBe(93); });
  it('plain potion quote costs 49 G (40 base + 4 first insurance + 5 fee)', () => { expect(premiums([item('potion')])).toBe(49); });
  it('one rune quote costs 33 G (25 base + 2.5 assessment + 5 fee, rounded up)', () => { expect(premiums([item('rune')])).toBe(33); });
  it('one moonstone quote costs 33 G (25 base + 2.5 assessment + 5 fee)', () => { expect(premiums([item('moonstone')])).toBe(33); });
  it('two runes have 50 G base, quote 60 G', () => { expect(premiums([item('rune'), item('rune')])).toBe(60); });
  it('three runes have block base 60 G, quote 71 G', () => { expect(premiums(Array.from({length: 3}, () => item('rune')))).toBe(71); });
  it('four runes have 100 G base, quote 115 G (block requires exactly three)', () => { expect(premiums(Array.from({length: 4}, () => item('rune')))).toBe(115); });
  it('seven runes have 175 G base, quote 198 G (not multiple blocks)', () => { expect(premiums(Array.from({length: 7}, () => item('rune')))).toBe(198); });
  it('two runes and one moonstone have 75 G base, quote 88 G (different types)', () => { expect(premiums([item('rune'), item('rune'), item('moonstone')])).toBe(88); });
  it('three runes and three moonstones have two blocks, 120 G base, quote 137 G', () => { expect(premiums([...Array.from({length: 3}, () => item('rune')), ...Array.from({length: 3}, () => item('moonstone'))])).toBe(137); });
  it('cursed sword alone costs 165 G including item-only 50 G surcharge', () => { expect(premiums([item('sword', {cursed: true})])).toBe(165); });
  it('cursed sword and plain amulet cost 231 G (160 base + 50 curse + 16 assessment + 5 fee)', () => { expect(premiums([item('sword', {cursed: true}), item('amulet')])).toBe(231); });
  it('enchantment 4 steel sword without curse costs 115 G', () => { expect(premiums([item('sword', {enchantment: 4, material: 'steel'})])).toBe(115); });
  it('enchantment 4 cursed sword costs 165 G (curse only)', () => { expect(premiums([item('sword', {enchantment: 4, cursed: true})])).toBe(165); });
  it('enchantment 5 steel sword costs 145 G (30 G surcharge)', () => { expect(premiums([item('sword', {enchantment: 5})])).toBe(145); });
  it('enchantment 5 cursed sword costs 195 G (both surcharges)', () => { expect(premiums([item('sword', {enchantment: 5, cursed: true})])).toBe(195); });
  it('exactly two years earns 20 percent base loyalty discount: plain sword 95 G', () => { expect(premiums([item('sword')], 2)).toBe(95); });
  it('second quote gets 15 percent base contract discount but first insurance still applies: sword 100 G', () => { expect(run([quote([item('sword')]), quote([item('sword')])]).results?.[1].premium).toBe(100); });
  it('long-standing second quote of new cursed enchantment 7 sword costs 160 G', () => { expect(run([quote([item('amulet')]), quote([item('sword', {cursed: true, enchantment: 7})])], 3).results?.[1].premium).toBe(160); });
  it('fractional 197.5 G premium rounds up to 198 G (seven runes)', () => { expect(premiums(Array.from({length: 7}, () => item('rune')))).toBe(198); });
  it('unknown broomstick quote exits nonzero, describes error on stderr, writes no results', () => { const result = run([quote([item('broomstick')])]); expect(result.status).not.toBe(0); expect(result.stderr).toMatch(/broomstick/i); expect(result.stdout).not.toContain('results'); });
  it('schema example: five-year amulet quote then fire claim returns integer premium 59 and payout 100, remainingCap 1100', () => { expect(run([quote([item('amulet', {material: 'silver', enchantment: 2, cursed: false})]), claim(0, [damage('amulet', 200)])], 5).results).toEqual([{premium: 59}, {payout: 100, remainingCap: 1100}]); });
  it('regular steel enchantment 3 sword damage 500 pays 400 G, cap remaining 1600 G', () => { expect(run([quote([item('sword', {material: 'steel', enchantment: 3})]), claim(0, [damage('sword', 500)])]).results?.[1]).toEqual({payout: 400, remainingCap: 1600}); });
  it('rune damage 200 pays 100 G, cap remaining 400 G', () => { expect(run([quote([item('rune')]), claim(0, [damage('rune', 200)])]).results?.[1]).toEqual({payout: 100, remainingCap: 400}); });
  it('dragon material enchantment 5 sword damage 800 pays 700 G', () => { expect(run([quote([item('sword', {material: 'dragon', enchantment: 5})]), claim(0, [damage('sword', 800)])]).results?.[1].payout).toBe(700); });
  it('steel enchantment 9 sword damage 1000 pays 400 G', () => { expect(run([quote([item('sword', {material: 'steel', enchantment: 9})]), claim(0, [damage('sword', 1000)])]).results?.[1].payout).toBe(400); });
  it('dragon material enchantment 8 sword damage 1000 pays 400 G (high enchantment wins)', () => { expect(run([quote([item('sword', {material: 'dragon', enchantment: 8})]), claim(0, [damage('sword', 1000)])]).results?.[1].payout).toBe(400); });
  it('dragon material enchantment 9 sword damage 1000 pays 400 G', () => { expect(run([quote([item('sword', {material: 'dragon', enchantment: 9})]), claim(0, [damage('sword', 1000)])]).results?.[1].payout).toBe(400); });
  it('dragon attack damages sword 500 and amulet 300: two deductibles, payout 600 G', () => { expect(run([quote([item('sword'), item('amulet')]), claim(0, [damage('sword', 500), damage('amulet', 300)])]).results?.[1].payout).toBe(600); });
  it('two swords insure 2000 G with 4000 G cap and two sword damages have separate deductibles', () => { expect(run([quote([item('sword'), item('sword')]), claim(0, [damage('sword', 500), damage('sword', 500)])]).results?.[1]).toEqual({payout: 800, remainingCap: 3200}); });
  it('two sword damages with only one sword insured exits nonzero with stderr description', () => { const result = run([quote([item('sword')]), claim(0, [damage('sword', 200), damage('sword', 200)])]); expect(result.status).not.toBe(0); expect(result.stderr).toMatch(/sword/i); expect(result.stdout).not.toContain('results'); });
  it('amulet damage on sword policy exits nonzero with stderr description', () => { const result = run([quote([item('sword')]), claim(0, [damage('amulet', 200)])]); expect(result.status).not.toBe(0); expect(result.stderr).toMatch(/amulet/i); expect(result.stdout).not.toContain('results'); });
  it('unknown damaged item type exits nonzero with stderr description', () => { const result = run([quote([item('sword')]), claim(0, [damage('broomstick', 200)])]); expect(result.status).not.toBe(0); expect(result.stderr).toMatch(/broomstick/i); expect(result.stdout).not.toContain('results'); });
  it('negative damage amount -200 exits nonzero with stderr description', () => { const result = run([quote([item('sword')]), claim(0, [damage('sword', -200)])]); expect(result.status).not.toBe(0); expect(result.stderr).toMatch(/amount|negative/i); expect(result.stdout).not.toContain('results'); });
  it('sword and amulet policy has 1600 G sum and 3200 G cap', () => { expect(run([quote([item('sword'), item('amulet')]), claim(0, [])]).results?.[1]).toEqual({payout: 0, remainingCap: 3200}); });
  it('cursed sword premium 165 G does not raise its 2000 G cap', () => { expect(run([quote([item('sword', {cursed: true})]), claim(0, [])]).results).toEqual([{premium: 165}, {payout: 0, remainingCap: 2000}]); });
  it('sword and three runes block has sum 1750 G, cap 3500 G', () => { expect(run([quote([item('sword'), ...Array.from({length: 3}, () => item('rune'))]), claim(0, [])]).results?.[1]).toEqual({payout: 0, remainingCap: 3500}); });
  it('successive sword claims of 1500 pay 1400 then 600, remaining cap 600 then 0', () => { expect(run([quote([item('sword')]), claim(0, [damage('sword', 1500)]), claim(0, [damage('sword', 1500)])]).results?.slice(1)).toEqual([{payout: 1400, remainingCap: 600}, {payout: 600, remainingCap: 0}]); });
  it('fractional payout 350.5 G rounds down to 350 G only at the end', () => { expect(run([quote([item('sword', {enchantment: 8})]), claim(0, [damage('sword', 901)])]).results?.[1]).toEqual({payout: 350, remainingCap: 1650}); });
  it('staff has insurance value 800 G and cap 1600 G', () => { expect(run([quote([item('staff')]), claim(0, [])]).results?.[1].remainingCap).toBe(1600); });
  it('potion has insurance value 400 G and cap 800 G', () => { expect(run([quote([item('potion')]), claim(0, [])]).results?.[1].remainingCap).toBe(800); });
  it('moonstone has insurance value 250 G and cap 500 G', () => { expect(run([quote([item('moonstone')]), claim(0, [])]).results?.[1].remainingCap).toBe(500); });
  it('claim-office executable accepts stdin scenario and emits JSON results', () => { const result = spawnSync('./claim-office', {input: JSON.stringify(scenario([quote([])])), encoding: 'utf8'}); expect(result.status).toBe(0); expect(JSON.parse(result.stdout)).toEqual({results: [{premium: 5}]}); });
});
