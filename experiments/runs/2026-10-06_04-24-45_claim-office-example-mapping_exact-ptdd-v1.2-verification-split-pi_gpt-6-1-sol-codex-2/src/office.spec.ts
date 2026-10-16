import { describe, expect, it } from 'vitest';
import { execute } from './office.js';
import { spawnSync } from 'node:child_process';

function checkCli(key: keyof typeof cases) {
  const [input, expected] = cases[key];
  const output = spawnSync('./claim-office', { input: JSON.stringify(input), encoding: 'utf8' });
  if (expected === undefined) {
    expect(output.status).not.toBe(0);
    expect(output.stderr.trim()).not.toBe('');
    expect(output.stdout).toBe('');
  } else {
    expect(output.status).toBe(0);
    expect(output.stderr).toBe('');
    expect(JSON.parse(output.stdout)).toEqual(expected);
  }
}

function check(key: keyof typeof cases) {
  const [input, expected] = cases[key];
  if (expected === undefined) expect(() => execute(input)).toThrow(Error);
  else expect(execute(input)).toEqual(expected);
}

const item = (type: string, extra = {}) => ({ type, ...extra });
const quote = (items: object[]) => ({ op: 'quote', items });
const claim = (policy: number, damages: object[]) => ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const damage = (itemType: string, amount: number) => ({ itemType, amount });
const scenario = (steps: object[], yearsWithMHPCO = 0) => ({ customer: { yearsWithMHPCO }, steps });
const repeated = (type: string, count: number) => Array.from({ length: count }, () => item(type));

