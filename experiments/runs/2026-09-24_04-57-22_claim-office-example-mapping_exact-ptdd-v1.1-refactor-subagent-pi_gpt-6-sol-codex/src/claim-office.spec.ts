import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function run(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }),
    encoding: 'utf8',
  });
}

function quote(items: unknown[]) {
  return { op: 'quote', items };
}

function claim(policy: number, damages: unknown[]) {
  return { op: 'claim', policy, incident: { cause: 'dragon attack', damages } };
}

function assertResults(steps: unknown[], results: unknown[], years = 0) {
  const response = run(steps, years);
  expect(response.status).toBe(0);
  expect(JSON.parse(response.stdout)).toEqual({ results });
}

function assertRejected(steps: unknown[]) {
  const response = run(steps);
  expect(response.status).not.toBe(0);
  expect(response.stderr.length).toBeGreaterThan(0);
  expect(response.stdout).not.toContain('results');
}

const item = (type: string, options: Record<string, unknown> = {}) => ({ type, ...options });
const many = (type: string, count: number) => Array.from({ length: count }, () => item(type));
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const policy = (items: unknown[], damages: unknown[]) => [quote(items), claim(0, damages)];
const cases: Array<{ steps: unknown[]; results?: unknown[]; years?: number }> = [
  { steps: [quote([item('sword')])], results: [{ premium: 115 }] },
  { steps: [quote([item('amulet')])], results: [{ premium: 71 }] },
  { steps: [quote([item('staff')])], results: [{ premium: 93 }] },
  { steps: [quote([item('potion')])], results: [{ premium: 49 }] },
  { steps: [quote([item('rune')])], results: [{ premium: 33 }] },
  { steps: [quote([item('moonstone')])], results: [{ premium: 33 }] },
  { steps: [quote(many('rune', 2))], results: [{ premium: 60 }] },
  { steps: [quote(many('rune', 3))], results: [{ premium: 71 }] },
  { steps: [quote(many('rune', 4))], results: [{ premium: 115 }] },
  { steps: [quote(many('rune', 7))], results: [{ premium: 198 }] },
  { steps: [quote([...many('rune', 2), item('moonstone')])], results: [{ premium: 88 }] },
  { steps: [quote([...many('rune', 3), ...many('moonstone', 3)])], results: [{ premium: 137 }] },
  { steps: [quote([item('sword', { cursed: true }), item('amulet')])], results: [{ premium: 231 }] },
  { steps: [quote([item('sword')])], results: [{ premium: 95 }], years: 2 },
  { steps: [quote([item('sword')])], results: [{ premium: 115 }], years: 1 },
  { steps: [quote([item('sword', { enchantment: 5 })])], results: [{ premium: 145 }] },
  { steps: [quote([item('sword', { enchantment: 4 })])], results: [{ premium: 115 }] },
  { steps: [quote([item('sword', { cursed: true, enchantment: 5 })])], results: [{ premium: 195 }] },
  { steps: [quote([item('sword', { material: 'steel', cursed: true, enchantment: 3 })])], results: [{ premium: 165 }] },
  { steps: [quote([]), quote([item('sword')])], results: [{ premium: 5 }, { premium: 100 }] },
  { steps: [quote([]), quote([item('sword', { material: 'steel', cursed: true, enchantment: 7 })])], results: [{ premium: 5 }, { premium: 160 }], years: 3 },
  { steps: policy([item('amulet', { material: 'silver', enchantment: 2, cursed: false })], [damage('amulet', 200)]), results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }], years: 5 },
  { steps: policy([item('sword', { material: 'steel', enchantment: 3 })], [damage('sword', 500)]), results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] },
  { steps: policy([item('rune')], [damage('rune', 200)]), results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] },
  { steps: policy([item('sword', { material: 'dragon', enchantment: 5 })], [damage('sword', 800)]), results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] },
  { steps: policy([item('sword', { material: 'steel', enchantment: 9 })], [damage('sword', 1000)]), results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] },
  { steps: policy([item('sword', { material: 'dragon', enchantment: 8 })], [damage('sword', 1000)]), results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] },
  { steps: policy([item('sword', { material: 'dragon', enchantment: 9 })], [damage('sword', 1000)]), results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] },
  { steps: policy([item('sword'), item('amulet')], [damage('sword', 500), damage('amulet', 300)]), results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] },
  { steps: policy(many('sword', 2), [damage('sword', 500), damage('sword', 300)]), results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] },
  { steps: policy([item('sword'), item('amulet')], []), results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }] },
  { steps: policy([item('sword', { cursed: true })], []), results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] },
  { steps: policy([item('sword'), ...many('rune', 3)], []), results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] },
  { steps: [quote([item('sword')]), claim(0, [damage('sword', 1500)]), claim(0, [damage('sword', 1500)])], results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] },
  { steps: policy([item('sword', { enchantment: 8 })], [damage('sword', 901)]), results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] },
  { steps: [quote([item('broomstick')])] },
  { steps: policy([item('sword')], [damage('amulet', 200)]) },
  { steps: policy([item('sword')], [damage('broomstick', 200)]) },
  { steps: policy([item('sword')], [damage('sword', 200), damage('sword', 300)]) },
  { steps: policy([item('sword')], [damage('sword', -200)]) },
  { steps: policy([item('staff')], []), results: [{ premium: 93 }, { payout: 0, remainingCap: 1600 }] },
  { steps: policy([item('potion')], []), results: [{ premium: 49 }, { payout: 0, remainingCap: 800 }] },
  { steps: policy([item('moonstone')], []), results: [{ premium: 33 }, { payout: 0, remainingCap: 500 }] },
];

