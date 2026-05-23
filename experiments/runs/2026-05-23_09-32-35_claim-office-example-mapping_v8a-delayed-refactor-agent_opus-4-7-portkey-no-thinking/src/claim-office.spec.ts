import { describe, it, expect } from 'vitest';
import { runScenario, Scenario } from './claim-office.js';

function runQuote(items: any[], yearsWithMHPCO = 0, priorQuotes = 0): number {
  const steps: any[] = [];
  for (let i = 0; i < priorQuotes; i++) {
    steps.push({ op: 'quote', items: [] });
  }
  steps.push({ op: 'quote', items });
  const scenario: Scenario = { customer: { yearsWithMHPCO }, steps };
  const result = runScenario(scenario);
  return (result.results[priorQuotes] as { premium: number }).premium;
}

describe('Item values and base premiums (main items)', () => {
  it('sword: 1000 G insurance value, 100 G base premium → 110 G (100 + 10 first insurance + 5 fee = 115 — wait recompute)', () => {
    // Single sword, newcomer (0 years, first contract):
    // base 100 + first-insurance 10 + fee 5 = 115
    expect(runQuote([{ type: 'sword' }])).toBe(115);
  });

  it('amulet: 600 G insurance value, 60 G base premium → 71 G premium', () => {
    // base 60 + first-ins 6 = 66 + fee 5 = 71
    expect(runQuote([{ type: 'amulet' }])).toBe(71);
  });

  it('staff: 800 G insurance value, 80 G base premium → 93 G premium', () => {
    // base 80 + first-ins 8 = 88 + fee 5 = 93
    expect(runQuote([{ type: 'staff' }])).toBe(93);
  });

  it('potion: 400 G insurance value, 40 G base premium → 49 G premium', () => {
    // base 40 + first-ins 4 = 44 + fee 5 = 49
    expect(runQuote([{ type: 'potion' }])).toBe(49);
  });
});

describe('Components (runes, moonstones)', () => {
  it('single rune: 250 G insurance value, 25 G base premium → 33 G premium', () => {
    // base 25 + first-ins 2.5 = 27.5 + fee 5 = 32.5 → ceil → 33
    expect(runQuote([{ type: 'rune' }])).toBe(33);
  });

  it('single moonstone: 25 G base premium → 33 G premium', () => {
    expect(runQuote([{ type: 'moonstone' }])).toBe(33);
  });
});

describe('Building block of 3 alike components', () => {
  it('2 runes → 50 G base premium', () => {
    // base 50 + first-ins 5 = 55 + fee 5 = 60
    expect(runQuote([{ type: 'rune' }, { type: 'rune' }])).toBe(60);
  });

  it('3 runes → 60 G base premium (block applies)', () => {
    // base 60 + first-ins (each rune treated separately: 3 * 2.5 = 7.5)
    // total 60 + 7.5 = 67.5 + 5 = 72.5 → ceil 73
    expect(runQuote([{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }])).toBe(73);
  });

  it('4 runes → 100 G base premium (no block — block requires exactly 3)', () => {
    // base 100 + first-ins 4*2.5 = 10 + fee 5 = 115
    expect(runQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
    ])).toBe(115);
  });

  it('7 runes → 175 G base premium (2 blocks of 3 + 1 leftover = 60+60+25 = 145? No wait — spec says 175)', () => {
    // Spec example: 7 runes → 175 G base premium.
    // 7/3 = 2 blocks (120 G) + 1 rune (25 G) = 145 G. But spec says 175 G.
    // Re-reading spec: "A building block of 3 alike components is offered at a special base premium of 60 G."
    // 7 runes: only one possible block? Or multiple blocks? The example says 175 G.
    // 175 = 7 * 25 = no block applies for 7 runes. So block only applies when count == 3 exactly?
    // The example "4 runes → 100 G (no block — block requires exactly 3)" confirms exactly 3.
    // So 7 runes → 175 G (7 * 25, no block).
    // Premium: 175 + first-ins 7*2.5 = 175 + 17.5 = 192.5 + 5 = 197.5 → ceil 198
    expect(runQuote(Array(7).fill({ type: 'rune' }))).toBe(198);
  });
});