// The expected observations are recorded before any test is activated.
const cases = {
  empty: [scenario([quote([])]), { results: [{ premium: 5 }] }],
  sword: [scenario([quote([item('sword')])]), { results: [{ premium: 115 }] }],
  amulet: [scenario([quote([item('amulet')])]), { results: [{ premium: 71 }] }],
  staff: [scenario([quote([item('staff')])]), { results: [{ premium: 93 }] }],
  potion: [scenario([quote([item('potion')])]), { results: [{ premium: 49 }] }],
  rune: [scenario([quote([item('rune')])]), { results: [{ premium: 33 }] }],
  block: [scenario([quote(repeated('rune', 3))]), { results: [{ premium: 71 }] }],
  curse: [scenario([quote([item('sword', { cursed: true, material: 'steel', enchantment: 3 })])]), { results: [{ premium: 165 }] }],
  enchant: [scenario([quote([item('sword', { enchantment: 5 })])]), { results: [{ premium: 145 }] }],
  loyalty: [scenario([quote([item('sword')])], 2), { results: [{ premium: 95 }] }],
  followup: [scenario([quote([item('sword')]), quote([item('sword', { cursed: true, enchantment: 7, material: 'steel' })])], 3), { results: [{ premium: 95 }, { premium: 160 }] }],
  standardClaim: [scenario([quote([item('sword', { material: 'steel', enchantment: 3 })]), claim(0, [damage('sword', 500)])]), { results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] }],
  highClaim: [scenario([quote([item('sword', { material: 'dragon', enchantment: 8 })]), claim(0, [damage('sword', 1000)])]), { results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] }],
  multiClaim: [scenario([quote([item('sword'), item('amulet')]), claim(0, [damage('sword', 500), damage('amulet', 300)])]), { results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] }],
  exhaustion: [scenario([quote([item('sword')]), claim(0, [damage('sword', 1500)]), claim(0, [damage('sword', 1500)])]), { results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] }],
  negative: [scenario([quote([item('sword')]), claim(0, [damage('sword', -200)])])],
  absent: [scenario([quote([item('sword')]), claim(0, [damage('amulet', 200)])])],
  overcount: [scenario([quote([item('sword')]), claim(0, [damage('sword', 200), damage('sword', 200)])])],
  unknown: [scenario([quote([item('broomstick')])])],
  multiModifiers: [scenario([quote([]), quote([item('sword', { enchantment: 5 }), item('amulet')])], 2), { results: [{ premium: 5 }, { premium: 155 }] }],
  premiumFractions: [scenario([quote([item('rune', { cursed: true })])]), { results: [{ premium: 45 }] }],
  moonstone: [scenario([quote([item('moonstone')])]), { results: [{ premium: 33 }] }],
  twoRunes: [scenario([quote(repeated('rune', 2))]), { results: [{ premium: 60 }] }],
  fourRunes: [scenario([quote(repeated('rune', 4))]), { results: [{ premium: 115 }] }],
  sevenRunes: [scenario([quote(repeated('rune', 7))]), { results: [{ premium: 198 }] }],
  mixed: [scenario([quote([...repeated('rune', 2), item('moonstone')])]), { results: [{ premium: 88 }] }],
  twoBlocks: [scenario([quote([...repeated('rune', 3), ...repeated('moonstone', 3)])]), { results: [{ premium: 137 }] }],
  scope: [scenario([quote([item('sword', { cursed: true }), item('amulet')])]), { results: [{ premium: 231 }] }],
  both: [scenario([quote([item('sword', { cursed: true, enchantment: 5 })])]), { results: [{ premium: 195 }] }],
  belowEnchant: [scenario([quote([item('sword', { enchantment: 4 })])]), { results: [{ premium: 115 }] }],
  cursedBelow: [scenario([quote([item('sword', { cursed: true, enchantment: 4 })])]), { results: [{ premium: 165 }] }],
  belowLoyalty: [scenario([quote([item('sword')])], 1), { results: [{ premium: 115 }] }],
  highDragon: [scenario([quote([item('sword', { enchantment: 9, material: 'dragon' })]), claim(0, [damage('sword', 1000)])]), { results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] }],
  dragon: [scenario([quote([item('sword', { enchantment: 5, material: 'dragon' })]), claim(0, [damage('sword', 800)])]), { results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] }],
  highSteel: [scenario([quote([item('sword', { enchantment: 9, material: 'steel' })]), claim(0, [damage('sword', 1000)])]), { results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] }],
  runeClaim: [scenario([quote([item('rune')]), claim(0, [damage('rune', 200)])]), { results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] }],
  twoSwords: [scenario([quote(repeated('sword', 2)), claim(0, [damage('sword', 500), damage('sword', 300)])]), { results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }] }],
  curseCap: [scenario([quote([item('sword', { cursed: true })]), claim(0, [damage('sword', 3000)])]), { results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }] }],
  blockCap: [scenario([quote([item('sword'), ...repeated('rune', 3)]), claim(0, [])]), { results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] }],
  amuletCap: [scenario([quote([item('amulet')]), claim(0, [damage('amulet', 2000)])]), { results: [{ premium: 71 }, { payout: 1200, remainingCap: 0 }] }],
  staffCap: [scenario([quote([item('staff')]), claim(0, [damage('staff', 2000)])]), { results: [{ premium: 93 }, { payout: 1600, remainingCap: 0 }] }],
  potionCap: [scenario([quote([item('potion')]), claim(0, [damage('potion', 2000)])]), { results: [{ premium: 49 }, { payout: 800, remainingCap: 0 }] }],
  moonstoneCap: [scenario([quote([item('moonstone')]), claim(0, [damage('moonstone', 1000)])]), { results: [{ premium: 33 }, { payout: 500, remainingCap: 0 }] }],
  payoutRounding: [scenario([quote([item('sword', { enchantment: 8 })]), claim(0, [damage('sword', 901)])]), { results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] }],
  fractionalEvent: [scenario([quote([item('sword', { enchantment: 8 }), item('sword', { enchantment: 9 })]), claim(0, [damage('sword', 901), damage('sword', 901)])]), { results: [{ premium: 285 }, { payout: 701, remainingCap: 3299 }] }],
  tinyDamage: [scenario([quote([item('sword')]), claim(0, [damage('sword', 50)])]), { results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }] }],
  unknownDamage: [scenario([quote([item('sword')]), claim(0, [damage('broomstick', 200)])])],
  schema: [scenario([quote([item('amulet', { material: 'silver', enchantment: 2, cursed: false })]), claim(0, [damage('amulet', 200)])], 5), { results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] }],
  stepIndex: [scenario([quote([item('sword')]), claim(0, []), quote([item('amulet')]), claim(2, [damage('amulet', 200)])]), { results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }] }],
};

