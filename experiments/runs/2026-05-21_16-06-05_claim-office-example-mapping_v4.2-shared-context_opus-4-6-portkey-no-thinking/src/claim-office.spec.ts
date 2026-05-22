import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ── Quote: empty and single-item base premiums ──────────────────────
  describe("Quote - base premiums", () => {
    it("should return 5 G premium for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 5 }]);
    });

    it("should return 115 G for a single plain sword — new customer first quote (100 base + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 115 }]);
    });

    it("should return 71 G for a single plain amulet — new customer first quote (60 base + 6 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "amulet" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 71 }]);
    });

    it("should return 93 G for a single plain staff — new customer first quote (80 base + 8 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "staff" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 93 }]);
    });

    it("should return 49 G for a single plain potion — new customer first quote (40 base + 4 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "potion" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 49 }]);
    });

    it("should return 33 G for a single rune — new customer first quote (25 base + 2.5 first-insurance + 5 fee = 32.5, ceiling 33)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "rune" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 33 }]);
    });
  });

  // ── Quote: component building blocks ────────────────────────────────
  describe("Quote - component building blocks", () => {
    it("should use 50 G base premium for 2 runes (2 x 25, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 60 }]);
    });

    it("should use 60 G base premium for 3 runes (block of exactly 3 alike)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 71 }]);
    });

    it("should use 100 G base premium for 4 runes (no block — block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 115 }]);
    });

    it("should use 175 G base premium for 7 runes (7 x 25, no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 198 }]);
    });
  });

  // ── Quote: "alike" component blocks ─────────────────────────────────
  describe("Quote - alike components", () => {
    it("should use 75 G base premium for 2 runes + 1 moonstone (no block: different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 88 }]);
    });

    it("should use 120 G base premium for 3 runes + 3 moonstones (two separate blocks: 60 + 60)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 137 }]);
    });
  });

  // ── Quote: item-specific modifiers ──────────────────────────────────
  describe("Quote - item-specific modifiers", () => {
    it("should add 50% curse surcharge on a cursed sword's base premium", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword", cursed: true }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 165 }]);
    });

    it("should add 30% high-enchantment surcharge for sword with enchantment exactly 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 145 }]);
    });

    it("should not add high-enchantment surcharge for sword with enchantment 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 115 }]);
    });

    it("should apply both cursed and high-enchantment surcharges when sword is cursed with enchantment >= 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 195 }]);
    });
  });

  // ── Quote: modifier scope on multi-item policies ────────────────────
  describe("Quote - modifier scope on multi-item policies", () => {
    it("should apply cursed surcharge only to the cursed item's base premium — cursed sword + plain amulet: policy base 160 + 50 curse on sword = 210 before further modifiers and fee", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ] }],
      };
      const results = processScenario(scenario);
      // policy base = 100 + 60 = 160
      // curse surcharge = 50% of 100 (sword only) = 50
      // first insurance = 10% of 160 = 16
      // total = 160 + 50 + 16 + 5 fee = 231
      expect(results).toEqual([{ premium: 231 }]);
    });
  });

  // ── Quote: policy-wide modifiers ────────────────────────────────────
  describe("Quote - policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with exactly 2 years with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword" }] }],
      };
      const results = processScenario(scenario);
      // policy base = 100, loyalty = -20% of 100 = -20, first-ins = +10% of 100 = +10, + 5 fee = 95
      expect(results).toEqual([{ premium: 95 }]);
    });

    it("should not apply loyalty discount for customer with 1 year with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword" }] }],
      };
      const results = processScenario(scenario);
      // No loyalty discount (1 year < 2 year threshold), so:
      // 100 base + 10 first-insurance + 5 fee = 115
      expect(results).toEqual([{ premium: 115 }]);
    });

    it("should apply 15% follow-up discount on second and subsequent quotes", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 2 },
        steps: [{ type: "quote", items: [{ type: "sword" }] }],
      };
      const results = processScenario(scenario);
      // policy base = 100, follow-up = -15% of 100 = -15, first-ins = +10% of 100 = +10, + 5 fee
      // total = 100 + 10 - 15 + 5 = 100
      expect(results).toEqual([{ premium: 100 }]);
    });

    it("should always apply 10% first-insurance surcharge to every item regardless of customer history", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5, quoteNumber: 3 },
        steps: [{ type: "quote", items: [{ type: "sword" }] }],
      };
      const results = processScenario(scenario);
      // policy base = 100, first-ins = +10% of 100 = +10, loyalty = -20% of 100 = -20, follow-up = -15% of 100 = -15, + 5 fee
      // total = 100 + 10 - 20 - 15 + 5 = 80
      expect(results).toEqual([{ premium: 80 }]);
    });
  });

  // ── Quote: rounding ─────────────────────────────────────────────────
  describe("Quote - rounding", () => {
    it("should round premium up (ceiling) in MHPCO's favor — e.g. 197.5 G becomes 198 G", () => {
      // 7 runes: base = 175 G, first-insurance = 10% of 175 = 17.5, + 5 fee = 197.5 -> ceil = 198
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 198 }]);
    });
  });

  // ── Quote: integration examples ─────────────────────────────────────
  describe("Quote - integration", () => {
    it("should return 165 G for newcomer with cursed sword — 0 years, first quote, cursed steel sword ench 3 (100 base + 50 curse + 10 first-ins + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 165 }]);
    });

    it("should return 160 G for long-standing customer second contract — 3 years, second quote, cursed steel sword ench 7 (100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3, quoteNumber: 2 },
        steps: [{ type: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] }],
      };
      const results = processScenario(scenario);
      expect(results).toEqual([{ premium: 160 }]);
    });
  });

  // ── Claim: standard reimbursement ───────────────────────────────────
  describe("Claim - standard reimbursement", () => {
    it("should return payout 400 G for regular steel sword ench 3 with 500 G damage (full reimbursement minus 100 G deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 500 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 100 G for rune with 200 G damage (full reimbursement minus 100 G deductible; no special clause for components)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "rune" }] },
          { type: "claim", policy: 0, damages: [{ type: "rune", amount: 200 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  // ── Claim: enchantment and material clauses ─────────────────────────
  describe("Claim - enchantment and material clauses", () => {
    it("should return payout 400 G for dragon-material sword ench 9 with 1000 G damage (both clauses: 50% wins, 500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 1000 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 700 G for dragon-material sword ench 5 with 800 G damage (only dragon clause: full, 800 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 800 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });

    it("should return payout 400 G for steel sword ench 9 with 1000 G damage (only high-ench clause: 50%, 500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 1000 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 400 G for dragon-material sword ench exactly 8 with 1000 G damage (high-ench threshold at 8: 50%, 500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 1000 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  // ── Claim: deductible per damage entry ──────────────────────────────
  describe("Claim - deductible", () => {
    it("should apply 100 G deductible per damaged item — sword 500 G + amulet 300 G = payout 600 G (400 + 200)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { type: "claim", policy: 0, damages: [
            { type: "sword", amount: 500 },
            { type: "amulet", amount: 300 },
          ] },
        ],
      };
      const results = processScenario(scenario);
      // sword: 500 - 100 deductible = 400
      // amulet: 300 - 100 deductible = 200
      // total payout = 600
      // insurance sum = 1000 + 600 = 1600, cap = 3200, remainingCap = 3200 - 600 = 2600
      expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  // ── Claim: multiple items of the same type ──────────────────────────
  describe("Claim - multiple items of same type", () => {
    it("should compute insurance sum 2000 G and cap 4000 G for two swords", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 500 }] },
        ],
      };
      const results = processScenario(scenario);
      // insurance sum = 2 x 1000 = 2000, cap = 2 x 2000 = 4000
      // payout = 500 - 100 deductible = 400
      // remainingCap = 4000 - 400 = 3600
      expect(results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });

    it("should treat two sword damage entries each with its own deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { type: "claim", policy: 0, damages: [
            { type: "sword", amount: 500 },
            { type: "sword", amount: 300 },
          ] },
        ],
      };
      const results = processScenario(scenario);
      // sword 1: 500 - 100 deductible = 400
      // sword 2: 300 - 100 deductible = 200
      // total payout = 600
      // insurance sum = 2 x 1000 = 2000, cap = 4000, remainingCap = 4000 - 600 = 3400
      expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });

    it("should reject claim with non-zero exit when damages exceed insured item count for a type", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [
            { type: "sword", amount: 500 },
            { type: "sword", amount: 300 },
          ] },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  // ── Claim: cap ──────────────────────────────────────────────────────
  describe("Claim - cap", () => {
    it("should compute cap as 2x insurance sum — sword + amulet: sum 1600 G, cap 3200 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 500 }] },
        ],
      };
      const results = processScenario(scenario);
      // insurance sum = 1000 + 600 = 1600, cap = 2 x 1600 = 3200
      // payout = 500 - 100 deductible = 400
      // remainingCap = 3200 - 400 = 2800
      expect(results[1]).toEqual({ payout: 400, remainingCap: 2800 });
    });

    it("should base cap on unmodified insurance value — cursed sword: value 1000 G, cap 2000 G", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", cursed: true }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 500 }] },
        ],
      };
      const results = processScenario(scenario);
      // insurance value = 1000 G (unmodified by cursed), cap = 2 x 1000 = 2000
      // payout = 500 - 100 deductible = 400
      // remainingCap = 2000 - 400 = 1600
      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should compute insurance sum including components at 250 G each — sword + 3 runes: sum 1750 G (block discount affects premium only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [
            { type: "sword" },
            { type: "rune" }, { type: "rune" }, { type: "rune" },
          ] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 500 }] },
        ],
      };
      const results = processScenario(scenario);
      // insurance sum = 1000 + 3 x 250 = 1750, cap = 2 x 1750 = 3500
      // payout = 500 - 100 deductible = 400
      // remainingCap = 3500 - 400 = 3100
      expect(results[1]).toEqual({ payout: 400, remainingCap: 3100 });
    });
  });

  // ── Claim: cap exhaustion across successive claims ──────────────────
  describe("Claim - cap exhaustion", () => {
    it("should return payout 1400 G and remainingCap 600 G on first claim of 1500 G against sword policy (cap 2000 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 1500 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });

    it("should return payout 600 G and remainingCap 0 G on second claim of 1500 G when only 600 G cap remains", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 1500 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 1500 }] },
        ],
      };
      const results = processScenario(scenario);
      // First claim: 1500 - 100 deductible = 1400, cap 2000, payout 1400, remaining 600
      // Second claim: 1500 - 100 deductible = 1400, but only 600 cap remains -> payout 600, remaining 0
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  // ── Claim: rounding ─────────────────────────────────────────────────
  describe("Claim - rounding", () => {
    it("should round payout down (floor) in MHPCO's favor — e.g. 350.5 G becomes 350 G", () => {
      // Sword with enchantment 8 triggers 50% reimbursement
      // damage 901 G -> 901 * 0.5 = 450.5 - 100 deductible = 350.5 -> floor = 350
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 901 }] },
        ],
      };
      const results = processScenario(scenario);
      expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  // ── Edge cases / errors ─────────────────────────────────────────────
  describe("Edge cases and errors", () => {
    it("should exit with non-zero status and write error to stderr for unknown item type in quote (e.g. broomstick)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "broomstick" }] }],
      };
      expect(() => processScenario(scenario)).toThrow();
    });

    it("should exit with non-zero status and write error to stderr when claim references item not in policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "amulet", amount: 300 }] },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });

    it("should exit with non-zero status and write error to stderr for negative damage amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: -100 }] },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });

    it("should exit with non-zero status and write error to stderr when claim references unknown item type", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "broomstick", amount: 300 }] },
        ],
      };
      expect(() => processScenario(scenario)).toThrow();
    });
  });

  // ── CLI interface ───────────────────────────────────────────────────
  describe("CLI interface", () => {
    it("should read JSON scenario from stdin and write JSON results to stdout with correct structure", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "sword" }] }],
      };
      const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      const output = JSON.parse(stdout);
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });

    it("should produce results array of same length and order as input steps", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword" }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 500 }] },
        ],
      };
      const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      const output = JSON.parse(stdout);
      expect(output.results).toHaveLength(2);
      expect(output.results[0]).toEqual({ premium: 115 });
      expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should output quote result with integer premium field", () => {
      // 7 runes: base = 175, first-insurance = 17.5, + 5 fee = 197.5 -> ceil = 198
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ] }],
      };
      const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      const output = JSON.parse(stdout);
      expect(output.results[0].premium).toBe(198);
      expect(Number.isInteger(output.results[0].premium)).toBe(true);
    });

    it("should output claim result with integer payout and remainingCap fields", () => {
      // Sword ench 8 triggers 50% reimbursement: 901 * 0.5 = 450.5 - 100 = 350.5 -> floor = 350
      // remainingCap = 2000 - 350 = 1650
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [
          { type: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
          { type: "claim", policy: 0, damages: [{ type: "sword", amount: 901 }] },
        ],
      };
      const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      const output = JSON.parse(stdout);
      expect(output.results[1].payout).toBe(350);
      expect(Number.isInteger(output.results[1].payout)).toBe(true);
      expect(output.results[1].remainingCap).toBe(1650);
      expect(Number.isInteger(output.results[1].remainingCap)).toBe(true);
    });

    it("should exit with non-zero status code and write to stderr on error — no results written to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0, quoteNumber: 1 },
        steps: [{ type: "quote", items: [{ type: "broomstick" }] }],
      };
      try {
        execFileSync("npx", ["tsx", "src/cli.ts"], {
          input: JSON.stringify(scenario),
          encoding: "utf-8",
        });
        expect.unreachable("Expected CLI to exit with non-zero status");
      } catch (error: any) {
        expect(error.status).not.toBe(0);
        expect(error.stderr.length).toBeGreaterThan(0);
        expect(error.stdout).toBe("");
      }
    });
  });
});
