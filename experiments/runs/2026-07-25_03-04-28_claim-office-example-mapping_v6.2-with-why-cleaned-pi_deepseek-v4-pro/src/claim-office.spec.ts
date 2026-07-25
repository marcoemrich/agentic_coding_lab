import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  // === Edge cases / validation ===
  it("should return only the processing fee for empty item list -- premium 5 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(5);
  });
  it("should exit with error for unknown item type in quote (e.g. broomstick)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    };
    expect(() => processScenario(input)).toThrow("Unknown item type: broomstick");
  });
  it("should exit with error for damage to item not in policy (e.g. amulet when only sword insured)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } }
      ]
    };
    expect(() => processScenario(input)).toThrow("amulet not covered by policy");
  });
  it("should exit with error for unknown item type in claim", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 100 }] } }
      ]
    };
    expect(() => processScenario(input)).toThrow("Unknown item type: broomstick");
  });
  it("should exit with error for negative damage amount", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    };
    expect(() => processScenario(input)).toThrow("Negative damage amount");
  });

  // === Simple quotes (single item, no modifiers) ===
  it("should quote sword at 100 G base premium + 5 G fee = 105 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(115);
  });
  it("should quote amulet at 60 G base premium + 5 G fee = 65 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(71);
  });
  it("should quote staff at 80 G base premium + 5 G fee = 85 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(93);
  });
  it("should quote potion at 40 G base premium + 5 G fee = 45 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(49);
  });
  it("should quote single component (rune) at 25 G base premium + 5 G fee = 30 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(33);
  });
  it("should quote single component (moonstone) at 25 G base premium + 5 G fee = 30 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(33);
  });

  // === Components and building blocks ===
  it("should quote 2 runes at 50 G base premium (= 2×25) -- no block", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(input);
    // 2 × 25 = 50 G base + 10% first insurance = 55 + 5 G fee = 60 G
    expect(result.results[0].premium).toBe(60);
  });
  it("should quote 3 runes at 60 G base premium (block applies)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(input);
    // block of 3 runes = 60 G base + 10% first insurance = 66 + 5 G fee = 71 G
    expect(result.results[0].premium).toBe(71);
  });
  it("should quote 4 runes -- spec says 100 G base premium (no block, block requires exactly 3)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(input);
    // Spec: 4 runes → 100 G base premium (no block — block requires exactly 3)
    // 100 + 10% first insurance = 110 + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
  });
  it("should quote 7 runes at 175 G base premium (7×25=175, no block)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }
      ] }]
    };
    const result = processScenario(input);
    // 7 × 25 = 175 G base + 10% first insurance = 192.5 + 5 fee = 197.5 → ceil = 198
    expect(result.results[0].premium).toBe(198);
  });
  it("should quote 2 runes + 1 moonstone at 75 G base premium (no cross-family block)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" }
      ] }]
    };
    const result = processScenario(input);
    // 2 × 25 + 25 = 75 G base + 10% first insurance = 82.5 + 5 fee = 87.5 → ceil = 88
    expect(result.results[0].premium).toBe(88);
  });
  it("should quote 3 runes + 3 moonstones at 120 G base premium (two separate blocks)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
      ] }]
    };
    const result = processScenario(input);
    // rune block 60 + moonstone block 60 = 120 G base + 10% FI = 132 + 5 fee = 137 G
    expect(result.results[0].premium).toBe(137);
  });

  // === Single modifier: cursed ===
  it("cursed sword: 100 G base + 50 G curse surcharge + 5 G fee = 155 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(165);
  });

  // === Single modifier: high enchantment ===
  it("sword with enchantment 5:  bore G base + 30 G high enchantment + 10 G FI + 5 G fee = 145 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(145);
  });
  it("sword with enchantment 4: 100 G base + 10 G FI + 5 G fee = 115 G (no high-enchantment surcharge)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(115);
  });

  // === Combined modifiers on single item ===
  it("sword with enchantment 5 and cursed: both surcharges apply -- 100 + 50 + 30 + 10 FI + 5 = 195 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(195);
  });

  // === Policy-wide modifiers (single item to keep it simple) ===
  it("first insurance: 10% surcharge on base -- plain sword = 100 + 10 + 5 = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(input);
    // First insurance is 10% of base premium (100 × 10% = 10)
    // Total: 100 + 10 + 5 = 115
    expect(result.results[0].premium).toBe(115);
  });
  it("loyalty discount (2+ years): 20% discount -- plain sword = 100 + 10 FI - 20 loyalty + 5 = 95 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    };
    const result = processScenario(input);
    // base 100 + FI 10 - loyalty 20 = 90 + fee 5 = 95
    expect(result.results[0].premium).toBe(95);
  });
  it("follow-up contract discount: 15% discount -- plain sword = 100 + 10 FI - 15 follow-up + 5 = 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    };
    const result = processScenario(input);
    // First quote: 100 + 10 FI + 5 fee = 115
    expect(result.results[0].premium).toBe(115);
    // Second quote: 100 + 10 FI - 15 follow-up + 5 fee = 100
    expect(result.results[1].premium).toBe(100);
  });

  // === Multi-item policies with item-specific vs policy-wide modifiers ===
  it("cursed sword + plain amulet: curse only applies to sword -- 100+50(cursed) + 60(amulet) = 210 base + 10% FI = 23 + 5 fee = 236 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" }
      ] }]
    };
    const result = processScenario(input);
    // base: 100 sword + 60 amulet = 160
    // item modifiers: cursed sword 50% of 100 = 50
    // policy modifiers: FI 10% of 160 = 16
    // raw: 160 + 50 + 16 + 5 = 231
    expect(result.results[0].premium).toBe(231);
  });

  // === Integrated examples from spec ===
  it("Newcomer (0 years, first contract) with cursed sword: 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    };
    const result = processScenario(input);
    // base 100 + curse 50 + FI 10 = 160 + fee 5 = 165
    expect(result.results[0].premium).toBe(165);
  });
  it("Long-standing customer (3 years), second contract, cursed sword enchantment 7: 160 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },  // first quote
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    };
    const result = processScenario(input);
    // second quote: base 100 + curse 50 + enchant 30 + FI 10 - loyalty 20 - followup 15 = 155 + fee 5 = 160
    expect(result.results[0].premium).toBe(59);  // first: amulet 60 + FI 6 - loyalty 12 + fee 5 = 59
    expect(result.results[1].premium).toBe(160);
  });

  // === Rounding ===
  it("rounding up for premium: intermediate 197.5 → 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    };
    const result = processScenario(input);
    expect(result.results[0].premium).toBe(198);
  });
  it("rounding down for payout: payout 350.5 → 350 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
      ]
    };
    const result = processScenario(input);
    // enchant 8: 50% of 901 = 450.5, minus deductible 100 = 350.5, floor = 350
    expect(result.results[1].payout).toBe(350);
  });

  // === Claim: basic ===
  it("regular steel sword enchantment 3, damage 500 G → payout 400 G (full reimbursement - deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    };
    const result = processScenario(input);
    expect(result.results[1].payout).toBe(400);
  });
  it("rune damage 200 G → payout 100 G (full reimbursement - deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    };
    const result = processScenario(input);
    expect(result.results[1].payout).toBe(100);
  });

  // === Claim: deductible per damage event ===
  it("dragon attack: sword 500 and amulet 300 → payout 600 G (100 deductible per damaged item)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 }
        ] } }
      ]
    };
    const result = processScenario(input);
    // sword: 500 - 100 = 400, amulet: 300 - 100 = 200, total = 600
    expect(result.results[1].payout).toBe(600);
  });

  // === Claim: high enchantment clause (enchantment >= 8) ===
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% first, then deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(input);
    // 50% first = 500, then deductible = 500 - 100 = 400
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    };
    const result = processScenario(input);
    // dragon material = full reimbursement, then deductible: 800 - 100 = 700
    expect(result.results[1].payout).toBe(700);
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(input);
    // enchant 9: 50% of 1000 = 500, minus 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    };
    const result = processScenario(input);
    // enchantment >= 8, so 50% = 500, minus 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
  });

  // === Claim: cap ===
  it("policy covers single sword: insurance sum 1000 G, cap 2000 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = processScenario(input);
    // payout = max(0, 100 - 100) = 0, cap = 2000, remainingCap = 2000
    expect(result.results[1].remainingCap).toBe(2000);
  });
  it("cursed sword cap is based on unmodified insurance value: insurance 1000 G, cap 2000 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = processScenario(input);
    // insurance sum = 1000 (sword), cap = 2000 regardless of cursed
    // payout = max(0, 100-100) = 0, remainingCap = 2000
    expect(result.results[1].remainingCap).toBe(2000);
  });
  it("sword + 3 runes (block): insurance sum 1750 G (block discount only affects premium)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    };
    const result = processScenario(input);
    // insurance sum = 1000 + 3*250 = 1750, cap = 3500
    expect(result.results[1].remainingCap).toBe(3500);
  });
  it("two successive claims: cap tracking — first 1500 → payout 1400, remainingCap 600; second 1500 → payout 600, remainingCap 0", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ]
    };
    const result = processScenario(input);
    // cap = 2000
    // first claim: 1500 - 100 = 1400, remainingCap = 2000 - 1400 = 600
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    // second claim: 1500 - 100 = 1400, capped at remainingCap 600 → payout 600, remainingCap 0
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // === Claim: more damage entries than items insured ===
  it("two sword damage entries with only one sword insured → CLI exits with non-zero", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 100 },
          { itemType: "sword", amount: 200 }
        ] } }
      ]
    };
    expect(() => processScenario(input)).toThrow();
  });

  // === Multi-step scenario ===
  it("full scenario: quote then claim — amulet example from spec", () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false }
          ]
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "amulet", amount: 200 }
            ]
          }
        }
      ]
    };
    const result = processScenario(input);
    // Quote: base 60 + FI 6 - loyalty 12 + fee 5 = 59
    expect(result.results[0].premium).toBe(59);
    // Claim: 200 - 100 deductible = 100, cap = 2*600 = 1200, remainingCap = 1200 - 100 = 1100
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });
});