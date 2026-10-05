import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { basePremium, insuranceSum, runScenario, type Damage, type Item, type Scenario } from './office.js';

function cli(scenario: Scenario) {
  return spawnSync('./claim-office', { input: JSON.stringify(scenario), encoding: 'utf8' });
}
function expectRejected(scenario: Scenario) {
  const result = cli(scenario);
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim().length).toBeGreaterThan(0);
  expect(result.stdout).toBe('');
}
function copies(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}
function quote(items: Item[], years = 0) {
  return runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0].premium;
}

function claim(items: Item[], damages: Damage[]) {
  return runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
  ] }).results[1];
}

describe('MHPCO', () => {
  it('empty quote costs 5 G', () => { expect(quote([])).toBe(5); });
  it('sword base 100 G', () => { expect(basePremium([{ type: 'sword' }])).toBe(100); });
  it('amulet base 60 G', () => { expect(basePremium([{ type: 'amulet' }])).toBe(60); });
  it('staff base 80 G', () => { expect(basePremium([{ type: 'staff' }])).toBe(80); });
  it('potion base 40 G', () => { expect(basePremium([{ type: 'potion' }])).toBe(40); });
  it('rune base 25 G', () => { expect(basePremium([{ type: 'rune' }])).toBe(25); });
  it('moonstone base 25 G', () => { expect(basePremium([{ type: 'moonstone' }])).toBe(25); });
  it('2 runes base 50 G', () => { expect(basePremium(copies('rune', 2))).toBe(50); });
  it('3 runes base 60 G', () => { expect(basePremium(copies('rune', 3))).toBe(60); });
  it('4 runes base 100 G', () => { expect(basePremium(copies('rune', 4))).toBe(100); });
  it('7 runes base 175 G', () => { expect(basePremium(copies('rune', 7))).toBe(175); });
  it('2 runes and 1 moonstone base 75 G', () => { expect(basePremium([...copies('rune', 2), ...copies('moonstone', 1)])).toBe(75); });
  it('3 runes and 3 moonstones base 120 G', () => { expect(basePremium([...copies('rune', 3), ...copies('moonstone', 3)])).toBe(120); });
  it('newcomer cursed sword costs 165 G', () => { expect(quote([{ type: 'sword', cursed: true, material: 'steel', enchantment: 3 }])).toBe(165); });
  it('cursed sword and plain amulet costs 231 G with item-scoped curse', () => { expect(basePremium([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(160); expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231); });
  it('exactly 2 years gives sword premium 95 G', () => { expect(quote([{ type: 'sword' }], 2)).toBe(95); expect(quote([{ type: 'sword' }], 1)).toBe(115); });
  it('enchantment 5 sword costs 145 G', () => { expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145); });
  it('cursed enchantment 5 sword costs 195 G', () => { expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195); });
  it('enchantment 4 plain sword costs 115 G', () => { expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115); });
  it('enchantment 4 cursed sword costs 165 G', () => { expect(quote([{ type: 'sword', cursed: true, enchantment: 4 }])).toBe(165); });
  it('second quote at 3 years cursed enchantment 7 sword costs 160 G', () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [] }, { op: 'quote', items: [{ type: 'sword', cursed: true, material: 'steel', enchantment: 7 }] },
    ] });
    expect(result.results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it('premium 197.5 rounds up to 198 G', () => { expect(quote([{ type: 'sword', cursed: true, enchantment: 5 }, { type: 'rune' }], 2)).toBe(198); });
  it('sword insurance sum 1000 G', () => { expect(insuranceSum([{ type: 'sword' }])).toBe(1000); expect(quote(copies('sword', 1))).toBe(115); expect(claim(copies('sword', 1), [])).toEqual({ payout: 0, remainingCap: 2000 }); });
  it('amulet insurance sum 600 G', () => { expect(insuranceSum([{ type: 'amulet' }])).toBe(600); expect(quote(copies('amulet', 1))).toBe(71); expect(claim(copies('amulet', 1), [])).toEqual({ payout: 0, remainingCap: 1200 }); });
  it('staff insurance sum 800 G', () => { expect(insuranceSum([{ type: 'staff' }])).toBe(800); expect(quote(copies('staff', 1))).toBe(93); expect(claim(copies('staff', 1), [])).toEqual({ payout: 0, remainingCap: 1600 }); });
  it('potion insurance sum 400 G', () => { expect(insuranceSum([{ type: 'potion' }])).toBe(400); expect(quote(copies('potion', 1))).toBe(49); expect(claim(copies('potion', 1), [])).toEqual({ payout: 0, remainingCap: 800 }); });
  it('rune insurance sum 250 G', () => { expect(insuranceSum([{ type: 'rune' }])).toBe(250); expect(quote(copies('rune', 1))).toBe(33); expect(claim(copies('rune', 1), [])).toEqual({ payout: 0, remainingCap: 500 }); });
  it('moonstone insurance sum 250 G', () => { expect(insuranceSum([{ type: 'moonstone' }])).toBe(250); expect(quote(copies('moonstone', 1))).toBe(33); expect(claim(copies('moonstone', 1), [])).toEqual({ payout: 0, remainingCap: 500 }); });
  it('two swords sum 2000 G cap 4000 G', () => { const items = copies('sword', 2); expect(insuranceSum(items)).toBe(2000); expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 4000 }); });
  it('sword and amulet sum 1600 G cap 3200 G', () => { const items = [{ type: 'sword' }, { type: 'amulet' }]; expect(insuranceSum(items)).toBe(1600); expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 3200 }); });
  it('cursed sword premium 165 G retains cap 2000 G', () => { const items = [{ type: 'sword', cursed: true }]; expect(quote(items)).toBe(165); expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 2000 }); });
  it('sword and 3 runes sum 1750 G cap 3500 G', () => { const items = [...copies('sword', 1), ...copies('rune', 3)]; expect(basePremium(items)).toBe(160); expect(insuranceSum(items)).toBe(1750); expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 3500 }); });
  it('regular steel enchantment 3 sword damage 500 pays 400 G', () => { expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
  it('rune damage 200 pays 100 G', () => { expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 }); });
  it('dragon enchantment 8 sword damage 1000 pays 400 G', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
  it('dragon enchantment 9 sword damage 1000 pays 400 G', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
  it('dragon enchantment 5 sword damage 800 pays 700 G', () => { expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 }); });
  it('steel enchantment 9 sword damage 1000 pays 400 G', () => { expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 }); });
  it('sword 500 and amulet 300 damages pay 600 G with separate deductibles', () => { expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 }); });
  it('two sword damage entries each get a deductible', () => { expect(claim([{ type: 'sword', enchantment: 3 }, { type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }])).toEqual({ payout: 450, remainingCap: 3550 }); });
  it('successive 1500 G claims pay 1400 then 600 G and exhaust cap', () => {
    const incident = { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident }, { op: 'claim', policy: 0, incident }, { op: 'claim', policy: 0, incident },
    ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
  });
  it('payout 350.5 rounds down to 350 G', () => { expect(claim([{ type: 'sword', enchantment: 9 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 }); });
  it('payout fractions are retained until final event rounding', () => { expect(claim([{ type: 'sword', enchantment: 9 }, { type: 'amulet', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'amulet', amount: 901 }])).toEqual({ payout: 701, remainingCap: 2499 }); });
  it('schema CLI example produces premium 59 payout 100 remainingCap 1100', () => {
    const result = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(result.status).toBe(0); expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('policy references quote step index rather than quote count', () => {
    const result = cli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }, { payout: 100, remainingCap: 1100 }, { payout: 100, remainingCap: 1500 }] });
  });
  it('CLI unknown quoted broomstick exits nonzero with stderr and no stdout results', () => { expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] }); });
  it('CLI uninsured amulet damage rejects with stderr and nonzero status', () => { expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }] }); });
  it('CLI unknown damage type rejects with stderr and nonzero status', () => { expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }] }); });
  it('CLI negative damage rejects with stderr and nonzero status', () => { expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }] }); });
  it('CLI excess sword damage entries rejects the whole claim', () => { expectRejected({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'sword' }] }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }] } }] }); });
});
