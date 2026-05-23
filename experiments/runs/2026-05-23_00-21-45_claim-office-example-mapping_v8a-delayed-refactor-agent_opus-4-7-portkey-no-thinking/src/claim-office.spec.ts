import { describe, it, expect } from 'vitest';
import { runScenario, Scenario } from './claim-office.js';

function quote(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0, priorQuotes: Array<Record<string, unknown>>[] = []): number {
  const steps: Array<Record<string, unknown>> = [];
  for (const prior of priorQuotes) {
    steps.push({ op: 'quote', items: prior });
  }
  steps.push({ op: 'quote', items });
  const result = runScenario({
    customer: { yearsWithMHPCO },
    steps: steps as Scenario['steps'],
  });
  const last = result.results[result.results.length - 1] as { premium: number };
  return last.premium;
}

describe('Item values and base premiums', () => {
  it('sword: 100 G base premium (single item, newcomer first quote: 100 + 10 first ins + 5 fee = 115)', () => {
    expect(quote([{ type: 'sword' }])).toBe(115);
  });

  it('amulet: 60 G base (60 + 6 first ins + 5 fee = 71)', () => {
    expect(quote([{ type: 'amulet' }])).toBe(71);
  });

  it('staff: 80 G base (80 + 8 first ins + 5 fee = 93)', () => {
    expect(quote([{ type: 'staff' }])).toBe(93);
  });

  it('potion: 40 G base (40 + 4 first ins + 5 fee = 49)', () => {
    expect(quote([{ type: 'potion' }])).toBe(49);
  });

  it('rune: 25 G base (25 + 2.5 first ins → 27.5 + 5 fee = 32.5 → rounded up to 33)', () => {
    expect(quote([{ type: 'rune' }])).toBe(33);
  });

  it('moonstone: 25 G base (same as rune → 33)', () => {
    expect(quote([{ type: 'moonstone' }])).toBe(33);
  });
});

describe('Building block of 3 alike components', () => {
  // These tests assert the base premium contribution; we deduce by single-component quote
  // For these we test by checking premium with newcomer first quote: policy base + 10% first ins + 5 fee
  it('2 runes → 50 G base (50 + 5 first ins + 5 fee = 60)', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('3 runes → 60 G base (block applies; 60 + 6 first ins + 5 fee = 71)', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(71);
  });

  it('4 runes → 100 G base (no block; 100 + 10 first ins + 5 fee = 115)', () => {
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(115);
  });

  it('7 runes → 175 G base (no block — block requires exactly 3); 175 + 17.5 first ins + 5 fee = 197.5 → 198', () => {
    expect(quote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' },
    ])).toBe(198);
  });
});

describe('"Alike" components', () => {
  it('2 runes + 1 moonstone → 75 G base (no block: different types)', () => {
    // 75 + 7.5 + 5 = 87.5 → 88
    expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 G base (two separate blocks)', () => {
    // 120 + 12 + 5 = 137
    expect(quote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ])).toBe(137);
  });
});

describe('Modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet → policy base 160 + curse 50 = 210; +21 first ins + 5 fee = 236', () => {
    // 160 + 50 (item surcharge from cursed sword) + 160*0.1 first ins = 226; +5 = 231
    // Wait: spec says "210 G before further modifiers and fee" — so policy base 160 + curse 50 = 210
    // Then first insurance +10% of 160 = 16; total = 210 + 16 + 5 = 231
    expect(quote([
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ])).toBe(231);
  });
});

describe('Modifier thresholds', () => {
  it('customer with exactly 2 years gets loyalty discount: sword premium', () => {
    // sword: base 100, no item surcharge, policyMods: -20 loyalty + 10 first ins = -10
    // total = 100 - 10 + 5 = 95
    expect(quote([{ type: 'sword' }], 2)).toBe(95);
  });

  it('sword with exactly enchantment 5 gets high-enchantment surcharge: 100 + 30 + 10 + 5 = 145', () => {
    expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('sword with enchantment 5 and cursed: both surcharges apply 100 + 50 + 30 + 10 + 5 = 195', () => {
    expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
  });

  it('sword with enchantment 4: no high-enchantment surcharge (100 + 10 + 5 = 115)', () => {
    expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('sword with enchantment 4 cursed: only curse surcharge (100 + 50 + 10 + 5 = 165)', () => {
    expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
  });
});

describe('Integration: newcomer with a cursed sword (spec example)', () => {
  it('0 years, cursed sword (steel, enchantment 3) → 165 G', () => {
    expect(quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], 0)).toBe(165);
  });
});

describe('Integration: long-standing customer second contract (spec example)', () => {
  it('3 years, second quote, cursed sword (steel, enchantment 7) → 160 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect((result.results[1] as { premium: number }).premium).toBe(160);
  });
});

describe('Standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, enchant 3), damage 500 G → payout 400 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(400);
    expect(claim.remainingCap).toBe(2000 - 400);
  });

  it('rune (insurance 250 G), damage 200 G → payout 100 G', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'spill', damages: [{ itemType: 'rune', amount: 200 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(100);
  });
});

