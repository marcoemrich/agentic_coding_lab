import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ============================================================
  // Quote: empty / single items (simplest cases)
  // ============================================================

  describe("Quote: base cases", () => {
    it("should return premium 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 5 });
    });

    it("should return premium 115 G for a single plain sword (100 base + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 115 });
    });

    it("should return premium 71 G for a single plain amulet (60 base + 6 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 71 });
    });

    it("should return premium 93 G for a single plain staff (80 base + 8 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 93 });
    });

    it("should return premium 49 G for a single plain potion (40 base + 4 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 49 });
    });
  });

  // ============================================================
  // Quote: component base premiums and building blocks
  // ============================================================

  describe("Quote: components and building blocks", () => {
    it("should compute base premium 50 G for 2 runes (2 x 25, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base premium = 2 x 25 = 50; first-insurance = 10% of 50 = 5; fee = 5; total = 60
      expect(result.results[0]).toEqual({ premium: 60 });
    });

    it("should compute base premium 60 G for 3 runes (block of 3 alike applies)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base premium = 60 (block of 3 alike); first-insurance = 10% of 60 = 6; fee = 5; total = 71
      expect(result.results[0]).toEqual({ premium: 71 });
    });

    it("should compute base premium 100 G for 4 runes (no block -- block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base premium = 4 x 25 = 100 (no block: count is not exactly 3); first-insurance = 10% of 100 = 10; fee = 5; total = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });

    it("should compute base premium 175 G for 7 runes (7 x 25, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({
              type: "rune",
              material: "magic",
              enchantment: 0,
              cursed: false,
            })),
          },
        ],
      };
      const result = processScenario(scenario);
      // base premium = 7 x 25 = 175 (no block: count is not exactly 3); first-insurance = 10% of 175 = 17.5; fee = 5; total = 197.5 -> ceil = 198
      expect(result.results[0]).toEqual({ premium: 198 });
    });

    it("should compute base premium 75 G for 2 runes + 1 moonstone (no block: different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "moonstone", material: "magic", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base premium = 3 x 25 = 75 (no block: different types); first-insurance = 10% of 75 = 7.5; fee = 5; total = 87.5 -> ceil = 88
      expect(result.results[0]).toEqual({ premium: 88 });
    });

    it("should compute base premium 120 G for 3 runes + 3 moonstones (two separate blocks: 60 + 60)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "moonstone", material: "magic", enchantment: 0, cursed: false },
              { type: "moonstone", material: "magic", enchantment: 0, cursed: false },
              { type: "moonstone", material: "magic", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base premium = 60 (rune block) + 60 (moonstone block) = 120; first-insurance = 10% of 120 = 12; fee = 5; total = 137
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  // ============================================================
  // Quote: item-specific modifiers (cursed, high enchantment)
  // ============================================================

  describe("Quote: item-specific modifiers", () => {
    it("should add 50% curse surcharge -- cursed sword newcomer: 100 + 50 curse + 10 first-insurance + 5 fee = 165 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 165 });
    });

    it("should add 30% high-enchantment surcharge for sword with enchantment exactly 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base = 100, high-ench surcharge = 30% of 100 = 30, first-ins = 10% of 100 = 10, fee = 5
      // total = 100 + 30 + 10 + 5 = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });

    it("should NOT add high-enchantment surcharge for sword with enchantment 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base = 100, NO high-ench surcharge (4 < 5), first-ins = 10% of 100 = 10, fee = 5
      // total = 100 + 10 + 5 = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });

    it("should apply both curse and high-enchantment surcharges to sword with enchantment 5, cursed", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base = 100, curse = 50% of 100 = 50, high-ench = 30% of 100 = 30,
      // first-ins = 10% of 100 = 10, fee = 5
      // total = 100 + 50 + 30 + 10 + 5 = 195
      expect(result.results[0]).toEqual({ premium: 195 });
    });

    it("should apply item-specific modifiers only to the affected item -- cursed sword (100 base) + plain amulet (60 base) = 210 G before policy-wide modifiers and fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // policy base = 100 + 60 = 160
      // curse surcharge on sword only = 50% of 100 = 50
      // subtotal before policy-wide = 160 + 50 = 210
      // first-insurance = 10% of 160 = 16
      // premium = 210 + 16 + 5 fee = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  // ============================================================
  // Quote: policy-wide modifiers (loyalty, first-insurance, follow-up)
  // ============================================================

  describe("Quote: policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with exactly 2 years with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base = 100, loyalty discount = 20% of 100 = 20, first-ins = 10% of 100 = 10, fee = 5
      // total = 100 - 20 + 10 + 5 = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });

    it("should NOT apply loyalty discount for customer with 1 year with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base = 100, NO loyalty discount (1 < 2), first-ins = 10% of 100 = 10, fee = 5
      // total = 100 + 10 + 5 = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });

    it("should apply 10% first-insurance surcharge on every quote (always applies)", () => {
      // Even a brand-new customer with 0 years gets the first-insurance surcharge
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // base = 80, first-insurance = 10% of 80 = 8, fee = 5
      // total = 80 + 8 + 5 = 93
      // The surcharge is always present -- removing it would give 85, not 93
      expect(result.results[0]).toEqual({ premium: 93 });
    });

    it("should apply 15% follow-up contract discount on the customer's second quote in the scenario", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote: 100 base + 10 first-ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote: 100 base - 15 follow-up + 10 first-ins + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });

    it("should apply first-insurance surcharge even on follow-up contracts -- both modifiers coexist", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote: 100 base + 10 first-ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // Second quote (follow-up): 60 base + 6 first-ins - 9 follow-up + 5 fee = 62
      // Without first-insurance, it would be 60 - 9 + 5 = 56 -- this test verifies first-ins is present
      expect(result.results[1]).toEqual({ premium: 62 });
    });
  });

  // ============================================================
  // Quote: integration examples (multiple modifiers combined)
  // ============================================================

  describe("Quote: integration examples", () => {
    it("should return 165 G for newcomer (0 years, first contract) with cursed sword (steel, ench 3) -- 100 base + 50 curse + 10 first-ins = 160 + 5 fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Integration example 1: 100 base + 50 curse + 10 first-ins = 160 + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });

    it("should return 160 G for long-standing customer (3 years, second contract) with cursed sword (steel, ench 7) -- 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up = 155 + 5 fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Integration example 2: second quote with cursed sword (ench 7), loyal customer (3 years)
      // base = 100, curse = 50, high-ench = 30, loyalty = -20, first-ins = 10, follow-up = -15
      // = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  // ============================================================
  // Quote: rounding
  // ============================================================

  describe("Quote: rounding", () => {
    it("should round premium UP in MHPCO's favor -- 197.5 G rounds to 198 G", () => {
      // 7 runes: base premium = 7 x 25 = 175; first-insurance = 10% of 175 = 17.5; fee = 5
      // raw premium = 175 + 17.5 + 5 = 197.5 -> ceil = 198
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: Array.from({ length: 7 }, () => ({
              type: "rune",
              material: "magic",
              enchantment: 0,
              cursed: false,
            })),
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0]).toEqual({ premium: 198 });
    });
  });

  // ============================================================
  // Claim: standard reimbursement (no special clauses)
  // ============================================================

  describe("Claim: standard reimbursement", () => {
    it("should return payout 400 G for regular sword (steel, ench 3), damage 500 G (full reimbursement minus 100 G deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Quote result at index 0, claim result at index 1
      // Payout = 500 (damage) - 100 (deductible) = 400
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 100 G for rune, damage 200 G (full reimbursement minus 100 G deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Payout = 200 (damage) - 100 (deductible) = 100
      // Insurance sum = 250 (rune), cap = 500, remainingCap = 500 - 100 = 400
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  // ============================================================
  // Claim: deductible per damage event
  // ============================================================

  describe("Claim: deductible", () => {
    it("should apply 100 G deductible per damaged item -- sword 500 G + amulet 300 G = payout 600 G (400 + 200)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Payout: sword 500 - 100 = 400, amulet 300 - 100 = 200, total = 600
      // Insurance sum = 1000 + 600 = 1600, cap = 3200, remainingCap = 3200 - 600 = 2600
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  // ============================================================
  // Claim: high enchantment reimbursement
  // ============================================================

  describe("Claim: high enchantment", () => {
    it("should reimburse at 50% for steel sword with enchantment 9 -- damage 1000 G -> payout 400 G (500 - 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Enchantment 9 >= 8 -> reimburse at 50%: 50% of 1000 = 500, minus 100 deductible = 400
      // Insurance sum = 1000, cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should reimburse at 50% for dragon-material sword with enchantment 8 -- damage 1000 G -> payout 400 G (500 - 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // R9 + R11: enchantment 8 >= 8 -> reimburse at 50%: 50% of 1000 = 500, minus 100 deductible = 400
      // Insurance sum = 1000, cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  // ============================================================
  // Claim: dragon material reimbursement
  // ============================================================

  describe("Claim: dragon material", () => {
    it("should fully reimburse dragon-material sword with enchantment 5 -- damage 800 G -> payout 700 G (800 - 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // R10: dragon-material sword fully reimbursed: 800, minus 100 deductible = 700
      // Insurance sum = 1000, cap = 2000, remainingCap = 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  // ============================================================
  // Claim: enchantment >= 8 AND dragon material
  // ============================================================

  describe("Claim: enchantment vs dragon material interaction", () => {
    it("should apply 50% rule when dragon-material sword has enchantment 9 -- damage 1000 G -> payout 400 G (50% wins over dragon-material full reimbursement)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // R11: dragon-material + enchantment 9 (>= 8) -> 50% rule wins
      // 50% of 1000 = 500, minus 100 deductible = 400
      // Insurance sum = 1000, cap = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  // ============================================================
  // Claim: payout rounding
  // ============================================================

  describe("Claim: rounding", () => {
    it("should round payout DOWN in MHPCO's favor -- 350.5 G rounds to 350 G", () => {
      // Steel sword with enchantment 9 -> 50% reimbursement applies
      // Damage 901: 50% of 901 = 450.5, minus 100 deductible = 350.5 -> floor = 350
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Payout: 50% of 901 = 450.5, minus 100 = 350.5, floor = 350
      // Insurance sum = 1000, cap = 2000, remainingCap = 2000 - 350 = 1650
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  // ============================================================
  // Claim: cap
  // ============================================================

  describe("Claim: cap", () => {
    it("should set cap at 2x insurance sum -- sword (1000) + amulet (600) = insurance sum 1600, cap 3200 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Insurance sum = 1000 (sword) + 600 (amulet) = 1600
      // Cap = 2 x 1600 = 3200
      // Payout = 500 - 100 (deductible) = 400
      // Remaining cap = 3200 - 400 = 2800
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
    });

    it("should base cap on unmodified insurance value -- cursed sword (ins value 1000) -> cap 2000 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Insurance value of sword = 1000 (unmodified by curse), cap = 2 x 1000 = 2000
      // Payout = 500 - 100 (deductible) = 400
      // Remaining cap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should not let block discount affect insurance sum -- sword + 3 runes -> insurance sum 1750 G (1000 + 3x250)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
              { type: "rune", material: "magic", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // Insurance sum = 1000 (sword) + 3 x 250 (runes) = 1750 (block discount does NOT affect insurance sum)
      // Cap = 2 x 1750 = 3500
      // Payout = 500 - 100 (deductible) = 400
      // Remaining cap = 3500 - 400 = 3100
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });

    it.todo(
      "should exhaust cap across multiple claims -- sword insured (cap 2000); first claim 1500 -> payout 1400, remaining 600; second claim 1500 -> payout 600, remaining 0"
    );
  });

  // ============================================================
  // Claim: multiple items of the same type
  // ============================================================

  describe("Claim: multiple items of same type", () => {
    it.todo(
      "should allow two swords in a policy -- insurance sum 2000 G, cap 4000 G"
    );

    it.todo(
      "should apply separate deductible per damage entry when both swords are damaged"
    );

    it.todo(
      "should reject claim if damages array has more entries of a type than the policy covers -- non-zero exit"
    );
  });

  // ============================================================
  // Error handling
  // ============================================================

  describe("Error handling", () => {
    it.todo(
      "should reject quote with unknown item type (e.g. broomstick) -- error thrown"
    );

    it.todo(
      "should reject claim referencing a damage item not in the policy -- error thrown"
    );

    it.todo(
      "should reject claim with negative damage amount -- error thrown"
    );
  });

  // ============================================================
  // CLI integration
  // ============================================================

  describe("CLI integration", () => {
    it.todo(
      "should read JSON scenario from stdin and write JSON results to stdout"
    );

    it.todo(
      "should process a full scenario with quote and claim steps, returning results array matching step order"
    );

    it.todo(
      "should exit with non-zero status code and write error to stderr for unknown item type"
    );

    it.todo(
      "should exit with non-zero status code and write error to stderr for damage to item not in policy"
    );

    it.todo(
      "should exit with non-zero status code and write error to stderr for negative damage amount"
    );

    it.todo(
      "should exit with non-zero status code when damages exceed insured item count"
    );
  });
});
