import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote -- base premiums", () => {
    it("should return premium 5 G for empty item list (only processing fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });

    it("should return premium 115 G for a single sword (100 base + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });

    it("should return premium 71 G for a single amulet (60 base + 6 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "amulet" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });

    it("should return premium 93 G for a single staff (80 base + 8 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "staff" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });

    it("should return premium 49 G for a single potion (40 base + 4 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "potion" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("Quote -- component pricing", () => {
    it("should return premium 60 G for 2 runes (50 base + 5 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });

    it("should return premium 71 G for 3 runes with block discount (60 base + 6 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });

    it("should return premium 115 G for 4 runes with no block (100 base + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });

    it("should return premium 198 G for 7 runes (175 base + 17.5 first-insurance + 5 fee = 197.5, rounded up)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
  });

  describe("Quote -- alike components and blocks", () => {
    it("should return premium 88 G for 2 runes + 1 moonstone with no block (75 base + 7.5 first-insurance + 5 fee = 87.5, rounded up)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });

    it("should return premium 137 G for 3 runes + 3 moonstones as two separate blocks (120 base + 12 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("Quote -- cursed surcharge (item-specific)", () => {
    it("should return premium 165 G for a newcomer with a cursed sword (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", cursed: true }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });

    it("should apply cursed surcharge only to the cursed item, not the whole policy -- cursed sword + plain amulet = 231 G (item-adjusted 210 + 16 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", cursed: true },
              { type: "amulet" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote -- high enchantment surcharge (item-specific)", () => {
    it("should return premium 145 G for sword with enchantment 5 (100 base + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 5 }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });

    it("should return premium 115 G for sword with enchantment 4, no high-enchantment surcharge (100 base + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 4 }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("Quote -- combined item-specific modifiers", () => {
    it("should return premium 195 G for cursed sword with enchantment 5 -- both surcharges apply (100 base + 50 curse + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", cursed: true, enchantment: 5 }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });

    it("should return premium 165 G for cursed sword with enchantment 4 -- only curse surcharge, no high-enchant (100 base + 50 curse + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", cursed: true, enchantment: 4 }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
  });

  describe("Quote -- loyalty discount (policy-wide)", () => {
    it("should return premium 95 G for customer with exactly 2 years and a single sword (100 base - 20 loyalty + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });

    it("should not apply loyalty discount for customer with 1 year -- premium 115 G for sword (100 base + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("Quote -- follow-up contract discount (policy-wide)", () => {
    it("should apply 15% follow-up discount on second quote -- customer 0 years, second quote for sword = 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote -- first insurance surcharge always applies", () => {
    it("should apply 10% first-insurance surcharge even for long-standing customer -- customer 3 years, single sword = 95 G (100 base - 20 loyalty + 10 first-insurance + 5 fee)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
  });

  describe("Quote -- rounding premium up in MHPCO's favor", () => {
    it("should round premium up: 7 runes for newcomer = 198 G (175 base + 17.5 first-insurance + 5 fee = 197.5, ceiled to 198)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
  });

  describe("Quote -- integration: newcomer with cursed sword", () => {
    it("should return premium 165 G for newcomer (0 years, first contract) with cursed steel sword enchantment 3 (100 + 50 + 10 + 5 = 165)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", cursed: true, enchantment: 3, material: "steel" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
  });

  describe("Quote -- integration: long-standing customer second contract", () => {
    it("should return premium 160 G for customer 3 years on second contract with cursed steel sword enchantment 7 (100 + 50 + 30 - 20 + 10 - 15 + 5 = 160)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword" }],
          },
          {
            op: "quote" as const,
            items: [{ type: "sword", cursed: true, enchantment: 7, material: "steel" }],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim -- standard reimbursement", () => {
    it("should return payout 400 G for regular steel sword enchantment 3 with damage 500 G (500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 3, material: "steel" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ type: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 100 G for rune with damage 200 G (200 - 100 deductible; no special clause for components)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "magical surge",
              damages: [{ type: "rune", amount: 200 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim -- high enchantment clause", () => {
    it("should return payout 400 G for steel sword enchantment 9 with damage 1000 G (50% of 1000 = 500 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 9, material: "steel" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "magical explosion",
              damages: [{ type: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 400 G for steel sword enchantment 7 with damage 500 G -- no high-enchantment clause (enchantment 7 < 8), full reimbursement minus deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 7, material: "steel" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire damage",
              damages: [{ type: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim -- dragon material clause", () => {
    it("should return payout 700 G for dragon-material sword enchantment 5 with damage 800 G (full reimbursement 800 - 100 deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 5, material: "dragon" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "cave collapse",
              damages: [{ type: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
  });

  describe("Claim -- both enchantment >= 8 and dragon material", () => {
    it("should return payout 400 G for dragon-material sword enchantment 9 with damage 1000 G (50% rule wins: 500 - 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 9, material: "dragon" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "magical explosion",
              damages: [{ type: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });

    it("should return payout 400 G for dragon-material sword enchantment 8 with damage 1000 G (50% rule wins: 500 - 100)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "sword", enchantment: 8, material: "dragon" }],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "magical explosion",
              damages: [{ type: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim -- deductible per damage event", () => {
    it("should return payout 600 G for sword damage 500 G and amulet damage 300 G (400 + 200, each with own 100 G deductible)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", enchantment: 3, material: "steel" },
              { type: "amulet", enchantment: 2, material: "steel" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { type: "sword", amount: 500 },
                { type: "amulet", amount: 300 },
              ],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim -- multiple items of the same type", () => {
    it("should compute insurance sum 2000 G and cap 4000 G for a policy covering two swords", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", enchantment: 3, material: "steel" },
              { type: "sword", enchantment: 3, material: "steel" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ type: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
    });

    it("should treat two sword damage entries as separate damages with own deductibles when policy covers two swords", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", enchantment: 3, material: "steel" },
              { type: "sword", enchantment: 3, material: "steel" },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { type: "sword", amount: 500 },
                { type: "sword", amount: 500 },
              ],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });

    it.todo(
      "should reject claim with error when damages array has more entries of a type than policy covers"
    );
  });

  describe("Claim -- payout cap", () => {
    it.todo(
      "should compute cap as 2x insurance sum: sword + amulet = cap 3200 G (2 x 1600)"
    );

    it.todo(
      "should base cap on unmodified insurance value: cursed sword = cap 2000 G (2 x 1000, premium modifiers ignored)"
    );

    it.todo(
      "should compute insurance sum 1750 G for sword + 3 runes block (1000 + 3x250; block discount affects premium only)"
    );

    it.todo(
      "should pay 1400 G on first claim of 1500 G damage against sword policy (1500 - 100 deductible), remaining cap 600 G"
    );

    it.todo(
      "should cap second claim payout at remaining 600 G when cap is nearly exhausted, remaining cap 0 G"
    );
  });

  describe("Claim -- payout rounding in MHPCO's favor", () => {
    it.todo(
      "should round payout down: 350.5 G becomes 350 G"
    );
  });

  describe("Error handling", () => {
    it.todo(
      "should reject quote with unknown item type (e.g. broomstick) with an error"
    );

    it.todo(
      "should reject claim referencing a damage entry whose item is not in the policy with an error"
    );

    it.todo(
      "should reject claim with negative damage amount with an error"
    );

    it.todo(
      "should reject claim when damage entries reference unknown item type with an error"
    );
  });

  describe("CLI -- stdin/stdout interface", () => {
    it.todo(
      "should read JSON scenario from stdin and write JSON results to stdout"
    );

    it.todo(
      "should produce correct output for the schema example (customer 5 years, quote amulet, claim amulet damage 200 G)"
    );

    it.todo(
      "should exit with non-zero status code and write error to stderr for invalid input"
    );

    it.todo(
      "should process steps sequentially: claim references policy from earlier quote via step index"
    );
  });
});
