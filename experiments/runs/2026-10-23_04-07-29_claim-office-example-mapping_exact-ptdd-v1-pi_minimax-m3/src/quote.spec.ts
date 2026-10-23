import { describe, it, expect } from "vitest";
import { quote } from "./quote.js";

describe("quote", () => {
  describe("empty item list", () => {
    it("returns 5 G premium (only processing fee) for empty items", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(5);
    });
  });

  describe("item base premiums", () => {
    it("sword base premium is 100 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
    it("amulet base premium is 60 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "amulet" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(71);
    });
    it("staff base premium is 80 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "staff" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(93);
    });
    it("potion base premium is 40 G", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "potion" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(49);
    });
    it("rune base premium is 25 G (single, no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(33);
    });
    it("moonstone base premium is 25 G (single, no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "moonstone" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(33);
    });
  });

  describe("component blocks", () => {
    it("2 runes → 50 G base premium (no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(60);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(71);
    });
    it("4 runes → 100 G base premium (no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
        ],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
    it("7 runes → 175 G base premium (no block)", () => {
      const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items,
        quoteNumber: 0,
      });
      expect(result.premium).toBe(198);
    });
    it("2 runes + 1 moonstone → 75 G (no block, different types)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(88);
    });
    it("3 runes + 3 moonstones → 120 G (two separate blocks)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(137);
    });
    it("3 moonstones → 60 G (block applies)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(71);
    });
    it("1 rune + 3 moonstones → 85 G (1 rune no block + 3 moonstones block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(99);
    });
    it("3 runes + 2 moonstones → 110 G (3 runes block + 2 moonstones no block)", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" },
        ],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(126);
    });
  });

  describe("item-specific modifiers", () => {
    it("cursed item adds 50% surcharge on item base premium", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", cursed: true }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(165);
    });
    it("high enchantment (>=5) adds 30% surcharge on item base premium", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 5 }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(145);
    });
    it("cursed AND high enchantment both apply", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 5, cursed: true }],
        quoteNumber: 0,
      });
      // 100 + 50 cursed + 30 high enchantment + 10 first insurance + 5 fee = 195
      expect(result.premium).toBe(195);
    });
    it("enchantment exactly 5 → high enchantment applies", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 5 }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(145);
    });
    it("enchantment 4 → no high enchantment surcharge", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 4 }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
    it("not cursed → no curse surcharge", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", cursed: false }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
  });

  describe("policy-wide modifiers", () => {
    it("loyalty discount (>=2 years) applies 20% discount on policy base", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 5 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      // 100 base - 20 loyalty (20%) + 10 first insurance + 5 fee = 95
      expect(result.premium).toBe(95);
    });
    it("loyalty discount does not apply for <2 years", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 1 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
    it("exactly 2 years → loyalty discount applies", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(95);
    });
    it("first insurance applies 10% surcharge on policy base", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
    it("follow-up contract applies 15% discount on second+ quote", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }],
        quoteNumber: 1,
      });
      // 100 + 10 first insurance - 15 follow-up + 5 fee = 100
      expect(result.premium).toBe(100);
    });
    it("first quote in scenario → no follow-up discount", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      expect(result.premium).toBe(115);
    });
  });

  describe("processing fee", () => {
    it("5 G fee is added at the end of every quote", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }],
        quoteNumber: 0,
      });
      // 100 + 10 first insurance + 5 fee = 115
      expect(result.premium).toBe(115);
    });
  });

  describe("multi-item policy", () => {
    it("cursed sword + plain amulet → policy base 160 + 50 cursed = 210 before policy modifiers and fee", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
        quoteNumber: 0,
      });
      // 160 base + 50 cursed + 16 first insurance (10%) + 5 fee = 231
      expect(result.premium).toBe(231);
    });
    it("policy base premium is sum of item base premiums", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }, { type: "amulet" }],
        quoteNumber: 0,
      });
      // 100 + 60 = 160 base + 16 (10%) + 5 fee = 181
      expect(result.premium).toBe(181);
    });
    it("insurance sum equals sum of insurance values across items", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }, { type: "amulet" }],
        quoteNumber: 0,
      });
      // sword = 1000, amulet = 600, insurance sum = 1600
      expect(result.policy.insuranceSum).toBe(1600);
      expect(result.policy.cap).toBe(3200);
      expect(result.policy.remainingCap).toBe(3200);
    });
  });

  describe("rounding", () => {
    it("premium is rounded up to whole G (ceiling) in MHPCO's favor", () => {
      const result = quote({
        customer: { yearsWithMHPCO: 0 },
        items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        quoteNumber: 0,
      });
      // 175 base + 17.5 first insurance + 5 fee = 197.5 → ceil 198
      expect(result.premium).toBe(198);
    });
  });

  describe("edge cases", () => {
    it("throws error on unknown item type", () => {
      expect(() =>
        quote({
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "broomstick" }],
          quoteNumber: 0,
        }),
      ).toThrow(/Unknown item type/);
    });
  });
});
