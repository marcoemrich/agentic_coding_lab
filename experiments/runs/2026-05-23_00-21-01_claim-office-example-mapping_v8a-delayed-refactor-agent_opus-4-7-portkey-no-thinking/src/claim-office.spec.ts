import { describe, it, expect } from 'vitest';
import { runScenario, type Scenario } from './claim-office.js';

// Helpers
function quoteOnly(items: any[], yearsWithMHPCO = 0): number {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [{ op: 'quote', items }],
  };
  const result = runScenario(scenario).results[0];
  if (!('premium' in result)) throw new Error('expected quote result');
  return result.premium;
}

function claimFor(
  quoteItems: any[],
  damages: Array<{ itemType: string; amount: number }>,
  yearsWithMHPCO = 0,
): { payout: number; remainingCap: number } {
  const scenario: Scenario = {
    customer: { yearsWithMHPCO },
    steps: [
      { op: 'quote', items: quoteItems },
      { op: 'claim', policy: 0, incident: { cause: 'test', damages } },
    ],
  };
  const result = runScenario(scenario).results[1];
  if (!('payout' in result)) throw new Error('expected claim result');
  return result;
}

describe('quote: base premiums per item type', () => {
  // Newcomer (0 years, 1st contract) with one plain item:
  // base + 10% first insurance + 5 fee
  it('sword (plain): 100 base + 10 first + 5 fee = 115 G', () => {
    expect(quoteOnly([{ type: 'sword' }])).toBe(115);
  });
  it('amulet (plain): 60 base + 6 first + 5 fee = 71 G', () => {
    expect(quoteOnly([{ type: 'amulet' }])).toBe(71);
  });
  it('staff (plain): 80 base + 8 first + 5 fee = 93 G', () => {
    expect(quoteOnly([{ type: 'staff' }])).toBe(93);
  });
  it('potion (plain): 40 base + 4 first + 5 fee = 49 G', () => {
    expect(quoteOnly([{ type: 'potion' }])).toBe(49);
  });
});

