import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("returns base premium plus fee for a single sword", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("returns base premium plus fee for each main item type", () => {
      const customer = { yearsWithMHPCO: 0 };
      const quote = (type: string) =>
        processScenario({
          customer,
          steps: [
            {
              op: "quote" as const,
              items: [{ type, material: "steel", enchantment: 0, cursed: false }],
            },
          ],
        });
      expect(quote("amulet").results[0]).toEqual({ premium: 71 });
      expect(quote("staff").results[0]).toEqual({ premium: 93 });
      expect(quote("potion").results[0]).toEqual({ premium: 49 });
    });
    it("returns base premium plus fee for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("sums base premiums for multiple items in one policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 181 });
    });
  });

  describe("Quote - component building blocks", () => {
    it("applies block discount for exactly 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block discount for 2 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("does not apply block discount for 4 alike components", () => {
      const result = processScenario({
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
      });
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("treats different component types separately for blocks", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("applies two separate blocks for 3 runes and 3 moonstones", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 137 });
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("adds 50% cursed surcharge to a cursed item base premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("adds 30% high-enchantment surcharge for enchantment >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies both cursed and high-enchantment surcharges to same item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 195 });
    });
    it("applies item-specific surcharges only to affected item in multi-item policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("adds 10% first insurance surcharge to policy base premium", () => {
      // Verifies first insurance (10%) applies to policy base (100G), not to total with surcharges
      // Cursed sword: 100 base + 50 curse + 10 first insurance (10% of 100, not 150) + 5 fee = 165
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("applies 20% loyalty discount for customer with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 15% follow-up discount on second quote step", () => {
      const result = processScenario({
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
      });
      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("applies both loyalty and follow-up discounts together", () => {
      const result = processScenario({
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
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 80 });
    });
  });

  describe("Quote - rounding", () => {
    it("rounds premium up in MHPCO favor", () => {
      // moonstone (25G) for loyal customer: 25 + 2.5 first ins - 5 loyalty + 5 fee = 27.5, ceil = 28
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "moonstone" }],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 28 });
    });
  });

  describe("Quote - integration", () => {
    it("newcomer with cursed sword pays 165G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("long-standing customer second contract with cursed high-enchant sword pays 160G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Quote - errors", () => {
    it("throws error for unknown item type", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "broomstick" }],
            },
          ],
        })
      ).toThrow();
    });
  });

  describe("Claim - basic payout", () => {
    it("applies 100G deductible per damaged item", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses standard item damage minus deductible", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("applies deductible separately to each damaged item", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "amulet", amount: 250 },
              ],
            },
          },
        ],
      });
      // sword: 300 - 100 = 200, amulet: 250 - 100 = 150, total = 350
      // cap = 2 * (1000 + 600) = 3200, remainingCap = 3200 - 350 = 2850
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 2850 });
    });
  });

  describe("Claim - special reimbursement clauses", () => {
    it("reimburses at 50% for enchantment >= 8 before deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // 50% reimbursement: 500 * 0.5 = 250, minus 100 deductible = 150
      // cap = 2 * 1000 = 2000, remainingCap = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
    it("fully reimburses dragon material damage before deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // dragon material: full reimbursement, 500 - 100 deductible = 400
      // cap = 2 * 1000 = 2000, remainingCap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies 50% rule when both enchantment >= 8 and dragon material", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // enchantment >= 8 AND dragon material: 50% wins
      // 500 * 0.5 = 250, minus 100 deductible = 150
      // cap = 2 * 1000 = 2000, remainingCap = 2000 - 150 = 1850
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
    });
  });

  describe("Claim - cap", () => {
    it("caps total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      });
      // potion insurance value = 400, cap = 2 * 400 = 800
      // damage 1000 - 100 deductible = 900, capped at 800
      // remainingCap = 800 - 800 = 0
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "potion", amount: 500 }],
            },
          },
        ],
      });
      // potion insurance = 400, cap = 800
      // claim 1: 500 - 100 = 400, remainingCap = 800 - 400 = 400
      // claim 2: 500 - 100 = 400, capped at 400, remainingCap = 400 - 400 = 0
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 400 });
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 0 });
    });
  });

  describe("Claim - payout rounding", () => {
    it("rounds payout down in MHPCO favor", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 301 }],
            },
          },
        ],
      });
      // enchantment >= 8: 301 * 0.5 = 150.5, minus 100 deductible = 50.5, floor = 50
      // cap = 2000, remainingCap = 2000 - 50 = 1950
      expect(result.results[1]).toEqual({ payout: 50, remainingCap: 1950 });
    });
  });

  describe("Claim - errors", () => {
    it("throws error when damage references item not in policy", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "staff", amount: 300 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("throws error when more damages of a type than policy covers", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "sword", material: "steel", enchantment: 0, cursed: false },
              ],
            },
            {
              op: "claim" as const,
              policy: 0,
              incident: {
                cause: "fire",
                damages: [
                  { itemType: "sword", amount: 300 },
                  { itemType: "sword", amount: 200 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
    it.todo("throws error for negative damage amount");
  });
});
