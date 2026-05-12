import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - basic pricing", () => {
    it("should return premium 5G for empty items list (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("should return premium 115G for a single sword (newcomer: 100 base + 10 first-insurance + 5 fee)", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should return premium 33G for a single rune component (newcomer: 25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("should return premium 181G for sword + amulet (newcomer: 160 base + 16 first-insurance + 5 fee)", () => {
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
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("should return premium 71G for block of 3 alike runes (newcomer: 60 block + 6 first-insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("should return premium 115G for 4 runes with no block discount (newcomer: 100 base + 10 first-insurance + 5 fee)", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
  });

  describe("Quote - item-level modifiers", () => {
    it("should add 50% cursed surcharge on item base premium (cursed sword, newcomer -> 165G)", () => {
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
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("should add 30% high-enchantment surcharge for enchantment >= 5 (sword enchant 5, newcomer -> 145G)", () => {
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
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("should scope cursed surcharge to the cursed item only (cursed sword + plain amulet, newcomer -> 231G)", () => {
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
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote - policy-level modifiers", () => {
    it("should apply 20% loyalty discount for customer with >= 2 years (sword, 2yr customer -> 95G)", () => {
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
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("should apply 15% follow-up discount on second quote (newcomer, two sword quotes -> second is 100G)", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("should combine all modifiers correctly (3yr customer, second contract, cursed sword enchant 7 -> 160G)", () => {
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
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      expect((result as any).results[1].premium).toBe(160);
    });
  });

  describe("Claim - basic processing", () => {
    it("should apply 100G deductible per damage (500G sword damage -> payout 400G, remaining cap 1600G)", () => {
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
            op: "claim" as const,
            item: { type: "sword", material: "steel", enchantment: 0, cursed: false },
            damage: 500,
          },
        ],
      });
      expect((result as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should reimburse at 50% for enchantment >= 8 (enchant 9 sword, 1000G damage -> payout 400G)", () => {
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
            item: { type: "sword", material: "steel", enchantment: 9, cursed: false },
            damage: 1000,
          },
        ],
      });
      expect((result as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should fully reimburse dragon material items (dragon sword enchant 5, 800G damage -> payout 700G)", () => {
      const result = processScenario({
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
            item: { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            damage: 800,
          },
        ],
      });
      expect((result as any).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should enforce cap across multiple claims (sword cap 2000: first 1500G -> 1400G, second 1500G -> 600G)", () => {
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
            op: "claim" as const,
            item: { type: "sword", material: "steel", enchantment: 0, cursed: false },
            damage: 1500,
          },
          {
            op: "claim" as const,
            item: { type: "sword", material: "steel", enchantment: 0, cursed: false },
            damage: 1500,
          },
        ],
      });
      expect((result as any).results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect((result as any).results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Error handling", () => {
    it("should throw for unknown item type in quote", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [{ type: "wand", enchantment: 0, cursed: false }],
            },
          ],
        })
      ).toThrow();
    });
    it("should throw for negative damage amount in claim", () => {
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
              item: { type: "sword", material: "steel", enchantment: 0, cursed: false },
              damage: -100,
            },
          ],
        })
      ).toThrow();
    });
  });
});
