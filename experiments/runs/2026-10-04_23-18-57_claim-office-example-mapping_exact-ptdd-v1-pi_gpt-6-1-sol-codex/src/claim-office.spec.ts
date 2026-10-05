import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Step = { op: string; items?: Item[]; policy?: number; incident?: { cause: string; damages: { itemType: string; amount: number }[] } };
type Case = { name: string; years: number; steps: Step[]; results?: object[]; reject?: boolean };
const item = (type: string, attributes: Omit<Item, 'type'> = {}): Item => ({ type, ...attributes });
const quote = (...items: Item[]): Step => ({ op: 'quote', items });
const damage = (policy: number, ...entries: [string, number][]): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages: entries.map(([itemType, amount]) => ({ itemType, amount })) } });
const repeat = (type: string, count: number): Item[] => Array.from({ length: count }, () => item(type));
const q = (name: string, items: Item[], premium: number, years = 0): Case => ({ name, years, steps: [quote(...items)], results: [{ premium }] });
const c = (name: string, items: Item[], entries: [string, number][], premium: number, payout: number, remainingCap: number): Case => ({ name, years: 0, steps: [quote(...items), damage(0, ...entries)], results: [{ premium }, { payout, remainingCap }] });
const bad = (name: string, steps: Step[]): Case => ({ name, years: 0, steps, reject: true });
const cases: Case[] = [
  q('01 empty items premium 5', [], 5),
  q('02 sword base 100 plus initial assessment and fee = 115', [item('sword')], 115),
  q('03 amulet base 60 premium 71', [item('amulet')], 71),
  q('04 staff base 80 premium 93', [item('staff')], 93),
  q('05 potion base 40 premium 49', [item('potion')], 49),
  q('06 rune base 25 premium rounded up to 33', [item('rune')], 33),
  q('07 moonstone base 25 premium 33', [item('moonstone')], 33),
  q('08 two runes base 50 premium 60', repeat('rune', 2), 60),
  q('09 three runes exact block base 60 premium 71', repeat('rune', 3), 71),
  q('10 four runes no block base 100 premium 115', repeat('rune', 4), 115),
  q('11 seven runes no block base 175 final 197.5 rounds to 198', repeat('rune', 7), 198),
  q('12 two runes and one moonstone base 75 premium 88', [...repeat('rune', 2), item('moonstone')], 88),
  q('13 three runes and three moonstones two blocks base 120 premium 137', [...repeat('rune', 3), ...repeat('moonstone', 3)], 137),
  q('14 newcomer cursed steel sword enchantment 3 premium 165', [item('sword', { cursed: true, enchantment: 3, material: 'steel' })], 165),
  q('15 cursed sword plus plain amulet base 160 item risk 50 premium 231', [item('sword', { cursed: true }), item('amulet')], 231),
  q('16 exactly two years loyalty premium 95', [item('sword')], 95, 2),
  q('17 one year no loyalty premium 115', [item('sword')], 115, 1),
  q('18 enchantment exactly five premium 145', [item('sword', { enchantment: 5 })], 145),
  q('19 cursed enchantment five both risks premium 195', [item('sword', { enchantment: 5, cursed: true })], 195),
  q('20 enchantment four no high risk premium 115', [item('sword', { enchantment: 4 })], 115),
  q('21 cursed enchantment four only curse premium 165', [item('sword', { enchantment: 4, cursed: true })], 165),
  { name: '22 second quote long-standing cursed new sword enchantment seven premium 160', years: 3, steps: [quote(item('sword')), quote(item('sword', { cursed: true, enchantment: 7, material: 'steel' }))], results: [{ premium: 95 }, { premium: 160 }] },
  q('23 item risk and policy discounts each use base not compounded premium 179', [item('sword', { enchantment: 5 }), item('amulet')], 179, 2),
  c('24 regular steel sword enchantment three damage 500 payout 400 cap 1600', [item('sword', { material: 'steel', enchantment: 3 })], [['sword', 500]], 115, 400, 1600),
  c('25 rune damage 200 payout 100 cap 400', [item('rune')], [['rune', 200]], 33, 100, 400),
  c('26 moonstone value 250 damage 200 payout 100 cap 400', [item('moonstone')], [['moonstone', 200]], 33, 100, 400),
  c('27 amulet value 600 cap 1200 damage 200 payout 100 cap 1100 schema example', [item('amulet', { material: 'silver', enchantment: 2, cursed: false })], [['amulet', 200]], 71, 100, 1100),
  c('28 staff value 800 cap 1600 damage 200 payout 100 cap 1500', [item('staff')], [['staff', 200]], 93, 100, 1500),
  c('29 potion value 400 cap 800 damage 200 payout 100 cap 700', [item('potion')], [['potion', 200]], 49, 100, 700),
  c('30 dragon sword enchantment eight damage 1000 payout 400 cap 1600', [item('sword', { material: 'dragon', enchantment: 8 })], [['sword', 1000]], 145, 400, 1600),
  c('31 dragon sword enchantment nine damage 1000 payout 400', [item('sword', { material: 'dragon', enchantment: 9 })], [['sword', 1000]], 145, 400, 1600),
  c('32 dragon sword enchantment five damage 800 payout 700', [item('sword', { material: 'dragon', enchantment: 5 })], [['sword', 800]], 145, 700, 1300),
  c('33 steel sword enchantment nine damage 1000 payout 400', [item('sword', { material: 'steel', enchantment: 9 })], [['sword', 1000]], 145, 400, 1600),
  c('34 sword and amulet damage 500 and 300 payout 600 cap 2600 deductible per item', [item('sword'), item('amulet')], [['sword', 500], ['amulet', 300]], 181, 600, 2600),
  c('35 two swords sum 2000 cap 4000 separate deductibles payout 800 cap 3200', repeat('sword', 2), [['sword', 500], ['sword', 500]], 225, 800, 3200),
  c('36 cursed sword premium 165 cap based on value 2000', [item('sword', { cursed: true })], [['sword', 100]], 165, 0, 2000),
  c('37 sword and rune block sum 1750 cap 3500 despite discount', [item('sword'), ...repeat('rune', 3)], [['sword', 100]], 181, 0, 3500),
  { name: '38 successive sword claims payout 1400 then 600 remaining cap zero', years: 0, steps: [quote(item('sword')), damage(0, ['sword', 1500]), damage(0, ['sword', 1500]), damage(0, ['sword', 500])], results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }] },
  c('39 payout 350.5 rounds down to 350', [item('sword', { enchantment: 8 })], [['sword', 901]], 145, 350, 1650),
  c('40 intermediate half G amounts retained until total payout 701', repeat('sword', 2).map(i => ({ ...i, enchantment: 8 })), [['sword', 901], ['sword', 901]], 285, 701, 3299),
  c('41 damage below deductible cannot make negative payout', [item('sword')], [['sword', 50]], 115, 0, 2000),
  bad('42 unknown quote broomstick nonzero stderr and no stdout results', [quote(item('broomstick'))]),
  bad('43 uninsured amulet rejects whole claim nonzero stderr', [quote(item('sword')), damage(0, ['amulet', 200])]),
  bad('44 unknown damage type rejects whole claim nonzero stderr', [quote(item('sword')), damage(0, ['broomstick', 200])]),
  bad('45 two sword damages but one insured rejects whole claim nonzero stderr', [quote(item('sword')), damage(0, ['sword', 200], ['sword', 200])]),
  bad('46 negative damage minus 200 rejects whole claim nonzero stderr', [quote(item('sword')), damage(0, ['sword', -200])]),
  { name: '47 quote step indices and customer history survive intervening claim', years: 5, steps: [quote(item('amulet')), damage(0, ['amulet', 200]), quote(item('sword')), damage(2, ['sword', 500])], results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }, { premium: 80 }, { payout: 400, remainingCap: 1600 }] },
];
const fractionalPremium = q('48 fractional curse amounts retained until premium total 85', [item('rune', { cursed: true }), item('rune', { cursed: true })], 85);
function verify(example: Case) {
  const output = spawnSync('./claim-office', [], { input: JSON.stringify({ customer: { yearsWithMHPCO: example.years }, steps: example.steps }), encoding: 'utf8' });
  if (example.reject) {
    expect(output.status).not.toBe(0);
    expect(output.stderr.trim()).not.toBe('');
    expect(output.stdout).toBe('');
  } else {
    expect(output.stderr).toBe('');
    expect(output.status).toBe(0);
    expect(JSON.parse(output.stdout)).toEqual({ results: example.results });
  }
}

