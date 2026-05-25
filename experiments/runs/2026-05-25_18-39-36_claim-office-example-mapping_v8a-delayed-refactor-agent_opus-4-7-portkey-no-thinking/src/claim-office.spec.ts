import { describe, it, expect } from 'vitest';
import { runScenario, Scenario } from './claim-office.js';

function premiumOf(scenario: Scenario, stepIdx = 0): number {
  const out = runScenario(scenario);
  const r = out.results[stepIdx] as { premium: number };
  return r.premium;
}

function claimResult(scenario: Scenario, stepIdx: number): { payout: number; remainingCap: number } {
  const out = runScenario(scenario);
  return out.results[stepIdx] as { payout: number; remainingCap: number };
}

describe('Item values and base premiums', () => {
  // The base premiums are tested indirectly through quotes (with fee).
  // Customer with 1 year (no loyalty), first quote (first insurance applies, no follow-up).

  it('sword base premium 100 G → premium with 10% first insurance and 5 G fee = 100 + 10 + 5 = 115 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    });
    expect(p).toBe(115);
  });

  it('amulet base premium 60 G → premium 60 + 6 + 5 = 71 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'amulet' }] }],
    });
    expect(p).toBe(71);
  });

  it('staff base premium 80 G → premium 80 + 8 + 5 = 93 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'staff' }] }],
    });
    expect(p).toBe(93);
  });

  it('potion base premium 40 G → premium 40 + 4 + 5 = 49 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'potion' }] }],
    });
    expect(p).toBe(49);
  });

  it('1 rune base premium 25 G → premium 25 + 2.5 + 5 = 32.5 → 33 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }] }],
    });
    expect(p).toBe(33);
  });
});

describe('Building block of 3 alike components', () => {
  // base premium tests: customer with 0 years, no first insurance? No — first insurance ALWAYS applies on first quote.
  // To isolate the base premium logic, we use a customer with 1 year + first quote.
  // The example says base premiums; we test by computing what premium emerges.
  // For 2 runes: base 50, +5 first ins, +5 fee = 60
  // For 3 runes (block): base 60, +6, +5 = 71
  // For 4 runes (no block): base 100, +10, +5 = 115
  // For 7 runes: 2 blocks of 3 = 120 + 25 = 145? No — 7 runes = 2*60 + 1*25 = 145? But spec says 175.
  // Wait: "7 runes → 175 G base premium". Let me check: 7 runes can form how many blocks of 3?
  // 2 blocks = 6 runes + 1 leftover. 2*60 + 1*25 = 145. But spec says 175.
  // Hmm, re-reading: "A building block of 3 alike components is offered at a special base premium of 60 G."
  // So 3 runes alone = 60. But 7 runes = 175. Let me see: 7*25 = 175. So no block discount on 7?
  // Maybe the block only applies to *exactly* 3? Like "no block — block requires exactly 3" for 4 runes.
  // For 7 runes: 7*25 = 175. That's consistent with "block requires exactly 3" applied to the WHOLE group.
  // So the rule is: if the count is exactly 3, you get the block discount; otherwise each is 25.

  it('2 runes → base 50 G; premium = 50 + 5 first ins + 5 fee = 60 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }] }],
    });
    expect(p).toBe(60);
  });

  it('3 runes (block) → base 60 G; premium = 60 + 6 first ins + 5 fee = 71 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }] }],
    });
    expect(p).toBe(71);
  });

  it('4 runes (no block) → base 100 G; premium = 100 + 10 first ins + 5 fee = 115 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
      ] }],
    });
    expect(p).toBe(115);
  });

  it('7 runes → base 175 G; premium = 175 + 17.5 + 5 = 197.5 → 198 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' },
      ] }],
    });
    expect(p).toBe(198);
  });
});

describe('"Alike" components — different types do not block together', () => {
  it('2 runes + 1 moonstone → base 75 G; premium = 75 + 7.5 + 5 = 87.5 → 88 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'moonstone' },
      ] }],
    });
    expect(p).toBe(88);
  });

  it('3 runes + 3 moonstones (two separate blocks) → base 120 G; premium = 120 + 12 + 5 = 137 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' },
      ] }],
    });
    expect(p).toBe(137);
  });
});

describe('Modifier scope on multi-item policies', () => {
  it('cursed sword (base 100) + plain amulet (base 60): policy base 160; +50 curse = 210 before further modifiers; with 1-year customer (no loyalty), first quote: + 16 first ins + 5 fee = 231 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'sword', cursed: true },
        { type: 'amulet' },
      ] }],
    });
    expect(p).toBe(231);
  });
});

describe('Modifier thresholds', () => {
  it('customer with exactly 2 years → loyalty discount applies. Sword: 100 base - 20 loyalty + 10 first ins + 5 fee = 95 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: 'quote', items: [{ type: 'sword' }] }],
    });
    expect(p).toBe(95);
  });

  it('sword with exactly enchantment 5 → high-enchantment surcharge applies. 100 + 30 + 10 first + 5 = 145 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 5 }] }],
    });
    expect(p).toBe(145);
  });

  it('sword with enchantment 5 AND cursed → both surcharges apply: 100 + 50 + 30 + 10 + 5 = 195 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 5, cursed: true }] }],
    });
    expect(p).toBe(195);
  });

  it('sword with enchantment 4 → no high-enchantment surcharge: 100 + 10 first + 5 = 115 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 4 }] }],
    });
    expect(p).toBe(115);
  });

  it('sword with enchantment 4 AND cursed → only curse surcharge: 100 + 50 + 10 + 5 = 165 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [{ type: 'sword', enchantment: 4, cursed: true }] }],
    });
    expect(p).toBe(165);
  });

  it('dragon sword with exactly enchantment 8, damage 1000 → payout 400 G (high-enchantment 50% then deductible)', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8 }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(400);
  });
});

