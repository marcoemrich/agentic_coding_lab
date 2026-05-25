import { describe, it, expect } from 'vitest';
import { processScenario, computeQuote, Scenario } from './claimOffice.js';

function quote(items: any[], years = 0, quoteIndex = 0): number {
  return computeQuote(items, { customer: { yearsWithMHPCO: years }, quoteIndex }).premium;
}

function runScenario(scenario: Scenario) {
  return processScenario(scenario);
}

describe('Item values and base premiums (per-item)', () => {
  it('sword: 100 G base + 5 G fee = 105 G for newcomer first quote', () => {
    // 100*1.1 + 5 = 115
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('amulet: 60 G base, newcomer => 60*1.1 + 5 = 71', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });

  it('staff: 80 G base, newcomer => 80*1.1 + 5 = 93', () => {
    expect(quote([{ type: 'staff' }])).toBe(93);
  });

  it('potion: 40 G base, newcomer => 40*1.1 + 5 = 49', () => {
    expect(quote([{ type: 'potion' }])).toBe(49);
  });
});

describe('Building block of 3 alike components (base premiums in isolation)', () => {
  // Test in isolation by checking policy base via direct scenarios.
  // We use a long-standing customer's *first* contract where loyalty (-20%) + first-ins (+10%) = -10%.
  // Easier: just inspect computeQuote output and subtract the known overhead.

  it('2 runes -> 50 G base premium', () => {
    // No surcharges; multiplier = 1.1 for newcomer
    // premium = 50*1.1 + 5 = 60
    expect(quote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('3 runes -> 60 G base premium (block applies)', () => {
    // 60*1.1 + 5 = 71
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
  });

  it('4 runes -> 100 G base premium (no block — block requires exactly 3)', () => {
    // Spec says "block requires exactly 3". 4 runes = 4*25 = 100 (block doesn't apply to 4).
    // premium = 100*1.1 + 5 = 115
    expect(quote(Array(4).fill({ type: 'rune' }))).toBe(115);
  });

  it('7 runes -> 175 G base premium', () => {
    // 7 runes: 175 (no block since "exactly 3" — actually the wording is ambiguous; spec says 7→175 base)
    // 175*1.1 + 5 = 197.5 -> 198
    expect(quote(Array(7).fill({ type: 'rune' }))).toBe(198);
  });
});

describe('"Alike" components clarifying question (❓)', () => {
  it('2 runes + 1 moonstone -> 75 G base premium (no block: different types)', () => {
    // 2*25 + 25 = 75. 75*1.1 + 5 = 87.5 -> 88
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(88);
  });

  it('3 runes + 3 moonstones -> 120 G base premium (two separate blocks)', () => {
    // 60 + 60 = 120. 120*1.1 + 5 = 137
    expect(
      quote([
        { type: 'rune' },
        { type: 'rune' },
        { type: 'rune' },
        { type: 'moonstone' },
        { type: 'moonstone' },
        { type: 'moonstone' },
      ]),
    ).toBe(137);
  });
});

describe('Modifier scope on multi-item policies (❓)', () => {
  it('cursed sword + plain amulet (newcomer 1st quote): 160 base + 50 curse + first-ins on 160 + fee', () => {
    // policyBase=160; item surcharges = 50 (cursed sword's 50% of 100)
    // policy-wide multiplier (newcomer, 1st quote) = 1 + 0.1 = 1.1
    // total = 160*1.1 + 50 + 5 = 176 + 50 + 5 = 231
    const items = [
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ];
    expect(quote(items)).toBe(231);
  });
});

describe('Modifier thresholds', () => {
  it('customer with exactly 2 years -> loyalty discount applies', () => {
    // sword alone, 2 years, 1st quote: 100*(1-0.2+0.1) + 5 = 100*0.9 + 5 = 95
    expect(quote([{ type: 'sword' }], 2, 0)).toBe(95);
  });

  it('sword with exactly enchantment 5 -> high-enchantment surcharge applies', () => {
    // 100*1.1 + 100*0.3 + 5 = 110 + 30 + 5 = 145
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('sword with exactly enchantment 5 AND cursed -> both surcharges apply', () => {
    // 100*1.1 + 100*(0.3+0.5) + 5 = 110 + 80 + 5 = 195
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('sword with enchantment 4 -> no high-ench surcharge; cursed surcharge applies only if cursed', () => {
    // Not cursed, ench 4: 100*1.1 + 5 = 115
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
    // Cursed, ench 4: 100*1.1 + 50 + 5 = 165
    expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
  });

  it('dragon-material sword with exactly enchantment 8, damage 1000 G -> payout 400 G', () => {
    // Both clauses; 50% wins → 500; minus deductible 100 = 400.
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });
});

describe('Deductible per damage event', () => {
  it('dragon attack damages sword (500) and amulet (300); payout = 600 (deductible per item)', () => {
    // Both items have no special clauses. payout = (500-100) + (300-100) = 400 + 200 = 600
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'amulet', amount: 300 },
            ],
          },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(600);
  });
});

describe('Standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, ench 3), damage 500 -> payout 400', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });

  it('damage to a rune (value 250), damage 200 -> payout 100', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'rune', amount: 200 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(100);
  });
});

describe('Enchantment threshold vs. dragon material', () => {
  it('dragon sword ench 9, damage 1000 -> payout 400 (50% wins, then deductible)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });

  it('dragon sword ench 5, damage 800 -> payout 700 (dragon only, full then deductible)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 800 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(700);
  });

  it('steel sword ench 9, damage 1000 -> payout 400 (high-ench: 50% then deductible)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(400);
  });
});