// Each entry is activated individually during its predictive cycle.
it(cases[0].name, () => verify(cases[0]));
it(cases[1].name, () => verify(cases[1]));
it(cases[2].name, () => verify(cases[2]));
it(cases[3].name, () => verify(cases[3]));
it(cases[4].name, () => verify(cases[4]));
it(cases[5].name, () => verify(cases[5]));
it(cases[6].name, () => verify(cases[6]));
it(cases[7].name, () => verify(cases[7]));
it(cases[8].name, () => verify(cases[8]));
it(cases[9].name, () => verify(cases[9]));
it(cases[10].name, () => verify(cases[10]));
it(cases[11].name, () => verify(cases[11]));
it(cases[12].name, () => verify(cases[12]));
it(cases[13].name, () => verify(cases[13]));
it(cases[14].name, () => verify(cases[14]));
it(cases[15].name, () => verify(cases[15]));
it(cases[16].name, () => verify(cases[16]));
it(cases[17].name, () => verify(cases[17]));
it(cases[18].name, () => verify(cases[18]));
it(cases[19].name, () => verify(cases[19]));
it(cases[20].name, () => verify(cases[20]));
it(cases[21].name, () => verify(cases[21]));
it(cases[22].name, () => verify(cases[22]));
it(cases[23].name, () => verify(cases[23]));
it(cases[24].name, () => verify(cases[24]));
it(cases[25].name, () => verify(cases[25]));
it(cases[26].name, () => verify(cases[26]));
it(cases[27].name, () => verify(cases[27]));
it(cases[28].name, () => verify(cases[28]));
it(cases[29].name, () => verify(cases[29]));
it(cases[30].name, () => verify(cases[30]));
it(cases[31].name, () => verify(cases[31]));
it(cases[32].name, () => verify(cases[32]));
it(cases[33].name, () => verify(cases[33]));
it(cases[34].name, () => verify(cases[34]));
it(cases[35].name, () => verify(cases[35]));
it(cases[36].name, () => verify(cases[36]));
it(cases[37].name, () => verify(cases[37]));
it(cases[38].name, () => verify(cases[38]));
it(cases[39].name, () => verify(cases[39]));
it(cases[40].name, () => verify(cases[40]));
it(cases[41].name, () => verify(cases[41]));
it(cases[42].name, () => verify(cases[42]));
it(cases[43].name, () => verify(cases[43]));
it(cases[44].name, () => verify(cases[44]));
it(cases[45].name, () => verify(cases[45]));
it(cases[46].name, () => verify(cases[46]));
it(fractionalPremium.name, () => verify(fractionalPremium));
