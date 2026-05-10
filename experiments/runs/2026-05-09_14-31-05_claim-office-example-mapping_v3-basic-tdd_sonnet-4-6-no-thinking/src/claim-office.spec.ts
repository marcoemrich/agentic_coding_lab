import { describe, it, expect } from 'vitest';
import { computePremium, processClaim } from './claim-office.js';
import type { Customer, Item, Policy, Incident } from './types.js';

// ─── Quote / Premium Tests ────────────────────────────────────────────────────

describe('computePremium – base premiums', () => {
  const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };

  it('sword base premium 100 + fee', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    // base 100, first insurance +10, fee +5 = 115
    expect(computePremium(customer, items)).toBe(115);
  });

  it('amulet base premium 60 + fee', () => {
    const items: Item[] = [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }];
    // base 60, first insurance +6, fee +5 = 71
    expect(computePremium(customer, items)).toBe(71);
  });

  it('staff base premium 80 + fee', () => {
    const items: Item[] = [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }];
    // base 80, first insurance +8, fee +5 = 93
    expect(computePremium(customer, items)).toBe(93);
  });

  it('potion base premium 40 + fee', () => {
    const items: Item[] = [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }];
    // base 40, first insurance +4, fee +5 = 49
    expect(computePremium(customer, items)).toBe(49);
  });

  it('empty item list → fee only (5 G)', () => {
    expect(computePremium(customer, [])).toBe(5);
  });
});

describe('computePremium – components', () => {
  const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };

  it('1 rune → 25 G base + first insurance + fee', () => {
    const items: Item[] = [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }];
    // base 25, first insurance +2.5→3 ceil, fee 5 = base 25, 10% of 25=2.5→ceil=3?
    // Let's check: intermediate kept as fractions; final rounded up
    // base=25, firstIns=25*0.1=2.5, policyBase=25, policyModifiers=+2.5, total=27.5+5=32.5→33
    expect(computePremium(customer, items)).toBe(33);
  });

  it('2 runes → 50 G base premium (no block)', () => {
    const items: Item[] = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
    ];
    // base=50, firstIns=5, total=55+5=60
    expect(computePremium(customer, items)).toBe(60);
  });

  it('3 runes → 60 G base premium (block applies)', () => {
    const items: Item[] = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
    ];
    // base=60, firstIns=6, total=66+5=71
    expect(computePremium(customer, items)).toBe(71);
  });

  it('4 runes → 100 G base premium (no block — needs exactly 3)', () => {
    const items: Item[] = Array(4).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false });
    // base=100, firstIns=10, total=110+5=115
    expect(computePremium(customer, items)).toBe(115);
  });

  it('7 runes → 175 G base premium (2 blocks? no — 1 block of 3 + 4 individual)', () => {
    // 7 runes: how many blocks? block requires exactly 3 alike
    // 7 = 2*3 + 1? No: the examples show 7 runes → 175 G
    // 175 = 25*7 = plain. So 7 individual? But 3+3+1=7 would be 60+60+25=145
    // The example explicitly says 7 runes → 175 G base premium
    // That means blocks only when the GROUP SIZE is exactly 3 — and groups here must be exactly 3
    // 7 runes: no group of exactly 3 that covers all? Or we greedily form as many blocks of 3?
    // 7 = 2*3 + 1 → 2 blocks + 1 = 60+60+25=145
    // But example says 175. Let me re-read:
    // "4 runes → 100 G (no block — block requires exactly 3)"
    // So when you have 4, the block doesn't apply. For 7: 7 is not divisible by 3 evenly?
    // 7 = floor(7/3)=2 blocks → 6 runes in blocks = 2*60=120, 1 remaining = 25, total=145
    // But example says 175... That means blocks only apply when the TOTAL count is exactly 3?
    // No — that seems weird. Let me re-read the example more carefully:
    // "3 runes → 60 G base premium (block applies)"
    // "4 runes → 100 G base premium (no block — block requires exactly 3)"
    // This says 4 runes → 4*25=100, no block at all.
    // "7 runes → 175 G base premium" = 7*25=175. No blocks.
    // So blocks only apply when the TOTAL COUNT of that component type is exactly 3.
    const items: Item[] = Array(7).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false });
    // base=175, firstIns=17.5, total=192.5+5=197.5→198
    expect(computePremium(customer, items)).toBe(198);
  });

  it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
    const items: Item[] = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false },
    ];
    // base=75, firstIns=7.5, total=82.5+5=87.5→88
    expect(computePremium(customer, items)).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
    const items: Item[] = [
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false },
      { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false },
    ];
    // base=120, firstIns=12, total=132+5=137
    expect(computePremium(customer, items)).toBe(137);
  });
});

