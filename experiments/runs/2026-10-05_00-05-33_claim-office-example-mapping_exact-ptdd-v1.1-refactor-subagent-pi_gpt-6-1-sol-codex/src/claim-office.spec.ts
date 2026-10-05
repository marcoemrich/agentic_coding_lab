import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
interface Damage { itemType: string; amount: number }
const quote = (items: Item[]) => ({ op: 'quote', items });
const claim = (damages: Damage[] = [], policy = 0) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const items = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
function run(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8' });
}
function results(steps: unknown[], years = 0) {
  const result = run(steps, years);
  expect(result.stderr).toBe('');
  expect(result.status).toBe(0);
  return JSON.parse(result.stdout).results;
}
function rejected(steps: unknown[]) {
  const result = run(steps);
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
}

describe('claim-office', () => {
  it('01 empty items: premium 5 G', () => {
    expect(results([quote([])])).toEqual([{ premium: 5 }]);
  });
  it('02 sword: base 100, value 1000, premium 115, cap 2000', () => {
    expect(results([quote(items('sword', 1)), claim()])).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
  });
  it('03 amulet: base 60, value 600, premium 71, cap 1200', () => {
    expect(results([quote(items('amulet', 1)), claim()])).toEqual([{ premium: 71 }, { payout: 0, remainingCap: 1200 }]);
  });
  it('04 staff: base 80, value 800, premium 93, cap 1600', () => {
    expect(results([quote(items('staff', 1)), claim()])).toEqual([{ premium: 93 }, { payout: 0, remainingCap: 1600 }]);
  });
  it('05 potion: base 40, value 400, premium 49, cap 800', () => {
    expect(results([quote(items('potion', 1)), claim()])).toEqual([{ premium: 49 }, { payout: 0, remainingCap: 800 }]);
  });
  it('06 rune: base 25, value 250, premium 33, cap 500', () => {
    expect(results([quote(items('rune', 1)), claim()])).toEqual([{ premium: 33 }, { payout: 0, remainingCap: 500 }]);
  });
  it('07 moonstone: base 25, value 250, premium 33, cap 500', () => {
    expect(results([quote(items('moonstone', 1)), claim()])).toEqual([{ premium: 33 }, { payout: 0, remainingCap: 500 }]);
  });
  it('08 two runes: base 50, premium 60', () => {
    expect(results([quote(items('rune', 2))])).toEqual([{ premium: 60 }]);
  });
  it('09 three runes: base 60, premium 71', () => {
    expect(results([quote(items('rune', 3))])).toEqual([{ premium: 71 }]);
  });
  it('10 four runes: base 100, premium 115, not a block plus one', () => {
    expect(results([quote(items('rune', 4))])).toEqual([{ premium: 115 }]);
  });
  it('11 seven runes: base 175, premium 198', () => {
    expect(results([quote(items('rune', 7))])).toEqual([{ premium: 198 }]);
  });
  it('12 two runes and one moonstone: base 75, premium 88', () => {
    expect(results([quote([...items('rune', 2), ...items('moonstone', 1)])])).toEqual([{ premium: 88 }]);
  });
  it('13 three runes and three moonstones: base 120, premium 137', () => {
    expect(results([quote([...items('rune', 3), ...items('moonstone', 3)])])).toEqual([{ premium: 137 }]);
  });
  it('14 cursed sword plus plain amulet: base 160 plus curse 50, premium 231', () => {
    expect(results([quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])])).toEqual([{ premium: 231 }]);
  });
  it('15 exactly two years: plain sword loyalty 20, premium 95', () => {
    expect(results([quote(items('sword', 1))], 2)).toEqual([{ premium: 95 }]);
  });
  it('16 cursed sword enchantment 5: both surcharges, premium 195', () => {
    expect(results([quote([{ type: 'sword', cursed: true, enchantment: 5 }])])).toEqual([{ premium: 195 }]);
  });
  it('17 sword enchantment 4: premium 115 plain, 165 cursed; no enchantment surcharge', () => {
    expect(results([quote([{ type: 'sword', enchantment: 4 }])])).toEqual([{ premium: 115 }]);
    expect(results([quote([{ type: 'sword', enchantment: 4, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it('18 newcomer cursed steel sword enchantment 3: premium 165, cap 2000', () => {
    expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]), claim()])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it('19 three-year customer second quote of new cursed sword enchantment 7: premium 160', () => {
    expect(results([quote(items('amulet', 1)), quote([{ type: 'sword', material: 'steel', cursed: true, enchantment: 7 }])], 3)).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it('20 dragon sword enchantment 8 damage 1000: payout 400', () => {
    expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 8 }]), claim([{ itemType: 'sword', amount: 1000 }])])).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('21 dragon attack sword damage 500 and amulet damage 300: payout 600, remaining cap 2600', () => {
    expect(results([quote([{ type: 'sword' }, { type: 'amulet' }]), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])])).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });
  it('22 regular steel sword enchantment 3 damage 500: payout 400', () => {
    expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3 }]), claim([{ itemType: 'sword', amount: 500 }])])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('23 rune damage 200: payout 100', () => {
    expect(results([quote(items('rune', 1)), claim([{ itemType: 'rune', amount: 200 }])])).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it('24 dragon sword enchantment 9 damage 1000: payout 400', () => {
    expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 1000 }])])).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('25 dragon sword enchantment 5 damage 800: payout 700', () => {
    expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 5 }]), claim([{ itemType: 'sword', amount: 800 }])])).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });
  it('26 steel sword enchantment 9 damage 1000: payout 400', () => {
    expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 1000 }])])).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it('27 two swords: insurance sum 2000 and cap 4000', () => {
    expect(results([quote(items('sword', 2)), claim()])).toEqual([{ premium: 225 }, { payout: 0, remainingCap: 4000 }]);
  });
  it('28 two sword damage entries: separate deductions, payout 600', () => {
    expect(results([quote(items('sword', 2)), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])])).toEqual([{ premium: 225 }, { payout: 600, remainingCap: 3400 }]);
  });
  it('29 excess sword damage entries: nonzero status, stderr, no partial results', () => {
    rejected([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])]);
  });
  it('30 sword plus three runes: insurance sum 1750 and cap 3500', () => {
    expect(results([quote([...items('sword', 1), ...items('rune', 3)]), claim()])).toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
  });
  it('31 successive sword damages 1500: payouts 1400 then 600 then 0, caps 600 then 0 then 0', () => {
    const damage = [{ itemType: 'sword', amount: 1500 }];
    expect(results([quote(items('sword', 1)), claim(damage), claim(damage), claim(damage)])).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it('32 fractional premium 197.5: round up to 198 only at the end', () => {
    expect(results([quote([]), quote([{ type: 'sword', cursed: true }, ...items('rune', 2)])])).toEqual([{ premium: 5 }, { premium: 198 }]);
  });
  it('33 fractional payout 350.5: round down to 350', () => {
    expect(results([quote([{ type: 'sword', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 901 }])])).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });
  it('34 two fractional reimbursements 50.5 each: total payout 101, no intermediate rounding', () => {
    expect(results([quote([{ type: 'sword', enchantment: 9 }, { type: 'sword', enchantment: 9 }]), claim([{ itemType: 'sword', amount: 301 }, { itemType: 'sword', amount: 301 }])])).toEqual([{ premium: 285 }, { payout: 101, remainingCap: 3899 }]);
  });
  it('35 unknown quoted broomstick: nonzero status, stderr, no stdout results', () => {
    rejected([quote([{ type: 'broomstick' }])]);
  });
  it('36 uninsured amulet damage: nonzero status, stderr, no stdout results', () => {
    rejected([quote(items('sword', 1)), claim([{ itemType: 'amulet', amount: 200 }])]);
  });
  it('37 unknown damage type: nonzero status, stderr, no stdout results', () => {
    rejected([quote(items('sword', 1)), claim([{ itemType: 'broomstick', amount: 200 }])]);
  });
  it('38 negative damage -200: nonzero status, stderr, no stdout results', () => {
    rejected([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: -200 }])]);
  });
  it('39 normative schema example: amulet premium 59, payout 100, remaining cap 1100', () => {
    const report = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } };
    expect(results([quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]), report], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it('40 policies referenced by step index across interleaved operations retain independent caps', () => {
    expect(results([
      quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 500 }]),
      quote(items('amulet', 1)), claim([{ itemType: 'amulet', amount: 200 }], 2),
      claim([{ itemType: 'sword', amount: 1500 }]), quote(items('potion', 1)),
    ])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 1400, remainingCap: 200 }, { premium: 43 }]);
  });
  it('41 damage below deductible never produces negative payout: damage 50 gives 0', () => {
    expect(results([quote(items('sword', 1)), claim([{ itemType: 'sword', amount: 50 }])])).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
  });
  it('42 unknown prototype-property item type constructor: nonzero status, stderr, no stdout results', () => {
    rejected([quote([{ type: 'constructor' }])]);
  });
});
