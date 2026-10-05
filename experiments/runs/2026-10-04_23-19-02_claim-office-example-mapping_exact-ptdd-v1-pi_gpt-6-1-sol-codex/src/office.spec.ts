import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario, type Item, type Damage, type Scenario } from './office.js';

function quote(items: Item[], yearsWithMHPCO = 0) {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0].premium;
}

function claim(items: Item[], damages: Damage[], yearsWithMHPCO = 0) {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [
    { op: 'quote', items },
    { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
  ] }).results[1];
}

function cli(scenario: Scenario) {
  return spawnSync('./claim-office', [], { input: JSON.stringify(scenario), encoding: 'utf8' });
}

function expectRejected(scenario: Scenario) {
  const output = cli(scenario);
  expect(output.error).toBeUndefined();
  expect(output.status).not.toBe(0);
  expect(output.stderr.trim()).not.toBe('');
  expect(output.stdout).toBe('');
}

describe('MHPCO claim office', () => {
  it('01 empty quote costs 5 G', () => {
    expect(quote([])).toBe(5);
  });
  it('02 plain sword costs 115 G on first quote', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });
  it('03 plain amulet costs 71 G', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });
  it('04 plain staff costs 93 G', () => {
    expect(quote([{ type: 'staff' }])).toBe(93);
  });
  it('05 plain potion costs 49 G', () => {
    expect(quote([{ type: 'potion' }])).toBe(49);
  });
  it('06 two runes base 50 G, premium 60 G', () => {
    expect(quote(Array.from({ length: 2 }, () => ({ type: 'rune' })))).toBe(60);
  });
  it('07 three runes base 60 G, premium 71 G', () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: 'rune' })))).toBe(71);
  });
  it('08 four runes base 100 G, premium 115 G', () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: 'rune' })))).toBe(115);
  });
  it('09 seven runes base 175 G, premium 198 G', () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: 'rune' })))).toBe(198);
  });
  it('10 two runes and moonstone base 75 G, premium 88 G', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(88);
  });
  it('11 three runes and three moonstones base 120 G, premium 137 G', () => {
    expect(quote(['rune', 'moonstone'].flatMap(type => Array.from({ length: 3 }, () => ({ type }))))).toBe(137);
  });
  it('12 cursed newcomer sword enchantment 3 costs 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });
  it('13 cursed sword and plain amulet cost 231 G, curse adds only 50 G', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });
  it('14 exactly two customer years discounts sword to 95 G', () => {
    expect(quote([{ type: 'sword' }], 2)).toBe(95);
  });
  it('15 one customer year gives no loyalty, sword 115 G', () => {
    expect(quote([{ type: 'sword' }], 1)).toBe(115);
  });
  it('16 sword enchantment exactly five costs 145 G', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });
  it('17 cursed sword enchantment five costs 195 G', () => {
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });
  it('18 sword enchantment four costs 115 G', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });
  it('19 cursed sword enchantment four costs 165 G', () => {
    expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
  });
  it('20 second quote with three-year customer cursed sword enchantment seven costs 160 G', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it('21 steel sword enchantment three damage 500 pays 400, remaining cap 1600', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('22 rune damage 200 pays 100, remaining cap 400', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('23 amulet damage 200 pays 100, remaining cap 1100, schema example premium 59', () => {
    const item = { type: 'amulet', material: 'silver', enchantment: 2, cursed: false };
    expect(quote([item], 5)).toBe(59);
    expect(claim([item], [{ itemType: 'amulet', amount: 200 }], 5)).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it('24 staff insurance value 800 gives cap 1600', () => {
    expect(claim([{ type: 'staff' }], [])).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it('25 potion insurance value 400 gives cap 800', () => {
    expect(claim([{ type: 'potion' }], [])).toEqual({ payout: 0, remainingCap: 800 });
  });
  it('26 moonstone insurance value 250 gives cap 500', () => {
    expect(claim([{ type: 'moonstone' }], [])).toEqual({ payout: 0, remainingCap: 500 });
  });
  it('27 dragon sword enchantment exactly eight damage 1000 pays 400', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('28 dragon sword enchantment nine damage 1000 pays 400', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('29 dragon sword enchantment five damage 800 pays 700', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('30 steel sword enchantment nine damage 1000 pays 400', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('31 sword damage 500 plus amulet damage 300 pays 600, remaining cap 2600', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('32 two swords give cap 4000 and two damage 500 entries pay 800', () => {
    const items = [{ type: 'sword' }, { type: 'sword' }];
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 4000 });
    expect(claim(items, [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it('33 cursed sword premium 165 still gives cap 2000', () => {
    const items = [{ type: 'sword', cursed: true }];
    expect(quote(items)).toBe(165);
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('34 sword and three runes give cap 3500', () => {
    const items = [{ type: 'sword' }, ...Array.from({ length: 3 }, () => ({ type: 'rune' }))];
    expect(quote(items)).toBe(181);
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it('35 successive sword claims 1500 pay 1400 then 600, caps 600 then zero', () => {
    const damage = { op: 'claim' as const, policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] }, damage, damage, damage,
    ] }).results).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 },
    ]);
  });
  it('36 fractional payout 350.5 rounds down to 350', () => {
    expect(claim([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('37 intermediate payout fractions aggregate before rounding to 701', () => {
    expect(claim([{ type: 'sword', enchantment: 9 }, { type: 'sword', enchantment: 9 }], [
      { itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 },
    ])).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it('38 damage below deductible pays zero and never increases cap', () => {
    expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(claim([{ type: 'sword' }, { type: 'sword' }], [
      { itemType: 'sword', amount: 50 }, { itemType: 'sword', amount: 500 },
    ])).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it('39 claim references quote step index, not quote ordinal; results preserve order', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      { op: 'quote', items: [{ type: 'sword' }] },
    ] }).results).toEqual([
      { premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 },
      { payout: 100, remainingCap: 1100 }, { premium: 100 },
    ]);
  });
  it('40 claim-office CLI accepts stdin JSON and writes schema example results', () => {
    const output = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(output.status).toBe(0);
    expect(output.stderr).toBe('');
    expect(JSON.parse(output.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('41 unknown broomstick quote exits nonzero with stderr and no stdout results', () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'broomstick' }] },
    ] });
  });
  it('42 uninsured amulet claim exits nonzero with stderr', () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
  });
  it('43 unknown item damage exits nonzero with stderr', () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } },
    ] });
  });
  it('44 excess sword damage entries reject whole claim with nonzero exit and stderr', () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
        { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
      ] } },
    ] });
  });
  it('45 negative damage -200 exits nonzero with stderr', () => {
    expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
    ] });
  });
  it('46 enchanted sword and plain amulet cost 211 G, enchantment surcharge only on sword', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }, { type: 'amulet' }])).toBe(211);
  });
  it('47 loyal customer cursed enchanted sword and amulet cost 229 G, discounts use base only', () => {
    expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }, { type: 'amulet' }], 2)).toBe(229);
  });
  it('48 two cursed runes cost 85 G, fractional risk intermediates stay unrounded', () => {
    expect(quote([{ type: 'rune', cursed: true }, { type: 'rune', cursed: true }])).toBe(85);
  });
});
