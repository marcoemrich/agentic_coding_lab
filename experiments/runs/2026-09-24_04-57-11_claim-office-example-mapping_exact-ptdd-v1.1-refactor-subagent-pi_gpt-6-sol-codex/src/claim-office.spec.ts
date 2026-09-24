import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });
const repeat = (type: string, n: number) => Array.from({ length: n }, () => item(type));
const quote = (items: unknown[]) => ({ op: 'quote', items });
const claim = (policy: number, damages: unknown[]) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
function scenario(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('node', ['--import', 'tsx', 'src/cli.ts'], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
  });
}
function results(steps: unknown[], years = 0): Record<string, number>[] {
  const run = scenario(steps, years);
  expect(run.status, run.stderr).toBe(0);
  return (JSON.parse(run.stdout) as { results: Record<string, number>[] }).results;
}
function rejected(steps: unknown[]) {
  const run = scenario(steps);
  expect(run.status).not.toBe(0);
  expect(run.stderr.length).toBeGreaterThan(0);
  expect(run.stdout).not.toContain('results');
}
const sword = item('sword');
const cursed = item('sword', { cursed: true, material: 'steel', enchantment: 3 });
const enchanted = (level: number, material = 'steel') => item('sword', { enchantment: level, material });
const checkPremium = (items: unknown[], premium: number, years = 0) =>
  expect(results([quote(items)], years)).toEqual([{ premium }]);
const checkClaim = (insured: unknown[], damages: unknown[], payout: number, remainingCap: number) =>
  expect(results([quote(insured), claim(0, damages)])[1]).toEqual({ payout, remainingCap });

