import { spawnSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
const item = (type: string, other: Partial<Item> = {}): Item => ({ type, ...other });
const many = (type: string, count: number): Item[] => Array.from({ length: count }, () => item(type));
const quote = (items: Item[], yearsWithMHPCO = 0) => ({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] });
const claim = (items: Item[], damages: Damage[], yearsWithMHPCO = 0) => ({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } }] });
const damage = (itemType: string, amount: number): Damage => ({ itemType, amount });
const q = (premium: number) => ({ results: [{ premium }] });
const c = (premium: number, payout: number, remainingCap: number) => ({ results: [{ premium }, { payout, remainingCap }] });
const sword = item('sword');
const rune = item('rune');
const amulet = item('amulet');
const cursed = item('sword', { cursed: true, material: 'steel', enchantment: 3 });
const dragon = (enchantment: number) => item('sword', { material: 'dragon', enchantment });

const cases: Array<[string, object, object | 'error']> = [
  ['empty steps return results []', { customer: { yearsWithMHPCO: 0 }, steps: [] }, { results: [] }],
  ['empty quote returns premium 5 G', quote([]), q(5)],
  ['plain sword quote returns premium 115 G', quote([sword]), q(115)],
  ['plain amulet quote returns premium 71 G', quote([amulet]), q(71)],
  ['plain staff quote returns premium 93 G', quote([item('staff')]), q(93)],
  ['plain potion quote returns premium 49 G', quote([item('potion')]), q(49)],
  ['one rune quote returns premium 33 G (rounded up)', quote([rune]), q(33)],
  ['one moonstone quote returns premium 33 G (rounded up)', quote([item('moonstone')]), q(33)],
  ['2 runes have 50 G base and premium 60 G', quote(many('rune', 2)), q(60)],
  ['3 runes have 60 G block base and premium 71 G', quote(many('rune', 3)), q(71)],
  ['4 runes have 100 G base without block and premium 115 G', quote(many('rune', 4)), q(115)],
  ['7 runes have 175 G base and premium 198 G (197.5 rounded up)', quote(many('rune', 7)), q(198)],
  ['2 runes and 1 moonstone have 75 G base, premium 88 G', quote([...many('rune', 2), item('moonstone')]), q(88)],
  ['3 runes and 3 moonstones have separate blocks, premium 137 G', quote([...many('rune', 3), ...many('moonstone', 3)]), q(137)],
  ['cursed sword adds 50 G: newcomer premium 165 G', quote([cursed]), q(165)],
  ['cursed sword plus plain amulet adds only 50 G: premium 231 G', quote([cursed, amulet]), q(231)],
  ['enchantment 4 sword has no surcharge: premium 115 G', quote([item('sword', { enchantment: 4 })]), q(115)],
  ['enchantment 5 sword adds 30 G: premium 145 G', quote([item('sword', { enchantment: 5 })]), q(145)],
  ['enchantment 5 cursed sword adds 30 G and 50 G: premium 195 G', quote([item('sword', { enchantment: 5, cursed: true })]), q(195)],
  ['exactly 2 years earns loyalty discount: sword premium 95 G', quote([sword], 2), q(95)],
  ['second quote gets follow-up discount and first assessment: premium 100 G', { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [sword] }, { op: 'quote', items: [sword] }] }, { results: [{ premium: 115 }, { premium: 100 }] }],
  ['3-year customer second cursed enchantment-7 sword premium 160 G', { customer: { yearsWithMHPCO: 3 }, steps: [{ op: 'quote', items: [sword] }, { op: 'quote', items: [item('sword', { material: 'steel', cursed: true, enchantment: 7 })] }] }, { results: [{ premium: 95 }, { premium: 160 }] }],
  ['unknown broomstick quote exits non-zero with stderr and no results', quote([item('broomstick')]), 'error'],
  ['steel enchantment-3 sword damage 500 pays 400, cap 1600', claim([item('sword', { material: 'steel', enchantment: 3 })], [damage('sword', 500)]), c(115, 400, 1600)],
  ['rune damage 200 pays 100, cap 400', claim([rune], [damage('rune', 200)]), c(33, 100, 400)],
  ['dragon enchantment-5 sword damage 800 pays 700', claim([dragon(5)], [damage('sword', 800)]), c(145, 700, 1300)],
  ['steel enchantment-9 sword damage 1000 pays 400', claim([item('sword', { enchantment: 9, material: 'steel' })], [damage('sword', 1000)]), c(145, 400, 1600)],
  ['dragon enchantment-8 sword damage 1000 pays 400', claim([dragon(8)], [damage('sword', 1000)]), c(145, 400, 1600)],
  ['dragon enchantment-9 sword damage 1000 pays 400 (half wins)', claim([dragon(9)], [damage('sword', 1000)]), c(145, 400, 1600)],
  ['damage 500 sword and 300 amulet pays 600 (two deductibles)', claim([sword, amulet], [damage('sword', 500), damage('amulet', 300)]), c(181, 600, 2600)],
  ['two swords insurance sum 2000 cap 4000', claim([sword, sword], []), c(225, 0, 4000)],
  ['two insured swords damaged separately each get deductible', claim([sword, sword], [damage('sword', 500), damage('sword', 300)]), c(225, 600, 3400)],
  ['two sword damages against one insured sword reject whole claim', claim([sword], [damage('sword', 500), damage('sword', 300)]), 'error'],
  ['sword and amulet sum 1600 cap 3200', claim([sword, amulet], []), c(181, 0, 3200)],
  ['cursed sword cap remains 2000 despite premium 165', claim([cursed], []), c(165, 0, 2000)],
  ['sword and 3 runes sum 1750 cap 3500', claim([sword, ...many('rune', 3)], []), c(181, 0, 3500)],
  ['successive 1500 sword claims pay 1400 then 600, cap 600 then 0', { customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [sword] }, ...[0, 1].map(() => ({ op: 'claim', policy: 0, incident: { cause: 'fire', damages: [damage('sword', 1500)] } }))] }, { results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] }],
  ['half of 901 minus deductible yields 350.5 rounded down to 350', claim([dragon(8)], [damage('sword', 901)]), c(145, 350, 1650)],
  ['uninsured amulet damage rejects with non-zero exit and stderr', claim([sword], [damage('amulet', 200)]), 'error'],
  ['unknown damaged type rejects with non-zero exit and stderr', claim([sword], [damage('broomstick', 200)]), 'error'],
  ['negative damage -200 rejects with non-zero exit and stderr', claim([sword], [damage('sword', -200)]), 'error'],
  ['schema example: premium 59, payout 100, remainingCap 1100', claim([item('amulet', { material: 'silver', enchantment: 2, cursed: false })], [damage('amulet', 200)], 5), c(59, 100, 1100)],
  ['staff insurance value 800 gives cap 1600', claim([item('staff')], []), c(93, 0, 1600)],
  ['potion insurance value 400 gives cap 800', claim([item('potion')], []), c(49, 0, 800)],
  ['moonstone insurance value 250 gives cap 500', claim([item('moonstone')], []), c(33, 0, 500)],
];

// Increment exactly once per behavior cycle; all later cases remain inactive.
const active = 45;
describe('MHPCO claim office CLI', () => {
  cases.forEach(([name, scenario, expected], index) => {
    if (index >= active) {
      it.todo(name);
    } else {
      it(name, () => {
        const result = spawnSync(process.execPath, ['--import', 'tsx', 'src/cli.ts'], { input: JSON.stringify(scenario), encoding: 'utf8' });
        if (expected === 'error') {
          expect(result.status).not.toBe(0);
          expect(result.stderr.length).toBeGreaterThan(0);
          expect(result.stdout).not.toContain('results');
        } else {
          expect(result.status, result.stderr).toBe(0);
          expect(JSON.parse(result.stdout)).toEqual(expected);
        }
      });
    }
  });
});
