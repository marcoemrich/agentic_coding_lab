import { describe, it, expect } from 'vitest';
import { runScenario, Item } from './claim-office.js';

function premium(items: Item[], years = 0): number {
  const out = runScenario({
    customer: { yearsWithMHPCO: years },
    steps: [{ op: 'quote', items }],
  });
  return (out.results[0] as { premium: number }).premium;
}

describe('Item values and base premiums', () => {
  it('sword: 100 G base + 5 G fee = 105', () => {
    expect(premium([{ type: 'sword' }])).toBe(100 + 10 + 5); // first insurance 10
  });

  it('amulet: 60 G base + first ins 6 + 5 fee = 71', () => {
    expect(premium([{ type: 'amulet' }])).toBe(60 + 6 + 5);
  });

  it('staff: 80 G base + first ins 8 + 5 fee = 93', () => {
    expect(premium([{ type: 'staff' }])).toBe(80 + 8 + 5);
  });

  it('potion: 40 G base + first ins 4 + 5 fee = 49', () => {
    expect(premium([{ type: 'potion' }])).toBe(40 + 4 + 5);
  });

  it('single rune: 25 G base + first ins 2.5 + 5 fee = round up 33', () => {
    // 25 + 2.5 + 5 = 32.5 → round up 33
    expect(premium([{ type: 'rune' }])).toBe(33);
  });
});

describe('Building block of 3 alike components', () => {
  // base premiums shown; we test the policy base premium via the final premium
  // and subtract the fee/first-insurance to verify intent.
  it('2 runes → 50 G base premium', () => {
    // policyBase=50, first ins=5, fee=5 → 60
    expect(premium([{ type: 'rune' }, { type: 'rune' }])).toBe(50 + 5 + 5);
  });

  it('3 runes → 60 G base premium (block applies)', () => {
    // policyBase=60, first ins=6, fee=5 → 71
    expect(premium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(60 + 6 + 5);
  });

  it('4 runes → 100 G base premium (no block — block requires exactly 3)', () => {
    // policyBase = 60 (block of 3) + 25 (1 extra) = 85; spec says 100 (no block).
    // Re-reading: "A building block of 3 alike components is offered at a special base premium of 60 G."
    // 4 runes → spec says 100 G base premium "(no block — block requires exactly 3)"
    // So a count != 3 means NO block at all (4 runes = 4 * 25 = 100).
    // Then 7 runes → 175 = 7 * 25 (no block either, since 7 != 3 and presumably even multiple blocks
    // only apply if exact). Let me verify: 7 * 25 = 175. Yes — block requires EXACTLY 3.
    // So my impl is wrong. Skip this in the test (will fix impl).
    // policyBase=100, first ins=10, fee=5 → 115
    expect(premium([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(115);
  });

  it('7 runes → 175 G base premium', () => {
    // policyBase=175, first ins=17.5, fee=5 → 197.5 → round up 198
    expect(premium(Array(7).fill({ type: 'rune' }))).toBe(198);
  });
});

describe('"Alike" components', () => {
  it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
    // policyBase = 50 + 25 = 75; first ins 7.5; fee 5 → 87.5 → 88
    expect(premium([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
    // policyBase=60+60=120; first ins 12; fee 5 → 137
    expect(premium([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ])).toBe(137);
  });
});

describe('Modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet → 210 G before modifiers/fee', () => {
    // policyBase=160; cursed surcharge=50; first ins=16; fee=5
    // 160 + 50 + 16 + 5 = 231
    expect(premium([
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ])).toBe(231);
  });
});

describe('Modifier thresholds', () => {
  it('customer with exactly 2 years → loyalty discount applies', () => {
    // sword: policyBase=100; first ins=10; loyalty=-20; fee=5 → 95
    expect(premium([{ type: 'sword' }], 2)).toBe(95);
  });

  it('sword with exactly enchantment 5 → high-enchantment surcharge applies', () => {
    // policyBase=100; surcharge=30; first ins=10; fee=5 → 145
    expect(premium([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('cursed sword with enchantment 5 → both surcharges apply', () => {
    // policyBase=100; surcharge=50+30=80; first ins=10; fee=5 → 195
    expect(premium([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('sword with enchantment 4 → no high-enchantment surcharge', () => {
    // policyBase=100; first ins=10; fee=5 → 115
    expect(premium([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('cursed sword with enchantment 4 → only curse surcharge', () => {
    // policyBase=100; surcharge=50; first ins=10; fee=5 → 165
    expect(premium([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe('Claim processing — deductible', () => {
  it('dragon attack damages sword (500) + amulet (300) → payout 600', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'amulet', amount: 300 },
            ],
          },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(600);
  });
});

describe('Standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, ench 3), damage 500 → payout 400', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(400);
  });

  it('rune (value 250), damage 200 → payout 100', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] },
        },
      ],
    });
    const claim = out.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(100);
  });
});

describe('Enchantment threshold vs. dragon material', () => {
  it('dragon-material sword, ench 8, damage 1000 → payout 400', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });

  it('dragon-material sword, ench 9, damage 1000 → payout 400 (50% wins)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });

  it('dragon-material sword, ench 5, damage 800 → payout 700 (dragon only)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(700);
  });

  it('steel sword, ench 9, damage 1000 → payout 400 (high ench only)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });
});

describe('Multiple items of the same type', () => {
  it('policy of two swords → insurance sum 2000, cap 4000', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    // Each sword damage: 500-100=400; total 800
    expect((out.results[1] as any).payout).toBe(800);
    expect((out.results[1] as any).remainingCap).toBe(4000 - 800);
  });

  it('damages array has more entries of a type than insured → CLI rejects', () => {
    // Test the underlying error throw.
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon',
              damages: [
                { itemType: 'sword', amount: 200 },
                { itemType: 'sword', amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

describe('Cap exhaustion', () => {
  it('sword + amulet → insurance sum 1600, cap 3200', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 200 }] },
        },
      ],
    });
    // payout: 200-100=100; cap remaining 3200-100=3100
    expect((out.results[1] as any).payout).toBe(100);
    expect((out.results[1] as any).remainingCap).toBe(3100);
  });

  it('cursed sword has cap 2000 (premium modifiers do not raise cap)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 5000 }] },
        },
      ],
    });
    // raw payout: 5000-100=4900, capped at 2000
    expect((out.results[1] as any).payout).toBe(2000);
    expect((out.results[1] as any).remainingCap).toBe(0);
  });

  it('sword + 3 runes block → insurance sum 1750 (block discount affects premium only)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 4000 }] },
        },
      ],
    });
    // cap = 3500; raw payout 3900 → capped 3500
    expect((out.results[1] as any).payout).toBe(3500);
    expect((out.results[1] as any).remainingCap).toBe(0);
  });

  it('sword (cap 2000); two claims of 1500: first 1400 remaining 600, second 600 remaining 0', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(1400);
    expect((out.results[1] as any).remainingCap).toBe(600);
    expect((out.results[2] as any).payout).toBe(600);
    expect((out.results[2] as any).remainingCap).toBe(0);
  });
});

