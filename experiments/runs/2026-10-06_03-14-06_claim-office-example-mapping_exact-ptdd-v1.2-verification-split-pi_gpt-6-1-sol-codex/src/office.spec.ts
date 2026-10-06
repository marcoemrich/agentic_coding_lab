import { describe, expect, it } from 'vitest';
import { spawnSync } from 'node:child_process';
import { runScenario, type Item, type Quote, type Claim, type Scenario } from './office.js';

const quote = (items: Item[]): Quote => ({ op: 'quote', items });
const claim = (policy: number, damages: { itemType: string; amount: number }[]): Claim =>
  ({ op: 'claim', policy, incident: { cause: 'dragon attack', damages } });
const scenario = (steps: (Quote | Claim)[], years = 0): Scenario =>
  ({ customer: { yearsWithMHPCO: years }, steps });
const premiums = (items: Item[], years = 0) => runScenario(scenario([quote(items)], years)).results;
const cli = (input: Scenario) => spawnSync('./claim-office', [], { input: JSON.stringify(input), encoding: 'utf8' });
const expectRejected = (input: Scenario) => {
  const result = cli(input);
  expect(result.error).toBeUndefined();
  expect(result.status).toBeTypeOf('number');
  expect(result.status).not.toBe(0);
  expect(result.stderr).toMatch(/Error: .+/);
  expect(result.stdout).toBe('');
};
const sword: Item = { type: 'sword', material: 'steel', enchantment: 3 };
const components = (type: string, count: number): Item[] => Array.from({ length: count }, () => ({ type }));
const insuredClaim = (items: Item[], damages: { itemType: string; amount: number }[]) =>
  runScenario(scenario([quote(items), claim(0, damages)])).results[1];

