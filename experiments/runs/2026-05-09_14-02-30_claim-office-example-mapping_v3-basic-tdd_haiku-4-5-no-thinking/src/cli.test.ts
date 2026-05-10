import { describe, it, expect } from "vitest";
import { calculatePremium, calculateInsuranceSum } from "./pricing";
import { processClaim } from "./claims";

describe("Integration Examples", () => {
  it("should handle example from prompt: newcomer with cursed sword", () => {
    // Integration example 1: newcomer with cursed sword
    // customer: 0 years with MHPCO, no previous contract
    // item: a cursed sword (steel, enchantment 3)
    // expected premium: 165 G
    const premium = calculatePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      0,
      true,
      false
    );
    expect(premium).toBe(165);
  });

  it("should handle example from prompt: long-standing customer's second contract", () => {
    // Integration example 2: long-standing customer's second contract
    // customer: 3 years with MHPCO; this is the customer's second quote
    // item: a cursed sword (steel, enchantment 7)
    // expected premium: 160 G
    const premium = calculatePremium(
      [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
      3,
      true,
      true
    );
    expect(premium).toBe(160);
  });

  it("should calculate insurance sum for single sword", () => {
    // Single sword: 1000 G
    const sum = calculateInsuranceSum([{ type: "sword" }]);
    expect(sum).toBe(1000);
  });

  it("should calculate insurance sum for sword and amulet", () => {
    // sword + amulet = 1000 + 600 = 1600
    const sum = calculateInsuranceSum([{ type: "sword" }, { type: "amulet" }]);
    expect(sum).toBe(1600);
  });

  it("should calculate insurance sum for sword and 3 runes (block)", () => {
    // sword (1000) + 3 runes (3 * 250) = 1750
    // Note: block discount affects premium only, not insurance sum
    const sum = calculateInsuranceSum([
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(sum).toBe(1750);
  });

  it("should calculate cap for sword as twice the insurance value", () => {
    // Insurance sum: 1000, cap: 2000
    const sum = calculateInsuranceSum([{ type: "sword" }]);
    const cap = sum * 2;
    expect(cap).toBe(2000);
  });

  it("should calculate cap for sword and amulet", () => {
    // Insurance sum: 1600, cap: 3200
    const sum = calculateInsuranceSum([{ type: "sword" }, { type: "amulet" }]);
    const cap = sum * 2;
    expect(cap).toBe(3200);
  });

  it("should handle deductible per damage event correctly", () => {
    // Dragon attack damages sword (500 G) and amulet (300 G)
    // payout = 600 G (100 G deductible applies once per damaged item)
    // sword: 500 - 100 = 400
    // amulet: 300 - 100 = 200
    // total: 600
    const policyItems = [{ type: "sword" }, { type: "amulet" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "amulet" as const, amount: 300 },
      ],
    };
    const result = processClaim(policyItems, incident, 3200);
    expect(result.payout).toBe(600);
  });

  it("should handle cap exhaustion over multiple claims", () => {
    // Sword insured (insurance sum 1000 G, cap 2000 G)
    // First claim: damage 1500 G
    const policyItems = [{ type: "sword" }];
    const incident1 = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 1500 }],
    };
    const result1 = processClaim(policyItems, incident1, 2000);
    expect(result1.payout).toBe(1400); // 1500 - 100 deductible
    expect(result1.remainingCap).toBe(600);

    // Second claim: damage 1500 G
    const incident2 = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 1500 }],
    };
    const result2 = processClaim(policyItems, incident2, 600);
    expect(result2.payout).toBe(600); // Capped at remaining 600
    expect(result2.remainingCap).toBe(0);
  });

  it("should handle enchantment clause and deductible", () => {
    // Steel sword, enchantment 9, damage 1000 G
    // High-enchantment clause applies: 50% first, then deductible
    // 1000 * 0.5 = 500, 500 - 100 = 400
    const policyItems = [{ type: "sword", material: "steel", enchantment: 9 }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 1000 }],
    };
    const result = processClaim(policyItems, incident, 2000);
    expect(result.payout).toBe(400);
  });

  it("should prefer 50% rule over dragon material when both apply", () => {
    // Dragon-material sword, enchantment 9, damage 1000 G
    // Both clauses apply; the 50% rule wins
    // 1000 * 0.5 = 500, 500 - 100 = 400
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 1000 }],
    };
    const result = processClaim(policyItems, incident, 2000);
    expect(result.payout).toBe(400);
  });

  it("should handle dragon material without high enchantment", () => {
    // Dragon-material sword, enchantment 5, damage 800 G
    // Only the dragon-material clause applies: full reimbursement
    // 800 - 100 = 700
    const policyItems = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: 800 }],
    };
    const result = processClaim(policyItems, incident, 2000);
    expect(result.payout).toBe(700);
  });

  it("should handle empty item list premium (only fee)", () => {
    // Empty item list → premium 5 G (only processing fee)
    const premium = calculatePremium([], 0, false, false);
    expect(premium).toBe(5);
  });

  it("should handle 2 runes base premium", () => {
    // 2 runes → 50 G base premium (no block)
    const premium = calculatePremium([{ type: "rune" }, { type: "rune" }], 0, false, false);
    expect(premium).toBe(55); // 50 + 5 fee
  });

  it("should handle 3 runes block premium", () => {
    // 3 runes → 60 G base premium (block applies)
    const premium = calculatePremium(
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      0,
      false,
      false
    );
    expect(premium).toBe(65); // 60 + 5 fee
  });

  it("should reject claim for item not in policy", () => {
    const policyItems = [{ type: "sword" }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "amulet" as const, amount: 300 }],
    };
    expect(() => processClaim(policyItems, incident, 2000)).toThrow();
  });

  it("should reject claim with more damages than policy covers", () => {
    const policyItems = [{ type: "sword" }];
    const incident = {
      cause: "dragon",
      damages: [
        { itemType: "sword" as const, amount: 500 },
        { itemType: "sword" as const, amount: 600 },
      ],
    };
    expect(() => processClaim(policyItems, incident, 2000)).toThrow();
  });

  it("should reject negative damage amounts", () => {
    const policyItems = [{ type: "sword" }];
    const incident = {
      cause: "fire",
      damages: [{ itemType: "sword" as const, amount: -200 }],
    };
    expect(() => processClaim(policyItems, incident, 2000)).toThrow();
  });
});
