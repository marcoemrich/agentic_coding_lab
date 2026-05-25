import { describe, it, expect } from 'vitest';
import {
  computePremium,
  createPolicy,
  processClaim,
  runScenario,
  type Item,
  type Scenario,
} from './claim-office.js';

const noContext = { yearsWithMHPCO: 0, isFollowUpContract: false };

describe('item values and base premiums (single item, no modifiers)', () => {
  it('sword alone → 100 G base + 10 G first insurance + 5 G fee = 115 G', () => {
    expect(computePremium([{ type: 'sword' }], noContext)).toBe(115);
  });
  it('amulet alone → 60 + 6 + 5 = 71 G', () => {
    expect(computePremium([{ type: 'amulet' }], noContext)).toBe(71);
  });
  it('staff alone → 80 + 8 + 5 = 93 G', () => {
    expect(computePremium([{ type: 'staff' }], noContext)).toBe(93);
  });
  it('potion alone → 40 + 4 + 5 = 49 G', () => {
    expect(computePremium([{ type: 'potion' }], noContext)).toBe(49);
  });
});

describe('building block of 3 alike components (base premium)', () => {
  // The spec values are *base premiums* (before first-insurance surcharge and fee).
  // We verify via insurance sums and via premiums (deriving base by subtracting
  // the documented add-ons).
  it('2 runes → 50 G base premium', () => {
    // 2 * 25 = 50; first insurance per item base 25 → +5; fee 5 → 60
    expect(computePremium([{ type: 'rune' }, { type: 'rune' }], noContext)).toBe(60);
  });
  it('3 runes → 60 G base premium (block applies)', () => {
    // block: 60 base; per-item effective 20 → first ins 0.1*60 = 6; +5 fee = 71
    expect(
      computePremium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }], noContext)
    ).toBe(71);
  });
  it('4 runes → 100 G base premium (no block — block requires exactly 3)', () => {
    // 4*25 = 100; first ins 10; fee 5 = 115
    expect(
      computePremium(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }],
        noContext
      )
    ).toBe(115);
  });
  it('7 runes → 175 G base premium (block requires exactly 3)', () => {
    // base 175; first ins +17.5; fee +5 = 197.5 → 198 (rounded up)
    expect(
      computePremium(
        [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        noContext
      )
    ).toBe(198);
  });
});

describe('"alike" components', () => {
  it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
    // base 75; first ins 7.5; fee 5 = 87.5 → 88
    expect(
      computePremium(
        [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }],
        noContext
      )
    ).toBe(88);
  });
  it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
    // base 120; first ins 12; fee 5 = 137
    expect(
      computePremium(
        [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'moonstone' },
          { type: 'moonstone' },
          { type: 'moonstone' },
        ],
        noContext
      )
    ).toBe(137);
  });
});

describe('modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet → 210 G before further modifiers and fee', () => {
    // base 160; cursed surcharge 50 (50% of sword 100 base) = 210
    // first ins: 10 (sword) + 6 (amulet) = 16; fee 5 → 231
    expect(
      computePremium(
        [
          { type: 'sword', cursed: true },
          { type: 'amulet' },
        ],
        noContext
      )
    ).toBe(231);
  });
});

describe('modifier thresholds', () => {
  it('customer with exactly 2 years → loyalty discount applies', () => {
    // sword: 100 base; loyalty -20% = -20; first ins +10; fee +5 = 95
    expect(
      computePremium([{ type: 'sword' }], {
        yearsWithMHPCO: 2,
        isFollowUpContract: false,
      })
    ).toBe(95);
  });
  it('sword with exactly enchantment 5 → high-enchantment surcharge applies', () => {
    // 100 + 30 + 10 + 5 = 145
    expect(
      computePremium([{ type: 'sword', enchantment: 5 }], noContext)
    ).toBe(145);
  });
  it('cursed sword with enchantment 5 → both surcharges apply', () => {
    // 100 + 50 + 30 + 10 + 5 = 195
    expect(
      computePremium(
        [{ type: 'sword', enchantment: 5, cursed: true }],
        noContext
      )
    ).toBe(195);
  });
  it('sword with enchantment 4 → no high-enchantment surcharge', () => {
    // 100 + 10 + 5 = 115
    expect(
      computePremium([{ type: 'sword', enchantment: 4 }], noContext)
    ).toBe(115);
  });
  it('cursed sword with enchantment 4 → only curse surcharge', () => {
    // 100 + 50 + 10 + 5 = 165
    expect(
      computePremium(
        [{ type: 'sword', enchantment: 4, cursed: true }],
        noContext
      )
    ).toBe(165);
  });
  it('dragon sword ench 8, damage 1000 → payout 400 (50% then deductible)', () => {
    const policy = createPolicy([
      { type: 'sword', material: 'dragon', enchantment: 8 },
    ]);
    const r = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(r.payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('dragon damages sword(500) + amulet(300) → payout 600 (deductible per item)', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const r = processClaim(policy, {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    });
    expect(r.payout).toBe(600);
  });
});

describe('standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, ench 3), damage 500 → payout 400', () => {
    const policy = createPolicy([
      { type: 'sword', material: 'steel', enchantment: 3 },
    ]);
    const r = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    expect(r.payout).toBe(400);
  });
  it('rune, damage 200 → payout 100', () => {
    const policy = createPolicy([{ type: 'rune' }]);
    const r = processClaim(policy, {
      cause: 'fire',
      damages: [{ itemType: 'rune', amount: 200 }],
    });
    expect(r.payout).toBe(100);
  });
});

