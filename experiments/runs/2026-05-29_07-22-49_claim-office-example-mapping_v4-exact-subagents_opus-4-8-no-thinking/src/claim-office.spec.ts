import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums (single item)", () => {
    it("should quote 115 G for a single plain sword (100 base + 10 first-insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should quote 71 G for a single plain amulet (60 base + 6 first-insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should quote 93 G for a single plain staff (80 base + 8 first-insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should quote 49 G for a single plain potion (40 base + 4 first-insurance + 5 fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("should quote 33 G for a single rune (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should quote 33 G for a single moonstone (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Quote — empty policy", () => {
    it("should quote 5 G for an empty item list (only processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result.results[0]).toEqual({ premium: 5 });
    });
  });

  describe("Quote — component building blocks", () => {
    it("should charge 50 G base for 2 runes (no block)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("should charge 60 G base for 3 runes (block of 3 alike applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 73 });
    });
    it("should charge 100 G base for 4 runes (no block — block requires exactly 3)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
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
    it("should charge 175 G base for 7 runes (one block of 3 + 4 leftover)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 198 });
    });
    it("should charge 75 G base for 2 runes + 1 moonstone (no block: different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("should charge 120 G base for 3 runes + 3 moonstones (two separate blocks)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
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
      });

      expect(result.results[0]).toEqual({ premium: 140 });
    });
  });

  describe("Quote — item-specific modifiers", () => {
    it("should add 50% curse surcharge to a cursed sword's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should add 30% high-enchantment surcharge to a sword with enchantment exactly 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("should not add high-enchantment surcharge to a sword with enchantment 4", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 4, cursed: false },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should apply both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 195 });
    });
  });

  describe("Quote — policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for a customer with exactly 2 years with MHPCO", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("should not apply loyalty discount for a customer with fewer than 2 years", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should add 10% first-insurance surcharge on the policy base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should apply 15% follow-up discount on each quote after the customer's first in a scenario", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 115 });
      expect(result.results[1]).toEqual({ premium: 100 });
    });
  });

  describe("Quote — modifier scope on multi-item policies", () => {
    it("should apply the curse surcharge only to the cursed item's base premium, not the policy total", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 231 });
    });
  });

  describe("Quote — rounding", () => {
    it("should round the final premium up to the next whole G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 198 });
    });
  });

  describe("Quote — integration examples", () => {
    it("should quote 165 G for a newcomer's cursed steel sword (enchantment 3, 0 years)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("should quote 160 G for a long-standing customer's second quote (cursed steel sword enchantment 7, 3 years)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 95 });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("Claim — standard reimbursement", () => {
    it("should pay 400 G for a steel sword (enchantment 3) damaged 500 G (full minus 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
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
    it("should pay 100 G for a rune damaged 200 G (full minus 100 deductible, no special clause)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim — special clauses", () => {
    it("should reimburse 50% then deduct for a steel sword enchantment 9 damaged 1000 G → 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse then deduct for a dragon-material sword enchantment 5 damaged 800 G → 700 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply the 50% rule then deduct for a dragon sword enchantment 8 damaged 1000 G → 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should let the 50% rule win over dragon material for a dragon sword enchantment 9 damaged 1000 G → 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim — deductible per damage event", () => {
    it("should apply the 100 G deductible once per damaged item (sword 500 + amulet 300 → 600 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("Claim — rounding", () => {
    it("should round the final payout down to the previous whole G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("Claim — cap based on unmodified insurance sum", () => {
    it("should cap a sword+amulet policy at 3200 G (sum 1600)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 5000 },
                { itemType: "amulet", amount: 5000 },
              ],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
    });
    it("should cap a sword+3-runes policy at 3500 G (sum 1750, block discount does not lower the sum)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
    it("should cap a two-sword policy at 4000 G (sum 2000)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 5000 },
                { itemType: "sword", amount: 5000 },
              ],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
    });
  });

  describe("Claim — cap exhaustion across successive claims", () => {
    it("should report remainingCap after a single claim (sword cap 2000, claim 1500 → payout 1400, remaining 600)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("should limit a later claim to the remaining cap (second claim 1500 → payout 600, remaining 0)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim — multiple items of the same type", () => {
    it("should treat each same-type damage entry as a separate damage with its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
  });

  describe("CLI scenario output shape", () => {
    it("should return a results array of the same length and order as the input steps", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      });

      expect(result.results).toHaveLength(3);
      expect(result.results[0]).toHaveProperty("premium");
      expect(result.results[1]).toHaveProperty("payout");
      expect(result.results[2]).toHaveProperty("premium");
    });
    it("should return { premium } for a quote step and { payout, remainingCap } for a claim step", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 71 });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
  });

  describe("Error handling", () => {
    it("should reject a quote containing an unknown item type (e.g. broomstick)", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        })
      ).toThrow();
    });
    it("should reject a claim whose damage item is not part of the policy", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should reject a claim with more same-type damage entries than the policy covers", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("should reject a claim with a negative damage amount", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        })
      ).toThrow();
    });
  });
});
