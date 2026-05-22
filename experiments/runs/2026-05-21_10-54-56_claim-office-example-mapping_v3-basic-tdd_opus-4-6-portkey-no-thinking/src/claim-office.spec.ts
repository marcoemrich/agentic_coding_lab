import { describe, it, expect } from 'vitest';
import { processScenario } from './claim-office.js';

// Helper to run a scenario and return results
function run(scenario: any) {
  return processScenario(scenario);
}

describe('Quote - Item base premiums', () => {
  it('sword: 100 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('amulet: 60 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] }],
    });
    // 60 base + 6 first insurance + 5 fee = 71
    expect(result.results[0].premium).toBe(71);
  });

  it('staff: 80 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }] }],
    });
    // 80 base + 8 first insurance + 5 fee = 93
    expect(result.results[0].premium).toBe(93);
  });

  it('potion: 40 G base premium', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'potion', material: 'glass', enchantment: 0, cursed: false }] }],
    });
    // 40 base + 4 first insurance + 5 fee = 49
    expect(result.results[0].premium).toBe(49);
  });
});

describe('Quote - Component premiums', () => {
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

  it('3 runes → 60 G base premium (block discount)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    // 60 base + 6 first insurance + 5 fee = 71
    expect(result.results[0].premium).toBe(71);
  });

  it('4 runes → 100 G base premium (no block - requires exactly 3)', () => {
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

describe('Quote - Cursed surcharge', () => {
  it('cursed sword adds 50% surcharge to that item only', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
        { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
      ] }],
    });
    // Item base: sword 100 + amulet 60 = 160
    // Item surcharges: sword cursed 50% of 100 = 50
    // Policy base premium = 160 (sum of item base premiums)
    // First insurance: 10% of 160 = 16
    // Total: 160 + 50 + 16 = 226 + 5 = 231
    expect(result.results[0].premium).toBe(231);
  });
});

describe('Quote - Enchantment surcharge', () => {
  it('enchantment level 5 adds 30% surcharge', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 5, cursed: false },
      ] }],
    });
    // 100 base + 30 enchantment surcharge = 130
    // first insurance 10% of 100 = 10 → 140 + 5 fee = 145
    expect(result.results[0].premium).toBe(145);
  });

  it('enchantment level 4 does NOT add surcharge', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 4, cursed: false },
      ] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('cursed and enchantment 5: both surcharges apply', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 5, cursed: true },
      ] }],
    });
    // 100 base + 50 cursed + 30 enchantment = 180
    // first insurance 10% of 100 = 10 → 190 + 5 fee = 195
    expect(result.results[0].premium).toBe(195);
  });
});

describe('Quote - Loyalty discount', () => {
  it('customer with 2 years gets 20% loyalty discount', () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ] }],
    });
    // 100 base - 20 loyalty + 10 first insurance = 90 + 5 fee = 95
    expect(result.results[0].premium).toBe(95);
  });

  it('customer with 1 year does NOT get loyalty discount', () => {
    const result = run({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });
});

describe('Quote - First insurance and follow-up contract', () => {
  it('first quote has 10% first insurance surcharge', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
      ] }],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });

  it('second quote gets 15% follow-up discount but still 10% first insurance', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
      ],
    });
    // First: 100 base + 10 first insurance + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
    // Second: 100 base + 10 first insurance - 15 follow-up = 95 + 5 fee = 100
    expect(result.results[1].premium).toBe(100);
  });
});

describe('Quote - Processing fee', () => {
  it('empty item list → 5 G (processing fee only)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(result.results[0].premium).toBe(5);
  });
});

describe('Quote - Rounding', () => {
  it('premium rounded up in MHPCO favor (e.g. 197.5 → 198)', () => {
    // 7 runes: 175 base + 17.5 first insurance = 192.5 → round up → 193 + 5 fee = 198
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    expect(result.results[0].premium).toBe(198);
  });
});

describe('Quote - Integration: Newcomer with cursed sword', () => {
  it('premium = 165 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
      ] }],
    });
    // 100 base + 50 cursed = 150 (item-level) → policy base 150
    // + 10% first insurance (of 150) = 15 → 165
    // + 5 fee = 170?
    // Wait, the prompt says 165. Let me re-read:
    // "100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G"
    // So first insurance is 10% of 100 (the base), not 10% of 150?
    // No: 10 G = 10% of 100 G (the base premium sum without item surcharges)
    // Actually the prompt says: "policy-wide modifiers (loyalty, first insurance, follow-up)
    // apply to the policy base premium (the sum of all item base premiums)"
    // Policy base premium = sum of item BASE premiums = 100 G (just the sword base, before surcharges)
    // First insurance = 10% of 100 = 10
    // Total = 100 (base) + 50 (cursed) + 10 (first insurance) = 160 + 5 fee = 165
    expect(result.results[0].premium).toBe(165);
  });
});