describe('enchantment threshold vs dragon material', () => {
  it('dragon sword ench 9 dmg 1000 → payout 400 (50% wins, then deductible)', () => {
    const policy = createPolicy([
      { type: 'sword', material: 'dragon', enchantment: 9 },
    ]);
    const r = processClaim(policy, {
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(r.payout).toBe(400);
  });
  it('dragon sword ench 5 dmg 800 → payout 700 (dragon clause, full)', () => {
    const policy = createPolicy([
      { type: 'sword', material: 'dragon', enchantment: 5 },
    ]);
    const r = processClaim(policy, {
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 800 }],
    });
    expect(r.payout).toBe(700);
  });
  it('steel sword ench 9 dmg 1000 → payout 400 (50% then deductible)', () => {
    const policy = createPolicy([
      { type: 'sword', material: 'steel', enchantment: 9 },
    ]);
    const r = processClaim(policy, {
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 1000 }],
    });
    expect(r.payout).toBe(400);
  });
});

describe('multiple items of same type', () => {
  it('policy covers two swords → insurance sum 2000, cap 4000', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });
  it('two sword damages each treated separately with own deductible', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'sword' }]);
    const r = processClaim(policy, {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    });
    // each: 500 - 100 = 400; total 800
    expect(r.payout).toBe(800);
  });
  it('more sword damages than insured swords → claim rejected (throws)', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, {
        cause: 'x',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ],
      })
    ).toThrow();
  });
});

describe('cap exhaustion', () => {
  it('sword + amulet → insurance sum 1600, cap 3200', () => {
    const policy = createPolicy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });
  it('cursed sword → cap 2000 (premium modifiers do not raise cap)', () => {
    const policy = createPolicy([{ type: 'sword', cursed: true }]);
    expect(policy.cap).toBe(2000);
  });
  it('sword + 3 runes (block) → insurance sum 1750 (block discount affects premium only)', () => {
    const policy = createPolicy([
      { type: 'sword' },
      { type: 'rune' },
      { type: 'rune' },
      { type: 'rune' },
    ]);
    expect(policy.insuranceSum).toBe(1750);
  });
  it('sword (sum 1000, cap 2000), two 1500 claims → 1400/600 then 600/0', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    const r1 = processClaim(policy, {
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(r1.payout).toBe(1400);
    expect(r1.remainingCap).toBe(600);
    const r2 = processClaim(policy, {
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 1500 }],
    });
    expect(r2.payout).toBe(600);
    expect(r2.remainingCap).toBe(0);
  });
});

describe('rounding in MHPCO favor', () => {
  it('premium 197.5 → 198 (rounded up)', () => {
    // 7 runes: 7*25 = 175 base. first ins = 17.5. fee = 5. total 197.5 → 198
    expect(
      computePremium(
        [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
        ],
        noContext
      )
    ).toBe(198);
  });
  it('payout 350.5 → 350 (rounded down)', () => {
    // construct: enchant 8, damage 901 → 450.5; - deductible 100 = 350.5
    const policy = createPolicy([
      { type: 'sword', enchantment: 8 },
    ]);
    const r = processClaim(policy, {
      cause: 'x',
      damages: [{ itemType: 'sword', amount: 901 }],
    });
    expect(r.payout).toBe(350);
  });
});

describe('edge cases', () => {
  it('empty item list → premium 5 G (fee only)', () => {
    expect(computePremium([], noContext)).toBe(5);
  });
  it('quote with unknown item type → throws (CLI exits non-zero)', () => {
    expect(() => computePremium([{ type: 'broomstick' }], noContext)).toThrow();
  });
  it('claim references item not in policy → throws', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, {
        cause: 'x',
        damages: [{ itemType: 'amulet', amount: 100 }],
      })
    ).toThrow();
  });
  it('claim references unknown item type → throws', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, {
        cause: 'x',
        damages: [{ itemType: 'broomstick', amount: 100 }],
      })
    ).toThrow();
  });
  it('claim with negative amount → throws', () => {
    const policy = createPolicy([{ type: 'sword' }]);
    expect(() =>
      processClaim(policy, {
        cause: 'x',
        damages: [{ itemType: 'sword', amount: -200 }],
      })
    ).toThrow();
  });
});

describe('integration examples', () => {
  it('newcomer with cursed sword → premium 165 G', () => {
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }],
        { yearsWithMHPCO: 0, isFollowUpContract: false }
      )
    ).toBe(165);
  });
  it("long-standing customer's second contract → premium 160 G", () => {
    expect(
      computePremium(
        [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3, isFollowUpContract: true }
      )
    ).toBe(160);
  });
});

describe('scenario runner (CLI semantics)', () => {
  it('schema example: quote then claim', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'fire',
            damages: [{ itemType: 'amulet', amount: 200 }],
          },
        },
      ],
    };
    const out = runScenario(scenario);
    expect(out.results).toHaveLength(2);
    // amulet: 60 base; loyalty -12 (yearsWithMHPCO=5 ≥ 2); first ins +6; no follow-up; fee +5
    // = 60 - 12 + 6 + 5 = 59
    expect(out.results[0]).toEqual({ premium: 59 });
    // claim: amulet damage 200; full reimburse (no clause); 200 - 100 = 100
    // cap = 1200; remaining 1100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });

  it('each subsequent quote in scenario gets the follow-up discount', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword' }] },
      ],
    };
    const out = runScenario(scenario);
    const first = out.results[0] as { premium: number };
    const second = out.results[1] as { premium: number };
    expect(first.premium).toBe(115); // 100 + 10 + 5
    // second: 100 + 10 - 15 + 5 = 100
    expect(second.premium).toBe(100);
  });
});
