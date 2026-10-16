import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario, type Item, type Damage, type Scenario } from './office.js';

function cli(scenario: Scenario) {
  return spawnSync('./claim-office', [], { input: JSON.stringify(scenario), encoding: 'utf8' });
}

function expectCliRejection(scenario: Scenario) {
  const result = cli(scenario);
  expect(typeof result.status).toBe('number');
  expect(result.status).not.toBe(0);
  expect(result.stderr.trim().length).toBeGreaterThan(0);
  expect(result.stdout).toBe('');
}

function quote(items: Item[], yearsWithMHPCO = 0) {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: 'quote', items }] }).results[0];
}
function claim(items: Item[], damages: Damage[]) {
  return runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: 'quote', items },
    { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages } },
  ] }).results[1];
}
function copies(type: string, count: number): Item[] {
  return Array.from({ length: count }, () => ({ type }));
}

describe('Claim office', () => {
  it('D01 empty quote costs 5 G', () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it('D02 sword costs 115 G including initial assessment and fee', () => {
    expect(quote([{ type: 'sword' }])).toEqual({ premium: 115 });
  });
  it('D03 amulet costs 71 G', () => {
    expect(quote([{ type: 'amulet' }])).toEqual({ premium: 71 });
  });
  it('D04 staff costs 93 G', () => {
    expect(quote([{ type: 'staff' }])).toEqual({ premium: 93 });
  });
  it('D05 potion costs 49 G', () => {
    expect(quote([{ type: 'potion' }])).toEqual({ premium: 49 });
  });
  it('D06 rune costs 33 G rounded up', () => {
    expect(quote([{ type: 'rune' }])).toEqual({ premium: 33 });
  });
  it('D07 moonstone costs 33 G', () => {
    expect(quote([{ type: 'moonstone' }])).toEqual({ premium: 33 });
  });
  it('D08 exactly 3 runes have base 60 G and premium 71 G', () => {
    expect(quote(copies('rune', 3))).toEqual({ premium: 71 });
  });
  it('D09 cursed newcomer sword costs 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it('D10 enchantment 5 sword costs 145 G', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toEqual({ premium: 145 });
  });
  it('D11 exactly 2 years discounts sword to 95 G', () => {
    expect(quote([{ type: 'sword' }], 2)).toEqual({ premium: 95 });
  });
  it('D12 second sword quote costs 100 G retaining initial assessment', () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] },
      { op: 'quote', items: [{ type: 'sword' }] },
    ] }).results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it('D13 ordinary steel enchantment 3 sword damage 500 pays 400 with cap 1600', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 3 }], [{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('D14 steel enchantment 9 damage 1000 pays 400 with cap 1600', () => {
    expect(claim([{ type: 'sword', material: 'steel', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('D15 successive 1500 claims pay 1400 then 600 with cap 600 then 0', () => {
    const damage: Scenario['steps'][number] = { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: 'quote', items: [{ type: 'sword' }] }, damage, damage,
    ] }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it('D17 unknown broomstick quote rejects (chosen contract: throws Error internally)', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow(Error);
  });
  it('D18 uninsured amulet damage rejects (chosen contract: throws Error internally)', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'amulet', amount: 200 }])).toThrow(Error);
  });
  it('D19 excessive sword damage entries reject the entire claim', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toThrow(Error);
  });
  it('D20 negative damage -200 rejects (chosen contract: throws Error internally)', () => {
    expect(() => claim([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }])).toThrow(Error);
  });
  it('V14 rune damage 200 pays 100 cap 400', () => {
    expect(claim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
  });
  it('V28 amulet claim cap 1200 independently uses its insurance value', () => {
    expect(claim([{ type: 'amulet' }], [])).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it('V29 staff claim cap 1600 independently uses its insurance value', () => {
    expect(claim([{ type: 'staff' }], [])).toEqual({ payout: 0, remainingCap: 1600 });
  });
  it('V30 potion claim cap 800 independently uses its insurance value', () => {
    expect(claim([{ type: 'potion' }], [])).toEqual({ payout: 0, remainingCap: 800 });
  });
  it('V31 moonstone claim cap 500 independently uses its insurance value', () => {
    expect(claim([{ type: 'moonstone' }], [])).toEqual({ payout: 0, remainingCap: 500 });
  });

  it('D21 CLI schema example emits premium 59 payout 100 remainingCap 1100', () => {
    const result = cli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
      { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });

  describe('verification', () => {
    it('D16 two sword damages of 500 each pay 800 with cap 3200', () => {
      expect(claim(copies('sword', 2), [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it('D22 CLI unknown quote exits nonzero with stderr and no stdout', () => {
      expectCliRejection({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }] });
    });
    it('V01 2 runes base 50 premium 60', () => {
      expect(quote(copies('rune', 2))).toEqual({ premium: 60 });
    });
    it('V02 4 runes base 100 premium 115 no block', () => {
      expect(quote(copies('rune', 4))).toEqual({ premium: 115 });
    });
    it('V03 7 runes base 175 premium 197.5 rounds to 198', () => {
      expect(quote(copies('rune', 7))).toEqual({ premium: 198 });
    });
    it('V04 2 runes and 1 moonstone base 75 premium 88 no mixed block', () => {
      expect(quote([...copies('rune', 2), { type: 'moonstone' }])).toEqual({ premium: 88 });
    });
    it('V05 3 runes and 3 moonstones base 120 premium 137', () => {
      expect(quote([...copies('rune', 3), ...copies('moonstone', 3)])).toEqual({ premium: 137 });
    });
    it('V06 cursed sword and plain amulet base 160 risk 50 premium 231', () => {
      expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet', cursed: false }])).toEqual({ premium: 231 });
    });
    it('V07 cursed enchantment 5 sword stacks surcharges premium 195', () => {
      expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
    });
    it('V08 enchantment 4 sword has no surcharge premium 115', () => {
      expect(quote([{ type: 'sword', enchantment: 4, cursed: false }])).toEqual({ premium: 115 });
    });
    it('V09 cursed enchantment 4 sword premium 165', () => {
      expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
    });
    it('V10 dragon enchantment 8 damage 1000 pays 400', () => {
      expect(claim([{ type: 'sword', material: 'dragon', enchantment: 8 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it('V11 dragon enchantment 9 damage 1000 pays 400', () => {
      expect(claim([{ type: 'sword', material: 'dragon', enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it('V12 dragon enchantment 5 damage 800 pays 700', () => {
      expect(claim([{ type: 'sword', material: 'dragon', enchantment: 5 }], [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it('V13 sword 500 and amulet 300 damage pay 600 deductible per item', () => {
      expect(claim([{ type: 'sword' }, { type: 'amulet' }], [{ itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it('V15 two swords insurance sum 2000 cap 4000', () => {
      expect(claim(copies('sword', 2), [])).toEqual({ payout: 0, remainingCap: 4000 });
    });
    it('V16 sword and amulet insurance sum 1600 cap 3200', () => {
      expect(claim([{ type: 'sword' }, { type: 'amulet' }], [])).toEqual({ payout: 0, remainingCap: 3200 });
    });
    it('V17 cursed sword premium 165 insurance sum 1000 cap 2000', () => {
      const items = [{ type: 'sword', cursed: true }];
      expect(quote(items)).toEqual({ premium: 165 });
      expect(claim(items, [])).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it('V18 sword and 3 runes insurance sum 1750 cap 3500', () => {
      expect(claim([{ type: 'sword' }, ...copies('rune', 3)], [])).toEqual({ payout: 0, remainingCap: 3500 });
    });
    it('V19 enchantment 8 damage 901 raw payout 350.5 rounds down to 350', () => {
      expect(claim([{ type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }])).toEqual({ payout: 350, remainingCap: 1650 });
    });
    it('V20 two fractional payouts keep intermediate fractions total 701', () => {
      expect(claim([{ type: 'sword', enchantment: 8 }, { type: 'sword', enchantment: 8 }], [{ itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 }])).toEqual({ payout: 701, remainingCap: 3299 });
    });
    it('V21 loyal second cursed enchantment 7 sword costs 160', () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ] }).results[1]).toEqual({ premium: 160 });
    });
    it('V22 1 year does not earn loyalty discount premium 115', () => {
      expect(quote([{ type: 'sword' }], 1)).toEqual({ premium: 115 });
    });
    it('V23 CLI uninsured amulet exits nonzero with stderr no results', () => {
      expectCliRejection({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ] });
    });
    it('V24 CLI unknown damage exits nonzero with stderr no results', () => {
      expectCliRejection({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } },
      ] });
    });
    it('V25 CLI negative damage exits nonzero with stderr no results', () => {
      expectCliRejection({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ] });
    });
    it('V26 CLI excessive damage entries reject all results', () => {
      expectCliRejection({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 }] } },
      ] });
    });
    it('V27 claim policy uses quote step index not quote count', () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] } },
        { op: 'quote', items: [{ type: 'potion' }] },
        { op: 'claim', policy: 2, incident: { cause: 'fire', damages: [{ itemType: 'potion', amount: 200 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [] } },
      ] }).results).toEqual([{ premium: 115 }, { payout: 100, remainingCap: 1900 }, { premium: 43 }, { payout: 100, remainingCap: 700 }, { payout: 0, remainingCap: 1900 }]);
    });
    it('V32 3 moonstones alone base 60 premium 71', () => {
      expect(quote(copies('moonstone', 3))).toEqual({ premium: 71 });
    });
    it('V33 item surcharges and policy discounts all use base premium', () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
        { op: 'quote', items: [] },
        { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 5 }, { type: 'rune' }] },
      ] }).results[1]).toEqual({ premium: 179 });
    });
    it('V34 exhausted policy pays 0 on subsequent claims', () => {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 2100 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      ] }).results.slice(1)).toEqual([{ payout: 2000, remainingCap: 0 }, { payout: 0, remainingCap: 0 }]);
    });
    it('V35 damage below deductible pays 0 not negative', () => {
      expect(claim([{ type: 'sword' }], [{ itemType: 'sword', amount: 50 }])).toEqual({ payout: 0, remainingCap: 2000 });
    });
  });
});