describe('Quote - Integration: Long-standing customer second contract', () => {
  it('premium = 160 G', () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] },
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 7, cursed: true },
        ] },
      ],
    });
    // Second quote:
    // Sword base: 100
    // Item surcharges: cursed 50% of 100 = 50, enchantment 30% of 100 = 30
    // Policy base premium (sum of item base premiums) = 100
    // Policy-wide: loyalty -20% of 100 = -20, first insurance +10% of 100 = +10, follow-up -15% of 100 = -15
    // Total = 100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 fee = 160
    expect(result.results[1].premium).toBe(160);
  });
});

describe('Quote - Modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet → 210 G before further modifiers and fee', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
        { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
      ] }],
    });
    // sword base 100, amulet base 60 → policy base = 160
    // cursed surcharge: 50% of 100 = 50 → item surcharges = 50
    // first insurance: 10% of 160 = 16
    // total before fee: 160 + 50 + 16 = 226 + 5 = 231
    expect(result.results[0].premium).toBe(231);
  });
});

describe('Claim - Standard reimbursement', () => {
  it('regular sword, damage 500 → payout 400 (full minus deductible)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack',
          damages: [{ itemType: 'sword', amount: 500 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });

  it('rune damage 200 → payout 100 (full minus deductible)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'rune', amount: 200 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(100);
  });
});

describe('Claim - Enchantment level >= 8 reimbursement', () => {
  it('enchantment 9, damage 1000 → payout 400 (50% then deductible)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack',
          damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });
});

describe('Claim - Dragon material reimbursement', () => {
  it('dragon material sword, enchantment 5, damage 800 → payout 700 (full minus deductible)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 800 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(700);
  });

  it('dragon material sword, enchantment 9, damage 1000 → payout 400 (50% wins, then deductible)', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });

  it('dragon material sword, enchantment 8, damage 1000 → payout 400', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 1000 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(400);
  });
});

describe('Claim - Deductible per damage event', () => {
  it('dragon attack damages sword (500) and amulet (300) → payout 600', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'amulet', amount: 300 },
          ],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(600);
  });
});

describe('Claim - Cap', () => {
  it('sword + amulet → insurance sum 1600, cap 3200', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 100 }],
        } },
      ],
    });
    // payout = 0 (100 - 100 deductible = 0)
    expect(result.results[1].payout).toBe(0);
    expect(result.results[1].remainingCap).toBe(3200);
  });

  it('sword + 3 runes → insurance sum 1750, cap not affected by block discount', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 200 }],
        } },
      ],
    });
    // insurance sum = 1000 + 3*250 = 1750, cap = 3500
    // payout = 200 - 100 = 100
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(3400);
  });

  it('cap exhaustion over two claims', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 1500 }],
        } },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 1500 }],
        } },
      ],
    });
    // Cap = 2000
    // First: 1500 - 100 = 1400, remaining 600
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    // Second: 1500 - 100 = 1400, but capped to 600, remaining 0
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  it('cursed item premium modifiers do not raise the cap', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 500 }],
        } },
      ],
    });
    // insurance value 1000, cap 2000
    expect(result.results[1].remainingCap).toBe(1600);
  });
});

describe('Claim - Multiple items of same type', () => {
  it('two swords insured → insurance sum 2000, cap 4000', () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
        ] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 500 },
          ],
        } },
      ],
    });
    // Each: 500 - 100 = 400; total payout = 800
    expect(result.results[1].payout).toBe(800);
    expect(result.results[1].remainingCap).toBe(3200);
  });
});

describe('Claim - Rounding payout down', () => {
  it('payout 350.5 → rounded down to 350', () => {
    // Need an enchantment 8+ item with odd damage to produce .5
    // enchant 9 sword, damage 901 → 50% = 450.5 - 100 = 350.5 → 350
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: 901 }],
        } },
      ],
    });
    expect(result.results[1].payout).toBe(350);
  });
});

describe('Error cases', () => {
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
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'amulet', amount: 200 }],
        } },
      ],
    })).toThrow();
  });

  it('negative damage amount → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: -200 }],
        } },
      ],
    })).toThrow();
  });

  it('more damage entries than insured items → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [
            { itemType: 'sword', amount: 200 },
            { itemType: 'sword', amount: 300 },
          ],
        } },
      ],
    })).toThrow();
  });

  it('unknown item type in damage → throws error', () => {
    expect(() => run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'fire',
          damages: [{ itemType: 'broomstick', amount: 200 }],
        } },
      ],
    })).toThrow();
  });
});

describe('Quote - Schema example from prompt', () => {
  it('long-standing customer with plain amulet', () => {
    const result = run({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [
          { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
        ] },
      ],
    });
    // amulet base: 60
    // no item surcharges (enchantment 2 < 5, not cursed)
    // policy base = 60
    // loyalty: -20% of 60 = -12
    // first insurance: +10% of 60 = +6
    // total before fee: 60 - 12 + 6 = 54 + 5 = 59
    expect(result.results[0].premium).toBe(59);
  });
});