describe('MHPCO', () => {
  it('D01 empty items: premium 5', () => {
    expect(premiums([])).toEqual([{ premium: 5 }]);
  });
  it('D02 sword: premium 115', () => {
    expect(premiums([sword])).toEqual([{ premium: 115 }]);
  });
  it('D03 amulet: premium 71', () => {
    expect(premiums([{ type: 'amulet' }])).toEqual([{ premium: 71 }]);
  });
  it('D04 staff: premium 93', () => {
    expect(premiums([{ type: 'staff' }])).toEqual([{ premium: 93 }]);
  });
  it('D05 potion: premium 49', () => {
    expect(premiums([{ type: 'potion' }])).toEqual([{ premium: 49 }]);
  });
  it('D06 rune: premium 33, final rounding up', () => {
    expect(premiums([{ type: 'rune' }])).toEqual([{ premium: 33 }]);
  });
  it('D07 moonstone: premium 33', () => {
    expect(premiums([{ type: 'moonstone' }])).toEqual([{ premium: 33 }]);
  });
  it('D08 exactly 3 runes: base 60, premium 71', () => {
    expect(premiums(components('rune', 3))).toEqual([{ premium: 71 }]);
  });
  it('D10 newcomer cursed sword enchantment 3: premium 165', () => {
    expect(premiums([{ ...sword, cursed: true }])).toEqual([{ premium: 165 }]);
  });
  it('D11 sword enchantment 5: premium 145', () => {
    expect(premiums([{ ...sword, enchantment: 5 }])).toEqual([{ premium: 145 }]);
  });
  it('D12 exactly 2 years: sword premium 95', () => {
    expect(premiums([sword], 2)).toEqual([{ premium: 95 }]);
  });
  it('D13 second quote sword: premium 100', () => {
    expect(runScenario(scenario([quote([sword]), quote([sword])])).results)
      .toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it('D14 standard steel sword enchantment 3 damage 500: payout 400, cap 1600', () => {
    expect(insuredClaim([sword], [{ itemType: 'sword', amount: 500 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('D15 enchantment 9 steel sword damage 1000: payout 400, cap 1600', () => {
    expect(insuredClaim([{ ...sword, enchantment: 9 }], [{ itemType: 'sword', amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it('D16 successive sword claims 1500: payouts 1400 then 600, caps 600 then 0', () => {
    const damage = [{ itemType: 'sword', amount: 1500 }];
    expect(runScenario(scenario([quote([sword]), claim(0, damage), claim(0, damage)])).results)
      .toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it('D17 unknown quote type broomstick: throws Error (chosen internal rejection contract)', () => {
    expect(() => premiums([{ type: 'broomstick' }])).toThrow(Error);
  });
  it('D18 uninsured amulet damage: throws Error', () => {
    expect(() => insuredClaim([sword], [{ itemType: 'amulet', amount: 200 }])).toThrow(Error);
  });
  it('D19 negative damage -200: throws Error', () => {
    expect(() => insuredClaim([sword], [{ itemType: 'sword', amount: -200 }])).toThrow(Error);
  });
  it('D20 two sword damages but one insured: throws Error, whole claim rejected', () => {
    expect(() => insuredClaim([sword], [
      { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 },
    ])).toThrow(Error);
  });
  it('D21 CLI schema scenario: amulet premium 59, payout 100, cap 1100', () => {
    const result = cli(scenario([
      quote([{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }]),
      claim(0, [{ itemType: 'amulet', amount: 200 }]),
    ], 5));
    expect(result.status).toBe(0);
    expect(result.stderr).toBe('');
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });

  describe('verification', () => {
    it('D09 2 runes + 1 moonstone: base 75, premium 88', () => {
      expect(premiums([...components('rune', 2), { type: 'moonstone' }]))
        .toEqual([{ premium: 88 }]);
    });
    it('D22 CLI unknown quote: nonzero status, stderr description, no stdout', () => {
      expectRejected(scenario([quote([{ type: 'broomstick' }])]));
    });
    it('V01 2 runes: base 50, premium 60', () => {
      expect(premiums(components('rune', 2))).toEqual([{ premium: 60 }]);
    });
    it('V02 4 runes: base 100, premium 115, no block', () => {
      expect(premiums(components('rune', 4))).toEqual([{ premium: 115 }]);
    });
    it('V03 7 runes: base 175, unrounded 197.5, premium 198', () => {
      expect(premiums(components('rune', 7))).toEqual([{ premium: 198 }]);
    });
    it('V04 3 runes + 3 moonstones: base 120, premium 137', () => {
      expect(premiums([...components('rune', 3), ...components('moonstone', 3)]))
        .toEqual([{ premium: 137 }]);
    });
    it('V05 cursed sword + plain amulet: base 160, risk-adjusted 210, premium 231', () => {
      expect(premiums([{ ...sword, cursed: true }, { type: 'amulet' }]))
        .toEqual([{ premium: 231 }]);
    });
    it('V06 cursed sword enchantment 5: both surcharges, premium 195', () => {
      expect(premiums([{ ...sword, enchantment: 5, cursed: true }]))
        .toEqual([{ premium: 195 }]);
    });
    it('V07 sword enchantment 4: no enchantment surcharge, premium 115', () => {
      expect(premiums([{ ...sword, enchantment: 4 }])).toEqual([{ premium: 115 }]);
    });
    it('V08 cursed sword enchantment 4: curse only, premium 165', () => {
      expect(premiums([{ ...sword, enchantment: 4, cursed: true }]))
        .toEqual([{ premium: 165 }]);
    });
    it('V09 years 1: no loyalty, premium 115', () => {
      expect(premiums([sword], 1)).toEqual([{ premium: 115 }]);
    });
    it('V10 years 3 second quote cursed sword enchantment 7: premium 160', () => {
      expect(runScenario(scenario([
        quote([sword]), quote([{ ...sword, cursed: true, enchantment: 7 }]),
      ], 3)).results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
    it('V11 dragon sword enchantment 8 damage 1000: payout 400', () => {
      expect(insuredClaim([{ ...sword, material: 'dragon', enchantment: 8 }],
        [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it('V12 dragon sword enchantment 9 damage 1000: payout 400', () => {
      expect(insuredClaim([{ ...sword, material: 'dragon', enchantment: 9 }],
        [{ itemType: 'sword', amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it('V13 dragon sword enchantment 5 damage 800: payout 700', () => {
      expect(insuredClaim([{ ...sword, material: 'dragon', enchantment: 5 }],
        [{ itemType: 'sword', amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it('V14 dragon attack sword 500 + amulet 300: payout 600, cap 2600', () => {
      expect(insuredClaim([sword, { type: 'amulet' }], [
        { itemType: 'sword', amount: 500 }, { itemType: 'amulet', amount: 300 },
      ])).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it('V15 rune damage 200: payout 100, cap 400', () => {
      expect(insuredClaim([{ type: 'rune' }], [{ itemType: 'rune', amount: 200 }]))
        .toEqual({ payout: 100, remainingCap: 400 });
    });
    it('V16 two swords damage 500 each: payout 800, cap 3200 (initial 4000)', () => {
      expect(insuredClaim([{ ...sword, material: 'dragon' }, { ...sword, material: 'dragon' }], [
        { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 500 },
      ])).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it('V17 sword + amulet zero damage: insurance sum 1600, cap 3200', () => {
      expect(insuredClaim([sword, { type: 'amulet' }], []))
        .toEqual({ payout: 0, remainingCap: 3200 });
    });
    it('V18 cursed sword premium 165: zero damage leaves cap 2000', () => {
      expect(runScenario(scenario([quote([{ ...sword, cursed: true }]), claim(0, [])])).results)
        .toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
    });
    it('V19 sword + 3 runes: insurance sum 1750, cap 3500', () => {
      expect(insuredClaim([sword, ...components('rune', 3)], []))
        .toEqual({ payout: 0, remainingCap: 3500 });
    });
    it('V20 enchantment 8 sword damage 901: raw payout 350.5, payout 350, cap 1650', () => {
      expect(insuredClaim([{ ...sword, enchantment: 8 }], [{ itemType: 'sword', amount: 901 }]))
        .toEqual({ payout: 350, remainingCap: 1650 });
    });
    it('V21 two enchantment 8 swords damage 901 each: fractions retained, payout 701, cap 3299', () => {
      expect(insuredClaim([{ ...sword, enchantment: 8 }, { ...sword, enchantment: 8 }], [
        { itemType: 'sword', amount: 901 }, { itemType: 'sword', amount: 901 },
      ])).toEqual({ payout: 701, remainingCap: 3299 });
    });
    it('V22 amulet zero damage: cap 1200', () => {
      expect(insuredClaim([{ type: 'amulet' }], []))
        .toEqual({ payout: 0, remainingCap: 1200 });
    });
    it('V23 staff zero damage: cap 1600', () => {
      expect(insuredClaim([{ type: 'staff' }], []))
        .toEqual({ payout: 0, remainingCap: 1600 });
    });
    it('V24 potion zero damage: cap 800', () => {
      expect(insuredClaim([{ type: 'potion' }], []))
        .toEqual({ payout: 0, remainingCap: 800 });
    });
    it('V25 moonstone damage 200: payout 100, cap 400', () => {
      expect(insuredClaim([{ type: 'moonstone' }], [{ itemType: 'moonstone', amount: 200 }]))
        .toEqual({ payout: 100, remainingCap: 400 });
    });
    it('V26 unknown damage type broomstick: throws Error', () => {
      expect(() => insuredClaim([sword], [{ itemType: 'broomstick', amount: 200 }])).toThrow(Error);
    });
    it('V27 CLI uninsured amulet: nonzero, stderr, no stdout', () => {
      expectRejected(scenario([quote([sword]), claim(0, [{ itemType: 'amulet', amount: 200 }])]));
    });
    it('V28 CLI unknown damage: nonzero, stderr, no stdout', () => {
      expectRejected(scenario([quote([sword]), claim(0, [{ itemType: 'broomstick', amount: 200 }])]));
    });
    it('V29 CLI negative damage: nonzero, stderr, no stdout', () => {
      expectRejected(scenario([quote([sword]), claim(0, [{ itemType: 'sword', amount: -200 }])]));
    });
    it('V30 CLI excess sword damages: nonzero, stderr, no stdout', () => {
      expectRejected(scenario([quote([sword]), claim(0, [
        { itemType: 'sword', amount: 500 }, { itemType: 'sword', amount: 300 },
      ])]));
    });
    it('V31 policy references quote step index, not quote ordinal; independent caps and quote history', () => {
      expect(runScenario(scenario([
        quote([sword]), claim(0, [{ itemType: 'sword', amount: 1500 }]),
        quote([{ type: 'amulet' }]), claim(2, [{ itemType: 'amulet', amount: 300 }]),
        claim(0, [{ itemType: 'sword', amount: 1500 }]),
      ])).results).toEqual([
        { premium: 115 }, { payout: 1400, remainingCap: 600 }, { premium: 62 },
        { payout: 200, remainingCap: 1000 }, { payout: 600, remainingCap: 0 },
      ]);
    });
    it('V32 damage below deductible: payout 0, cap unchanged', () => {
      expect(insuredClaim([sword], [{ itemType: 'sword', amount: 50 }]))
        .toEqual({ payout: 0, remainingCap: 2000 });
    });
    it('V33 third quote continues follow-up discount: premiums 115, 100, 100', () => {
      expect(runScenario(scenario([quote([sword]), quote([sword]), quote([sword])])).results)
        .toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
    });
    it('V34 mixed component modifiers: cursed rune + 2 plain runes, base 60, premium 81', () => {
      expect(premiums([{ type: 'rune', cursed: true }, ...components('rune', 2)]))
        .toEqual([{ premium: 81 }]);
    });
    it('V35 enchanted sword + plain amulet: enchantment surcharge only 30, premium 211', () => {
      expect(premiums([{ ...sword, enchantment: 5 }, { type: 'amulet' }]))
        .toEqual([{ premium: 211 }]);
    });
  });
});
