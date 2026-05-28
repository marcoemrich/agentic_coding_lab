import { describe, it, expect } from "vitest";
import { type Scenario, type StepResult, type ClaimResult } from "./claim-office.js";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  it("should return premium 5 G for empty item list -- only processing fee", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }]
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  describe("Basic item premiums", () => {
    it("should return premium 115 G for a single plain sword (100 base + 10 first insurance + 5 fee)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return premium 71 G for a single plain amulet (60 base + 6 first insurance + 5 fee)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return premium 93 G for a single plain staff (80 base + 8 first insurance + 5 fee)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should return premium 49 G for a single plain potion (40 base + 4 first insurance + 5 fee)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("should return premium 33 G for a single rune (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should return premium 33 G for a single moonstone (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Component building block pricing", () => {
    it("should return base premium 50 G for 2 runes (no block) -- 50 + 5 fee + 5 first insurance = 60 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("should return base premium 60 G for 3 runes (block applies) -- 60 + 6 first insurance + 5 fee = 71 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should return base premium 100 G for 4 runes (no block) -- 100 + 10 first insurance + 5 fee = 115 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should return base premium 175 G for 7 runes -- 175 + 17.5 first insurance + 5 fee = 197.5 rounded up = 198 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill(null).map(() => ({ type: "rune" })) }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("should return base premium 75 G for 2 runes + 1 moonstone -- 75 + 7.5 first insurance + 5 fee = 87.5 rounded up = 88 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("should return base premium 120 G for 3 runes + 3 moonstones (two blocks) -- 120 + 12 first insurance + 5 fee = 137 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Premium modifiers", () => {
    it("should add 50 % risk surcharge for cursed items -- 100 base + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should add 30 % risk surcharge for highly enchanted items (enchantment >= 5) -- 100 base + 30 enchant + 10 first insurance + 5 fee = 145 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should NOT add high-enchantment surcharge for enchantment level 4 -- 100 base + 10 first insurance + 5 fee = 115 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should apply both curse and high-enchantment surcharges when both conditions met -- 100 base + 50 curse + 30 enchant + 10 first insurance + 5 fee = 195 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("should apply 20 % loyalty discount for customers with >= 2 years with MHPCO -- 100 base + 10 first insurance - 20 loyalty + 5 fee = 95 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("should apply 10 % initial assessment surcharge for first insurance", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should apply 15 % discount on each contract after the first (follow-up contract)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("should add 5 G processing fee to every premium", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBeGreaterThanOrEqual(5);
    });
  });

  describe("Multi-item modifier scope", () => {
    it("should apply item-specific modifiers to the affected item only (cursed sword + plain amulet) -- 210 + 16 first ins + 5 fee = 231 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Modifier thresholds", () => {
    it("should apply loyalty discount for customer with exactly 2 years with MHPCO", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("should apply high-enchantment surcharge for sword with exactly enchantment 5", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should apply both curse and high-enchantment surcharges for cursed sword with exactly enchantment 5", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 195 });
    });
  });

describe("Rounding in MHPCO's favor", () => {
    it("should round premium up (e.g. 197.5 -> 198 G) -- 7 runes: 175 + 17.5 first ins + 5 fee = 197.5 rounded up = 198", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill(null).map(() => ({ type: "rune" })) }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("should round payout down (e.g. 350.5 -> 350 G)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 901 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(350);
    });
  });

  describe("Error handling", () => {
    it("should exit with non-zero status and write error for unknown item type in quote", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("should exit with non-zero status and write error for claim referencing uninsured item", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "amulet", amount: 200 }] } }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("should exit with non-zero status and write error for claim with negative damage amount", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: -200 }] } }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("Claim processing - standard reimbursement", () => {
    it("should reimburse damage minus 100 G deductible for regular items (no special clauses)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(400);
      expect(claimResult.remainingCap).toBe(1600);
    });
    it("should reimburse damage minus 100 G deductible for components like runes", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "rune", amount: 200 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(100);
    });
  });

  describe("Claim processing - special clauses", () => {
    it("should reimburse at 50% of damage for items with enchantment >= 8, then subtract deductible", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(400);
    });
    it("should fully reimburse damage for items made of dragon material, then subtract deductible", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 800 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(700);
    });
    it("should apply 50% rule (not full reimbursement) when both enchantment >= 8 and dragon material apply", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(400);
    });
    it("should apply full reimbursement (not 50% rule) for dragon material with enchantment < 8", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 800 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(700);
    });
    it("should apply 50% rule for steel sword with enchantment >= 8", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(400);
    });
  });

  describe("Deductible per damage event", () => {
    it("should apply 100 G deductible once per damaged item", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(600);
    });
  });

  describe("Cap and multiple claims", () => {
    it("should cap payout at 2x the insurance sum (sword: cap 2000 G)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 3000 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(2000);
      expect(claimResult.remainingCap).toBe(0);
    });
    it("should track remaining cap across successive claims", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } }
        ]
      };
      const result = processScenario(scenario);
      const firstClaim = result.results[1] as ClaimResult;
      const secondClaim = result.results[2] as ClaimResult;
      expect(firstClaim.payout).toBe(1400);
      expect(firstClaim.remainingCap).toBe(600);
      expect(secondClaim.payout).toBe(600);
      expect(secondClaim.remainingCap).toBe(0);
    });
    it("should reduce desired payout to remaining cap when cap is insufficient", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } }
        ]
      };
      const result = processScenario(scenario);
      const secondClaim = result.results[2] as ClaimResult;
      expect(secondClaim.payout).toBe(600);
      expect(secondClaim.remainingCap).toBe(0);
    });
  });

  describe("Multiple items of same type", () => {
    it("should sum insurance values and cap for multiple items of same type", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(900);
      expect(claimResult.remainingCap).toBe(3100);
    });
    it("should treat each damage entry as a separate damage with its own deductible", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(600);
    });
    it("should reject claim when damages contain more entries of a type than the policy covers", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("Cap exhaustion", () => {
    it("should compute insurance sum as sum of items' insurance values", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 3200 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.remainingCap).toBe(100);
    });
    it("should base cap on unmodified insurance values (premium modifiers do not raise the cap)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 2100 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(2000);
      expect(claimResult.remainingCap).toBe(0);
    });
    it("should compute insurance sum correctly with component blocks (block discount affects premium only)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1000 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.remainingCap).toBe(2600);
    });
  });

  describe("Integration examples", () => {
    it("should compute premium 165 G for newcomer with cursed sword (0 years, no previous contract)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }]
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should compute premium 160 G for long-standing customer's second contract with cursed high-enchantment sword", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }
        ]
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Error handling", () => {
    it("should exit with non-zero status and write error for unknown item type in quote", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("should exit with non-zero status and write error for claim referencing uninsured item", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "amulet", amount: 200 }] } }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("should exit with non-zero status and write error for claim with negative damage amount", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: -200 }] } }
        ]
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("Multi-step scenario processing", () => {
    it("should process a quote followed by a claim referencing the policy by step index", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }] } }
        ]
      };
      const result = processScenario(scenario);
      const claimResult = result.results[1] as ClaimResult;
      expect(claimResult.payout).toBe(400);
      expect(claimResult.remainingCap).toBe(1600);
    });
  });
});
