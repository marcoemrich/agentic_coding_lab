import { describe, it, expect } from 'vitest';
import { processScenario } from './claim-office.js';

// Helper to run a scenario and return results
function run(scenario: any) {
  return processScenario(scenario);
}

describe('MHPCO Claim Office', () => {

  // === BASE PREMIUMS ===
  describe('Item base premiums', () => {
    it('sword has base premium 100 G', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }]
      });
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
    });

    it('amulet has base premium 60 G', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] }]
      });
      // 60 base + 6 first insurance + 5 fee = 71
      expect(result.results[0].premium).toBe(71);
    });

    it('staff has base premium 80 G', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'staff', material: 'wood', enchantment: 0, cursed: false }] }]
      });
      // 80 base + 8 first insurance + 5 fee = 93
      expect(result.results[0].premium).toBe(93);
    });

    it('potion has base premium 40 G', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'potion', material: 'liquid', enchantment: 0, cursed: false }] }]
      });
      // 40 base + 4 first insurance + 5 fee = 49
      expect(result.results[0].premium).toBe(49);
    });
  });

  // === COMPONENT PREMIUMS ===
  describe('Component base premiums', () => {
    it('2 runes → 50 G base premium', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' },
          { type: 'rune' }
        ]}]
      });
      // 50 base + 5 first insurance + 5 fee = 60
      expect(result.results[0].premium).toBe(60);
    });

    it('3 runes → 60 G base premium (block applies)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' }
        ]}]
      });
      // 60 base + 6 first insurance + 5 fee = 71
      expect(result.results[0].premium).toBe(71);
    });

    it('4 runes → 100 G base premium (no block)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' },
          { type: 'rune' }
        ]}]
      });
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
    });

    it('7 runes → 175 G base premium', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'rune' }
        ]}]
      });
      // 175 base + 17.5 first insurance → 175 + 17.5 = 192.5 → 193 + 5 fee = 198
      expect(result.results[0].premium).toBe(198);
    });

    it('2 runes + 1 moonstone → 75 G base premium (no block: different types)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' },
          { type: 'rune' },
          { type: 'moonstone' }
        ]}]
      });
      // 75 base + 7.5 first insurance = 82.5 → 83 + 5 fee = 88
      expect(result.results[0].premium).toBe(88);
    });

    it('3 runes + 3 moonstones → 120 G base premium (two separate blocks)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }
        ]}]
      });
      // 120 base + 12 first insurance + 5 fee = 137
      expect(result.results[0].premium).toBe(137);
    });
  });

  // === PREMIUM MODIFIERS ===
  describe('Premium modifiers', () => {
    it('cursed item adds 50% surcharge to that item only', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: true }
        ]}]
      });
      // 100 base + 50 curse + 10 first insurance (10% of 100 base) + 5 fee = 165
      expect(result.results[0].premium).toBe(165);
    });

    it('highly enchanted item (enchantment >= 5) adds 30% surcharge', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 5, cursed: false }
        ]}]
      });
      // 100 base + 30 enchantment + 10 first insurance (10% of 100 base) + 5 fee = 145
      expect(result.results[0].premium).toBe(145);
    });

    it('cursed + highly enchanted: both surcharges apply', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 5, cursed: true }
        ]}]
      });
      // 100 base + 50 curse + 30 enchantment + 10 first insurance (10% of 100) + 5 fee = 195
      expect(result.results[0].premium).toBe(195);
    });

    it('enchantment 4 → no high-enchantment surcharge', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 4, cursed: false }
        ]}]
      });
      // 100 base + 10 first insurance + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
    });

    it('loyalty discount: customer >= 2 years gets 20% discount', () => {
      const result = run({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false }
        ]}]
      });
      // 100 base + 10 first insurance - 20 loyalty (20% of 100) + 5 fee = 95
      expect(result.results[0].premium).toBe(95);
    });

    it('follow-up contract gets 15% discount', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] }
        ]
      });
      // First quote: 100 + 10 + 5 = 115
      // Second quote: 100 base + 10 first insurance - 15 follow-up (15% of 100) + 5 = 100
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].premium).toBe(100);
    });

    it('empty item list → premium 5 G (processing fee only)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [] }]
      });
      expect(result.results[0].premium).toBe(5);
    });
  });

  // === MODIFIER SCOPE ON MULTI-ITEM POLICIES ===
  describe('Modifier scope on multi-item policies', () => {
    it('cursed sword + plain amulet → cursed surcharge on sword only', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
        ]}]
      });
      // sword: 100 base, amulet: 60 base → policy base = 160
      // curse surcharge = 50% of sword base = 50
      // first insurance = 10% of 160 = 16
      // total = 160 + 50 + 16 + 5 = 231
      expect(result.results[0].premium).toBe(231);
    });
  });

  // === INTEGRATION EXAMPLES ===
  describe('Integration examples', () => {
    it('newcomer with a cursed sword → 165 G', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 3, cursed: true }
        ]}]
      });
      // 100 base + 50 curse = 150
      // first insurance = 10% of 150 = 15
      // total = 150 + 15 + 5 = 170
      // But prompt says 165! Let me recheck.
      // "100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G"
      // So first insurance = 10 G, which is 10% of 100 (the item base, not the policy base after surcharges)
      // This means policy-wide modifiers apply to the SUM OF ITEM BASE PREMIUMS BEFORE item-specific surcharges
      expect(result.results[0].premium).toBe(165);
    });

    it('long-standing customer second contract with cursed enchanted sword → 160 G', () => {
      const result = run({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: 'quote', items: [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }] },
          { op: 'quote', items: [
            { type: 'sword', material: 'steel', enchantment: 7, cursed: true }
          ]}
        ]
      });
      // Second quote:
      // 100 base + 50 curse + 30 enchantment − 20 loyalty (20% of 100) + 10 first insurance (10% of 100) − 15 follow-up (15% of 100) = 155 + 5 fee = 160
      expect(result.results[1].premium).toBe(160);
    });
  });

  // === CLAIM PROCESSING ===
  describe('Claim processing', () => {
    it('standard reimbursement: regular sword, damage 500 → payout 400', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [{ itemType: 'sword', amount: 500 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(400);
      // cap = 2 * 1000 = 2000; remaining = 2000 - 400 = 1600
      expect(result.results[1].remainingCap).toBe(1600);
    });

    it('damage to rune → payout 100 (200 damage - 100 deductible)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'rune' }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'rune', amount: 200 }] } }
        ]
      });
      expect(result.results[1].payout).toBe(100);
      // cap = 2 * 250 = 500; remaining = 500 - 100 = 400
      expect(result.results[1].remainingCap).toBe(400);
    });

    it('deductible per damage event: sword 500 + amulet 300 → payout 600', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'amulet', material: 'silver', enchantment: 0, cursed: false }
          ]},
          { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'amulet', amount: 300 }
          ]}}
        ]
      });
      // sword: 500 - 100 = 400, amulet: 300 - 100 = 200 → total 600
      expect(result.results[1].payout).toBe(600);
    });

    it('high enchantment (>= 8) → 50% reimbursement', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } }
        ]
      });
      // 50% of 1000 = 500, then - 100 deductible = 400
      expect(result.results[1].payout).toBe(400);
    });

    it('dragon material → full reimbursement', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 800 }] } }
        ]
      });
      // dragon material, enchantment 5 < 8 → full reimbursement
      // 800 - 100 deductible = 700
      expect(result.results[1].payout).toBe(700);
    });

    it('dragon material + enchantment >= 8 → 50% wins', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 9, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } }
        ]
      });
      // both clauses: 50% of 1000 = 500, then - 100 = 400
      expect(result.results[1].payout).toBe(400);
    });

    it('dragon material + exactly enchantment 8 → 50% wins, then deductible', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } }
        ]
      });
      // enchantment >= 8 → 50%, then deductible: 500 - 100 = 400
      expect(result.results[1].payout).toBe(400);
    });
  });

  // === CAP AND MULTIPLE CLAIMS ===
  describe('Cap and multiple claims', () => {
    it('two swords → insurance sum 2000, cap 4000', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false }
          ]},
          { op: 'claim', policy: 0, incident: { cause: 'dragon attack', damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 300 }
          ]}}
        ]
      });
      // sword1: 500 - 100 = 400, sword2: 300 - 100 = 200 → total 600
      expect(result.results[1].payout).toBe(600);
      expect(result.results[1].remainingCap).toBe(3400);
    });

    it('cap exhaustion across two claims', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } }
        ]
      });
      // cap = 2 * 1000 = 2000
      // claim 1: 1500 - 100 = 1400, remaining cap = 600
      // claim 2: 1500 - 100 = 1400, but capped at 600, remaining cap = 0
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });

    it('cursed sword premium does not raise cap', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1500 }] } }
        ]
      });
      // cap = 2 * 1000 = 2000 (based on insurance value, not premium)
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
    });

    it('sword + 3 runes (block) → insurance sum 1750', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [
            { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
            { type: 'rune' }, { type: 'rune' }, { type: 'rune' }
          ]},
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 1000 }] } }
        ]
      });
      // insurance sum = 1000 + 3*250 = 1750, cap = 3500
      expect(result.results[1].payout).toBe(900);
      expect(result.results[1].remainingCap).toBe(2600);
    });
  });

  // === ROUNDING ===
  describe('Rounding', () => {
    it('premium rounds up (in MHPCO favor)', () => {
      // 7 runes: 175 base + 10% first insurance = 175 + 17.5 = 192.5 → 193 + 5 fee = 198
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'rune' }, { type: 'rune' }, { type: 'rune' },
          { type: 'rune' }
        ]}]
      });
      expect(result.results[0].premium).toBe(198);
    });

    it('payout rounds down (in MHPCO favor)', () => {
      // Need a scenario that produces a fractional payout
      // enchantment >= 8 → 50% reimbursement of odd amount
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 9, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 701 }] } }
        ]
      });
      // 50% of 701 = 350.5 → round down to 350, then - 100 deductible = 250
      expect(result.results[1].payout).toBe(250);
    });
  });

  // === EDGE CASES ===
  describe('Edge cases', () => {
    it('unknown item type in quote → error', () => {
      expect(() => run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [{ type: 'broomstick' }] }]
      })).toThrow();
    });

    it('claim references item not in policy → error', () => {
      expect(() => run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] } }
        ]
      })).toThrow();
    });

    it('claim references unknown item type → error', () => {
      expect(() => run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'broomstick', amount: 200 }] } }
        ]
      })).toThrow();
    });

    it('negative damage amount → error', () => {
      expect(() => run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: -200 }] } }
        ]
      })).toThrow();
    });

    it('more damages of a type than insured → error', () => {
      expect(() => run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }] },
          { op: 'claim', policy: 0, incident: { cause: 'fire', damages: [
            { itemType: 'sword', amount: 200 },
            { itemType: 'sword', amount: 300 }
          ]}}
        ]
      })).toThrow();
    });
  });

  // === SCHEMA EXAMPLE FROM PROMPT ===
  describe('Schema example from prompt', () => {
    it('processes the schema example correctly', () => {
      const result = run({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: 'quote',
            items: [
              { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
            ]
          },
          {
            op: 'claim',
            policy: 0,
            incident: {
              cause: 'fire',
              damages: [
                { itemType: 'amulet', amount: 200 }
              ]
            }
          }
        ]
      });
      // amulet: 60 base
      // loyalty: -12 (20% of 60)
      // first insurance: +6 (10% of 60)
      // total = 60 + 6 - 12 = 54 + 5 fee = 59
      expect(result.results[0].premium).toBe(59);
      // claim: 200 - 100 deductible = 100
      expect(result.results[1].payout).toBe(100);
      // cap = 2 * 600 = 1200, remaining = 1200 - 100 = 1100
      expect(result.results[1].remainingCap).toBe(1100);
    });
  });

  // === PREMIUM MODIFIER INTERACTIONS ===
  describe('Premium modifier interactions', () => {
    it('policy-wide modifiers apply to sum of base premiums (not including item surcharges)', () => {
      const result = run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: 'quote', items: [
          { type: 'sword', material: 'steel', enchantment: 3, cursed: true },
          { type: 'amulet', material: 'silver', enchantment: 2, cursed: false }
        ]}]
      });
      // policy base = 100 + 60 = 160
      // item surcharges: +50 (curse on sword)
      // first insurance: 10% of 160 = 16
      // total = 160 + 50 + 16 + 5 = 231
      expect(result.results[0].premium).toBe(231);
    });
  });
});
