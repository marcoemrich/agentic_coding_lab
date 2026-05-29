import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums per item", () => {
    it("should charge 5 G for an empty item list (processing fee only)", () => {
      const results = runScenario([{ type: "quote", items: [] }]);
      expect(results).toEqual([{ premium: 5 }]);
    });
    it("should quote a single sword at 105 G (100 base + 5 fee)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword" }] },
      ]);
      expect(results).toEqual([{ premium: 105 }]);
    });
    it("should quote a single amulet at 65 G (60 base + 5 fee)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "amulet" }] },
      ]);
      expect(results).toEqual([{ premium: 65 }]);
    });
    it("should quote a single staff at 85 G (80 base + 5 fee)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "staff" }] },
      ]);
      expect(results).toEqual([{ premium: 85 }]);
    });
    it("should quote a single potion at 45 G (40 base + 5 fee)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "potion" }] },
      ]);
      expect(results).toEqual([{ premium: 45 }]);
    });
    it("should quote a single rune component at 30 G (25 base + 5 fee)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "rune" }] },
      ]);
      expect(results).toEqual([{ premium: 30 }]);
    });
    it("should quote a single moonstone component at 30 G (25 base + 5 fee)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "moonstone" }] },
      ]);
      expect(results).toEqual([{ premium: 30 }]);
    });
  });

  describe("quote — component building block of 3 alike", () => {
    it("should charge 50 G base for 2 runes (no block)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ]);
      expect(results).toEqual([{ premium: 55 }]);
    });
    it("should charge 60 G base for 3 runes (block applies)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ]);
      expect(results).toEqual([{ premium: 65 }]);
    });
    it("should charge 100 G base for 4 runes (no block, needs exactly 3)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ]);
      expect(results).toEqual([{ premium: 105 }]);
    });
    it("should charge 175 G base for 7 runes (no block — block requires exactly 3)", () => {
      const results = runScenario([
        {
          type: "quote",
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
      ]);
      expect(results).toEqual([{ premium: 180 }]);
    });
  });

  describe("quote — 'alike' means same component type", () => {
    it("should charge 75 G base for 2 runes + 1 moonstone (no block: different types)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ]);
      expect(results).toEqual([{ premium: 80 }]);
    });
    it("should charge 120 G base for 3 runes + 3 moonstones (two separate blocks)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ]);
      expect(results).toEqual([{ premium: 125 }]);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("should add 50% curse surcharge to a cursed sword (100 -> 150)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword", cursed: true }] },
      ]);
      expect(results).toEqual([{ premium: 155 }]);
    });
    it("should add 30% surcharge to a highly enchanted sword at enchantment exactly 5", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword", enchantment: 5 }] },
      ]);
      expect(results).toEqual([{ premium: 135 }]);
    });
    it("should NOT add high-enchantment surcharge to a sword at enchantment 4", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword", enchantment: 4 }] },
      ]);
      expect(results).toEqual([{ premium: 105 }]);
    });
    it("should stack curse and high-enchantment surcharges on the same item", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 5 }],
        },
      ]);
      expect(results).toEqual([{ premium: 185 }]);
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("should apply the curse surcharge only to the cursed item's base premium, not the policy total (cursed sword + plain amulet -> 210 before fee)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ]);
      expect(results).toEqual([{ premium: 215 }]);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for a customer with exactly 2 years", () => {
      // first-insurance (+10%) always applies; loyalty (-20%) applies at >=2 years
      // 100 base + 10 first-insurance - 20 loyalty + 5 fee = 95
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 2 },
          items: [{ type: "sword" }],
        },
      ]);
      expect(results).toEqual([{ premium: 95 }]);
    });
    it("should NOT apply loyalty discount below 2 years", () => {
      // first-insurance (+10%) still applies; no loyalty below 2 years
      // 100 base + 10 first-insurance + 5 fee = 115
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 1 },
          items: [{ type: "sword" }],
        },
      ]);
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("should apply 10% first-insurance surcharge to the policy base premium", () => {
      // each quote is treated as a first insurance: +10% of policy base, always
      // 100 base + 10 first-insurance + 5 fee = 115
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 0 },
          items: [{ type: "sword" }],
        },
      ]);
      expect(results).toEqual([{ premium: 115 }]);
    });
    it("should apply 15% follow-up discount on the customer's second quote in the scenario", () => {
      // follow-up (-15%) applies to every quote AFTER the first in the scenario,
      // keyed on quote index (not customer.years). first-insurance (+10%) always applies.
      // years:0 so loyalty does not apply, isolating the follow-up effect.
      // Quote 1 (first): 100 base + 10 first-insurance + 5 fee = 115 (no follow-up)
      // Quote 2 (second): 100 base + 10 first-insurance - 15 follow-up + 5 fee = 100
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 0 },
          items: [{ type: "sword" }],
        },
        {
          type: "quote",
          customer: { years: 0 },
          items: [{ type: "sword" }],
        },
      ]);
      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("should NOT apply follow-up discount on the first quote", () => {
      // the first quote in a scenario is never a follow-up.
      // first-insurance (+10%) applies; no follow-up, no loyalty (years:0).
      // 100 base + 10 first-insurance + 5 fee = 115
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 0 },
          items: [{ type: "sword" }],
        },
      ]);
      expect(results).toEqual([{ premium: 115 }]);
    });
  });

  describe("quote — rounding up in MHPCO's favor", () => {
    it("should round a premium of 197.5 G up to 198 G", () => {
      // 7 runes = 175 base (no block; block requires exactly 3 alike).
      // customer years:1 -> first-insurance +10% (17.5), no loyalty (<2 years).
      // 175 + 17.5 = 192.5 policy + 5 fee = 197.5 -> round UP to 198 (MHPCO's favor).
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 1 },
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
      ]);
      expect(results).toEqual([{ premium: 198 }]);
    });
    it("should keep intermediate amounts as fractions and round only the final premium", () => {
      // A single rune = 25 base (no block; block requires exactly 3 alike).
      // customer years:1 -> first-insurance +10% surcharge = 25 * 0.10 = 2.5,
      // no loyalty (<2 years).
      // If the intermediate surcharge (2.5) were rounded down to 2 before
      // adding, the total would be 25 + 2 + 5 fee = 32 -> ceil 32.
      // Keeping fractions: 25 + 2.5 + 5 fee = 32.5 -> ceil only at the end = 33.
      // The expected 33 proves intermediates stay fractional until the final ceil.
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 1 },
          items: [{ type: "rune" }],
        },
      ]);
      expect(results).toEqual([{ premium: 33 }]);
    });
  });

  describe("quote — integration examples", () => {
    it("should quote a newcomer's cursed sword (0 years, first contract) at 165 G", () => {
      // newcomer: years 0 (no loyalty), first quote (no follow-up).
      // cursed steel sword, enchantment 3 (< 5, no high-enchantment surcharge).
      // 100 base + 50 curse + 10 first-insurance + 5 fee = 165.
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 0 },
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ]);
      expect(results).toEqual([{ premium: 165 }]);
    });
    it("should quote a long-standing customer's second contract cursed enchanted sword at 160 G", () => {
      // customer 3 years (loyalty -20%); this is the customer's SECOND quote in
      // the scenario (follow-up -15%). first-insurance (+10%) always applies.
      // Quote 1 (plain steel sword): 100 base + 10 first-insurance - 20 loyalty
      //   + 5 fee = 95 (no follow-up, first quote).
      // Quote 2 (cursed steel sword, enchantment 7): 100 base + 50 curse
      //   + 30 high-enchantment + 10 first-insurance - 20 loyalty - 15 follow-up
      //   + 5 fee = 160.
      const results = runScenario([
        {
          type: "quote",
          customer: { years: 3 },
          items: [{ type: "sword", material: "steel" }],
        },
        {
          type: "quote",
          customer: { years: 3 },
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ]);
      expect(results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("claim — standard reimbursement (no special clause)", () => {
    it("should pay 400 G for a regular sword with 500 G damage (full minus 100 deductible)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword" }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 105 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should pay 100 G for a rune with 200 G damage (no enchantment/material clause)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "rune" }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 30 },
        { payout: 100, remainingCap: 400 },
      ]);
    });
  });

  describe("claim — high-enchantment clause (>= 8)", () => {
    it("should reimburse a steel sword at enchantment 9 at 50% then deductible (1000 damage -> 400)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 135 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
  });

  describe("claim — dragon-material clause", () => {
    it("should fully reimburse a dragon sword at enchantment 5 then deductible (800 damage -> 700)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 135 },
        { payout: 700, remainingCap: 1300 },
      ]);
    });
  });

  describe("claim — high-enchantment wins over dragon material", () => {
    it("should apply the 50% rule when a dragon sword has enchantment 9 (1000 damage -> 400)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 135 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should apply the 50% rule when a dragon sword has enchantment exactly 8 (1000 damage -> 400)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 135 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
  });

  describe("claim — deductible per damage event", () => {
    it("should apply the 100 G deductible once per damaged item (sword 500 + amulet 300 -> 600)", () => {
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 165 },
        { payout: 600, remainingCap: 2600 },
      ]);
    });
  });

  describe("claim — cap based on unmodified insurance sum", () => {
    it("should cap total payout at 2x the unmodified insurance sum across successive claims (1000 sum, cap 2000; two 1500 claims -> 1400 then 600)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword" }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 105 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    it("should base the cap on unmodified insurance value, ignoring premium modifiers (cursed sword cap 2000)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword", cursed: true }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 155 },
        { payout: 2000, remainingCap: 0 },
      ]);
    });
  });

  describe("claim — payout rounding down in MHPCO's favor", () => {
    it("should round a payout of 350.5 G down to 350 G", () => {
      // high-enchantment (>=8) sword reimburses 50% of damage.
      // 901 damage -> 450.5 covered - 100 deductible = 350.5 -> floor 350.
      // cap = 2 * 1000 sum = 2000; remainingCap = 2000 - 350 = 1650.
      const results = runScenario([
        {
          type: "quote",
          items: [{ type: "sword", enchantment: 8 }],
        },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 135 },
        { payout: 350, remainingCap: 1650 },
      ]);
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("should treat two sword damage entries as separate events each with its own deductible (insurance sum 2000, cap 4000)", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 205 },
        { payout: 800, remainingCap: 3200 },
      ]);
    });
  });

  describe("scenario — sequential steps", () => {
    it("should process a quote followed by a claim against that policy via its step index", () => {
      const results = runScenario([
        { type: "quote", items: [{ type: "amulet" }] },
        {
          type: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ]);
      expect(results).toEqual([
        { premium: 65 },
        { payout: 100, remainingCap: 1100 },
      ]);
    });
  });

  describe("errors", () => {
    it("should reject a quote with an unknown item type", () => {
      expect(() =>
        runScenario([{ type: "quote", items: [{ type: "broomstick" }] }]),
      ).toThrow();
    });
    it("should reject a claim whose damaged item is not part of the policy", () => {
      expect(() =>
        runScenario([
          { type: "quote", items: [{ type: "sword" }] },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ]),
      ).toThrow();
    });
    it("should reject a claim with more damage entries of a type than the policy covers", () => {
      expect(() =>
        runScenario([
          { type: "quote", items: [{ type: "sword" }] },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ]),
      ).toThrow();
    });
    it("should reject a claim with a negative damage amount", () => {
      expect(() =>
        runScenario([
          { type: "quote", items: [{ type: "sword" }] },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ]),
      ).toThrow();
    });
  });
});