describe('computePremium – modifier: cursed', () => {
  const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };

  it('cursed sword: base 100 + 50% surcharge on item = 150, firstIns on policy base, fee', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }];
    // itemBase=100, cursed=+50, itemAdjusted=150
    // policyBase=100 (raw base, before item modifiers)
    // firstIns = 10% of policyBase = 10
    // total = 150 + 10 + 5 = 165
    expect(computePremium(customer, items)).toBe(165);
  });

  it('cursed sword + plain amulet: cursed surcharge only on sword', () => {
    const items: Item[] = [
      { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
      { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
    ];
    // swordBase=100, cursed=+50, swordAdjusted=150; amuletBase=60
    // policyBase = 150+60=210 (already including item modifiers)
    // firstIns=21, total=231+5=236
    // Wait — let me re-read: "policy base premium 160 G; the cursed surcharge adds 50 G"
    // So policyBase = sum of ITEM base premiums (before modifiers) = 100+60=160
    // Then cursed surcharge adds 50% of sword's base premium = 50 → policy becomes 210
    // firstIns applies to policyBase (160) = 16, so 210+16=226+5=231
    expect(computePremium(customer, items)).toBe(231);
  });
});

describe('computePremium – modifier: high enchantment', () => {
  const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };

  it('sword with enchantment 5 → high-enchantment surcharge applies', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }];
    // base=100, highEnch=+30, itemAdj=130
    // policyBase=100, highEnch contribution=30
    // policySum with modifiers = 130, firstIns=10 (10% of policyBase=100)
    // total = 130+10+5=145
    expect(computePremium(customer, items)).toBe(145);
  });

  it('sword with enchantment 4 → no high-enchantment surcharge', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }];
    // base=100, no modifiers, firstIns=10, total=115
    expect(computePremium(customer, items)).toBe(115);
  });

  it('cursed sword enchantment 5 → both surcharges', () => {
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }];
    // base=100, curse=+50, highEnch=+30, itemAdj=180
    // policyBase=100, firstIns=10
    // total = 180+10+5=195
    expect(computePremium(customer, items)).toBe(195);
  });
});

describe('computePremium – policy-wide modifiers', () => {
  it('loyalty discount: customer with exactly 2 years', () => {
    const customer: Customer = { yearsWithMHPCO: 2, contractCount: 0 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    // base=100, firstIns=10, loyalty=-20, total=90+5=95
    expect(computePremium(customer, items)).toBe(95);
  });

  it('no loyalty discount with 1 year', () => {
    const customer: Customer = { yearsWithMHPCO: 1, contractCount: 0 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    // base=100, firstIns=10, total=110+5=115
    expect(computePremium(customer, items)).toBe(115);
  });

  it('follow-up contract: 15% discount on contracts after first', () => {
    const customer: Customer = { yearsWithMHPCO: 0, contractCount: 1 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    // base=100, firstIns=10, followUp=-15, total=95+5=100
    expect(computePremium(customer, items)).toBe(100);
  });

  it('first contract: first insurance surcharge applies (10%)', () => {
    const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
    // base=100, firstIns=10, total=110+5=115
    expect(computePremium(customer, items)).toBe(115);
  });
});

describe('computePremium – integration examples', () => {
  it('newcomer with a cursed sword → 165 G', () => {
    const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];
    // base=100, curse=+50, policyItemSum=150, policyBase=100
    // firstIns = 10% of policyBase = 10
    // total = 150 + 10 + 5 = 165
    expect(computePremium(customer, items)).toBe(165);
  });

  it('long-standing second contract with cursed high-ench sword → 160 G', () => {
    const customer: Customer = { yearsWithMHPCO: 3, contractCount: 1 };
    const items: Item[] = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    // base=100, curse=+50, highEnch=+30, itemAdj=180
    // policyBase=100, loyalty=-20 (20% of 100), firstIns=+10, followUp=-15
    // total = 180 + (-20+10-15) + 5 = 180 - 25 + 5 = 160
    expect(computePremium(customer, items)).toBe(160);
  });

  it('rounding: 197.5 G → 198 G (ceiling in MHPCO favor)', () => {
    // Need to contrive a case: see "7 runes" above gives 198
    // Verify: base=175, firstIns=17.5, total=192.5+5=197.5→198
    const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const items: Item[] = Array(7).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false });
    expect(computePremium(customer, items)).toBe(198);
  });
});

