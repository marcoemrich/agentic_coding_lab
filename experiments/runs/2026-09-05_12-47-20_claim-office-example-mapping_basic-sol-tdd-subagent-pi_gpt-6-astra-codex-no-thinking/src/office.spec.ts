import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { run, type Item } from './office.js';

const quote = (items: Item[], years = 0) => run({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
const copies = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));

it('empty quote costs 5 G', () => { expect(quote([])).toEqual({ premium: 5 }); });
it('sword base 100 plus assessment and fee costs 115', () => { expect(quote([{ type: 'sword' }])).toEqual({ premium: 115 }); });
it('amulet staff potion bases 60 80 40 cost 203 together', () => { expect(quote([{ type: 'amulet' }, { type: 'staff' }, { type: 'potion' }])).toEqual({ premium: 203 }); });
it('2 runes base 50 cost 60', () => { expect(quote(copies('rune', 2))).toEqual({ premium: 60 }); });
it('3 runes base 60 cost 71', () => { expect(quote(copies('rune', 3))).toEqual({ premium: 71 }); });
it('4 runes base 100 cost 115', () => { expect(quote(copies('rune', 4))).toEqual({ premium: 115 }); });
it('7 runes base 175 round 197.5 up to 198', () => { expect(quote(copies('rune', 7))).toEqual({ premium: 198 }); });
it('2 runes and moonstone base 75 cost 88', () => { expect(quote([...copies('rune', 2), { type: 'moonstone' }])).toEqual({ premium: 88 }); });
it('3 runes and 3 moonstones base 120 cost 137', () => { expect(quote([...copies('rune', 3), ...copies('moonstone', 3)])).toEqual({ premium: 137 }); });
it('newcomer cursed sword costs 165', () => { expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 }); });
it('cursed sword and plain amulet base 160 risk total 210 cost 231', () => { expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 }); });
it('exactly 2 years loyalty sword costs 95', () => { expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 }); });
it('enchantment 5 cursed sword costs 195', () => { expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toEqual({ premium: 195 }); });
it('enchantment 4 plain sword costs 115', () => { expect(quote([{ type: 'sword', enchantment: 4, cursed: false }])).toEqual({ premium: 115 }); });
it('enchantment 4 cursed sword costs 165', () => { expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toEqual({ premium: 165 }); });
it('longstanding second quote cursed enchanted sword costs 160', () => {
  expect(run({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: 'quote', items: [] }, { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] }] }).results).toEqual([{ premium: 5 }, { premium: 160 }]);
});
const claim = (items: Item[], damages: { itemType: string; amount: number }[]) => run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } }] }).results[1];
it('regular steel enchantment 3 damage 500 pays 400 cap 1600', () => { expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('rune damage 200 pays 100 cap 400', () => { expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }); });
it('dragon enchantment 8 damage 1000 pays 400', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('dragon enchantment 9 damage 1000 pays 400', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('dragon enchantment 5 damage 800 pays 700', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 }); });
it('steel enchantment 9 damage 1000 pays 400', () => { expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
it('sword 500 amulet 300 damage pays 600 cap 2600', () => { expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 }); });
it('two swords insurance 2000 cap 4000 and separate deductibles', () => { expect(claim(copies('sword', 2), [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 }); });
it('cursed sword premium 165 still cap 2000', () => { const items = [{ type: 'sword', cursed: true }]; expect(quote(items)).toEqual({ premium: 165 }); expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 2000 }); });
it('sword and 3 runes insurance 1750 cap 3500', () => { expect(claim([{ type: 'sword' }, ...copies('rune', 3)], [])).toEqual({ payout: 0, remainingCap: 3500 }); });
it('successive 1500 claims pay 1400 then 600 then zero', () => {
  const damageStep = { op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
  expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, damageStep, damageStep, damageStep] }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
});
it('payout 350.5 rounds down to 350', () => { expect(claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 }); });
it('intermediate half G payouts retained until final total', () => { expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])).toEqual({ payout: 701, remainingCap: 3299 }); });
it('damage below deductible never gives negative payout', () => { expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 }); });
it('staff potion moonstone insured values 800 400 250 give cap 2900', () => { expect(claim([{ type: 'staff' }, { type: 'potion' }, { type: 'moonstone' }], [])).toEqual({ payout: 0, remainingCap: 2900 }); });
it('cursed component block modifiers use discounted item base premium', () => { expect(quote([{ type: 'rune', cursed: true }, ...copies('rune', 2)])).toEqual({ premium: 81 }); });
it('mixed same-type enchantments match damage entries in insured order', () => { expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toEqual({ payout: 550, remainingCap: 3450 }); });
it('premium fractions retained across items and loyalty applies to policy base', () => { expect(quote([{ type: 'rune', cursed: true }, { type: 'rune', cursed: true }], 2)).toEqual({ premium: 75 }); });
const cli = (steps: unknown[], years = 0) => spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO: years }, steps }), encoding: 'utf8' });
it('CLI schema example outputs premium 59 payout 100 cap 1100', () => {
  const result = cli([{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }], 5);
  expect(result.status).toBe(0); expect(result.stderr).toBe('');
  expect(result.stdout.trim()).toBe(JSON.stringify({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] }));
});
const expectRejected = (steps: unknown[]) => { const result = cli(steps); expect(result.status).not.toBe(0); expect(result.stderr.trim()).not.toBe(''); expect(result.stdout).toBe(''); };
it('CLI unknown quote type fails with stderr and empty stdout', () => { expectRejected([{ op: 'quote', items: [{ type: 'broomstick' }] }]); });
const rejectedDamage = (damages: { itemType: string; amount: number }[]) => expectRejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages } }]);
it('CLI uninsured amulet claim fails with stderr and empty stdout', () => { rejectedDamage([{ itemType: 'amulet', amount: 200 }]); });
it('CLI unknown damaged type fails with stderr and empty stdout', () => { rejectedDamage([{ itemType: 'broomstick', amount: 200 }]); });
it('CLI negative damage fails with stderr and empty stdout', () => { rejectedDamage([{ itemType: 'sword', amount: -200 }]); });
it('CLI excess same type damage rejects whole claim', () => { rejectedDamage([{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }]); });
it('claim policy uses step index not quote count and independent caps', () => {
  expect(run({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items: [{ type: 'sword' }] },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
    { op: 'quote', items: [{ type: 'amulet' }] },
    { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } }
  ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 600, remainingCap: 0 }]);
});
