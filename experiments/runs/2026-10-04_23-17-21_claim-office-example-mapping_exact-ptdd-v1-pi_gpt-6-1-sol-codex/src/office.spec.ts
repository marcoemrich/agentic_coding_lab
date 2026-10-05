import { expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function scenario(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
  });
}
function quote(items: unknown[], premium: number, years = 0) {
  const result = scenario([{ op: 'quote', items }], years);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium }] });
}
function claim(items: unknown[], damages: unknown[], payout: number, remainingCap: number) {
  const result = scenario([{ op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } }]);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout).results[1]).toEqual({ payout, remainingCap });
}
function rejected(steps: unknown[]) {
  const result = scenario(steps);
  expect(result.status).not.toBe(0);
  expect(result.stderr.length).toBeGreaterThan(0);
  expect(result.stdout).toBe('');
}

it('empty items premium 5', () => quote([], 5));
it('sword base 100 gives premium 115', () => quote([{ type: 'sword' }], 115));
it('amulet base 60 gives premium 71', () => quote([{ type: 'amulet' }], 71));
it('staff base 80 gives premium 93', () => quote([{ type: 'staff' }], 93));
it('potion base 40 gives premium 49', () => quote([{ type: 'potion' }], 49));
it('rune base 25 rounds premium 32.5 to 33', () => quote([{ type: 'rune' }], 33));
it('moonstone base 25 gives premium 33', () => quote([{ type: 'moonstone' }], 33));
it('2 runes base 50 gives premium 60', () => quote(Array(2).fill({ type: 'rune' }), 60));
it('3 runes base 60 gives premium 71', () => quote(Array(3).fill({ type: 'rune' }), 71));
it('4 runes base 100 gives premium 115', () => quote(Array(4).fill({ type: 'rune' }), 115));
it('7 runes base 175 rounds 197.5 to 198', () => quote(Array(7).fill({ type: 'rune' }), 198));
it('2 runes and moonstone base 75 gives premium 88', () => quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }], 88));
it('3 runes and 3 moonstones base 120 gives premium 137', () => quote([...Array(3).fill({ type: 'rune' }), ...Array(3).fill({ type: 'moonstone' })], 137));
it('newcomer cursed steel sword enchantment 3 premium 165', () => quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], 165));
it('cursed sword and plain amulet premium 231, curse only adds 50', () => quote([{ type: 'sword', cursed: true }, { type: 'amulet' }], 231));
it('exactly 2 years loyalty sword premium 95', () => quote([{ type: 'sword' }], 95, 2));
it('1 year no loyalty sword premium 115', () => quote([{ type: 'sword' }], 115, 1));
it('enchantment 5 sword premium 145', () => quote([{ type: 'sword', enchantment: 5 }], 145));
it('enchantment 5 sword and plain amulet premium 211, high risk only adds 30', () => quote([{ type: 'sword', enchantment: 5 }, { type: 'amulet' }], 211));
it('cursed enchantment 5 sword premium 195 additive surcharges', () => quote([{ type: 'sword', enchantment: 5, cursed: true }], 195));
it('enchantment 4 sword premium 115', () => quote([{ type: 'sword', enchantment: 4 }], 115));
it('cursed enchantment 4 sword premium 165', () => quote([{ type: 'sword', enchantment: 4, cursed: true }], 165));
it('3 year second quote cursed enchantment 7 sword premium 160', () => {
  const result = scenario([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'quote', items: [{ type: 'sword', material: 'steel', cursed: true, enchantment: 7 }] }], 3);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
});
it('regular steel enchantment 3 sword damage 500 payout 400 cap 1600', () => claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }], 400, 1600));
it('rune damage 200 payout 100 cap 400', () => claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }], 100, 400));
it('moonstone damage 200 payout 100 cap 400', () => claim([{ type: 'moonstone' }], [{ itemType: 'moonstone', amount: 200 }], 100, 400));
it('amulet damage 200 payout 100 cap 1100', () => claim([{ type: 'amulet' }], [{ itemType: 'amulet', amount: 200 }], 100, 1100));
it('staff damage 200 payout 100 cap 1500', () => claim([{ type: 'staff' }], [{ itemType: 'staff', amount: 200 }], 100, 1500));
it('potion damage 200 payout 100 cap 700', () => claim([{ type: 'potion' }], [{ itemType: 'potion', amount: 200 }], 100, 700));
it('dragon enchantment 8 sword damage 1000 payout 400', () => claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }], 400, 1600));
it('dragon enchantment 9 sword damage 1000 payout 400', () => claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }], 400, 1600));
it('dragon enchantment 5 sword damage 800 payout 700', () => claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }], 700, 1300));
it('steel enchantment 9 sword damage 1000 payout 400', () => claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }], 400, 1600));
it('sword 500 and amulet 300 damage payout 600 cap 2600', () => claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }], 600, 2600));
it('two swords insurance 2000 cap 4000', () => claim([{ type: 'sword' }, { type: 'sword' }], [], 0, 4000));
it('two sword damage entries 500 each payout 800 cap 3200', () => claim([{ type: 'sword' }, { type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }], 800, 3200));
it('excess sword damage entries reject whole claim nonzero stderr empty stdout', () => rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }] } }]));
it('sword and amulet insurance 1600 cap 3200', () => claim([{ type: 'sword' }, { type: 'amulet' }], [], 0, 3200));
it('cursed sword premium 165 insurance 1000 cap 2000', () => {
  const result = scenario([{ op: 'quote', items: [{ type: 'sword', cursed: true }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } }]);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
});
it('sword and 3 rune block insurance 1750 cap 3500', () => claim([{ type: 'sword' }, ...Array(3).fill({ type: 'rune' })], [], 0, 3500));
it('successive sword claims 1500 payouts 1400 then 600 caps 600 then 0', () => {
  const damage = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
  const result = scenario([{ op: 'quote', items: [{ type: 'sword' }] }, damage, damage]);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
});
it('enchantment 8 damage 901 payout 350 from 350.5 rounded down', () => claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }], 350, 1650));
it('two enchantment 8 damages 901 retain fractions payout 701', () => claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }], 701, 3299));
it('damage 50 payout zero not negative', () => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }], 0, 2000));
it('unknown quote broomstick rejects nonzero stderr empty stdout', () => rejected([{ op: 'quote', items: [{ type: 'broomstick' }] }]));
it('uninsured amulet claim rejects nonzero stderr empty stdout', () => rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }]));
it('unknown damage type rejects nonzero stderr empty stdout', () => rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }]));
it('negative damage -200 rejects nonzero stderr empty stdout', () => rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }]));
it('schema example 5 year amulet premium 59 payout 100 remaining 1100', () => {
  const result = scenario([{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }], 5);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
});
it('policy refers to quote step index after intervening claim', () => {
  const result = scenario([
    { op: 'quote', items: [{ type: 'sword' }] },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
    { op: 'quote', items: [{ type: 'amulet' }] },
    { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
  ]);
  expect(result.status).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 100, remainingCap: 1500 }] });
});
