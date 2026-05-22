import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - base premium calculation", () => {
    it("should return premium 5 G for empty item list (just processing fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
    });
    it("should return premium 115 G for a single sword (100 base + 10 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should return premium 71 G for a single amulet (60 base + 6 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("should return premium 93 G for a single staff (80 base + 8 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 93 }] });
    });
    it("should return premium 49 G for a single potion (40 base + 4 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 49 }] });
    });
    it("should return premium 33 G for a single rune component (25 base + 2.5 first ins + 5 fee, rounded up)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
    it("should return premium 33 G for a single moonstone component", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "moonstone" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }] });
    });
    it("should sum base premiums of multiple distinct items (sword + amulet = 176 + 5 fee = 181 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("quote - component blocks", () => {
    it("should charge 71 G for 3 alike runes (60 block + 6 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("should charge 71 G for 3 alike moonstones (60 block + 6 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("should charge 88 G for 2 runes + 1 moonstone — no block applies (75 base + 7.5 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    });
    it("should charge 115 G for 4 runes — block requires exactly 3 alike (100 base + 10 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should charge 137 G for 3 runes + 3 moonstones — two separate blocks (120 base + 12 first ins + 5 fee)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote - item-specific modifiers", () => {
    it("should apply +50% curse surcharge to a cursed sword (100 + 50 curse + 10 first ins + 5 fee = 165 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("should apply +30% high-enchantment surcharge to a sword with enchantment >= 5 (100 + 30 + 10 first ins + 5 fee = 145 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
    });
    it("should not apply high-enchantment surcharge below threshold (enchantment 4 sword = 115 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should apply +10% first-insurance surcharge to each item in a quote (confirmation; sword = 115 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should stack curse and high-enchantment surcharges on the same item (cursed sword ench 7 = 100 + 50 + 30 + 10 + 5 fee = 195 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
    });
  });

  describe("quote - policy-wide modifiers", () => {
    it("should apply -20% loyalty discount when yearsWithMHPCO >= 2 (sword for 2-year customer: 100 base + 10 first ins - 20 loyalty + 5 fee = 95 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
    });
    it("should not apply loyalty discount when yearsWithMHPCO < 2 (sword for 1-year customer = 115 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 1 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("should apply -15% follow-up discount on customer's 2nd+ contract (sword: 100 + 10 first ins - 15 follow-up + 5 fee = 100 G)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "quote", items: [{ type: "sword" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
  });

  describe("quote - integration examples from spec", () => {
    it("should compute 165 G for newcomer (0 years, 1st contract) with cursed steel sword enchantment 3", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("should compute 160 G for 3-year customer on 2nd contract with cursed steel sword enchantment 7", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
    });
  });

  describe("quote - rounding", () => {
    it("should round final premium UP to whole G in MHPCO's favor", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }] }] };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 143 }] });
    });
  });

  describe("quote - validation", () => {
    it("should reject quote with unknown item type (non-zero exit, error to stderr)", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("claim - base payout calculation", () => {
    it("should pay out damage minus 100 G deductible for a standard item (sword damaged 500 G -> 400 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 400 }] });
    });
    it("should pay out 0 G when damage equals deductible (sword damaged 100 G -> 0 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 0 }] });
    });
    it("should pay out damage minus deductible for a component (rune damaged 200 G -> 100 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 33 }, { payout: 100 }] });
    });
  });

  describe("claim - special reimbursement rules", () => {
    it("should reimburse 50% of damage then subtract deductible for highly enchanted item (sword ench 8 damaged 1000 G -> 500 - 100 = 400 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400 }] });
    });
    it("should fully reimburse dragon-material item then subtract deductible (dragon sword damaged 1000 G -> 1000 - 100 = 900 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 900 }] });
    });
    it("should apply 50% rule (not dragon rule) when both apply (dragon sword ench 8 damaged 1000 G -> 500 - 100 = 400 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 400 }] });
    });
  });

  describe("claim - rounding", () => {
    it("should round final payout DOWN to whole G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 701 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 145 }, { payout: 250 }] });
    });
  });

  describe("claim - validation", () => {
    it("should reject claim that references an item not in the policy (non-zero exit, error to stderr)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 500 }] } },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("should reject claim with negative damage amount (non-zero exit, error to stderr)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
    it("should reject the whole claim when damages of a type exceed insured quantity (non-zero exit, error to stderr)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }, { itemType: "sword", amount: 200 }] } },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  describe("scenario processing", () => {
    it("should return empty results for a scenario with no steps", () => {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [] };
      expect(processScenario(scenario)).toEqual({ results: [] });
    });
    it("should process quote and claim steps sequentially and preserve order in results", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 400 }, { premium: 62 }] });
    });
    it("should allow a claim step to reference a prior quote step by index", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
        ],
      };
      expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { premium: 62 }, { payout: 200 }] });
    });
  });
});
