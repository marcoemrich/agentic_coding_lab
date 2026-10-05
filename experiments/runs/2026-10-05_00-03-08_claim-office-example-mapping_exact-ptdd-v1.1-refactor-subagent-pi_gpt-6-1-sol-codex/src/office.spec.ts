import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario, type Item, type Step } from './office.js';

function cli(steps: Step[], years = 0) {
  return spawnSync('./claim-office', { input: JSON.stringify({ customer: { yearsWithMHPCO: years }, steps }), encoding: 'utf8' });
}
function quote(items: Item[], years = 0) {
  return runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
}
function components(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}
function claimSteps(items: Item[], damages: { itemType: string; amount: number }[]): Step[] {
  return [{ op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } }];
}
function claim(items: Item[], damages: { itemType: string; amount: number }[]) {
  return runScenario({ customer: { yearsWithMHPCO: 0 }, steps: claimSteps(items, damages) }).results[1];
}
function rejects(steps: Step[]) {
  const result = cli(steps);
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
}

describe('MHPCO claim-office CLI', () => {
  it('01 empty items cost 5 G', () => {
    const result = cli([{ op: 'quote', items: [] }]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it('02 sword base 100: newcomer premium 115 G', () => {
    expect(quote([{ type: 'sword' }])).toEqual({ premium: 115 });
  });
  it('03 amulet base 60: newcomer premium 71 G', () => {
    expect(quote([{ type: 'amulet' }])).toEqual({ premium: 71 });
  });
  it('04 staff base 80: newcomer premium 93 G', () => {
    expect(quote([{ type: 'staff' }])).toEqual({ premium: 93 });
  });
  it('05 potion base 40: newcomer premium 49 G', () => {
    expect(quote([{ type: 'potion' }])).toEqual({ premium: 49 });
  });
  it('06 rune base 25: newcomer premium 33 G (round 32.5 up)', () => {
    expect(quote([{ type: 'rune' }])).toEqual({ premium: 33 });
  });
  it('07 moonstone base 25: newcomer premium 33 G', () => {
    expect(quote([{ type: 'moonstone' }])).toEqual({ premium: 33 });
  });
  it('08 two runes base 50: premium 60 G', () => {
    expect(quote(components('rune', 2))).toEqual({ premium: 60 });
  });
  it('09 three runes base 60: premium 71 G', () => {
    expect(quote(components('rune', 3))).toEqual({ premium: 71 });
  });
  it('10 four runes base 100: premium 115 G (exactly three only)', () => {
    expect(quote(components('rune', 4))).toEqual({ premium: 115 });
  });
  it('11 seven runes base 175: premium 198 G (197.5 up)', () => {
    expect(quote(components('rune', 7))).toEqual({ premium: 198 });
  });
  it('12 two runes and one moonstone base 75: premium 88 G', () => {
    expect(quote([...components('rune', 2), { type: 'moonstone' }])).toEqual({ premium: 88 });
  });
  it('13 three runes and three moonstones base 120: premium 137 G', () => {
    expect(quote([...components('rune', 3), ...components('moonstone', 3)])).toEqual({ premium: 137 });
  });
  it('14 cursed sword enchantment 3 newcomer costs 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it('15 cursed sword and plain amulet cost 231 G (210 before assessment and fee)', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
  });
  it('16 exactly two years earns loyalty: sword premium 95 G', () => {
    expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 });
    expect(quote([{ type: 'sword' }], 1)).toEqual({ premium: 115 });
  });
  it('17 enchantment exactly five: sword premium 145 G', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it('18 cursed enchantment five: sword premium 195 G (additive risks)', () => {
    const sword = { type: 'sword', cursed: true, enchantment: 5 };
    expect(quote([sword])).toEqual({ premium: 195 });
    expect(quote([sword, { type: 'amulet' }])).toEqual({ premium: 261 });
  });
  it('19 enchantment four costs 115 G plain and 165 G cursed', () => {
    expect(quote([{ type: 'sword', enchantment: 4, cursed: false }])).toEqual({ premium: 115 });
    expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it('20 second quote for three-year customer cursed enchantment seven costs 160 G; first costs 175 G', () => {
    const items = [{ type: 'sword', material: 'steel', cursed: true, enchantment: 7 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: 'quote', items }, { op: 'quote', items }, { op: 'quote', items }] })).toEqual({ results: [{ premium: 175 }, { premium: 160 }, { premium: 160 }] });
  });
  it('21 unknown quote type rejects: nonzero exit, stderr description, empty stdout', () => {
    rejects([{ op: 'quote', items: [{ type: 'broomstick' }] }]);
  });
  it('22 regular steel sword enchantment three damage 500 pays 400 G, remaining cap 1600 G', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('23 rune damage 200 pays 100 G, remaining cap 400 G', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('24 moonstone damage 200 pays 100 G, remaining cap 400 G', () => {
    expect(claim([{ type: 'moonstone' }], [{ itemType: 'moonstone', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('25 staff damage 200 pays 100 G, remaining cap 1500 G', () => {
    expect(claim([{ type: 'staff' }], [{ itemType: 'staff', amount: 200 }])).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it('26 potion damage 200 pays 100 G, remaining cap 700 G', () => {
    expect(claim([{ type: 'potion' }], [{ itemType: 'potion', amount: 200 }])).toEqual({ payout: 100, remainingCap: 700 });
  });
  it('27 schema example silver amulet: quote 59 G, damage 200 pays 100 G, remaining cap 1100 G', () => {
    const steps = claimSteps([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }], [{ itemType: 'amulet', amount: 200 }]);
    const result = cli(steps, 5);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('28 dragon sword enchantment eight damage 1000 pays 400 G', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('29 dragon sword enchantment nine damage 1000 pays 400 G', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('30 dragon sword enchantment five damage 800 pays 700 G', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('31 steel sword enchantment nine damage 1000 pays 400 G', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('32 dragon attack sword 500 and amulet 300 pays 600 G, remaining cap 2600 G', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('33 two swords insurance sum 2000: separate damage deductibles, payout 600 G, remaining cap 3400 G', () => {
    expect(claim([{ type: 'sword' }, { type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it('34 excess sword damages rejects whole claim: nonzero exit and stderr', () => {
    rejects(claimSteps([{ type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }]));
  });
  it('35 cursed sword premium 165 but cap 2000: large claim pays 2000 G', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: claimSteps([{ type: 'sword', cursed: true, enchantment: 3 }], [{ itemType: 'sword', amount: 5000 }]) })).toEqual({ results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }] });
  });
  it('36 sword and three runes insurance sum 1750: cap 3500 G despite block discount', () => {
    const items = [{ type: 'sword' }, ...components('rune', 3)];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: claimSteps(items, [{ itemType: 'sword', amount: 5000 }]) })).toEqual({ results: [{ premium: 181 }, { payout: 3500, remainingCap: 0 }] });
  });
  it('37 successive sword claims 1500 pay 1400 then 600 G; remaining cap 600 then 0 G', () => {
    const steps = claimSteps([{ type: 'sword' }], [{ itemType: 'sword', amount: 1500 }]);
    steps.push(steps[1], steps[1]);
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }] });
  });
  it('38 enchanted sword damage 901 pays 350 G (350.5 down)', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('39 two enchanted damages 901 retain fractions: total payout 701 G', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it('40 uninsured amulet rejects: nonzero exit and stderr', () => {
    rejects(claimSteps([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }]));
  });
  it('41 unknown damage type rejects: nonzero exit and stderr', () => {
    rejects(claimSteps([{ type: 'sword' }], [{ itemType: 'broomstick', amount: 200 }]));
  });
  it('42 negative damage -200 rejects: nonzero exit and stderr', () => {
    rejects(claimSteps([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }]));
  });
  it('43 quote policy referenced by step index after intervening claims: results retain order', () => {
    const steps: Step[] = [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
    ];
    const result = cli(steps);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 1400, remainingCap: 200 }] });
  });
});