describe('computePremium – error cases', () => {
  it('unknown item type throws', () => {
    const customer: Customer = { yearsWithMHPCO: 0, contractCount: 0 };
    const items = [{ type: 'broomstick', material: 'wood', enchantment: 0, cursed: false }] as unknown as Item[];
    expect(() => computePremium(customer, items)).toThrow();
  });
});

// ─── Claim / Payout Tests ─────────────────────────────────────────────────────

describe('processClaim – standard reimbursement', () => {
  it('regular sword, damage 500 → payout 400', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });

  it('rune, damage 200 → payout 100', () => {
    const policy: Policy = {
      items: [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }],
      remainingCap: 500,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'rune', amount: 200 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });
});

describe('processClaim – high enchantment clause', () => {
  it('steel sword enchantment 9, damage 1000 → payout 400', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    // 50% of 1000 = 500, minus deductible 100 = 400
    expect(result.payout).toBe(400);
  });

  it('steel sword enchantment 8 is NOT high enchantment (only ≥ 8 triggers clause)', () => {
    // Wait: "enchantment level ≥ 8 is reimbursed at 50%" — enchantment 8 DOES trigger
    // But example: "dragon-material sword with exactly enchantment 8, damage 1000 → payout 400"
    // So: 50% of 1000 = 500 - 100 = 400. Enchantment 8 triggers 50% reimbursement.
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });
});

describe('processClaim – dragon material clause', () => {
  it('dragon sword, damage 500 → full reimbursement minus deductible', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 500 }],
    };
    const result = processClaim(policy, incident);
    // full reimbursement = 500 - 100 = 400
    expect(result.payout).toBe(400);
  });

  it('dragon sword enchantment 9, damage 1000 → 50% wins, payout 400', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    // both clauses: 50% wins → 500 - 100 = 400
    expect(result.payout).toBe(400);
  });

  it('dragon sword enchantment 5, damage 800 → dragon full reimbursement, payout 700', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 800 }],
    };
    const result = processClaim(policy, incident);
    // only dragon clause: full reimbursement 800 - 100 = 700
    expect(result.payout).toBe(700);
  });

  it('dragon sword exactly enchantment 8, damage 1000 → payout 400', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1000 }],
    };
    const result = processClaim(policy, incident);
    // both clauses: high-ench 50% → 500, dragon full, high-ench wins → 500-100=400
    expect(result.payout).toBe(400);
  });
});

describe('processClaim – deductible per damage event', () => {
  it('dragon attack: sword 500 + amulet 300 → payout 600', () => {
    const policy: Policy = {
      items: [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: false },
        { type: 'amulet', material: 'silver', enchantment: 3, cursed: false },
      ],
      remainingCap: 3200,
    };
    const incident: Incident = {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    };
    const result = processClaim(policy, incident);
    // sword: 500-100=400, amulet: 300-100=200, total=600
    expect(result.payout).toBe(600);
  });
});

describe('processClaim – cap exhaustion', () => {
  it('two successive claims against cap', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident1: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    };
    const result1 = processClaim(policy, incident1);
    // 1500-100=1400, cap was 2000 → remaining 600
    expect(result1.payout).toBe(1400);
    expect(result1.remainingCap).toBe(600);

    // Update policy cap for second claim
    policy.remainingCap = result1.remainingCap;
    const incident2: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 1500 }],
    };
    const result2 = processClaim(policy, incident2);
    // 1500-100=1400, but cap only 600 → payout 600
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });
});

describe('processClaim – rounding', () => {
  it('payout 350.5 → 350 (rounded down)', () => {
    // Need 50% reimbursement giving .5: damage 801, enchantment 9
    // 50% of 801 = 400.5, minus 100 = 300.5 → 300
    // Actually let's try damage 901: 50% = 450.5, minus 100 = 350.5 → 350
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: 901 }],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(350);
  });
});

describe('processClaim – error cases', () => {
  it('damage to item not in policy → throws', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'amulet', amount: 200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it('negative damage amount → throws', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'sword', amount: -200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it('more damage entries of a type than policy covers → throws', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it('unknown item type in damage → throws', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const incident: Incident = {
      cause: 'fire',
      damages: [{ itemType: 'broomstick' as any, amount: 200 }],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });
});
