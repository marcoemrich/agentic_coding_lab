import { describe, expect, it } from 'vitest';
import { processScenario } from './office.js';
import { spawnSync } from 'node:child_process';

const cli = (steps: unknown[], yearsWithMHPCO = 0) => spawnSync('./claim-office', [], {
  input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
});

interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
const item = (type: string, properties: Omit<Item, 'type'> = {}): Item => ({ type, ...properties });
const copies = (type: string, count: number): Item[] => Array.from({ length: count }, () => item(type));
const quote = (items: Item[]) => ({ op: 'quote', items });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const claim = (damages: ReturnType<typeof damage>[], policy = 0) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const settlement = (items: Item[], damages: ReturnType<typeof damage>[]) => scenario([quote(items), claim(damages)])[1];
const scenario = (steps: unknown[], yearsWithMHPCO = 0) => processScenario({ customer: { yearsWithMHPCO }, steps }).results;


describe('MHPCO claim office', () => {
  it('01 empty quote costs 5 G', () => {
    expect(scenario([quote([])])).toEqual([{ premium: 5 }]);
  });
  it('02 plain sword costs 115 G (100 base plus initial and fee)', () => {
    expect(scenario([quote([item('sword')])])).toEqual([{ premium: 115 }]);
  });
  it('03 plain amulet costs 71 G (60 base)', () => {
    expect(scenario([quote([item('amulet')])])).toEqual([{ premium: 71 }]);
  });
  it('04 plain staff costs 93 G (80 base)', () => {
    expect(scenario([quote([item('staff')])])).toEqual([{ premium: 93 }]);
  });
  it('05 plain potion costs 49 G (40 base)', () => {
    expect(scenario([quote([item('potion')])])).toEqual([{ premium: 49 }]);
  });
  it('06 two runes cost 60 G (50 base)', () => {
    expect(scenario([quote(copies('rune', 2))])).toEqual([{ premium: 60 }]);
  });
  it('07 three runes cost 71 G (60 block base)', () => {
    expect(scenario([quote(copies('rune', 3))])).toEqual([{ premium: 71 }]);
  });
  it('08 four runes cost 115 G (100 base, no block)', () => {
    expect(scenario([quote(copies('rune', 4))])).toEqual([{ premium: 115 }]);
  });
  it('09 seven runes cost 198 G (175 base, rounded from 197.5)', () => {
    expect(scenario([quote(copies('rune', 7))])).toEqual([{ premium: 198 }]);
  });
  it('10 two runes and one moonstone cost 88 G (75 base)', () => {
    expect(scenario([quote([...copies('rune', 2), item('moonstone')])])).toEqual([{ premium: 88 }]);
  });
  it('11 three runes and three moonstones cost 137 G (120 base)', () => {
    expect(scenario([quote([...copies('rune', 3), ...copies('moonstone', 3)])])).toEqual([{ premium: 137 }]);
  });
  it('12 newcomer cursed steel sword enchantment 3 costs 165 G', () => {
    expect(scenario([quote([item('sword', { material: 'steel', enchantment: 3, cursed: true })])])).toEqual([{ premium: 165 }]);
  });
  it('13 cursed sword and plain amulet cost 231 G (210 before policy modifiers)', () => {
    expect(scenario([quote([item('sword', { cursed: true }), item('amulet')])])).toEqual([{ premium: 231 }]);
  });
  it('14 exactly two years earns loyalty: sword costs 95 G', () => {
    expect(scenario([quote([item('sword')])], 2)).toEqual([{ premium: 95 }]);
  });
  it('15 one year does not earn loyalty: sword costs 115 G', () => {
    expect(scenario([quote([item('sword')])], 1)).toEqual([{ premium: 115 }]);
  });
  it('16 sword enchantment 5 costs 145 G', () => {
    const sword = item('sword', { enchantment: 5 });
    expect(scenario([quote([sword])])).toEqual([{ premium: 145 }]);
    expect(scenario([quote([sword, item('amulet')])])).toEqual([{ premium: 211 }]);
  });
  it('17 cursed sword enchantment 5 costs 195 G', () => {
    expect(scenario([quote([item('sword', { enchantment: 5, cursed: true })])])).toEqual([{ premium: 195 }]);
  });
  it('18 plain sword enchantment 4 costs 115 G', () => {
    expect(scenario([quote([item('sword', { enchantment: 4, cursed: false })])])).toEqual([{ premium: 115 }]);
  });
  it('19 cursed sword enchantment 4 costs 165 G', () => {
    expect(scenario([quote([item('sword', { enchantment: 4, cursed: true })])])).toEqual([{ premium: 165 }]);
  });
  it('20 long-standing second quote cursed sword enchantment 7 costs 160 G, initial surcharge still applies', () => {
    expect(scenario([
      quote([item('sword')]),
      quote([item('sword', { material: 'steel', enchantment: 7, cursed: true })]),
    ], 3)).toEqual([{ premium: 95 }, { premium: 160 }]);
  });
  it('21 regular steel sword enchantment 3 damage 500 pays 400 G, remaining 1600 G', () => {
    expect(settlement([item('sword', { material: 'steel', enchantment: 3 })], [damage('sword', 500)])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('22 rune damage 200 pays 100 G, remaining 400 G', () => {
    expect(settlement([item('rune')], [damage('rune', 200)])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('23 dragon sword enchantment 8 damage 1000 pays 400 G', () => {
    expect(settlement([item('sword', { material: 'dragon', enchantment: 8 })], [damage('sword', 1000)])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('24 dragon sword enchantment 9 damage 1000 pays 400 G', () => {
    expect(settlement([item('sword', { material: 'dragon', enchantment: 9 })], [damage('sword', 1000)])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('25 dragon sword enchantment 5 damage 800 pays 700 G', () => {
    expect(settlement([item('sword', { material: 'dragon', enchantment: 5 })], [damage('sword', 800)])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('26 steel sword enchantment 9 damage 1000 pays 400 G', () => {
    expect(settlement([item('sword', { material: 'steel', enchantment: 9 })], [damage('sword', 1000)])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('27 sword damage 500 plus amulet damage 300 pays 600 G, cap 3200 G then 2600 G', () => {
    expect(settlement([item('sword'), item('amulet')], [damage('sword', 500), damage('amulet', 300)])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('28 two swords have sum 2000 G and cap 4000 G, each damage has its own deductible', () => {
    expect(settlement(copies('sword', 2), [damage('sword', 500), damage('sword', 300)])).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it('29 cursed sword premium 165 G still has cap 2000 G', () => {
    expect(scenario([quote([item('sword', { cursed: true })]), claim([])])).toEqual([
      { premium: 165 }, { payout: 0, remainingCap: 2000 },
    ]);
  });
  it('30 sword plus three runes has sum 1750 G and cap 3500 G', () => {
    expect(scenario([quote([item('sword'), ...copies('rune', 3)]), claim([])])).toEqual([
      { premium: 181 }, { payout: 0, remainingCap: 3500 },
    ]);
  });
  it('31 successive sword claims 1500 pay 1400 then 600 G, remaining 600 then 0 G', () => {
    expect(scenario([quote([item('sword')]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)])])).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it('32 payout 350.5 rounds down to 350 G', () => {
    expect(settlement([item('sword', { enchantment: 8 })], [damage('sword', 901)])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('33 fractional item reimbursements are summed before final rounding: two 1001 damages at enchantment 8 pay 801 G', () => {
    expect(settlement([item('sword', { enchantment: 8 }), item('sword', { enchantment: 8 })], [damage('sword', 1001), damage('sword', 1001)])).toEqual({ payout: 801, remainingCap: 3199 });
    expect(scenario([quote([item('rune', { cursed: true })])])).toEqual([{ premium: 45 }]);
  });
  it('34 catalogue policy values: amulet 600, staff 800, potion 400, moonstone 250 G', () => {
    for (const [type, remainingCap] of [['amulet', 1100], ['staff', 1500], ['potion', 700], ['moonstone', 400]] as const) {
      expect(settlement([item(type)], [damage(type, 200)]), type).toEqual({ payout: 100, remainingCap });
    }
  });
  it('35 exhausted policy pays zero on later claims', () => {
    expect(scenario([quote([item('sword')]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)]), claim([damage('sword', 500)])])[3]).toEqual({ payout: 0, remainingCap: 0 });
  });
  it('36 damage below deductible pays zero, never negative', () => {
    expect(settlement([item('sword')], [damage('sword', 50)])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('37 claims refer to zero-based step index, not quote count; only quotes trigger follow-up discount', () => {
    expect(scenario([
      quote([item('sword')]), claim([damage('sword', 500)]),
      quote([item('amulet')]), claim([damage('amulet', 200)], 2),
      claim([damage('sword', 200)]), quote([item('potion')]),
    ])).toEqual([
      { premium: 115 }, { payout: 400, remainingCap: 1600 },
      { premium: 62 }, { payout: 100, remainingCap: 1100 },
      { payout: 100, remainingCap: 1500 }, { premium: 43 },
    ]);
  });
  it('38 CLI schema example returns premium 59, payout 100, remainingCap 1100 G', () => {
    const result = cli([quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]),
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [damage('amulet', 200)] } },
    ], 5);
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('39 unknown quote broomstick: CLI nonzero, stderr description, no stdout results', () => {
    const result = cli([quote([item('sword')]), quote([item('broomstick')])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).not.toBe('');
    expect(result.stdout).toBe('');
  });
  it('40 uninsured amulet damage: CLI nonzero and stderr, whole claim rejected', () => {
    const result = cli([quote([item('sword')]), claim([damage('sword', 500), damage('amulet', 300)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('amulet');
    expect(result.stdout).toBe('');
  });
  it('41 unknown damage type: CLI nonzero and stderr', () => {
    const result = cli([quote([item('sword')]), claim([damage('broomstick', 200)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('broomstick');
    expect(result.stdout).toBe('');
  });
  it('42 negative damage -200: CLI nonzero and stderr', () => {
    const result = cli([quote([item('sword')]), claim([damage('sword', -200)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).not.toBe('');
    expect(result.stdout).toBe('');
  });
  it('43 more sword damages than insured swords: CLI nonzero, whole claim rejected', () => {
    const result = cli([quote([item('sword')]), claim([damage('sword', 500), damage('sword', 300)])]);
    expect(result.status).not.toBe(0);
    expect(result.stderr.trim()).not.toBe('');
    expect(result.stdout).toBe('');
  });
});