describe('"Alike" components — block requires exact same type', () => {
  it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
    // 2 runes (50) + 1 moonstone (25) = 75
    // first-ins: 3 * 2.5 = 7.5; total 75 + 7.5 + 5 = 87.5 → ceil 88
    expect(runQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
    ])).toBe(88);
  });

  it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
    // base 60 + 60 = 120; first-ins 6 * 2.5 = 15; total 120+15+5 = 140
    expect(runQuote([
      { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
    ])).toBe(140);
  });
});

describe('Premium modifiers', () => {
  it('cursed item adds 50% risk surcharge to the item base', () => {
    // cursed sword: 100 + 50 + 10 first-ins + 5 fee = 165
    expect(runQuote([{ type: 'sword', cursed: true }])).toBe(165);
  });

  it('high-enchantment (≥5) adds 30% surcharge', () => {
    // sword enchant 5: 100 + 30 + 10 first-ins + 5 = 145
    expect(runQuote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('enchantment 4 → no high-enchantment surcharge', () => {
    // sword enchant 4: 100 + 10 first-ins + 5 = 115
    expect(runQuote([{ type: 'sword', enchantment: 4 }])).toBe(115);
  });

  it('cursed + high-enchantment: both surcharges apply', () => {
    // sword cursed enchant 5: 100 + 50 + 30 + 10 first-ins + 5 = 195
    expect(runQuote([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195);
  });

  it('long-standing customer (≥2 years) gets 20% loyalty discount on policy base', () => {
    // sword, 2 years: 100 + 10 first-ins - 20 loyalty + 5 = 95
    expect(runQuote([{ type: 'sword' }], 2)).toBe(95);
  });

  it('customer with 1 year → no loyalty discount', () => {
    // sword, 1 year: 100 + 10 first-ins + 5 = 115
    expect(runQuote([{ type: 'sword' }], 1)).toBe(115);
  });

  it('first insurance carries 10% initial assessment surcharge per item', () => {
    // already tested above (115 for plain sword); this confirms per-item nature
    expect(runQuote([{ type: 'sword' }, { type: 'amulet' }])).toBe(
      // base 160 + first-ins (10 + 6 = 16) + 5 fee = 181
      181,
    );
  });

  it('follow-up contract: 15% discount on policy base', () => {
    // 2nd quote, 0 years, plain sword:
    // base 100 + first-ins 10 - follow-up 15 + 5 = 100
    expect(runQuote([{ type: 'sword' }], 0, 1)).toBe(100);
  });

  it('5 G processing fee added to every premium', () => {
    // empty item list → premium 5 G
    expect(runQuote([])).toBe(5);
  });
});

describe('Modifier scope on multi-item policies', () => {
  it('cursed sword + plain amulet: cursed surcharge applies only to cursed item', () => {
    // base 100 + 60 = 160; cursed surcharge 50 (50% of sword base only)
    // → 210 before further modifiers and fee.
    // Add: first-ins (10 + 6 = 16) + 5 fee = 231
    expect(runQuote([
      { type: 'sword', cursed: true },
      { type: 'amulet' },
    ])).toBe(231);
  });
});

describe('Modifier thresholds (exact boundaries)', () => {
  it('exactly 2 years with MHPCO → loyalty discount applies', () => {
    // sword, 2 years: 100 + 10 first-ins - 20 loyalty + 5 = 95
    expect(runQuote([{ type: 'sword' }], 2)).toBe(95);
  });

  it('exactly enchantment 5 → high-enchantment surcharge applies', () => {
    // sword enchant 5: 100 + 30 + 10 + 5 = 145
    expect(runQuote([{ type: 'sword', enchantment: 5 }])).toBe(145);
  });

  it('cursed + enchantment 5 → both surcharges apply', () => {
    expect(runQuote([{ type: 'sword', cursed: true, enchantment: 5 }])).toBe(195);
  });
});

describe('Standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, enchant 3), damage 500 → payout 400', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('damage to a rune (insurance value 250), damage 200 → payout 100', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'spell', damages: [{ itemType: 'rune', amount: 200 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
});

describe('Enchantment threshold (≥8) vs. dragon material in claim payout', () => {
  it('dragon-material sword, enchant 8, damage 1000 → payout 400', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect((result.results[1] as any).payout).toBe(400);
  });

  it('dragon-material sword, enchant 9, damage 1000 → payout 400 (50% wins)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect((result.results[1] as any).payout).toBe(400);
  });

  it('dragon-material sword, enchant 5, damage 800 → payout 700 (only dragon clause applies)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect((result.results[1] as any).payout).toBe(700);
  });

  it('steel sword, enchant 9, damage 1000 → payout 400 (50% then deductible)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect((result.results[1] as any).payout).toBe(400);
  });
});

describe('Deductible per damage event (per damaged item)', () => {
  it('dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ] } },
      ],
    };
    const result = runScenario(scenario);
    // sword: 500-100=400, amulet: 300-100=200, total=600
    expect((result.results[1] as any).payout).toBe(600);
  });
});

