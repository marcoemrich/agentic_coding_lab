import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';

function cli(steps: unknown[], yearsWithMHPCO = 0) {
  const result = spawnSync('./claim-office', [], {
    input: JSON.stringify({ customer: { yearsWithMHPCO }, steps }), encoding: 'utf8',
  });
  return result;
}

function quote(items: object[]) { return { op: 'quote', items }; }
function claim(policy: number, damages: object[]) {
  return { op: 'claim', policy, incident: { cause: 'dragon attack', damages } };
}
function result(steps: unknown[], yearsWithMHPCO = 0) {
  const response = cli(steps, yearsWithMHPCO);
  expect(response.status, response.stderr).toBe(0);
  return JSON.parse(response.stdout).results;
}

describe('MHPCO claim office CLI', () => {
  it('empty items: quote premium 5 G fee', () => {
    expect(result([quote([])])).toEqual([{ premium: 5 }]);
  });
  it.each([
    ['sword', 100, 1000], ['amulet', 60, 600], ['staff', 80, 800],
    ['potion', 40, 400], ['rune', 25, 250], ['moonstone', 25, 250],
  ])('%s base %i G and insurance value %i G', (type, base, value) => {
    expect(result([quote([{ type }]), claim(0, [])])).toEqual([
      { premium: Math.ceil(base * 110 / 100 + 5) }, { payout: 0, remainingCap: value * 2 },
    ]);
  });
  it.each([
    [2, 0, 60], [3, 0, 71], [4, 0, 115], [7, 0, 198],
    [2, 1, 88], [3, 3, 137],
  ])('%i runes and %i moonstones quote %i G (base 50/60/100/175/75/120 G)', (runes, stones, premium) => {
    const items = [...Array(runes).fill({ type: 'rune' }), ...Array(stones).fill({ type: 'moonstone' })];
    expect(result([quote(items)])).toEqual([{ premium }]);
  });
  it('cursed sword and plain amulet base 160 G plus 50 G item surcharge', () => {
    expect(result([quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])])).toEqual([{ premium: 231 }]);
  });
  it('enchantment 4 sword has no enchantment surcharge', () => {
    expect(result([quote([{ type: 'sword', enchantment: 4 }])])).toEqual([{ premium: 115 }]);
  });
  it('enchantment 5 sword has 30 G surcharge', () => {
    expect(result([quote([{ type: 'sword', enchantment: 5 }])])).toEqual([{ premium: 145 }]);
  });
  it('cursed enchantment 5 sword has both 50 G and 30 G surcharges', () => {
    expect(result([quote([{ type: 'sword', enchantment: 5, cursed: true }])])).toEqual([{ premium: 195 }]);
  });
  it('exactly 2 years gives 20 percent policy-base loyalty discount', () => {
    expect(result([quote([{ type: 'sword' }])], 2)).toEqual([{ premium: 95 }]);
  });
  it('first insurance adds 10 percent of policy base per quote, even for old customer', () => {
    expect(result([quote([{ type: 'sword' }])], 3)).toEqual([{ premium: 95 }]);
  });
  it('second contract subtracts 15 percent of policy base', () => {
    expect(result([quote([{ type: 'sword' }]), quote([{ type: 'sword' }])])).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it('newcomer cursed steel sword enchantment 3 costs 165 G', () => {
    expect(result([quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])])).toEqual([{ premium: 165 }]);
  });
  it('long-standing second quote cursed sword enchantment 7 costs 160 G', () => {
    expect(result([quote([]), quote([{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }])], 3)).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it('fractional premium 197.5 G rounds up to 198 G only at end', () => {
    expect(result([quote(Array(7).fill({ type: 'rune' }))])).toEqual([{ premium: 198 }]);
  });
  it('unknown broomstick quote exits nonzero with stderr and no results stdout', () => {
    const response = cli([quote([{ type: 'broomstick' }])]);
    expect(response.status).not.toBe(0);
    expect(response.stderr).toMatch(/broomstick|unknown/i);
    expect(response.stdout).toBe('');
  });
  it.each([
    [{ type: 'sword', material: 'steel', enchantment: 3 }, 500, 400],
    [{ type: 'rune' }, 200, 100],
    [{ type: 'sword', material: 'dragon', enchantment: 5 }, 800, 700],
    [{ type: 'sword', material: 'steel', enchantment: 9 }, 1000, 400],
    [{ type: 'sword', material: 'dragon', enchantment: 8 }, 1000, 400],
    [{ type: 'sword', material: 'dragon', enchantment: 9 }, 1000, 400],
  ])('%j damage %i G pays %i G', (item, amount, payout) => {
    const results = result([quote([item]), claim(0, [{ itemType: item.type, amount }])]);
    expect(results[1].payout).toBe(payout);
  });
  it('sword and amulet damage 500 G and 300 G pays 600 G: two deductibles', () => {
    const results = result([quote([{ type: 'sword' }, { type: 'amulet' }]),
      claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])]);
    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('two swords have sum 2000 G and cap 4000 G', () => {
    expect(result([quote([{ type: 'sword' }, { type: 'sword' }]), claim(0, [])])[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it('two sword damages use separate deductibles', () => {
    expect(result([quote([{ type: 'sword' }, { type: 'sword' }]),
      claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])])[1])
      .toEqual({ payout: 600, remainingCap: 3400 });
  });
  it('two sword damages with one insured sword reject whole claim nonzero', () => {
    const response = cli([quote([{ type: 'sword' }]),
      claim(0, [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])]);
    expect(response.status).not.toBe(0);
    expect(response.stdout).toBe('');
  });
  it('sword and amulet sum 1600 G has cap 3200 G', () => {
    expect(result([quote([{ type: 'sword' }, { type: 'amulet' }]), claim(0, [])])[1].remainingCap).toBe(3200);
  });
  it('cursed sword premium 165 G still has cap 2000 G', () => {
    expect(result([quote([{ type: 'sword', cursed: true }]), claim(0, [])]))
      .toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it('sword and three runes sum 1750 G despite block premium', () => {
    expect(result([quote([{ type: 'sword' }, ...Array(3).fill({ type: 'rune' })]), claim(0, [])]))
      .toEqual([{ premium: 181 }, { payout: 0, remainingCap: 3500 }]);
  });
  it('successive sword claims 1500 G pay 1400 G then 600 G, cap 0 G', () => {
    expect(result([quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: 1500 }]),
      claim(0, [{ itemType: 'sword', amount: 1500 }])]).slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it('fractional payout 350.5 G rounds down to 350 G only at end', () => {
    expect(result([quote([{ type: 'sword', enchantment: 8 }]),
      claim(0, [{ itemType: 'sword', amount: 901 }])])[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it.each(['amulet', 'broomstick'])('%s damage not insured rejects claim nonzero with stderr', (itemType) => {
    const response = cli([quote([{ type: 'sword' }]), claim(0, [{ itemType, amount: 200 }])]);
    expect(response.status).not.toBe(0);
    expect(response.stderr).toMatch(/uninsured|unknown/i);
    expect(response.stdout).toBe('');
  });
  it('negative damage -200 rejects claim nonzero with stderr', () => {
    const response = cli([quote([{ type: 'sword' }]), claim(0, [{ itemType: 'sword', amount: -200 }])]);
    expect(response.status).not.toBe(0);
    expect(response.stderr).toMatch(/damage|negative|amount/i);
    expect(response.stdout).toBe('');
  });
  it('schema example: quote then fire claim yields ordered integer results', () => {
    const steps = [quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]),
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }];
    expect(result(steps, 5)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
});
