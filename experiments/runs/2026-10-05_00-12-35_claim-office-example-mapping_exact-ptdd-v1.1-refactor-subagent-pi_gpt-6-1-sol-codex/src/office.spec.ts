import { describe, expect, it } from 'vitest';
import { runScenario, type Item, type Step } from './office.js';
import { spawnSync } from 'node:child_process';

function cli(steps: Step[], years = 0) {
  return spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO: years }, steps }), encoding: 'utf8',
  });
}
function rejected(steps: Step[]) {
  const result = cli(steps);
  expect(result.error).toBeUndefined();
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
}

function quote(items: Item[], years = 0) {
  return runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
}
function scenario(steps: Step[], years = 0) {
  return runScenario({ customer: { yearsWithMHPCO: years }, steps }).results;
}
function claim(items: Item[], damages: { itemType: string; amount: number }[]) {
  return scenario([{ op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages } }])[1];
}
function runes(count: number): Item[] {
  return Array.from({ length: count }, () => ({ type: 'rune' }));
}

describe('MHPCO claim office', () => {
  it('empty quote costs 5 G', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it('sword base 100 G gives first premium 115 G', () => {
    expect(quote([{ type: 'sword' }])).toEqual({ premium: 115 });
  });
  it('amulet base 60 G gives first premium 71 G', () => {
    expect(quote([{ type: 'amulet' }])).toEqual({ premium: 71 });
  });
  it('staff base 80 G gives first premium 93 G', () => {
    expect(quote([{ type: 'staff' }])).toEqual({ premium: 93 });
  });
  it('potion base 40 G gives first premium 49 G', () => {
    expect(quote([{ type: 'potion' }])).toEqual({ premium: 49 });
  });
  it('2 runes base 50 G gives premium 60 G', () => {
    expect(quote(runes(2))).toEqual({ premium: 60 });
  });
  it('3 runes base 60 G gives premium 71 G', () => {
    expect(quote(runes(3))).toEqual({ premium: 71 });
  });
  it('4 runes base 100 G gives premium 115 G, no block', () => {
    expect(quote(runes(4))).toEqual({ premium: 115 });
  });
  it('7 runes base 175 G gives rounded premium 198 G', () => {
    expect(quote(runes(7))).toEqual({ premium: 198 });
  });
  it('2 runes and 1 moonstone base 75 G gives premium 88 G', () => {
    expect(quote([...runes(2), { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('3 runes and 3 moonstones base 120 G gives premium 137 G', () => {
    expect(quote([...runes(3), ...Array.from({ length: 3 }, () => ({ type: 'moonstone' }))])).toEqual({ premium: 137 });
  });
  it('newcomer cursed sword premium 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it('cursed sword and plain amulet add only 50 G curse: premium 231 G', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
  it('enchantment 5 adds 30 G, cursed adds another 50 G: premiums 145 and 195 G', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toEqual({ premium: 145 });
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    expect(quote([{ type: 'sword', enchantment: 5 }, { type: 'amulet' }])).toEqual({ premium: 211 });
  });
  it('enchantment 4 has no surcharge, curse alone: premiums 115 and 165 G', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toEqual({ premium: 115 });
    expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it('loyalty starts at exactly 2 years: sword premiums 115 and 95 G', () => {
    expect(quote([{ type: 'sword' }], 1)).toEqual({ premium: 115 });
    expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 });
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }], 2)).toEqual({ premium: 199 });
  });
  it('second quote at 3 years with a new cursed enchantment 7 sword costs 160 G', () => {
    expect(scenario([
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true, material: 'steel', enchantment: 7 }] },
      { op: 'quote', items: [{ type: 'sword', cursed: true }, { type: 'amulet' }] },
    ], 3)).toEqual([{ premium: 59 }, { premium: 160 }, { premium: 175 }]);
  });
  it('regular steel enchantment 3 sword damage 500 pays 400, remaining cap 1600 G', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('rune damage 200 pays 100, remaining cap 400 G', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('amulet insurance value 600 G gives cap 1200 G', () => {
    expect(claim([{ type: 'amulet' }], [])).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it('staff insurance value 800 G gives cap 1600 G', () => {
    expect(claim([{ type: 'staff' }], [])).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it('potion insurance value 400 G gives cap 800 G', () => {
    expect(claim([{ type: 'potion' }], [])).toEqual({ payout: 0, remainingCap: 800 });
  });
  it('moonstone premium 33 G and insurance value 250 G gives cap 500 G', () => {
    expect(quote([{ type: 'moonstone' }])).toEqual({ premium: 33 });
    expect(claim([{ type: 'moonstone' }], [])).toEqual({ payout: 0, remainingCap: 500 });
  });
  it('dragon enchantment 8 damage 1000 pays 400 G', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('dragon enchantment 9 damage 1000 pays 400 G, half rule wins', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('dragon enchantment 5 damage 800 pays 700 G', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('steel enchantment 9 damage 1000 pays 400 G', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('dragon attack sword 500 and amulet 300 pays 600 G, cap starts 3200 G', () => {
    expect(scenario([
      { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
      { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }] } },
    ])).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });
  it('two swords have cap 4000 G and two damages each receive a deductible', () => {
    expect(claim([{ type: 'sword' }, { type: 'sword' }], [])).toEqual({ payout: 0, remainingCap: 4000 });
    expect(claim([{ type: 'sword' }, { type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])).toEqual({ payout: 600, remainingCap: 3400 });
    expect(claim([{ type: 'sword', enchantment: 3 }, { type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 600 }])).toEqual({ payout: 1100, remainingCap: 2900 });
  });
  it('cursed sword premium 165 G does not change cap 2000 G', () => {
    expect(quote([{ type: 'sword', cursed: true }])).toEqual({ premium: 165 });
    expect(claim([{ type: 'sword', cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('sword and 3 runes insurance sum 1750 G gives cap 3500 G', () => {
    const items = [{ type: 'sword' }, ...runes(3)];
    expect(quote(items)).toEqual({ premium: 181 });
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it('successive sword damages 1500 pay 1400 then 600 G, cap exhausted', () => {
    const damage: Step = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
    expect(scenario([{ op: 'quote', items: [{ type: 'sword' }] }, damage, damage, damage])).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
    ]);
  });
  it('fractional payout 350.5 rounds down to 350 G', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('two fractional reimbursements retain fractions until final payout 701 G', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])).toEqual({ payout: 701, remainingCap: 3299 });
    expect(quote([{ type: 'rune' }, { type: 'moonstone' }])).toEqual({ premium: 60 });
  });
  it('damage below deductible pays zero and cannot increase remaining cap', () => {
    expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 50 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 200, remainingCap: 3000 });
  });
  it('CLI rejects unknown quote type broomstick with nonzero exit, stderr, no stdout results', () => {
    rejected([{ op: 'quote', items: [{ type: 'broomstick' }] }]);
  });
  it('CLI rejects uninsured amulet damage with nonzero exit and stderr', () => {
    rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }]);
  });
  it('CLI rejects unknown damage type with nonzero exit and stderr', () => {
    rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }]);
  });
  it('CLI rejects excess sword damage entries, entire claim rejected', () => {
    rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }] } }]);
  });
  it('CLI rejects negative damage -200 with nonzero exit and stderr', () => {
    rejected([{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }]);
  });
  it('claim-office CLI schema example gives premium 59, payout 100, remainingCap 1100 G in order', () => {
    const result = cli([
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ], 5);
    expect(result.error).toBeUndefined();
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('policy references use quote step index even after intervening claims', () => {
    expect(scenario([
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
    ])).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 400, remainingCap: 1200 }]);
  });
});
