import { describe, it, expect } from "vitest";
import { quote, claim, processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === QUOTE TESTS ===

  // Individual item base premiums
  it("should quote a single sword -- 100 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("should quote a single amulet -- 60 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("should quote a single staff -- 80 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("should quote a single potion -- 40 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });

  // Components
  it("should quote a single rune -- 25 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("should quote a single moonstone -- 25 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // Building blocks of 3 alike components
  it("should quote 2 runes -- 50 G base premium (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("should quote 3 runes -- 60 G base premium (block discount)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("should quote 4 runes -- 100 G base premium (no block, exact-3 required)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }
    ])).toBe(115);
  });
  it("should quote 7 runes -- 175 G base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("should quote 2 runes + 1 moonstone -- 75 G base premium (different types, no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("should quote 3 runes + 3 moonstones -- 120 G base premium (two separate blocks)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
    ])).toBe(137);
  });

  // Modifiers - simple
  it("should quote a cursed sword -- 150 G base + 50% curse surcharge = 150 G (without fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0)).toBe(165);
  });
  it("should quote a highly enchanted sword (enchantment 5) -- 100 G base + 30% high-enchantment surcharge = 130 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 0)).toBe(145);
  });
  it("should quote a cursed highly enchanted sword -- 100 base + 50% + 30% = 180 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 5 }], 0)).toBe(195);
  });

  // Policy-wide modifiers
  it("should apply loyalty discount for customer with exactly 2 years -- 20% discount on policy base", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(93);
  });
  it("should apply first insurance surcharge for newcomer's first quote -- 10% surcharge", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("should apply follow-up contract discount (second quote onwards) -- 15% discount", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(99);
  });
  it("should add 5 G processing fee to every premium -- e.g. empty list → 5 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // Rounding
  it("should round premium UP in MHPCO's favor -- 197.5 → 198", () => {
    // 7 runes (base 175) with first insurance: 175 * 1.1 = 192.5, ceil = 193, +5 = 198
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }), 0)).toBe(198);
  });
  it("should round payout DOWN in MHPCO's favor -- 350.5 → 350", () => {
    // Dragon sword with enchantment 9, damage 901: 50% = 450.5, minus 100 deductible = 350.5
    // But wait, enchantment 9 triggers 50%, so damagePayout = 901 * 0.5 = 450.5 - 100 = 350.5, floor = 350
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(350);
  });

  it("should quote empty item list -- 5 G (only processing fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });

  // Unknown item type
  it("should reject unknown item type with non-zero exit and stderr error", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "broomstick" }] }
      ]
    })).toThrow();
  });

  // Modifier scope on multi-item policies
  it("should apply cursed surcharge only to cursed item on multi-item policy -- cursed sword (100) + plain amulet (60) → 160 base + 50 curse = 210 before other modifiers", () => {
    // policy base = 100 + 60 = 160
    // first insurance: 160 * 1.1 = 176
    // item surcharge = 50
    // total = 176 + 50 = 226, ceil = 226, +5 = 231
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", cursed: true },
      { type: "amulet" }
    ], 0)).toBe(231);
  });
  it("should apply high-enchantment surcharge only to affected item -- enchantment 5 sword + plain amulet", () => {
    // policy base = 100 + 60 = 160
    // first insurance: 160 * 1.1 = 176
    // item surcharge = 30
    // total = 176 + 30 = 206, ceil = 206, +5 = 211
    expect(quote({ yearsWithMHPCO: 0 }, [
      { type: "sword", enchantment: 5 },
      { type: "amulet" }
    ], 0)).toBe(211);
  });

  // Integration examples
  it("should calculate newcomer with cursed sword -- 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 0)).toBe(165);
  });
  it("should calculate long-standing customer's second contract with cursed enchanted sword -- 160 G (base100 + curse50 + enchant30 - loyalty20 + first10 - followup15 = 155 + 5 fee)", () => {
    // cursed enchanted sword: 100 + 50 + 30 = 180
    // loyalty (3 years): 180 * 0.8 = 144
    // first insurance: 144 * 1.1 = 158.4
    // follow-up (previousQuotes=1): 158.4 * 0.85 = 134.64
    // ceil = 135, +5 = 140
    // Hmm, that doesn't match 160. Let me re-read the spec...
    // Wait, the spec says: (100 base + 50 curse + 30 enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160)
    // So the modifiers are applied to the base, not compounded!
    // Let me re-read: "item-specific modifiers apply to the base premium of the affected item; policy-wide modifiers apply to the policy base premium"
    // But the example shows: 100 + 50 + 30 - 20 + 10 - 15 = 155
    // This means the modifiers are ADDITIVE (percentage points), not MULTIPLICATIVE!
    // -20% loyalty means subtract 20% of policy base
    // +10% first insurance means add 10% of policy base
    // -15% follow-up means subtract 15% of policy base
    // So: 180 + (180 * -0.2) + (180 * 0.1) + (180 * -0.15) = 180 - 36 + 18 - 27 = 135
    // Then +5 fee = 140. Still not 160.
    // Hmm wait, let me re-read the example more carefully:
    // "(100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G)"
    // So the amounts are: 100 + 50 + 30 - 20 + 10 - 15 = 155
    // This means the modifiers are applied as FLAT AMOUNTS based on percentages of the base, not compounded!
    // loyalty discount = 20% of policy base = 20% of 180 = 36? But the example says -20 G, not -36 G.
    // Wait, maybe the policy base is just the sum of item bases (100), not the sum with item modifiers?
    // Let me re-read: "policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium (the sum of all item base premiums)"
    // So policy base = sum of item base premiums = 100 (for the sword)
    // loyalty = -20% of 100 = -20
    // first insurance = +10% of 100 = +10
    // follow-up = -15% of 100 = -15
    // Total = 100 + 50 + 30 - 20 + 10 - 15 = 155
    // +5 fee = 160
    // AHA! So policy-wide modifiers apply to the SUM OF BASE PREMIUMS, not the sum after item modifiers!
    // This is a critical insight. Let me fix the implementation.
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", cursed: true, enchantment: 7 }], 1)).toBe(160);
  });

  // Multi-item same type
  it("should quote two swords -- insurance sum 2000 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] }
      ]
    });
    expect(result.results[0].premium).toBe(225);
  });

  // === CLAIM TESTS ===

  it("should claim standard reimbursement -- steel sword enchantment 3, damage 500 → payout 400 (full - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600);
  });

  it("should claim rune damage -- damage 200 → payout 100 (full - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(400);
  });

  // Deductible per damage event
  it("should apply deductible per damaged item in a single incident -- dragon attack damages sword(500) + amulet(300) → payout 600 (400 + 200, each minus 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 }
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 }
        ] } }
      ]
    });
    expect(result.results[1].payout).toBe(600);
  });

  // Dragon material
  it("should fully reimburse dragon-material item -- dragon sword damage 500 → payout 400 (full - deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(400);
  });

  // High enchantment
  it("should reimburse 50% for enchantment ≥8 -- steel sword enchantment 8, damage 1000 → payout 400 (50% = 500 - 100 deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(400);
  });

  it("should reimburse 50% for enchantment ≥9 -- steel sword enchantment 9, damage 1000 → payout 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(400);
  });

  // Both clauses
  it("dragon-material sword enchantment 9 damage 1000 → payout 400 (50% rule wins over full, then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(400);
  });
  it("dragon-material sword enchantment 5 damage 800 → payout 700 (only dragon clause applies)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(700);
  });

  // Cap
  it("should cap payout at twice insurance sum -- sword + amulet → cap 3200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "amulet", material: "silver", enchantment: 2 }
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(3200);
    expect(result.results[1].remainingCap).toBe(0);
  });
  it("should cap based on unmodified insurance value -- cursed sword insurance value 1000, cap 2000", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(2000);
    expect(result.results[1].remainingCap).toBe(0);
  });
  it("should track cap exhaustion across claims -- sword cap 2000, claim1 1500 → payout 1400, claim2 1500 → payout 600, remaining 0", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    });
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // Multiple same-type items in claim
  it("should treat each damage entry as separate damage with own deductible -- two swords damaged, each gets deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3 },
          { type: "sword", material: "steel", enchantment: 3 }
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 }
        ] } }
      ]
    });
    expect(result.results[1].payout).toBe(800);
  });
  it("should reject claim with more damage entries than insured items of that type", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 }
        ] } }
      ]
    })).toThrow();
  });

  // Edge cases
  it("should reject claim for item not in policy", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    })).toThrow();
  });
  it("should reject claim with negative damage amount", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    })).toThrow();
  });
});