describe('Rounding in the MHPCO\'s favor', () => {
  it('premium 197.5 → 198 (rounded up)', () => {
    // 7 runes case = 197.5 → 198 (verified above)
    expect(premium(Array(7).fill({ type: 'rune' }))).toBe(198);
  });

  it('payout 350.5 → 350 (rounded down)', () => {
    // dragon-mat sword ench 8, damage 901 → reimbursed 450.5; -100 = 350.5 → 350
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 901 }] },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(350);
  });
});

describe('Edge cases', () => {
  it('empty item list → premium 5 G (processing fee only)', () => {
    expect(premium([])).toBe(5);
  });

  it('quote with unknown item type → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' } as any] }],
      }),
    ).toThrow();
  });

  it('claim references item type not in policy → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('claim references unknown item type → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  it('claim with negative damage amount → throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
});

describe('Integration examples', () => {
  it('Newcomer with cursed sword → premium 165', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] },
      ],
    });
    expect((out.results[0] as any).premium).toBe(165);
  });

  it("Long-standing customer's second contract → premium 160", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        // first quote — content doesn't matter for the 2nd quote's premium calc
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect((out.results[1] as any).premium).toBe(160);
  });
});

describe('Schema example from prompt', () => {
  it('amulet quote + amulet claim 200 — runs end to end', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
      ],
    });
    // Premium: policyBase=60; first ins 6; loyalty -12; fee 5 → 59
    expect((out.results[0] as any).premium).toBe(59);
    // Claim: 200-100=100; cap=1200; remaining=1100
    expect((out.results[1] as any).payout).toBe(100);
    expect((out.results[1] as any).remainingCap).toBe(1100);
  });
});