describe('MHPCO claim office CLI', () => {
  it('empty quote costs only the 5 G processing fee', () => checkPremium([], 5));
  it('plain sword base 100 G and first insurance 10 G plus fee gives 115 G', () => checkPremium([sword], 115));
  it('plain amulet base 60 G gives 71 G first quote', () => checkPremium([item('amulet')], 71));
  it('plain staff base 80 G gives 93 G first quote', () => checkPremium([item('staff')], 93));
  it('plain potion base 40 G gives 49 G first quote', () => checkPremium([item('potion')], 49));
  it('single rune base 25 G gives 32.5 rounded up to 33 G', () => checkPremium([item('rune')], 33));
  it('single moonstone base 25 G gives 33 G', () => checkPremium([item('moonstone')], 33));
  it('two runes base 50 G gives 60 G', () => checkPremium(repeat('rune', 2), 60));
  it('three runes block base 60 G gives 71 G', () => checkPremium(repeat('rune', 3), 71));
  it('four runes do not form a block: base 100 G gives 115 G', () => checkPremium(repeat('rune', 4), 115));
  it('seven runes do not form a block: base 175 G gives 198 G', () => checkPremium(repeat('rune', 7), 198));
  it('two runes and one moonstone base 75 G without block gives 88 G', () => checkPremium([...repeat('rune', 2), item('moonstone')], 88));
  it('three runes and three moonstones form two blocks base 120 G gives 137 G', () => checkPremium([...repeat('rune', 3), ...repeat('moonstone', 3)], 137));
  it('cursed sword newcomer pays 165 G including first insurance and fee', () => checkPremium([cursed], 165));
  it('enchantment 4 plain sword remains at 115 G', () => checkPremium([enchanted(4)], 115));
  it('enchantment 5 sword incurs 30 G high enchantment surcharge: 145 G', () => checkPremium([enchanted(5)], 145));
  it('enchantment 4 cursed sword pays only curse surcharge: 165 G', () => checkPremium([item('sword', { enchantment: 4, cursed: true })], 165));
  it('enchantment 5 cursed sword pays both surcharges: 195 G', () => checkPremium([item('sword', { enchantment: 5, cursed: true })], 195));
  it('exactly two years of loyalty discounts sword base by 20 G: 95 G', () => checkPremium([sword], 95, 2));
  it('one year of loyalty does not discount sword: 115 G', () => checkPremium([sword], 115, 1));
  it('cursed sword and plain amulet surcharge applies to sword base only: 231 G including first insurance and fee', () => checkPremium([cursed, item('amulet')], 231));
  it('second quote receives 15 percent follow-up discount on base, while new sword still incurs first insurance: 100 G', () =>
    expect(results([quote([sword]), quote([sword])])).toEqual([{ premium: 115 }, { premium: 100 }]));
  it('three-year customer second quote cursed enchanted sword costs 160 G', () =>
    expect(results([quote([]), quote([item('sword', { cursed: true, enchantment: 7 })])], 3)[1]).toEqual({ premium: 160 }));
  it('fractional combined premium 197.5 G rounds up to 198 G', () => checkPremium(repeat('rune', 7), 198));
  it('quote with unknown broomstick exits nonzero, stderr describes error, stdout has no results', () => rejected([quote([item('broomstick')])]));
  it('regular steel sword enchantment 3 damage 500 pays 400 G leaving 1600 G cap', () => checkClaim([enchanted(3)], [damage('sword', 500)], 400, 1600));
  it('rune damage 200 pays 100 G leaving 400 G cap', () => checkClaim([item('rune')], [damage('rune', 200)], 100, 400));
  it('moonstone damage 200 pays 100 G leaving 400 G cap', () => checkClaim([item('moonstone')], [damage('moonstone', 200)], 100, 400));
  it('amulet damage 200 pays 100 G leaving 1100 G cap', () => checkClaim([item('amulet')], [damage('amulet', 200)], 100, 1100));
  it('staff damage 200 pays 100 G leaving 1500 G cap', () => checkClaim([item('staff')], [damage('staff', 200)], 100, 1500));
  it('potion damage 200 pays 100 G leaving 700 G cap', () => checkClaim([item('potion')], [damage('potion', 200)], 100, 700));
  it('dragon sword enchantment 8 damage 1000 pays 400 G', () => checkClaim([enchanted(8, 'dragon')], [damage('sword', 1000)], 400, 1600));
  it('dragon sword enchantment 9 damage 1000 pays 400 G: enchantment wins', () => checkClaim([enchanted(9, 'dragon')], [damage('sword', 1000)], 400, 1600));
  it('dragon sword enchantment 5 damage 800 pays 700 G', () => checkClaim([enchanted(5, 'dragon')], [damage('sword', 800)], 700, 1300));
  it('steel sword enchantment 9 damage 1000 pays 400 G', () => checkClaim([enchanted(9)], [damage('sword', 1000)], 400, 1600));
  it('dragon attack on sword 500 and amulet 300 pays 600 G, deductible twice', () => checkClaim([sword, item('amulet')], [damage('sword', 500), damage('amulet', 300)], 600, 2600));
  it('two swords create 2000 G insurance sum and 4000 G cap', () => checkClaim([sword, sword], [], 0, 4000));
  it('two separate sword damages each incur a 100 G deductible', () => checkClaim([sword, sword], [damage('sword', 500), damage('sword', 300)], 600, 3400));
  it('more sword damages than insured swords rejects entire claim with nonzero exit and stderr', () => rejected([quote([sword]), claim(0, [damage('sword', 500), damage('sword', 300)])]));
  it('sword and amulet insurance sum 1600 G gives 3200 G cap', () => checkClaim([sword, item('amulet')], [], 0, 3200));
  it('cursed sword premium 165 G does not alter 2000 G cap', () => expect(results([quote([cursed]), claim(0, [])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]));
  it('sword and three runes insurance sum 1750 G despite block discount gives 3500 G cap', () => checkClaim([sword, ...repeat('rune', 3)], [], 0, 3500));
  it('first sword claim 1500 pays 1400 leaving 600 G cap; second pays 600 leaving zero', () =>
    expect(results([quote([sword]), claim(0, [damage('sword', 1500)]), claim(0, [damage('sword', 1500)])])).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]));
  it('fractional reimbursement 350.5 rounds down to 350 G only at final payout', () => checkClaim([enchanted(8)], [damage('sword', 901)], 350, 1650));
  it('damage for amulet absent from sword policy rejects with nonzero exit and stderr', () => rejected([quote([sword]), claim(0, [damage('amulet', 200)])]));
  it('unknown damage item type rejects with nonzero exit and stderr', () => rejected([quote([sword]), claim(0, [damage('broomstick', 200)])]));
  it('negative damage amount rejects with nonzero exit and stderr', () => rejected([quote([sword]), claim(0, [damage('sword', -200)])]));
});