describe('Multiple items of the same type', () => {
  it('policy covering two swords → insurance sum 2000, cap 4000', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ] } },
      ],
    };
    const result = runScenario(scenario);
    // two damages, each 500-100=400, total 800; cap 4000 not hit
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('two sword damages but only one sword insured → CLI rejects claim', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 100 },
          { itemType: 'sword', amount: 100 },
        ] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe('Cap exhaustion', () => {
  it('policy covers sword and amulet → insurance sum 1600, cap 3200', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });

  it('cursed sword: cap 2000 (based on unmodified insurance value)', () => {
    // cursed sword premium with modifiers 165 G, but cap should still be 2000
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 2500 }] } },
      ],
    };
    const result = runScenario(scenario);
    // payout would be 2400, capped at 2000
    expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  it('sword + 3 runes (block): insurance sum 1750', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [
          { type: 'sword' },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        ] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 200 }] } },
      ],
    };
    const result = runScenario(scenario);
    // cap = 2 * 1750 = 3500. payout 200-100=100. remaining 3400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  it('two successive claims of 1500 each on sword (cap 2000)', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    };
    const result = runScenario(scenario);
    // first: 1500-100=1400, remaining 600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second: would be 1400, capped at 600, remaining 0
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('Rounding in MHPCO\'s favor', () => {
  it('premium 197.5 G → 198 G (rounded up)', () => {
    // 7 runes: 175 base + 17.5 first-ins = 192.5 + 5 fee = 197.5 → 198
    expect(runQuote(Array(7).fill({ type: 'rune' }))).toBe(198);
  });

  it('payout 350.5 G → 350 G (rounded down)', () => {
    // sword high enchant: damage 901 → 901*0.5 = 450.5 - 100 = 350.5 → 350
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: 901 }] } },
      ],
    };
    const result = runScenario(scenario);
    expect((result.results[1] as any).payout).toBe(350);
  });
});

describe('Edge cases', () => {
  it('empty item list → premium 5 G (processing fee only)', () => {
    expect(runQuote([])).toBe(5);
  });

  it('quote includes unknown item type → error', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'broomstick' } as any] },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it('claim references item not in policy → error', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it('claim references unknown item type → error', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'broomstick', amount: 200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });

  it('claim contains negative damage amount → error', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'x', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe('Clarifying question: first insurance per item or per customer', () => {
  it('long-standing customer\'s second contract: first-insurance surcharge still applies to new item', () => {
    // 3 years, 2nd quote, cursed sword enchant 7
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up + 5 fee = 160
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet' }] },
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    };
    const result = runScenario(scenario);
    expect((result.results[1] as any).premium).toBe(160);
  });
});

describe('Integration: newcomer with cursed sword', () => {
  it('cursed sword, 0 years, no previous contract → premium 165', () => {
    expect(runQuote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }])).toBe(165);
  });
});

describe('Full scenario through runScenario', () => {
  it('runs schema example: amulet quote followed by amulet claim', () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    };
    const result = runScenario(scenario);
    // amulet, 5 years (loyalty), first quote (no follow-up):
    // 60 base + 6 first-ins - 12 loyalty + 5 fee = 59
    expect(result.results[0]).toEqual({ premium: 59 });
    // claim: 200 - 100 deductible = 100, cap 1200, remaining 1100
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