describe('Deductible per damage event', () => {
  it('dragon attack damages a sword (500 G) and an amulet (300 G): payout 600 G (100 G deductible per damaged item)', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ] } },
      ],
    }, 1);
    expect(r.payout).toBe(600);
  });
});

describe('Standard reimbursement (no special clauses)', () => {
  it('regular sword (steel, enchantment 3), damage 500 G → payout 400 G', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3 }] },
        { op: 'claim', policy: 0, incident: { cause: 'theft', damages: [{ itemType: 'sword', amount: 500 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(400);
  });

  it('damage to a rune (insurance value 250 G), damage 200 G → payout 100 G', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'water', damages: [{ itemType: 'rune', amount: 200 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(100);
  });
});

describe('Enchantment threshold vs. dragon material', () => {
  it('dragon sword, enchantment 9, damage 1000 → payout 400 G (50% wins, then deductible)', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(400);
  });

  it('dragon sword, enchantment 5, damage 800 → payout 700 G (dragon clause: full, then deductible)', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5 }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [{ itemType: 'sword', amount: 800 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(700);
  });

  it('steel sword, enchantment 9, damage 1000 → payout 400 G (50% then deductible)', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [{ itemType: 'sword', amount: 1000 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(400);
  });
});

describe('Multiple items of the same type', () => {
  it('two swords → insurance sum 2000, cap 4000', () => {
    // Verify via a damage that exceeds single-sword cap: two damages of 1500 each.
    // Each: 1500-100 = 1400, total 2800. Below cap (4000). Remaining = 4000-2800 = 1200.
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'dragon', damages: [
          { itemType: 'sword', amount: 1500 },
          { itemType: 'sword', amount: 1500 },
        ] } },
      ],
    }, 1);
    expect(r.payout).toBe(2800);
    expect(r.remainingCap).toBe(1200);
  });

  it('two sword damages but only one sword insured → CLI exits non-zero (runScenario throws)', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [
          { itemType: 'sword', amount: 100 },
          { itemType: 'sword', amount: 100 },
        ] } },
      ],
    })).toThrow();
  });
});

describe('Cap exhaustion', () => {
  it('sword + amulet → insurance sum 1600, cap 3200', () => {
    // Trigger by damage of 1800 (full reimbursement minus 100 = 1700, under cap, remaining 1500)
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'amulet' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1800 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(1700);
    expect(r.remainingCap).toBe(1500);
  });

  it('cursed sword (premium 165 with modifiers) → cap 2000 (based on unmodified insurance value)', () => {
    // Damage of 3000 → 3000-100 = 2900 reimbursable; capped at 2000
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', cursed: true }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 3000 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(2000);
    expect(r.remainingCap).toBe(0);
  });

  it('sword + 3 runes (block) → insurance sum 1750 (block affects premium only); cap 3500', () => {
    // Verify with damage of 1700 on sword (full, -100 = 1600); remaining = 1900
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1700 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(1600);
    expect(r.remainingCap).toBe(1900);
  });

  it('sword (cap 2000); first claim 1500 → payout 1400, remaining 600; second claim 1500 → payout 600, remaining 0', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(out.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('Rounding in the MHPCO\'s favor', () => {
  it('premium yielding 197.5 → 198 (rounded up). 7 runes: 175 + 17.5 + 5 = 197.5 → 198', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: 'quote', items: [
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
        { type: 'rune' },
      ] }],
    });
    expect(p).toBe(198);
  });

  it('payout yielding 350.5 → 350 (rounded down). Use dragon sword ench 9, damage 901: 901*0.5=450.5, -100=350.5 → 350', () => {
    const r = claimResult({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9 }] },
        { op: 'claim', policy: 0, incident: { cause: 'attack', damages: [{ itemType: 'sword', amount: 901 }] } },
      ],
    }, 1);
    expect(r.payout).toBe(350);
  });
});

describe('Edge cases', () => {
  it('empty item list → premium 5 G (only processing fee)', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [] }],
    });
    expect(p).toBe(5);
  });

  it('quote with unknown item type → runScenario throws (CLI exits non-zero)', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }],
    })).toThrow();
  });

  it('claim references damage entry whose item is not part of the policy → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim references damage entry with unknown item type → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 100 }] } },
      ],
    })).toThrow();
  });

  it('claim with negative damage amount → throws', () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } },
      ],
    })).toThrow();
  });
});

describe('Integration examples', () => {
  it('Newcomer with a cursed sword: 0 years, cursed steel sword ench 3 → premium 165 G', () => {
    const p = premiumOf({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }] }],
    });
    expect(p).toBe(165);
  });

  it("Long-standing customer's second contract: 3 years, second quote, cursed steel sword ench 7 → premium 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: 'quote', items: [{ type: 'sword' }] }, // first quote (any items)
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }] },
      ],
    });
    expect((out.results[1] as { premium: number }).premium).toBe(160);
  });
});

describe('Schema example from spec', () => {
  it('produces results array with quote and claim entries of the right shape', () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }] },
        { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } },
      ],
    });
    expect(out.results).toHaveLength(2);
    expect(out.results[0]).toHaveProperty('premium');
    expect(out.results[1]).toHaveProperty('payout');
    expect(out.results[1]).toHaveProperty('remainingCap');
  });
});