describe('quote: component block of 3 alike', () => {
  // The spec examples list BASE premiums; total premium includes 10% first + 5 fee.
  it('2 runes → 50 G base premium (no block)', () => {
    // 50 + 5 first + 5 fee = 60
    expect(quoteOnly([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });
  it('3 runes → 60 G base premium (block applies)', () => {
    // 60 + 6 first + 5 fee = 71
    expect(quoteOnly([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
  });
  it('4 runes → 100 G base premium (no full block coverage: 60 + 25)', () => {
    // 100 + 10 first + 5 fee = 115
    expect(
      quoteOnly([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
    ).toBe(115);
  });
  it('7 runes → 175 G base premium (2 blocks + 1 leftover: 60+60+25)', () => {
    // 175 + 17.5 first + 5 fee = 197.5 → ceil = 198
    const items = Array(7).fill({ type: 'rune' });
    expect(quoteOnly(items)).toBe(198);
  });
});

describe('quote: "alike" components — clarified to same type', () => {
  it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
    // 75 + 7.5 first + 5 fee = 87.5 → 88
    expect(
      quoteOnly([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }]),
    ).toBe(88);
  });
  it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
    // 120 + 12 first + 5 fee = 137
    expect(
      quoteOnly([
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

describe('quote: modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet: policy base 160 G, +50 G curse = 210 before policy mods', () => {
    // policyBase = 160, itemSurcharges = 50 (cursed sword), total = 210
    // first insurance = 16, +5 fee = 231
    const items = [
      { type: 'sword', cursed: true, material: 'steel', enchantment: 3 },
      { type: 'amulet', material: 'silver', enchantment: 2, cursed: false },
    ];
    expect(quoteOnly(items)).toBe(231);
  });
});

describe('quote: modifier thresholds', () => {
  it('customer with exactly 2 years → loyalty discount applies (20%)', () => {
    // sword plain: 100 base, -20 loyalty + 10 first + 5 fee = 95
    expect(quoteOnly([{ type: 'sword' }], 2)).toBe(95);
  });
  it('sword with exactly enchantment 5 → high-enchantment surcharge applies', () => {
    // 100 + 30 high ench + 10 first + 5 fee = 145
    expect(quoteOnly([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });
  it('sword with enchantment 5 cursed → both surcharges apply', () => {
    // 100 + 30 high + 50 cursed + 10 first + 5 fee = 195
    expect(quoteOnly([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });
  it('sword with enchantment 4 plain → no surcharges (just base + first + fee)', () => {
    expect(quoteOnly([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });
  it('sword with enchantment 4 cursed → only curse surcharge', () => {
    // 100 + 50 + 10 + 5 = 165
    expect(quoteOnly([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe('claim: deductible per damage event', () => {
  it('dragon attack damages sword (500) and amulet (300) → payout 600 G (100 deductible per item)', () => {
    // both items plain (no special clauses), so reimbursable = damage amount
    // sword: 500-100=400; amulet: 300-100=200; total 600
    const result = claimFor(
      [{ type: 'sword' }, { type: 'amulet' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    );
    expect(result.payout).toBe(600);
  });
});

describe('claim: standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, ench 3), damage 500 → payout 400', () => {
    const result = claimFor(
      [{ type: 'sword', material: 'steel', enchantment: 3 }],
      [{ itemType: 'sword', amount: 500 }],
    );
    expect(result.payout).toBe(400);
  });
  it('rune, damage 200 → payout 100 (no enchantment/material on runes, no special clause)', () => {
    const result = claimFor(
      [{ type: 'rune' }],
      [{ itemType: 'rune', amount: 200 }],
    );
    expect(result.payout).toBe(100);
  });
});

describe('claim: enchantment threshold vs dragon material', () => {
  it('dragon sword, enchantment 9, damage 1000 → payout 400 (50% clause wins, then deductible)', () => {
    const result = claimFor(
      [{ type: 'sword', material: 'dragon', enchantment: 9 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });
  it('dragon sword, enchantment 5, damage 800 → payout 700 (only dragon clause, full then deductible)', () => {
    const result = claimFor(
      [{ type: 'sword', material: 'dragon', enchantment: 5 }],
      [{ itemType: 'sword', amount: 800 }],
    );
    expect(result.payout).toBe(700);
  });
  it('steel sword, enchantment 9, damage 1000 → payout 400 (only high-enchantment, 50% then deductible)', () => {
    const result = claimFor(
      [{ type: 'sword', material: 'steel', enchantment: 9 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });
  it('dragon sword, exactly enchantment 8, damage 1000 → payout 400 (high-enchantment clause applies, then deductible)', () => {
    // Spec: "dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G
    // (high-enchantment clause applies, then deductible)"
    // 1000 * 0.5 = 500, 500-100 = 400
    const result = claimFor(
      [{ type: 'sword', material: 'dragon', enchantment: 8 }],
      [{ itemType: 'sword', amount: 1000 }],
    );
    expect(result.payout).toBe(400);
  });
});

describe('claim: multiple items of the same type (clarified)', () => {
  it('policy covers two swords → insurance sum 2000, cap 4000', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: {
            cause: 'noop',
            damages: [{ itemType: 'sword', amount: 0 }],
          },
        },
      ],
    };
    const r = runScenario(scenario).results[1];
    if (!('payout' in r)) throw new Error('claim');
    // amount 0 → reimbursable 0 → after deductible 0; cap stays at 4000
    expect(r.remainingCap).toBe(4000);
  });
  it('two damage entries for two-sword policy: each treated separately with own deductible', () => {
    const result = claimFor(
      [{ type: 'sword' }, { type: 'sword' }],
      [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    );
    // each: 500-100=400, total 800
    expect(result.payout).toBe(800);
  });
  it('damages contain more entries of a type than policy covers → CLI exits non-zero (function throws)', () => {
    expect(() =>
      claimFor(
        [{ type: 'sword' }],
        [
          { itemType: 'sword', amount: 100 },
          { itemType: 'sword', amount: 100 },
        ],
      ),
    ).toThrow();
  });
});

describe('claim: cap exhaustion', () => {
  it('policy covers sword + amulet → insurance sum 1600, cap 3200', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'noop', damages: [{ itemType: 'sword', amount: 0 }] },
        },
      ],
    };
    const r = runScenario(scenario).results[1];
    if (!('payout' in r)) throw new Error('claim');
    expect(r.remainingCap).toBe(3200);
  });
  it('cursed sword → cap based on unmodified insurance value: cap 2000', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'noop', damages: [{ itemType: 'sword', amount: 0 }] },
        },
      ],
    };
    const r = runScenario(scenario).results[1];
    if (!('payout' in r)) throw new Error('claim');
    expect(r.remainingCap).toBe(2000);
  });
  it('sword + 3 runes (block) → insurance sum 1750 G (block discount does not affect insurance sum)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: 'quote',
          items: [
            { type: 'sword' },
            { type: 'rune' },
            { type: 'rune' },
            { type: 'rune' },
          ],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'noop', damages: [{ itemType: 'sword', amount: 0 }] },
        },
      ],
    };
    const r = runScenario(scenario).results[1];
    if (!('payout' in r)) throw new Error('claim');
    expect(r.remainingCap).toBe(3500); // cap = 2 * 1750
  });
  it('sword insured, cap 2000; two successive claims of 1500 G', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'c1', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'c2', damages: [{ itemType: 'sword', amount: 1500 }] },
        },
      ],
    };
    const results = runScenario(scenario).results;
    const c1 = results[1] as { payout: number; remainingCap: number };
    const c2 = results[2] as { payout: number; remainingCap: number };
    expect(c1.payout).toBe(1400);
    expect(c1.remainingCap).toBe(600);
    expect(c2.payout).toBe(600);
    expect(c2.remainingCap).toBe(0);
  });
});

describe('rounding in the MHPCO\'s favor', () => {
  it('premium calc yielding 197.5 → 198 (rounded up)', () => {
    // 7 runes: base 175 + 17.5 first + 5 fee = 197.5 → 198
    const items = Array(7).fill({ type: 'rune' });
    expect(quoteOnly(items)).toBe(198);
  });
  it('payout calc yielding 350.5 → 350 (rounded down)', () => {
    // Two damages, each (X*0.5 - 100) summed to 350.5
    // High-enchantment sword: damage 901 → 450.5 - 100 = 350.5
    const result = claimFor(
      [{ type: 'sword', enchantment: 9 }],
      [{ itemType: 'sword', amount: 901 }],
    );
    expect(result.payout).toBe(350);
  });
});

describe('edge cases', () => {
  it('empty item list → premium 5 (only processing fee)', () => {
    expect(quoteOnly([])).toBe(5);
  });
  it('quote with unknown item type → throws (CLI exits non-zero)', () => {
    expect(() => quoteOnly([{ type: 'broomstick' }])).toThrow();
  });
  it('claim references item not in policy → throws', () => {
    expect(() =>
      claimFor([{ type: 'sword' }], [{ itemType: 'amulet', amount: 100 }]),
    ).toThrow();
  });
  it('claim references unknown item type → throws', () => {
    expect(() =>
      claimFor([{ type: 'sword' }], [{ itemType: 'broomstick', amount: 100 }]),
    ).toThrow();
  });
  it('claim contains negative damage amount → throws', () => {
    expect(() =>
      claimFor([{ type: 'sword' }], [{ itemType: 'sword', amount: -200 }]),
    ).toThrow();
  });
});

describe('integration: newcomer with a cursed sword', () => {
  it('0 years, no previous; cursed sword (steel, ench 3); premium 165', () => {
    // 100 base + 50 curse + 10 first + 5 fee = 165
    expect(
      quoteOnly([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], 0),
    ).toBe(165);
  });
});

describe("integration: long-standing customer's second contract", () => {
  it('3 years, second quote; cursed sword (steel, ench 7); premium 160', () => {
    // policyBase=100; itemSurcharges=50+30=80; subtotal=180
    // loyalty -20; first +10; follow-up -15; fee +5 → 160
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] }, // first contract (any items)
        {
          op: 'quote',
          items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
        },
      ],
    };
    const r = runScenario(scenario).results[1];
    if (!('premium' in r)) throw new Error('quote');
    expect(r.premium).toBe(160);
  });
  it('first insurance surcharge applies to a new item even for a follow-up contract', () => {
    // The clarifying question: each item in a quote is treated as a first insurance,
    // regardless of customer history. Tested implicitly by the 160 G example above.
    // Additional check: a follow-up contract still gets +10% first insurance term.
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] }, // first
        { op: 'quote', items: [{ type: 'sword' }] }, // follow-up
      ],
    };
    const r = runScenario(scenario).results[1];
    if (!('premium' in r)) throw new Error('quote');
    // policyBase=100; subtotal=100; first +10; follow-up -15; fee +5 = 100
    expect(r.premium).toBe(100);
  });
});

describe('scenario sequencing: results length matches steps and order is preserved', () => {
  it('quote, claim, quote → 3 results in order', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 200 }] },
        },
        { op: 'quote', items: [{ type: 'amulet' }] },
      ],
    };
    const results = runScenario(scenario).results;
    expect(results.length).toBe(3);
    expect('premium' in results[0]).toBe(true);
    expect('payout' in results[1]).toBe(true);
    expect('premium' in results[2]).toBe(true);
  });
});