function check(index: number) {
  const example = cases[index];
  if (example.results) assertResults(example.steps, example.results, example.years);
  else assertRejected(example.steps);
}

describe('MHPCO claim office CLI', () => {
  it('empty quote costs 5 G processing fee', () => {
    assertResults([quote([])], [{ premium: 5 }]);
  });
  it('plain sword base 100 G yields 115 G with first insurance and fee', () => check(0));
  it('plain amulet base 60 G yields 71 G with first insurance and fee', () => check(1));
  it('plain staff base 80 G yields 93 G with first insurance and fee', () => check(2));
  it('plain potion base 40 G yields 49 G with first insurance and fee', () => check(3));
  it('one rune base 25 G yields 33 G with assessment and fee', () => check(4));
  it('one moonstone base 25 G yields 33 G with assessment and fee', () => check(5));
  it('2 runes base 50 G yield 60 G total', () => check(6));
  it('3 runes block base 60 G yields 71 G total', () => check(7));
  it('4 runes no block base 100 G yield 115 G total', () => check(8));
  it('7 runes no block base 175 G yield 198 G total after rounding up 197.5 G', () => check(9));
  it('2 runes and 1 moonstone are different types: base 75 G yields 88 G rounded up', () => check(10));
  it('3 runes and 3 moonstones form separate blocks: base 120 G yields 137 G', () => check(11));
  it('cursed sword and plain amulet: base 160 G plus 50 G curse, not 80 G; total 231 G', () => check(12));
  it('exactly 2 years grants 20% base loyalty discount: plain sword costs 95 G', () => check(13));
  it('less than 2 years gets no loyalty discount: plain sword costs 115 G', () => check(14));
  it('enchantment exactly 5 adds 30% base: sword costs 145 G', () => check(15));
  it('enchantment 4 adds no high-enchantment surcharge: sword costs 115 G', () => check(16));
  it('cursed sword with enchantment 5 stacks 50% and 30%: 195 G', () => check(17));
  it('newcomer cursed steel sword enchantment 3 costs 165 G', () => check(18));
  it('second quote discounts 15% of base on each contract after first: plain sword costs 100 G', () => check(19));
  it('3-year customer second quote of new cursed sword enchantment 7 costs 160 G, still assessed as first insurance', () => check(20));
  it('schema example 5-year customer amulet quote 59 G and fire damage 200 G payout 100 G remaining cap 1100 G', () => check(21));
  it('regular steel sword enchantment 3 damage 500 G pays 400 G and leaves cap 1600 G', () => check(22));
  it('rune damage 200 G pays 100 G, without material or enchantment clause', () => check(23));
  it('dragon material sword enchantment 5 damage 800 G pays 700 G', () => check(24));
  it('steel sword enchantment 9 damage 1000 G pays 400 G', () => check(25));
  it('dragon sword enchantment exactly 8 damage 1000 G pays 400 G: enchantment takes precedence', () => check(26));
  it('dragon sword enchantment 9 damage 1000 G pays 400 G: enchantment wins', () => check(27));
  it('dragon attack on sword 500 G and amulet 300 G pays 600 G with two deductibles', () => check(28));
  it('two insured swords have insurance sum 2000 G, cap 4000 G and separate damage entries/deductibles', () => check(29));
  it('sword and amulet insurance sum 1600 G gives cap 3200 G', () => check(30));
  it('cursed sword premium 165 G still gives cap 2000 G', () => check(31));
  it('sword plus 3 rune block insurance sum 1750 G gives cap 3500 G', () => check(32));
  it('sword claims of 1500 G twice pay 1400 G then 600 G, remaining caps 600 G then 0 G', () => check(33));
  it('fractional payout 350.5 G rounds down to 350 G only at final payout', () => check(34));
  it('unknown quote type broomstick exits nonzero with stderr and no results on stdout', () => check(35));
  it('uninsured amulet damage exits nonzero with stderr', () => check(36));
  it('unknown damage item type exits nonzero with stderr', () => check(37));
  it('two sword damages against one insured sword exit nonzero: whole claim rejected', () => check(38));
  it('negative damage -200 exits nonzero with stderr', () => check(39));
  it('staff insurance value 800 G yields policy cap 1600 G', () => check(40));
  it('potion insurance value 400 G yields policy cap 800 G', () => check(41));
  it('moonstone insurance value 250 G yields policy cap 500 G', () => check(42));
});
