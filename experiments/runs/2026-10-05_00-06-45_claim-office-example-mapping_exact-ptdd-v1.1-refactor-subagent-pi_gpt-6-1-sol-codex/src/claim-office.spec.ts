import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
const quote = (items: Item[]) => ({ op: 'quote', items });
const claim = (policy: number, damages: { itemType: string; amount: number }[]) =>
  ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
function cli(steps: unknown[], yearsWithMHPCO = 0) {
  return spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
  });
}
function results(steps: unknown[], years = 0) {
  const output = cli(steps, years);
  expect(output.status, output.stderr).toBe(0);
  expect(output.stderr).toBe('');
  return JSON.parse(output.stdout).results;
}
function rejects(steps: unknown[]) {
  const output = cli(steps);
  expect(output.status).not.toBe(0);
  expect(output.stderr.trim().length).toBeGreaterThan(0);
  expect(output.stdout).toBe('');
}

describe('MHPCO claim office', () => {
  it('empty items cost 5 G through the claim-office CLI', () => {
    expect(results([quote([])])).toEqual([{ premium: 5 }]);
  });
  it('plain sword first quote costs 115 G', () => {
    expect(results([quote([{ type: 'sword' }])])).toEqual([{ premium: 115 }]);
  });
  it('plain amulet costs 71 G and has cap 1200 G', () => {
    expect(results([quote([{ type: 'amulet' }]), claim(0, [])])).toEqual([
      { premium: 71 }, { payout: 0, remainingCap: 1200 },
    ]);
  });
  it('plain staff costs 93 G and has cap 1600 G', () => {
    expect(results([quote([{ type: 'staff' }]), claim(0, [])])).toEqual([
      { premium: 93 }, { payout: 0, remainingCap: 1600 },
    ]);
  });
  it('plain potion costs 49 G and has cap 800 G', () => {
    expect(results([quote([{ type: 'potion' }]), claim(0, [])])).toEqual([
      { premium: 49 }, { payout: 0, remainingCap: 800 },
    ]);
  });
  it('one rune costs 33 G and has cap 500 G', () => {
    expect(results([quote([{ type: 'rune' }]), claim(0, [])])).toEqual([
      { premium: 33 }, { payout: 0, remainingCap: 500 },
    ]);
  });
  it('one moonstone costs 33 G and has cap 500 G', () => {
    expect(results([quote([{ type: 'moonstone' }]), claim(0, [])])).toEqual([
      { premium: 33 }, { payout: 0, remainingCap: 500 },
    ]);
  });
  it('2 runes base 50 G yield premium 60 G', () => {
    expect(results([quote(Array.from({ length: 2 }, () => ({ type: 'rune' })))])).toEqual([{ premium: 60 }]);
  });
  it('3 runes base 60 G yield premium 71 G', () => {
    expect(results([quote(Array.from({ length: 3 }, () => ({ type: 'rune' })))])).toEqual([{ premium: 71 }]);
  });
  it('4 runes base 100 G yield premium 115 G', () => {
    expect(results([quote(Array.from({ length: 4 }, () => ({ type: 'rune' })))])).toEqual([{ premium: 115 }]);
  });
  it('7 runes base 175 G yield premium 198 G rounded up', () => {
    expect(results([quote(Array.from({ length: 7 }, () => ({ type: 'rune' })))])).toEqual([{ premium: 198 }]);
  });
  it('2 runes and 1 moonstone base 75 G yield premium 88 G', () => {
    expect(results([quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])])).toEqual([{ premium: 88 }]);
  });
  it('3 runes and 3 moonstones base 120 G yield premium 137 G', () => {
    const items = ['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type })));
    expect(results([quote(items)])).toEqual([{ premium: 137 }]);
  });
  it('newcomer cursed steel sword enchantment 3 costs 165 G', () => {
    expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it('cursed sword and plain amulet base 160 G cost 231 G', () => {
    expect(results([quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])])).toEqual([{ premium: 231 }]);
  });
  it('exactly 2 years loyalty makes plain sword cost 95 G', () => {
    expect(results([quote([{ type: 'sword' }])], 2)).toEqual([{ premium: 95 }]);
  });
  it('1 year has no loyalty discount and costs 115 G', () => {
    expect(results([quote([{ type: 'sword' }])], 1)).toEqual([{ premium: 115 }]);
  });
  it('enchantment 5 sword costs 145 G and cursed costs 195 G', () => {
    expect(results([quote([{ type: 'sword', enchantment: 5 }])])).toEqual([{ premium: 145 }]);
    expect(results([quote([{ type: 'sword', enchantment: 5, cursed: true }])])).toEqual([{ premium: 195 }]);
  });
  it('enchantment 4 sword costs 115 G and cursed costs 165 G', () => {
    expect(results([quote([{ type: 'sword', enchantment: 4 }])])).toEqual([{ premium: 115 }]);
    expect(results([quote([{ type: 'sword', enchantment: 4, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it('loyal second quote cursed enchantment 7 new sword costs 160 G', () => {
    expect(results([quote([{ type: 'amulet' }]), quote([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }])], 3))
      .toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it('follow-up discount begins after first quote, not after a claim', () => {
    const sword = quote([{ type: 'sword' }]);
    expect(results([sword, claim(0, []), sword, sword])).toEqual([
      { premium: 115 }, { payout: 0, remainingCap: 2000 }, { premium: 100 }, { premium: 100 },
    ]);
  });
  it('regular steel sword enchantment 3 damage 500 pays 400 remaining 1600 G', () => {
    expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 3 }]), claim(0, [{ itemType: 'sword', amount: 500 }])])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('rune damage 200 pays 100 remaining 400 G', () => {
    expect(results([quote([{ type: 'rune' }]), claim(0, [{ itemType: 'rune', amount: 200 }])])[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it('dragon enchantment 8 damage 1000 pays 400 G', () => {
    expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 8 }]), claim(0, [{ itemType: 'sword', amount: 1000 }])])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('dragon enchantment 9 damage 1000 pays 400 G', () => {
    expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 9 }]), claim(0, [{ itemType: 'sword', amount: 1000 }])])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('dragon enchantment 5 damage 800 pays 700 G', () => {
    expect(results([quote([{ type: 'sword', material: 'dragon', enchantment: 5 }]), claim(0, [{ itemType: 'sword', amount: 800 }])])[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('steel enchantment 9 damage 1000 pays 400 G', () => {
    expect(results([quote([{ type: 'sword', material: 'steel', enchantment: 9 }]), claim(0, [{ itemType: 'sword', amount: 1000 }])])[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('sword 500 and amulet 300 damage pay 600 with cap remaining 2600 G', () => {
    expect(results([quote([{ type: 'sword' }, { type: 'amulet' }]),
      claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])])[1])
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('two swords cap 4000 G and two damage entries each deduct 100 G', () => {
    const damages = [{ itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 1000 }];
    expect(results([quote([{ type: 'sword' }, { type: 'sword', enchantment: 9 }]), claim(0, []), claim(0, damages)]).slice(1))
      .toEqual([{ payout: 0, remainingCap: 4000 }, { payout: 1300, remainingCap: 2700 }]);
    expect(results([quote([{ type: 'sword' }, { type: 'sword' }]), claim(0, damages)])[1])
      .toEqual({ payout: 1800, remainingCap: 2200 });
  });
  it('cursed sword premium 165 G does not change cap 2000 G', () => {
    expect(results([quote([{ type: 'sword', cursed: true }]), claim(0, [])])).toEqual([
      { premium: 165 }, { payout: 0, remainingCap: 2000 },
    ]);
  });
  it('sword and 3 runes insurance sum 1750 G yields cap 3500 G', () => {
    const items = [{ type: 'sword' }, ...Array.from({ length: 3 }, () => ({ type: 'rune' }))];
    expect(results([quote(items), claim(0, [])])).toEqual([
      { premium: 181 }, { payout: 0, remainingCap: 3500 },
    ]);
  });
  it('successive sword claims 1500 pay 1400 then 600 remaining 0 G', () => {
    const damage = claim(0, [{ itemType: 'sword', amount: 1500 }]);
    expect(results([quote([{ type: 'sword' }]), damage, damage, damage]).slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
    ]);
  });
  it('fractional high enchantment payout 350.5 rounds down to 350 G', () => {
    expect(results([quote([{ type: 'sword', enchantment: 8 }]), claim(0, [{ itemType: 'sword', amount: 901 }])])[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('fractional reimbursements are summed before final rounding', () => {
    const items = [{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }];
    const damages = [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }];
    expect(results([quote(items), claim(0, damages)])[1]).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it('damage below deductible pays zero without increasing cap', () => {
    expect(results([quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: 50 }])])[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
    expect(results([quote([{ type: 'sword' }, { type: 'amulet' }]),
      claim(0, [{ itemType: 'sword', amount: 50 }, { itemType: 'amulet', amount: 300 }])])[1])
      .toEqual({ payout: 200, remainingCap: 3000 });
  });
  it('unknown quote type rejects with nonzero CLI status stderr and no stdout', () => {
    rejects([quote([{ type: 'sword' }]), quote([{ type: 'broomstick' }])]);
    rejects([quote([{ type: 'constructor' }])]);
    rejects([quote([{ type: '__proto__' }])]);
  });
  it('uninsured amulet claim rejects with nonzero status stderr and no stdout', () => {
    rejects([quote([{ type: 'sword' }]), claim(0, [{ itemType: 'amulet', amount: 500 }])]);
  });
  it('unknown damage type rejects with nonzero status stderr and no stdout', () => {
    rejects([quote([{ type: 'sword' }]), claim(0, [{ itemType: 'broomstick', amount: 500 }])]);
  });
  it('excess same-type damages reject whole claim with nonzero status stderr no stdout', () => {
    rejects([quote([{ type: 'sword' }]), claim(0, [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
    ])]);
  });
  it('negative damage -200 rejects with nonzero status stderr no stdout', () => {
    rejects([quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: -200 }])]);
  });
  it('schema example silver amulet quote 59 G then payout 100 remaining 1100 G', () => {
    expect(results([
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ], 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it('policy references use step indexes and maintain independent caps', () => {
    expect(results([
      quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: 500 }]),
      quote([{ type: 'amulet' }]), claim(2, [{ itemType: 'amulet', amount: 200 }]),
      claim(0, [{ itemType: 'sword', amount: 1500 }]),
    ])).toEqual([
      { premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 },
      { payout: 100, remainingCap: 1100 }, { payout: 1400, remainingCap: 200 },
    ]);
  });
});
