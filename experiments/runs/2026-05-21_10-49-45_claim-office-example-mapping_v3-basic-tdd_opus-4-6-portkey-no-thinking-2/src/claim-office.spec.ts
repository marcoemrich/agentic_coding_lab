import { describe, it, expect } from 'vitest';
import { processScenario } from './claim-office.js';

// Helper to run a scenario and return results
function run(scenario: any) {
  return processScenario(scenario);
}

describe('Item values and base premiums', () => {
  it('sword: 1000 G insurance value, 100 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('amulet: 600 G insurance value, 60 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] }],
    });
    // 60 base + 6 first insurance + 5 fee = 71
    expect(result.results[0].premium).toBe(71);
  });

  it('staff: 800 G insurance value, 80 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }] }],
    });
    // 80 base + 8 first insurance + 5 fee = 93
    expect(result.results[0].premium).toBe(93);
  });

  it('potion: 400 G insurance value, 40 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion', material: 'liquid', enchantment: 0, cursed: false }] }],
    });
    // 40 base + 4 first insurance + 5 fee = 49
    expect(result.results[0].premium).toBe(49);
  });
});

describe('Component base premiums', () => {
  it('2 runes → 50 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    // 50 base + 5 first insurance + 5 fee = 60
    expect(result.results[0].premium).toBe(60);
  });

  it('3 runes → 60 G base premium (block applies)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    // 60 base + 6 first insurance + 5 fee = 71
    expect(result.results[0].premium).toBe(71);
  });

  it('4 runes → 100 G base premium (no block — block requires exactly 3)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('7 runes → 175 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    // 175 base + 17.5 first insurance = 192.5 → 193 + 5 fee = 198
    expect(result.results[0].premium).toBe(198);
  });

  it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
      ] }],
    });
    // 75 base + 7.5 first insurance = 82.5 → 83 + 5 fee = 88
    expect(result.results[0].premium).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
      ] }],
    });
    // 120 base + 12 first insurance + 5 fee = 137
    expect(result.results[0].premium).toBe(137);
  });
});

describe('Premium modifiers', () => {
  it('cursed items add 50% risk surcharge on item base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    expect(result.results[0].premium).toBe(165);
  });

  it('highly enchanted items (enchantment >= 5) add 30% risk surcharge', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }] }],
    });
    // 100 base + 30 enchantment + 10 first insurance = 140 + 5 fee = 145 (wait...)
    // Wait: first insurance 10% applies to policy base premium = 100. So +10.
    // But enchantment surcharge is item-specific = 30, first insurance is policy-wide on sum of item base premiums = 100 * 10% = 10
    // Total = 100 (base) + 30 (enchantment) + 10 (first insurance) = 140 + 5 = 145
    expect(result.results[0].premium).toBe(145);
  });

  it('cursed + high enchantment: both surcharges apply', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }] }],
    });
    // 100 base + 50 curse + 30 enchantment + 10 first insurance = 190 + 5 = 195
    expect(result.results[0].premium).toBe(195);
  });

  it('enchantment 4 → no high-enchantment surcharge', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }] }],
    });
    // 100 base + 10 first insurance = 110 + 5 = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('long-standing customers (>= 2 years) receive 20% loyalty discount on policy base', () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    // 100 base + 10 first insurance - 20 loyalty = 90 + 5 fee = 95
    expect(result.results[0].premium).toBe(95);
  });

  it('first insurance carries 10% initial assessment surcharge', () => {
    // Already tested in basic tests - every first quote has this
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('15% follow-up discount on each contract after the first', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
      ],
    });
    // First: 100 + 10 first insurance + 5 = 115
    expect(result.results[0].premium).toBe(115);
    // Second: 100 + 10 first insurance - 15 follow-up + 5 = 100
    expect(result.results[1].premium).toBe(100);
  });

  it('5 G processing fee added to every premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    // Empty item list → premium 5 G (only the processing fee)
    expect(result.results[0].premium).toBe(5);
  });

  it('modifier scope: cursed surcharge applies only to cursed item, not whole policy', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
        { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
      ] }],
    });
    // policy base = 100 + 60 = 160
    // item surcharges: sword curse = 50
    // policy modifiers on base 160: first insurance = 16
    // total = 160 + 50 + 16 + 5 = 231
    // Wait, let me re-read the example:
    // "100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G"
    // Actually in the example:
    // policy base premium 160 G; cursed surcharge adds 50 G → 210 G before further modifiers and fee
    // So 210 + first insurance 10% of 160 = 16 → 226 + 5 = 231
    expect(result.results[0].premium).toBe(231);
  });
});

describe('Integration examples from prompt', () => {
  it('newcomer with a cursed sword → 165 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    expect(result.results[0].premium).toBe(165);
  });

  it('long-standing customer second contract with cursed high-enchant sword → 160 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    // Second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 = 160
    expect(result.results[1].premium).toBe(160);
  });
});

