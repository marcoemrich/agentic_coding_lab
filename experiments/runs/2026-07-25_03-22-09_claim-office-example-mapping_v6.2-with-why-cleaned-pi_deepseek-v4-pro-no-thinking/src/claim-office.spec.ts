import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  // === Edge Cases ===
  it("should return premium 5 G for empty item list (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("should exit with error for quote with unknown item type (e.g. broomstick)", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
    })).toThrow();
  });
  it("should exit with error for claim with damage to item not in policy", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] } }
      ]
    })).toThrow();
  });
  it("should exit with error for claim with damage entry having negative amount", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }
      ]
    })).toThrow();
  });

  // === Item values and base premiums (with first insurance 10% and fee) ===
  it("should calculate base premium for a sword: 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(115);
  });
  it("should calculate base premium for an amulet: 71 G (60 base + 6 + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(71);
  });
  it("should calculate base premium for a staff: 93 G (80 base + 8 + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(93);
  });
  it("should calculate base premium for a potion: 49 G (40 base + 4 + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(49);
  });
  it("should calculate base premium for a single rune: 33 G (25 base + 2.5 + 5 = 32.5 ceil 33)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(33);
  });
  it("should calculate base premium for a single moonstone: 33 G (25 base + 2.5 + 5 = 32.5 ceil 33)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(33);
  });

  // === Building block of 3 alike components ===
  it("should charge 60 G for 2 runes (50 base + 5 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(60);
  });
  it("should charge 71 G for 3 runes (60 block + 6 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(71);
  });
  it("should charge 115 G for 4 runes (4×25=100 base + 10 first insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(115);
  });
  it("should charge 198 G for 7 runes (7×25=175 base + 17.5 + 5 = 197.5 ceil 198)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(198);
  });

  // === "Alike" components: same type required ===
  it("should charge 88 G for 2 runes + 1 moonstone (75 base + 7.5 + 5 = 87.5 ceil 88)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(88);
  });
  it("should charge 137 G for 3 runes + 3 moonstones (120 base + 12 + 5 = 137)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
      ] }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(137);
  });

  // === Modifier scope on multi-item policies ===
  it("should apply cursed surcharge only to cursed item base premium: cursed sword + plain amulet", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 160, cursed 50, first insurance 16, fee 5 = 231
    expect(result.results[0].premium).toBe(231);
  });

  // === Modifier: cursed items (50% surcharge) ===
  it("should add 50% cursed surcharge: cursed sword", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 100, cursed 50, first insurance 10, fee 5 = 165
    expect(result.results[0].premium).toBe(165);
  });

  // === Modifier: high enchantment (≥5, 30% surcharge) ===
  it("should add 30% high-enchantment surcharge for enchantment >= 5: sword with enchantment 5", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 100, high-enchant 30, first insurance 10, fee 5 = 145
    expect(result.results[0].premium).toBe(145);
  });
  it("should not add high-enchantment surcharge for enchantment 4", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 100, first insurance 10, fee 5 = 115
    expect(result.results[0].premium).toBe(115);
  });

  // === Modifier: loyalty discount (≥2 years, 20%) ===
  it("should apply loyalty discount for customer with exactly 2 years with MHPCO", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 100, first insurance 10, loyalty -20, fee 5 = 95
    expect(result.results[0].premium).toBe(95);
  });

  // === Modifier: first insurance surcharge (10%) ===
  it("should apply 10% first insurance surcharge for new customer (0 years with MHPCO)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 100, first insurance 10, fee 5 = 115
    expect(result.results[0].premium).toBe(115);
  });

  // === Modifier: follow-up contract discount (15%) ===
  it("should apply 15% follow-up contract discount after first quote", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] }
      ]
    }) as { results: Array<{ premium?: number }> };
    // First quote: base 100, first insurance 10, fee 5 = 115
    // Second quote: base 100, first insurance 10, follow-up -15, fee 5 = 100
    expect(result.results[0].premium).toBe(115);
    expect(result.results[1].premium).toBe(100);
  });

  // === Integration: Newcomer with a cursed sword ===
  it("should calculate premium 165 G for newcomer (0 years) with cursed sword (enchantment 3)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }]
    }) as { results: Array<{ premium?: number }> };
    // base 100, cursed 50, first insurance 10, fee 5 = 165
    expect(result.results[0].premium).toBe(165);
  });

  // === Integration: Long-standing customer's second contract ===
  it("should calculate premium 160 G for 3-year customer, second contract, cursed sword (enchantment 7)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
      ]
    }) as { results: Array<{ premium?: number }> };
    // Second quote: base 100 + cursed 50 + high-enchant 30 + first insurance 10 - loyalty 20 - follow-up 15 = 155 + 5 fee = 160
    expect(result.results[1].premium).toBe(160);
  });

  // === Claim: Deductible per damage event ===
  it("should apply 100 G deductible per damaged item: dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]
        } }
      ]
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    // Sword: 500 - 100 deductible = 400
    // Amulet: 300 - 100 deductible = 200
    // Total payout: 600
    expect(result.results[1].payout).toBe(600);
    expect(result.results[1].remainingCap).toBeGreaterThan(0);
  });

  // === Claim: Standard reimbursement (no special clauses) ===
  it("should pay 400 G for regular steel sword (enchantment 3) damaged 500 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }
      ]
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    // 500 - 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
    expect(result.results[1].remainingCap).toBe(1600); // 2000 cap - 400 = 1600
  });
  it("should pay 100 G for rune damage 200 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }
      ]
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    // 200 - 100 deductible = 100
    expect(result.results[1].payout).toBe(100);
  });

  // === Claim: High enchantment ≥8 → 50% reimbursement ===
  it("should reimburse 50% for enchantment >= 8: steel sword enchantment 9, damage 1000 G → payout 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    }) as { results: Array<{ payout?: number }> };
    // 1000 * 0.5 = 500, 500 - 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
  });

  // === Claim: Dragon material → full reimbursement ===
  it("should fully reimburse dragon-material sword enchantment 5, damage 800 G → payout 700", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }
      ]
    }) as { results: Array<{ payout?: number }> };
    // Dragon material: full reimbursement, 800 - 100 deductible = 700
    expect(result.results[1].payout).toBe(700);
  });

  // === Claim: Enchantment ≥8 AND dragon material → 50% rule wins ===
  it("should apply 50% rule when both enchantment >= 8 and dragon material: payout 400", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }
      ]
    }) as { results: Array<{ payout?: number }> };
    // Enchantment >=8 rule (50%) wins over dragon material → 500 - 100 deductible = 400
    expect(result.results[1].payout).toBe(400);
  });

  // === Claim: Deductible per damage event (explicit) ===
  it("should apply 100 G deductible per damage event (not per claim)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]
        } }
      ]
    }) as { results: Array<{ payout?: number }> };
    // Sword: 500 - 100 = 400. Amulet: 300 - 100 = 200. Total 600.
    expect(result.results[1].payout).toBe(600);
  });

  // === Policy cap ===
  it("should have cap of 2x insurance sum: sword + amulet → sum 1600, cap 3200", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    }) as { results: Array<{ remainingCap?: number }> };
    // insurance sum: 1000 + 600 = 1600, cap = 3200
    // payout: 0 (100 - 100 deductible = 0). remainingCap = 3200 - 0 = 3200
    expect(result.results[1].remainingCap).toBe(3200);
  });
  it("should base cap on unmodified insurance value: cursed sword → cap 2000", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    }) as { results: Array<{ remainingCap?: number }> };
    // insurance sum = 1000, cap = 2000. Payout for 100 damage: 100-100=0
    expect(result.results[1].remainingCap).toBe(2000);
  });
  it("should not affect insurance sum with block discount: sword + 3 runes block → sum 1750", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } }
      ]
    }) as { results: Array<{ remainingCap?: number }> };
    // insurance sum = 1000 (sword) + 3×250 (runes) = 1750, cap = 3500, payout = 0
    expect(result.results[1].remainingCap).toBe(3500);
  });

  // === Cap exhaustion ===
  it("should exhaust cap across successive claims", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } }
      ]
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    // First claim: 1500 - 100 = 1400. Cap = 2000, remaining = 600
    expect(result.results[1].payout).toBe(1400);
    expect(result.results[1].remainingCap).toBe(600);
    // Second claim: 1500 - 100 = 1400, but cap remaining = 600, so payout = 600
    expect(result.results[2].payout).toBe(600);
    expect(result.results[2].remainingCap).toBe(0);
  });

  // === Multiple items of same type ===
  it("should allow two swords in policy → insurance sum 2000, cap 4000", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] }
      ]
    }) as { results: Array<{ premium?: number }> };
    // insurance sum = 2×1000 = 2000, cap = 4000
    // premium: base 200, first insurance 20, fee 5 = 225
    expect(result.results[0].premium).toBe(225);
  });
  it("should treat multiple damage entries of same type separately", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }]
        } }
      ]
    }) as { results: Array<{ payout?: number }> };
    // Each sword damage gets its own 100 G deductible
    // Sword 1: 500 - 100 = 400
    // Sword 2: 300 - 100 = 200, total = 600
    expect(result.results[1].payout).toBe(600);
  });
  it("should reject claim when damages contain more entries of a type than insured", () => {
    expect(() => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: {
          cause: "dragon attack",
          damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }]
        } }
      ]
    })).toThrow();
  });

  // === Rounding ===
  it("should round premium up in MHPCO's favor: 197.5 G → 198 G", () => {
    // Base 175 (7 runes) + first insurance 17.5 + fee 5 = 197.5 → ceil 198
    // Already tested in the 7-runes test above
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }]
    }) as { results: Array<{ premium?: number }> };
    expect(result.results[0].premium).toBe(198);
  });
  it("should round payout down in MHPCO's favor", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] } }
      ]
    }) as { results: Array<{ payout?: number }> };
    // 1001 * 0.5 = 500.5, floor(500.5 - 100) = floor(400.5) = 400
    expect(result.results[1].payout).toBe(400);
  });

  // === CLI I/O format: Schema example ===
  it("should process schema example: customer 5 years, quote amulet silver enchantment 2, claim damage 200", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    // Premium: base 60 + first insurance 6 - loyalty 12 + fee 5 = 59
    expect(result.results[0].premium).toBe(59);
    // Claim: 200 - 100 deductible = 100, cap 1200 - 100 = 1100
    expect(result.results[1].payout).toBe(100);
    expect(result.results[1].remainingCap).toBe(1100);
  });

  // === Scenario: sequential steps ===
  it("should process multiple sequential quote and claim steps in a scenario", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }
      ]
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    expect(result.results).toHaveLength(2);
  });
});