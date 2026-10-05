import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario, type Item, type Damage, type Scenario } from './office.js';

function quote(items: Item[], years = 0) {
  return runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0].premium;
}
function components(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}
function claim(items: Item[], damages: Damage[]) {
  return runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items }, { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } }
  ] }).results[1];
}

function cli(scenario: Scenario) {
  return spawnSync('./claim-office', [], { input: JSON.stringify(scenario), encoding: 'utf8' });
}
function rejects(scenario: Scenario) {
  const result = cli(scenario);
  expect(result.error).toBeUndefined();
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim()).not.toBe('');
  expect(result.stdout).toBe('');
}
function damageScenario(itemType: string, amount: number): Scenario {
  return { customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items: [{ type: 'sword' }] },
    { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType, amount }] } }
  ] };
}

// Ordered executable specifications are activated one at a time.
describe('MHPCO', () => {
  it('01 empty items premium 5', () => {
    expect(quote([])).toBe(5);
  });
  it('02 sword base 100 plus first assessment gives 115', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });
  it('03 amulet base 60 gives 71', () => { expect(quote([{ type: 'amulet' }])).toBe(71); });
  it('04 staff base 80 gives 93', () => { expect(quote([{ type: 'staff' }])).toBe(93); });
  it('05 potion base 40 gives 49', () => { expect(quote([{ type: 'potion' }])).toBe(49); });
  it('06 rune base 25 gives 33 rounded up', () => { expect(quote([{ type: 'rune' }])).toBe(33); });
  it('07 moonstone base 25 gives 33', () => { expect(quote([{ type: 'moonstone' }])).toBe(33); });
  it('08 two runes base 50 gives 60', () => { expect(quote(components('rune', 2))).toBe(60); });
  it('09 three runes block base 60 gives 71', () => { expect(quote(components('rune', 3))).toBe(71); });
  it('10 four runes no block base 100 gives 115', () => { expect(quote(components('rune', 4))).toBe(115); });
  it('11 seven runes base 175 final 197.5 rounds to 198', () => { expect(quote(components('rune', 7))).toBe(198); });
  it('12 two runes and moonstone base 75 gives 88', () => {
    expect(quote([...components('rune', 2), { type: 'moonstone' }])).toBe(88);
  });
  it('13 three runes and three moonstones base 120 gives 137', () => {
    expect(quote([...components('rune', 3), ...components('moonstone', 3)])).toBe(137);
  });
  it('14 newcomer cursed steel sword enchantment 3 gives 165', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });
  it('15 cursed sword and plain amulet base 160 risk 50 gives 231', () => {
    expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
  });
  it('16 enchantment 5 sword high risk gives 145', () => { expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145); });
  it('17 cursed enchantment 5 sword both additive risks gives 195', () => {
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });
  it('18 enchantment 4 sword no high risk gives 115', () => { expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115); });
  it('19 cursed enchantment 4 sword gives 165', () => { expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165); });
  it('20 exactly two years loyalty sword gives 95', () => { expect(quote([{ type: 'sword' }], 2)).toBe(95); });
  it('21 one year no loyalty sword gives 115', () => { expect(quote([{ type: 'sword' }], 1)).toBe(115); });
  it('22 three-year second quote cursed enchantment 7 new sword gives 160', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] }
    ] }).results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it('23 regular steel enchantment 3 sword damage 500 payout 400 cap 1600', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('24 rune damage 200 payout 100 cap 400', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('25 amulet insurance 600 cap 1200', () => { expect(claim([{ type: 'amulet' }], [])).toEqual({ payout: 0, remainingCap: 1200 }); });
  it('26 staff insurance 800 cap 1600', () => { expect(claim([{ type: 'staff' }], [])).toEqual({ payout: 0, remainingCap: 1600 }); });
  it('27 potion insurance 400 cap 800', () => { expect(claim([{ type: 'potion' }], [])).toEqual({ payout: 0, remainingCap: 800 }); });
  it('28 moonstone insurance 250 cap 500', () => { expect(claim([{ type: 'moonstone' }], [])).toEqual({ payout: 0, remainingCap: 500 }); });
  it('29 dragon enchantment 8 sword damage 1000 payout 400', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('30 dragon enchantment 9 sword damage 1000 payout 400', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('31 dragon enchantment 5 sword damage 800 payout 700', () => {
    expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it('32 steel enchantment 9 sword damage 1000 payout 400', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('33 sword 500 and amulet 300 damage payout 600 one deductible per item cap 2600', () => {
    expect(claim([{ type: 'sword' }, { type: 'amulet' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it('34 two swords sum 2000 cap 4000 and separate damages payout 600', () => {
    expect(claim([{ type: 'sword' }, { type: 'sword' }], [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 }
    ])).toEqual({ payout: 600, remainingCap: 3400 });
    expect(claim([{ type: 'sword', enchantment: 9 }, { type: 'sword', enchantment: 3 }], [
      { itemType: 'sword', amount: 1000 }, { itemType: 'sword', amount: 500 }
    ])).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it('35 cursed sword premium 165 unmodified cap 2000', () => {
    const items = [{ type: 'sword', cursed: true }];
    expect(quote(items)).toBe(165);
    expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('36 sword and three runes insurance 1750 cap 3500', () => {
    expect(claim([{ type: 'sword' }, ...components('rune', 3)], [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it('37 successive sword claims 1500 pay 1400 then 600 caps 600 then 0', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } }
    ] }).results).toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it('38 fractional payout 350.5 rounds down 350 cap 1650', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it('39 intermediate fractions retained across two damages payout 701', () => {
    expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }], [
      { itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }
    ])).toEqual({ payout: 701, remainingCap: 3299 });
  });
  it('40 below deductible damage payout 0 unchanged cap 2000', () => {
    expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it('41 CLI unknown quote type rejects nonzero stderr and no stdout results', () => {
    rejects({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });
  });
  it('42 CLI unowned amulet damage rejects nonzero stderr and no stdout results', () => { rejects(damageScenario('amulet', 200)); });
  it('43 CLI unknown damage type rejects nonzero stderr and no stdout results', () => { rejects(damageScenario('broomstick', 200)); });
  it('44 CLI negative damage -200 rejects nonzero stderr and no stdout results', () => { rejects(damageScenario('sword', -200)); });
  it('45 CLI excess sword entries rejects entire claim nonzero stderr and no stdout results', () => {
    const scenario = damageScenario('sword', 500);
    const step = scenario.steps[1];
    if (step.op !== 'claim') throw new Error('Expected claim fixture');
    step.incident.damages.push({ itemType: 'sword', amount: 300 });
    rejects(scenario);
  });
  it('46 CLI schema example five years amulet premium 59 payout 100 remainingCap 1100', () => {
    const result = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it('47 policy references use step index despite interspersed claims and independent caps', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      { op: 'quote', items: [{ type: 'amulet' }] },
      { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } }
    ] }).results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 },
      { payout: 100, remainingCap: 1100 }, { payout: 400, remainingCap: 1200 }]);
  });
  it('48 follow-up discount counts quotes not claim steps', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'quote', items: [{ type: 'sword' }] }
    ] }).results).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 },
      { payout: 0, remainingCap: 2000 }, { premium: 100 }, { premium: 100 }]);
  });
});