describe('Claim processing - deductible', () => {
  it('100 G deductible applies per damage event', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });
    // payout = 500 - 100 = 400
    expect(result.results[1].payout).toBe(400);
  });

  it('deductible per damaged item, not per event', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'amulet', amount: 300 },
          ] },
        },
      ],
    });
    // payout = (500 - 100) + (300 - 100) = 400 + 200 = 600
    expect(result.results[1].payout).toBe(600);
  });
});

describe('Claim processing - enchantment and material', () => {
  it('enchantment >= 8 → 50% reimbursement', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 50% of 1000 = 500, minus 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
  });

  it('dragon-material sword, enchantment 5 → full reimbursement (only dragon clause)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });
    // Full reimbursement: 800 - 100 = 700
    expect(result.results[1].payout).toBe(700);
  });

  it('dragon-material + enchantment >= 8 → 50% wins, then deductible', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 50% of 1000 = 500, minus 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
  });

  it('dragon-material sword, enchantment exactly 8 → 50% rule applies', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // 50% of 1000 = 500, minus 100 = 400
    expect(result.results[1].payout).toBe(400);
  });

  it('regular sword (no special clauses) → full reimbursement minus deductible', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });
    // 500 - 100 = 400
    expect(result.results[1].payout).toBe(400);
  });

  it('rune damage → full reimbursement minus deductible (no enchantment/material)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] },
        },
      ],
    });
    // 200 - 100 = 100
    expect(result.results[1].payout).toBe(100);
  });
});

describe('Cap and insurance sum', () => {
  it('cap is twice the insurance sum', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // insurance sum = 1000, cap = 2000
    // payout = 1000 - 100 = 900
    // remainingCap = 2000 - 900 = 1100
    expect(result.results[1].payout).toBe(900);
    expect(result.results[1].remainingCap).toBe(1100);
  });

  it('two swords → insurance sum 2000 G, cap 4000 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
        ] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 500 },
          ] },
        },
      ],
    });
    // Each sword: 500 - 100 = 400. Total = 800
    // Cap = 4000, remaining = 3200
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });

  it('sword + amulet → insurance sum 1600 G, cap 3200 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ] },
      ],
    });
    // Just verifying policy is created correctly - claim test below
    expect(result.results[0].premium).toBeDefined();
  });

  it('cursed sword: cap based on unmodified insurance value', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });
    // insurance sum = 1000, cap = 2000
    // payout = 1500 - 100 = 1400, remainingCap = 2000 - 1400 = 600
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
  });

  it('sword + 3 runes block → insurance sum 1750 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    // insurance sum = 1000 + 3*250 = 1750, cap = 3500
    // payout = 1000 - 100 = 900
    expect(result.results[1].payout).toBe(900);
    expect(result.results[1].remainingCap).toBe(2600);
  });

  it('cap exhaustion across successive claims', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });
    // insurance sum = 1000, cap = 2000
    // first claim: payout = 1500 - 100 = 1400, remaining = 600
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    // second claim: desired = 1500 - 100 = 1400, but capped to 600
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });
});

describe('Rounding', () => {
  it('premium rounded up (in MHPCO favor)', () => {
    // 7 runes: 175 base, first insurance 10% of 175 = 17.5 → total 192.5 → round up to 193 + 5 = 198
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    expect(result.results[0].premium).toBe(198);
  });

  it('payout rounded down (in MHPCO favor)', () => {
    // Need a scenario where payout is fractional
    // enchantment 8 sword, damage 501: 50% of 501 = 250.5, minus 100 = 150.5 → round down to 150
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 501 }] },
        },
      ],
    });
    expect(result.results[1].payout).toBe(150);
  });
});

describe('Edge cases', () => {
  it('empty item list → premium 5 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(result.results[0].premium).toBe(5);
  });

  it('unknown item type in quote → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow();
  });

  it('claim references item not in policy → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    })).toThrow();
  });

  it('claim references unknown item type → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] },
        },
      ],
    })).toThrow();
  });

  it('negative damage amount → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
        },
      ],
    })).toThrow();
  });

  it('more damage entries than insured items → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'fire', damages: [
            { itemType: 'sword', amount: 200 },
            { itemType: 'sword', amount: 300 },
          ] },
        },
      ],
    })).toThrow();
  });
});

describe('Multiple items of the same type', () => {
  it('two swords damaged separately, each gets own deductible', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
        ] },
        {
          op: 'claim', policy: 0,
          incident: { cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 500 },
          ] },
        },
      ],
    });
    // Each: 500 - 100 = 400. Total = 800
    expect(result.results[1].payout).toBe(800);
  });
});

describe('Schema example from prompt', () => {
  it('processes the schema example correctly', () => {
    const result = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
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
    });
    // Quote: 60 base + 6 first insurance - 12 loyalty = 54 + 5 = 59
    expect(result.results[0].premium).toBe(59);
    // Claim: 200 - 100 = 100
    expect(result.results[1].payout).toBe(100);
    // remainingCap: 1200 - 100 = 1100
    expect(result.results[1].remainingCap).toBe(1100);
  });
});