// Activation adds executable assertions here, one example at a time.
describe('Claim office', () => {
  it('empty: empty list costs only 5 G', () => check('empty'));
  it('sword: base 100 G, first assessment 10 G, fee = 115 G', () => check('sword'));
  it('amulet: base 60 G gives premium 71 G', () => check('amulet'));
  it('staff: base 80 G gives premium 93 G', () => check('staff'));
  it('potion: base 40 G gives premium 49 G', () => check('potion'));
  it('rune: base 25 G gives rounded premium 33 G', () => check('rune'));
  it('block: exactly 3 runes base 60 G gives 71 G', () => check('block'));
  it('curse: newcomer cursed sword costs 165 G', () => check('curse'));
  it('enchant: enchantment 5 adds 30 G, premium 145 G', () => check('enchant'));
  it('loyalty: exactly 2 years subtracts 20 G, premium 95 G', () => check('loyalty'));
  it('followup: long-standing second quote keeps assessment, costs 160 G', () => check('followup'));
  it('standardClaim: regular steel sword damage 500 pays 400, cap 1600', () => check('standardClaim'));
  it('highClaim: dragon enchantment 8 damage 1000 pays 400, cap 1600', () => check('highClaim'));
  it('multiClaim: sword 500 and amulet 300 pays 600, cap 2600', () => check('multiClaim'));
  it('exhaustion: successive 1500 damages pay 1400 then 600, cap 0', () => check('exhaustion'));
  it('negative: negative damage -200 rejects whole claim (chosen internal Error contract)', () => check('negative'));
  it('overcount: two sword damages with one insured rejects whole claim (chosen internal Error contract)', () => check('overcount'));
  it('unknown: broomstick quote rejects (chosen internal Error contract)', () => check('unknown'));

  it('CLI success: executable reads stdin and writes ordered normative results', () => checkCli('schema'));

  describe('verification', () => {
    it('absent: uninsured amulet rejects whole claim (chosen internal Error contract)', () => check('absent'));
    it('moonstone: base 25 G gives premium 33 G', () => check('moonstone'));
    it('twoRunes: 2 runes base 50 G gives 60 G', () => check('twoRunes'));
    it('fourRunes: 4 runes base 100 G gives 115 G, no block', () => check('fourRunes'));
    it('sevenRunes: 7 runes base 175 G yields 197.5 rounded to 198 G', () => check('sevenRunes'));
    it('mixed: 2 runes + moonstone base 75 G gives 88 G', () => check('mixed'));
    it('twoBlocks: 3 runes + 3 moonstones base 120 G gives 137 G', () => check('twoBlocks'));
    it('scope: cursed sword + plain amulet base 160 + curse 50 = 210, premium 231 G', () => check('scope'));
    it('both: cursed enchantment 5 sword adds both surcharges, premium 195 G', () => check('both'));
    it('belowEnchant: enchantment 4 has no surcharge, premium 115 G', () => check('belowEnchant'));
    it('cursedBelow: cursed enchantment 4 has only curse, premium 165 G', () => check('cursedBelow'));
    it('belowLoyalty: 1 year has no loyalty, premium 115 G', () => check('belowLoyalty'));
    it('highDragon: dragon enchantment 9 pays 400 G', () => check('highDragon'));
    it('dragon: dragon enchantment 5 damage 800 pays 700 G', () => check('dragon'));
    it('highSteel: steel enchantment 9 pays 400 G', () => check('highSteel'));
    it('runeClaim: rune damage 200 pays 100 G, cap 400 G', () => check('runeClaim'));
    it('twoSwords: insurance sum 2000, cap 4000, separate damages pay 600 G', () => check('twoSwords'));
    it('curseCap: cursed sword premium 165 does not raise cap 2000 G', () => check('curseCap'));
    it('blockCap: sword + 3 runes insurance sum 1750, cap 3500 G', () => check('blockCap'));
    it('amuletCap: amulet insurance 600, cap 1200 G', () => check('amuletCap'));
    it('staffCap: staff insurance 800, cap 1600 G', () => check('staffCap'));
    it('potionCap: potion insurance 400, cap 800 G', () => check('potionCap'));
    it('moonstoneCap: moonstone insurance 250, cap 500 G', () => check('moonstoneCap'));
    it('payoutRounding: payout 350.5 rounded down to 350 G', () => check('payoutRounding'));
    it('fractionalEvent: keep fractions until final payout, 350.5 + 350.5 = 701 G', () => check('fractionalEvent'));
    it('tinyDamage: deductible cannot create negative payout, 50 damage pays 0 G', () => check('tinyDamage'));
    it('unknownDamage: unknown damage type rejects (chosen internal Error contract)', () => check('unknownDamage'));
    it('schema: normative amulet schema gives premium 59, payout 100, cap 1100 G', () => check('schema'));
    it('stepIndex: policy references quote step index 2, claims do not count as contracts', () => check('stepIndex'));
    it('multiModifiers: high enchantment is item-scoped, loyalty and followup use full policy base, premium 155 G', () => check('multiModifiers'));
    it('premiumFractions: cursed rune retains 12.5 curse and 2.5 assessment until final premium 45 G', () => check('premiumFractions'));
    it('CLI unknown quote: nonzero exit, stderr description, no stdout results', () => checkCli('unknown'));
    it('CLI uninsured damage: nonzero exit, stderr description', () => checkCli('absent'));
    it('CLI unknown damage: nonzero exit, stderr description', () => checkCli('unknownDamage'));
    it('CLI negative damage: nonzero exit, stderr description', () => checkCli('negative'));
    it('CLI excess damages: nonzero exit rejects whole claim', () => checkCli('overcount'));
  });
});
