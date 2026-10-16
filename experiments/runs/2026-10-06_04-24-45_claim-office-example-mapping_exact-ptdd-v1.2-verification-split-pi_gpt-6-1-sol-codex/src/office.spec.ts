import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { execute, type Item, type Step, type Damage } from './office.js';

const item = (type = 'sword', extra: Partial<Item> = {}): Item => ({ type, ...extra });
const quote = (items: Item[]): Step => ({ op: 'quote', items });
const claim = (damages: Damage[], policy = 0): Step => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType = 'sword', amount = 500): Damage => ({ itemType, amount });
const run = (steps: Step[], years = 0) => execute({ customer: { yearsWithMHPCO: years }, steps }).results;
const premium = (items: Item[], years = 0) => run([quote(items)], years)[0].premium;
const settlement = (items: Item[], damages: Damage[]) => run([quote(items), claim(damages)])[1];
const cli = (steps: Step[], years = 0) => spawnSync('./claim-office', [], {
  input: JSON.stringify({ customer: { yearsWithMHPCO: years }, steps }), encoding: 'utf8',
});
const rejected = (steps: Step[]) => {
  const result = cli(steps);
  expect(result.error).toBeUndefined();
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
};

describe('Claim office', () => {
  it('D01 empty quote: premium 5', () => { expect(premium([])).toBe(5); });
  it('D02 sword: premium 115', () => { expect(premium([item()])).toBe(115); });
  it('D03 amulet: premium 71', () => { expect(premium([item('amulet')])).toBe(71); });
  it('D04 staff: premium 93', () => { expect(premium([item('staff')])).toBe(93); });
  it('D05 potion: premium 49', () => { expect(premium([item('potion')])).toBe(49); });
  it('D06 two runes: base 50, premium 60', () => { expect(premium([item('rune'), item('rune')])).toBe(60); });
  it('D07 moonstone: base 25, premium 33', () => { expect(premium([item('moonstone')])).toBe(33); });
  it('D08 three runes: base 60, premium 71', () => { expect(premium(Array.from({ length: 3 }, () => item('rune')))).toBe(71); });
  it('D09 cursed sword newcomer: premium 165', () => { expect(premium([item('sword', { cursed: true, material: 'steel', enchantment: 3 })])).toBe(165); });
  it('D10 enchantment 5 sword: premium 145', () => { expect(premium([item('sword', { enchantment: 5 })])).toBe(145); });
  it('D11 exactly 2 years sword: premium 95', () => { expect(premium([item()], 2)).toBe(95); });
  it('D12 second quote plain sword: premium 100', () => { expect(run([quote([item()]), quote([item()])])).toEqual([{ premium: 115 }, { premium: 100 }]); });
  it('D13 steel enchantment 3 sword damage 500: payout 400, cap 1600', () => { expect(settlement([item('sword', { material: 'steel', enchantment: 3 })], [damage()])).toEqual({ payout: 400, remainingCap: 1600 }); });
  it('D14 dragon enchantment 8 damage 1000: payout 400, cap 1600', () => { expect(settlement([item('sword', { material: 'dragon', enchantment: 8 })], [damage('sword', 1000)])).toEqual({ payout: 400, remainingCap: 1600 }); });
  it('D15 successive 1500 sword claims: payouts 1400/600, caps 600/0', () => { expect(run([quote([item()]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)])]).slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]); });
  it('D16 fractional payout 350.5 rounds down to 350', () => { expect(settlement([item('sword', { enchantment: 8 })], [damage('sword', 901)])).toEqual({ payout: 350, remainingCap: 1650 }); });
  it('D17 unknown quote type: nonzero CLI, stderr, no stdout', () => { rejected([quote([item('broomstick')])]); });
  it('D19 excess sword damage entries: whole claim rejected by CLI', () => { rejected([quote([item()]), claim([damage(), damage()])]); });
  it('D20 negative damage -200: nonzero CLI, stderr, no stdout', () => { rejected([quote([item()]), claim([damage('sword', -200)])]); });

  it('V12 rune damage 200: payout 100, cap 400', () => { expect(settlement([item('rune')], [damage('rune', 200)])).toEqual({ payout: 100, remainingCap: 400 }); });
  it('V18 sword and amulet insurance sum 1600: cap 3200', () => { expect(settlement([item(), item('amulet')], [])).toEqual({ payout: 0, remainingCap: 3200 }); });
  it('V21 staff insurance value 800: cap 1600', () => { expect(settlement([item('staff')], [])).toEqual({ payout: 0, remainingCap: 1600 }); });
  it('V22 potion insurance value 400: cap 800', () => { expect(settlement([item('potion')], [])).toEqual({ payout: 0, remainingCap: 800 }); });
  it('V23 moonstone insurance value 250: payout 100, cap 400', () => { expect(settlement([item('moonstone')], [damage('moonstone', 200)])).toEqual({ payout: 100, remainingCap: 400 }); });

  describe('verification', () => {
    it('D18 uninsured amulet damage: nonzero CLI, stderr, no stdout', () => { rejected([quote([item()]), claim([damage('amulet', 300)])]); });
    it('V01 four runes: base 100, premium 115, no block', () => { expect(premium(Array.from({ length: 4 }, () => item('rune')))).toBe(115); });
    it('V02 seven runes: base 175, premium 198 from 197.5', () => { expect(premium(Array.from({ length: 7 }, () => item('rune')))).toBe(198); });
    it('V03 two runes plus moonstone: base 75, premium 88', () => { expect(premium([item('rune'), item('rune'), item('moonstone')])).toBe(88); });
    it('V04 three runes plus three moonstones: base 120, premium 137', () => { expect(premium([...Array.from({ length: 3 }, () => item('rune')), ...Array.from({ length: 3 }, () => item('moonstone'))])).toBe(137); });
    it('V05 cursed sword plus plain amulet: base 160 plus curse 50, premium 231', () => { expect(premium([item('sword', { cursed: true }), item('amulet')])).toBe(231); });
    it('V06 cursed enchantment 5 sword: premium 195', () => { expect(premium([item('sword', { cursed: true, enchantment: 5 })])).toBe(195); });
    it('V07 plain enchantment 4 sword: premium 115', () => { expect(premium([item('sword', { cursed: false, enchantment: 4 })])).toBe(115); });
    it('V08 cursed enchantment 4 sword: premium 165', () => { expect(premium([item('sword', { cursed: true, enchantment: 4 })])).toBe(165); });
    it('V09 below loyalty threshold 1 year: premium 115', () => { expect(premium([item()], 1)).toBe(115); });
    it('V10 long-standing second cursed enchantment 7 sword: premium 160', () => { expect(run([quote([item('amulet')]), quote([item('sword', { cursed: true, material: 'steel', enchantment: 7 })])], 3)).toEqual([{ premium: 59 }, { premium: 160 }]); });
    it('V11 two damaged items 500/300: payout 600, cap 2600', () => { expect(settlement([item(), item('amulet')], [damage('sword', 500), damage('amulet', 300)])).toEqual({ payout: 600, remainingCap: 2600 }); });
    it('V13 dragon enchantment 9 damage 1000: payout 400', () => { expect(settlement([item('sword', { material: 'dragon', enchantment: 9 })], [damage('sword', 1000)])).toEqual({ payout: 400, remainingCap: 1600 }); });
    it('V14 dragon enchantment 5 damage 800: payout 700', () => { expect(settlement([item('sword', { material: 'dragon', enchantment: 5 })], [damage('sword', 800)])).toEqual({ payout: 700, remainingCap: 1300 }); });
    it('V15 steel enchantment 9 damage 1000: payout 400', () => { expect(settlement([item('sword', { material: 'steel', enchantment: 9 })], [damage('sword', 1000)])).toEqual({ payout: 400, remainingCap: 1600 }); });
    it('V16 two swords insurance sum 2000: cap 4000', () => { expect(settlement([item(), item()], [])).toEqual({ payout: 0, remainingCap: 4000 }); });
    it('V17 two sword damage entries 500 each: payout 800, cap 3200', () => { expect(settlement([item(), item()], [damage(), damage()])).toEqual({ payout: 800, remainingCap: 3200 }); });
    it('V19 cursed sword premium 165: cap 2000', () => { expect(run([quote([item('sword', { cursed: true })]), claim([])])).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]); });
    it('V20 sword and three runes insurance sum 1750: cap 3500', () => { expect(settlement([item(), ...Array.from({ length: 3 }, () => item('rune'))], [])).toEqual({ payout: 0, remainingCap: 3500 }); });
    it('V24 amulet insurance value 600: cap 1200', () => { expect(settlement([item('amulet')], [])).toEqual({ payout: 0, remainingCap: 1200 }); });
    it('V25 unknown damage type: CLI nonzero, stderr, no stdout', () => { rejected([quote([item()]), claim([damage('broomstick', 200)])]); });
    it('V26 schema CLI example: premium 59, payout 100, cap 1100', () => {
      const result = cli([
        quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]),
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [damage('amulet', 200)] } },
      ], 5);
      expect(result.status).toBe(0);
      expect(result.stderr).toBe('');
      expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    });
    it('V27 policy uses quote step index, not quote ordinal', () => {
      expect(run([quote([item()]), claim([damage()]), quote([item('amulet')]), claim([damage('amulet', 200)], 2), claim([damage()], 0)]))
        .toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 400, remainingCap: 1200 }]);
    });
    it('V28 intermediate payout fractions retained: two 350.5 payouts total 701', () => { expect(settlement([item('sword', { enchantment: 8 }), item('sword', { enchantment: 8 })], [damage('sword', 901), damage('sword', 901)])).toEqual({ payout: 701, remainingCap: 3299 }); });
    it('V29 deductible cannot produce negative payout: damage 50 gives 0', () => { expect(settlement([item()], [damage('sword', 50)])).toEqual({ payout: 0, remainingCap: 2000 }); });
    it('V30 cap exhausted: further claim payout 0, cap 0', () => { expect(run([quote([item()]), claim([damage('sword', 1500)]), claim([damage('sword', 1500)]), claim([damage()])]).slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]); });
    it('V31 enchanted sword plus plain amulet: premium 211, item-local high risk', () => { expect(premium([item('sword', { enchantment: 5 }), item('amulet')])).toBe(211); });
    it('V32 two moonstones: premium 60, intermediate 2.5 assessments not rounded', () => { expect(premium([item('moonstone'), item('moonstone')])).toBe(60); });
  });
});
