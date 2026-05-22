import { describe, it, expect } from "vitest";
import { quote, claim, runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - single main item base premium", () => {
    it("should return processing fee only for empty item list for a first-time customer with no loyalty", () => {
      expect(quote({ items: [], yearsWithMHPCO: 0, previousQuotes: 0 })).toBe(5);
    });
    it("should compute premium for a single sword (base 100 G) for a first-time non-loyal customer", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(115);
    });
    it("should compute premium for a single amulet (base 60 G) for a first-time non-loyal customer", () => {
      expect(
        quote({
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(71);
    });
    it("should compute premium for a single staff (base 80 G) for a first-time non-loyal customer", () => {
      expect(
        quote({
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(93);
    });
    it("should compute premium for a single potion (base 40 G) for a first-time non-loyal customer", () => {
      expect(
        quote({
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(49);
    });
  });

  describe("quote - single component base premium", () => {
    it("should compute premium for a single rune (base 25 G) for a first-time non-loyal customer", () => {
      expect(
        quote({
          items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(33);
    });
    it("should compute premium for a single moonstone (base 25 G) for a first-time non-loyal customer", () => {
      expect(
        quote({
          items: [{ type: "moonstone", material: "stone", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(33);
    });
  });

  describe("quote - multiple items sum base premiums", () => {
    it("should sum base premiums for two different main items", () => {
      expect(
        quote({
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(181);
    });
    it("should sum base premiums for a main item and a component", () => {
      expect(
        quote({
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(143);
    });
  });

  describe("quote - component bundling (3 alike = 60 G)", () => {
    it("should price a bundle of 3 alike runes at 60 G instead of 75 G", () => {
      expect(
        quote({
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(71);
    });
    it("should price a bundle of 3 alike moonstones at 60 G instead of 75 G", () => {
      expect(
        quote({
          items: [
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(71);
    });
    it("should not bundle 2 alike components (still 50 G total)", () => {
      expect(
        quote({
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(60);
    });
    it("should bundle 3 alike and price the 4th separately (60 G + 25 G)", () => {
      expect(
        quote({
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(99);
    });
    it("should bundle two separate triples of alike components independently (3 runes + 3 moonstones)", () => {
      expect(
        quote({
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(137);
    });
    it("should not bundle across different component types (1 rune + 2 moonstones = 75 G)", () => {
      expect(
        quote({
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(88);
    });
  });

  describe("quote - per-item modifiers", () => {
    it("should apply +50% risk surcharge to a cursed item", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(170);
    });
    it("should apply +30% risk surcharge to a highly enchanted item (enchantment >= 5)", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(148);
    });
    it("should not apply enchantment surcharge below the threshold (enchantment 4)", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(115);
    });
    it("should apply both cursed and high-enchantment surcharges to the same item", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(220);
    });
  });

  describe("quote - customer-level modifiers", () => {
    it("should apply +10% initial assessment surcharge on the customer's first quote", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(115);
    });
    it("should apply -15% subsequent-contract discount on the second quote onward", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 1,
        }),
      ).toBe(90);
    });
    it("should apply -20% loyalty discount for long-standing customers (yearsWithMHPCO >= 2)", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 2,
          previousQuotes: 0,
        }),
      ).toBe(93);
    });
    it("should not apply loyalty discount below the threshold (yearsWithMHPCO = 1)", () => {
      expect(
        quote({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 1,
          previousQuotes: 0,
        }),
      ).toBe(115);
    });
  });

  describe("quote - processing fee and rounding", () => {
    it("should add a flat 5 G processing fee to every premium", () => {
      expect(
        quote({
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          yearsWithMHPCO: 2,
          previousQuotes: 1,
        }),
      ).toBe(33);
    });
    it("should round the premium up to the nearest whole G (MHPCO's favor)", () => {
      expect(
        quote({
          items: [{ type: "moonstone", material: "stone", enchantment: 5, cursed: false }],
          yearsWithMHPCO: 0,
          previousQuotes: 0,
        }),
      ).toBe(41);
    });
  });

  describe("claim - basic payout rules", () => {
    it("should subtract the 100 G deductible from a standard damage amount", () => {
      expect(
        claim(
          { damages: [{ itemType: "sword", amount: 300 }] },
          { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ),
      ).toBe(200);
    });
    it("should pay out 0 when the damage amount is at or below the 100 G deductible", () => {
      expect(
        claim(
          { damages: [{ itemType: "sword", amount: 100 }] },
          { items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        ),
      ).toBe(0);
    });
    it("should reimburse 50% of the damage for items with enchantment >= 8 (after deductible)", () => {
      expect(
        claim(
          { damages: [{ itemType: "sword", amount: 500 }] },
          { items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        ),
      ).toBe(150);
    });
    it("should fully reimburse damage to items made of dragon material (no deductible)", () => {
      expect(
        claim(
          { damages: [{ itemType: "sword", amount: 500 }] },
          { items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }] },
        ),
      ).toBe(500);
    });
    it("should sum payouts across multiple damaged items in a single incident, applying the deductible once per event", () => {
      expect(
        claim(
          {
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "amulet", amount: 200 },
            ],
          },
          {
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ),
      ).toBe(400);
    });
  });

  describe("CLI integration via quote/claim API", () => {
    it("should process a scenario with a single quote step and return its premium", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    it("should process a scenario with a quote followed by a claim referencing the policy by index", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 5 },
          steps: [
            {
              op: "quote",
              items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 58 }, { payout: 100 }] });
    });
    it("should process multiple sequential quotes applying the first/subsequent-contract modifiers correctly", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
    });
  });
});
