import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario, type Item, type Damage, type Scenario } from './office.js';

const item = (type: string, attributes: Partial<Item> = {}): Item => ({ type, ...attributes });
const quote = (items: Item[]) => ({ op: 'quote' as const, items });
const claim = (damages: Damage[], policy = 0) => ({ op: 'claim' as const, policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number): Damage => ({ itemType, amount });
const scenario = (steps: Scenario['steps'], years = 0): Scenario => ({ customer: { yearsWithMHPCO: years }, steps });
const premium = (items: Item[], expected: number, years = 0) => {
  expect(runScenario(scenario([quote(items)], years))).toEqual({ results: [{ premium: expected }] });
};

const copies = (type: string, count: number) => Array.from({ length: count }, () => item(type));
const settled = (items: Item[], damages: Damage[], payout: number, remainingCap: number) => {
  expect(runScenario(scenario([quote(items), claim(damages)])).results[1]).toEqual({ payout, remainingCap });
};
const cap = (items: Item[], remainingCap: number) => settled(items, [], 0, remainingCap);

const cli = (input: Scenario) => spawnSync('./claim-office', [], { input: JSON.stringify(input), encoding: 'utf8' });
const rejected = (input: Scenario) => {
  const result = cli(input);
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
};

describe('Claim office', () => {
  it('empty items cost 5 G', () => premium([], 5));
  it('sword base 100 yields first premium 115 G', () => premium([item('sword')], 115));
  it('amulet base 60 yields first premium 71 G', () => premium([item('amulet')], 71));
  it('staff base 80 yields first premium 93 G', () => premium([item('staff')], 93));
  it('potion base 40 yields first premium 49 G', () => premium([item('potion')], 49));
  it('rune base 25 yields first premium 33 G rounded up', () => premium([item('rune')], 33));
  it('moonstone base 25 yields first premium 33 G', () => premium([item('moonstone')], 33));
  it('3 runes base 60 yield premium 71 G', () => premium(Array.from({ length: 3 }, () => item('rune')), 71));
  it('newcomer cursed sword yields premium 165 G', () => premium([item('sword', { cursed: true, enchantment: 3, material: 'steel' })], 165));
  it('enchantment 5 sword yields premium 145 G', () => premium([item('sword', { enchantment: 5 })], 145));
  it('exactly 2 years gives sword premium 95 G', () => premium([item('sword')], 95, 2));
  it('second quote sword premium 100 G after first 115 G', () => {
    expect(runScenario(scenario([quote([item('sword')]), quote([item('sword')])]))).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it('steel enchantment 3 sword damage 500 pays 400 remaining 1600 G', () => {
    expect(runScenario(scenario([quote([item('sword', { material: 'steel', enchantment: 3 })]), claim([damage('sword', 500)])]))).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it('steel enchantment 9 damage 1000 pays 400 G', () => {
    expect(runScenario(scenario([quote([item('sword', { material: 'steel', enchantment: 9 })]), claim([damage('sword', 1000)])])).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('successive sword claims pay 1400 then 600 remaining 0 G', () => {
    expect(runScenario(scenario([quote([item('sword')]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)])]))).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });
  it('unknown quote type rejects CLI with stderr and no stdout', () => rejected(scenario([quote([item('broomstick')])])));
  it('uninsured amulet rejects whole claim via CLI', () => rejected(scenario([quote([item('sword')]), claim([damage('amulet', 300)])])));
  it('negative damage -200 rejects CLI with stderr', () => rejected(scenario([quote([item('sword')]), claim([damage('sword', -200)])])));
  describe('verification', () => {
    it('premium keeps fractional modifiers until final rounding 67.5 to 68 G', () => {
      expect(runScenario(scenario([quote([]), quote([item('rune', { cursed: true }), item('rune', { cursed: true })])], 3)).results).toEqual([{ premium: 5 }, { premium: 68 }]);
    });
    it('excess sword damage entries reject whole claim via CLI', () => rejected(scenario([quote([item('sword')]), claim([damage('sword', 500), damage('sword', 500)])])));
    it('2 runes base 50 yield premium 60 G', () => premium(copies('rune', 2), 60));
    it('4 runes base 100 yield premium 115 G no block', () => premium(copies('rune', 4), 115));
    it('7 runes base 175 yield premium 198 G from 197.5', () => premium(copies('rune', 7), 198));
    it('2 runes and 1 moonstone base 75 yield premium 88 G', () => premium([...copies('rune', 2), item('moonstone')], 88));
    it('3 runes and 3 moonstones base 120 yield premium 137 G', () => premium([...copies('rune', 3), ...copies('moonstone', 3)], 137));
    it('3 moonstones base 60 yield premium 71 G', () => premium(copies('moonstone', 3), 71));
    it('cursed sword and plain amulet base 160 plus curse 50 yield 231 G', () => premium([item('sword', { cursed: true }), item('amulet')], 231));
    it('cursed enchantment 5 sword gets both surcharges premium 195 G', () => premium([item('sword', { cursed: true, enchantment: 5 })], 195));
    it('enchantment 4 plain sword has premium 115 G', () => premium([item('sword', { enchantment: 4, cursed: false })], 115));
    it('enchantment 4 cursed sword has premium 165 G', () => premium([item('sword', { enchantment: 4, cursed: true })], 165));
    it('1 year receives no loyalty discount premium 115 G', () => premium([item('sword')], 115, 1));
    it('long-standing second cursed enchantment 7 sword premium 160 G', () => {
      expect(runScenario(scenario([quote([item('amulet')]), quote([item('sword', { cursed: true, enchantment: 7, material: 'steel' })])], 3)).results).toEqual([{ premium: 59 }, { premium: 160 }]);
    });
    it('dragon enchantment 8 damage 1000 pays 400 G', () => settled([item('sword', { material: 'dragon', enchantment: 8 })], [damage('sword', 1000)], 400, 1600));
    it('dragon attack sword 500 and amulet 300 pays 600 remaining 2600 G', () => settled([item('sword'), item('amulet')], [damage('sword', 500), damage('amulet', 300)], 600, 2600));
    it('rune damage 200 pays 100 remaining 400 G', () => settled([item('rune')], [damage('rune', 200)], 100, 400));
    it('dragon enchantment 9 damage 1000 pays 400 G', () => settled([item('sword', { material: 'dragon', enchantment: 9 })], [damage('sword', 1000)], 400, 1600));
    it('dragon enchantment 5 damage 800 pays 700 G', () => settled([item('sword', { material: 'dragon', enchantment: 5 })], [damage('sword', 800)], 700, 1300));
    it('two swords cap 4000 G with zero damage', () => cap(copies('sword', 2), 4000));
    it('two sword damages 500 each pay 800 remaining 3200 G', () => settled(copies('sword', 2), [damage('sword', 500), damage('sword', 500)], 800, 3200));
    it('sword and amulet cap 3200 G with zero damage', () => cap([item('sword'), item('amulet')], 3200));
    it('cursed sword premium 165 has cap 2000 G', () => {
      expect(runScenario(scenario([quote([item('sword', { cursed: true })]), claim([])]))).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
    });
    it('sword and 3 runes cap 3500 G despite block', () => cap([item('sword'), ...copies('rune', 3)], 3500));
    it('high enchantment damage 901 pays 350 G from 350.5', () => settled([item('sword', { enchantment: 8 })], [damage('sword', 901)], 350, 1650));
    it('two fractional payouts 350.5 sum before rounding to 701 G', () => settled([item('sword', { enchantment: 8 }), item('sword', { enchantment: 8 })], [damage('sword', 901), damage('sword', 901)], 701, 3299));
    it('unknown damage type rejects CLI with stderr', () => rejected(scenario([quote([item('sword')]), claim([damage('broomstick', 500)])])));
    it('moonstone damage 200 pays 100 remaining 400 G', () => settled([item('moonstone')], [damage('moonstone', 200)], 100, 400));
    it('staff cap 1600 G with zero damage', () => cap([item('staff')], 1600));
    it('potion cap 800 G with zero damage', () => cap([item('potion')], 800));
    it('amulet cap 1200 G with zero damage', () => cap([item('amulet')], 1200));
    it('schema example CLI amulet premium 59 payout 100 remaining 1100 G', () => {
      const result = cli(scenario([quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]), { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [damage('amulet', 200)] } }], 5));
      expect(result.status).toBe(0);
      expect(result.stderr).toBe('');
      expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
    it('claims use quote step indices and separate policy caps', () => {
      expect(runScenario(scenario([
        quote([item('sword')]), claim([damage('sword', 500)]),
        quote([item('amulet')]), claim([damage('amulet', 200)], 2), claim([damage('sword', 1500)], 0),
      ]))).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 1400, remainingCap: 200 }] });
    });
    it('damage below deductible pays zero and preserves cap', () => settled([item('sword')], [damage('sword', 50)], 0, 2000));
  });
});