describe('Enchantment threshold vs. dragon material', () => {
  it('dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% wins, then deductible)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  it('dragon-material sword, enchantment 5, damage 800 → payout 700 (dragon clause, then deductible)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(700);
  });

  it('steel sword, enchantment 9, damage 1000 → payout 400 (50% then deductible)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });

  it('dragon-material sword with exactly enchantment 8, damage 1000 → payout 400', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(400);
  });
});

describe('Deductible per damage event', () => {
  it('dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon attack',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'amulet', amount: 300 },
          ],
        } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(600);
  });
});

describe('Multiple items of the same type', () => {
  it('two swords → insurance sum 2000, cap 4000', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(400);
    expect(claim.remainingCap).toBe(4000 - 400);
  });

  it('two swords damaged separately each gets its own deductible (500 + 500 dmg → 400 + 400)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 500 },
          ],
        } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(800);
  });

  it('more sword damages than insured swords → CLI/exception rejects', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: {
          cause: 'dragon',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 500 },
          ],
        } },
      ],
    })).toThrow();
  });
});

describe('Cap exhaustion', () => {
  it('sword + amulet → insurance sum 1600, cap 3200', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.payout).toBe(100);
    expect(claim.remainingCap).toBe(3200 - 100);
  });

  it('cursed sword → cap 2000 (based on unmodified insurance value)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: 100 }] } },
      ],
    });
    const claim = result.results[1] as { payout: number; remainingCap: number };
    expect(claim.remainingCap).toBe(2000);
  });

  it('sword + 3 runes (block) → insurance sum 1750 G; block does not affect insurance sum', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword' },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    });
    expect((result.results[1] as { remainingCap: number }).remainingCap).toBe(1750 * 2 - 100);
  });

  it('sword (cap 2000), two successive claims of 1500 each: first 1400 (remaining 600), second 600 (remaining 0)', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    const c1 = result.results[1] as { payout: number; remainingCap: number };
    const c2 = result.results[2] as { payout: number; remainingCap: number };
    expect(c1.payout).toBe(1400);
    expect(c1.remainingCap).toBe(600);
    expect(c2.payout).toBe(600);
    expect(c2.remainingCap).toBe(0);
  });
});

describe('Rounding in the MHPCO\'s favor', () => {
  it('premium yielding 197.5 G → rounded up to 198 G', () => {
    // 7 runes: base 175 (no block); first ins 17.5; +5 fee = 197.5 → 198
    expect(quote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'rune' },
    ])).toBe(198);
  });

  it('payout yielding 350.5 G → rounded down to 350 G', () => {
    // Construct a half-damage clause: high-enchant sword damage 901 → 450.5 - 100 = 350.5 → 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: 901 }] } },
      ],
    });
    expect((result.results[1] as { payout: number }).payout).toBe(350);
  });
});

describe('Edge cases', () => {
  it('empty item list → premium 5 G (processing fee only)', () => {
    expect(quote([])).toBe(5);
  });

  it('unknown item type in quote → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow();
  });

  it('claim references item not in policy → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'amulet', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim references unknown item type → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'broomstick', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim damage amount -200 → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'test', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    })).toThrow();
  });
});

describe('Schema example from spec', () => {
  it('amulet quote then claim (silver enchant 2, damage 200) yields integer premium and payout 100, remainingCap 1100', () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    const q = result.results[0] as { premium: number };
    const c = result.results[1] as { payout: number; remainingCap: number };
    // amulet base 60, no item surcharge, policyMods: loyalty -12 + first ins +6 = -6; total = 60 - 6 + 5 = 59
    expect(q.premium).toBe(59);
    // payout: 200 - 100 = 100; cap = 1200; remainingCap = 1100
    expect(c.payout).toBe(100);
    expect(c.remainingCap).toBe(1100);
  });
});