describe('Multiple items of the same type (❓)', () => {
  it('two swords -> insurance sum 2000, cap 4000', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } },
      ],
    });
    expect((out.results[1] as any).remainingCap).toBe(4000);
  });

  it('two sword damages with two swords insured -> each has its own deductible', () => {
    // 2 swords; damage each 500 → (500-100)+(500-100) = 800
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'dragon attack',
            damages: [
              { itemType: 'sword', amount: 500 },
              { itemType: 'sword', amount: 500 },
            ],
          },
        },
      ],
    });
    expect((out.results[1] as any).payout).toBe(800);
  });

  it('two sword damages but only one sword insured -> CLI rejects (non-zero exit)', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'dragon attack',
              damages: [
                { itemType: 'sword', amount: 500 },
                { itemType: 'sword', amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});

describe('Cap exhaustion', () => {
  it('sword + amulet -> insurance sum 1600, cap 3200', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } },
      ],
    });
    expect((out.results[1] as any).remainingCap).toBe(3200);
  });

  it('cursed sword -> cap 2000 (based on unmodified insurance value)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } },
      ],
    });
    expect((out.results[1] as any).remainingCap).toBe(2000);
  });

  it('sword + 3 runes (block) -> insurance sum 1750 (block discount affects premium only)', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [] } },
      ],
    });
    expect((out.results[1] as any).remainingCap).toBe(3500); // 1750 * 2
  });

  it('sword insured (cap 2000); two successive claims of 1500 each: 1400 then 600', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    const first = out.results[1] as any;
    const second = out.results[2] as any;
    expect(first.payout).toBe(1400);
    expect(first.remainingCap).toBe(600);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe('Rounding in the MHPCO\'s favor', () => {
  it('premium that yields 197.5 G -> final premium 198 G (rounded up)', () => {
    // 7 runes (175 base), newcomer 1st quote: 175*1.1 + 5 = 192.5 + 5 = 197.5 -> 198
    expect(quote(Array(7).fill({ type: 'rune' }))).toBe(198);
  });

  it('payout that yields 350.5 G -> final payout 350 G (rounded down)', () => {
    // High-ench sword (ench 8): damage 901 -> 901*0.5 - 100 = 450.5 - 100 = 350.5
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 901 }] } },
      ],
    });
    expect((out.results[1] as any).payout).toBe(350);
  });
});

describe('Edge cases', () => {
  it('empty item list -> premium 5 G (only the processing fee)', () => {
    expect(quote([])).toBe(5);
  });

  it('quote includes unknown item type -> throws (CLI exits non-zero)', () => {
    expect(() => quote([{ type: 'broomstick' }])).toThrow();
  });

  it('claim references a damage entry whose item is not in the policy -> throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 100 }] } },
        ],
      }),
    ).toThrow();
  });

  it('claim with unknown damage item type -> throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'broomstick', amount: 100 }] } },
        ],
      }),
    ).toThrow();
  });

  it('claim with negative damage amount -> throws', () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword' }] },
          { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } },
        ],
      }),
    ).toThrow();
  });
});

describe('Integration: Newcomer with a cursed sword', () => {
  it('0 years, no previous contract, cursed sword (steel, ench 3) -> premium 165 G', () => {
    expect(
      quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], 0, 0),
    ).toBe(165);
  });
});

describe('Integration: Long-standing customer\'s second contract (❓ first insurance per item)', () => {
  it('3 years, 2nd quote, cursed sword (steel, ench 7) -> premium 160 G', () => {
    // Scenario: two quotes, second one is the test
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] }, // dummy first quote
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect((out.results[1] as any).premium).toBe(160);
  });

  it('first insurance surcharge still applies to a new sword for a long-standing customer (per-item)', () => {
    // Same calc as above demonstrates the +10 first-insurance applies
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect((out.results[1] as any).premium).toBe(160);
  });
});

describe('CLI input/output format', () => {
  it('schema example: amulet quote + amulet claim, damage 200 G', () => {
    // customer: 5 years (loyalty), 1st quote
    // amulet base 60; multiplier 1 - 0.2 + 0.1 = 0.9 → 60*0.9 + 5 = 54 + 5 = 59
    // cap = 600 * 2 = 1200
    // claim: amulet damage 200, no special clauses (silver material) → 200 - 100 = 100 payout
    const out = runScenario({
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
    expect(out.results).toHaveLength(2);
    expect((out.results[0] as any).premium).toBe(59);
    expect((out.results[1] as any).payout).toBe(100);
    expect((out.results[1] as any).remainingCap).toBe(1100);
  });
});
