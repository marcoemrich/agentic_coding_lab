import { describe, it, expect } from "vitest";
import { quote, processClaim } from "./claim-office.js";

function item(type: string, overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type, material: overrides.material ?? "default", enchantment: overrides.enchantment ?? 0, cursed: overrides.cursed ?? false };
}

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    const newCustomer = { yearsWithMHPCO: 0 };
    const firstContract = { isFirstContract: true };

    it("should calculate base premium for a single sword with first insurance surcharge and processing fee", () => {
      expect(quote(newCustomer, [item("sword")], firstContract)).toBe(115);
    });
    it("should calculate base premium for each item type (amulet, staff, potion)", () => {
      expect(quote(newCustomer, [item("amulet")], firstContract)).toBe(71);
      expect(quote(newCustomer, [item("staff")], firstContract)).toBe(93);
      expect(quote(newCustomer, [item("potion")], firstContract)).toBe(49);
    });
    it("should calculate base premium for a single component", () => {
      expect(quote(newCustomer, [item("rune")], firstContract)).toBe(33);
    });
    it("should sum premiums for multiple items", () => {
      expect(quote(newCustomer, [item("sword"), item("amulet")], firstContract)).toBe(181);
    });
    it("should apply building block discount for three alike components", () => {
      expect(quote(newCustomer, [item("rune"), item("rune"), item("rune")], firstContract)).toBe(71);
    });
    it("should apply 50% surcharge for cursed items", () => {
      expect(quote(newCustomer, [item("sword", { cursed: true })], firstContract)).toBe(170);
    });
    it("should apply 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      expect(quote(newCustomer, [item("staff", { enchantment: 5 })], firstContract)).toBe(119);
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      expect(quote({ yearsWithMHPCO: 3 }, [item("sword")], firstContract)).toBe(93);
    });
    it("should apply 15% discount on contracts after the first", () => {
      expect(quote(newCustomer, [item("sword")], { isFirstContract: false })).toBe(90);
    });
    it("should round amounts in MHPCO's favor", () => {
      const loyalCustomer = { yearsWithMHPCO: 5 };
      // cursed amulet: 60 * 1.50 = 90, * 0.85 = 76.5, * 0.80 = 61.2, + 5 = 66.2 → ceil = 67
      expect(quote(loyalCustomer, [item("amulet", { cursed: true })], { isFirstContract: false })).toBe(67);
    });
  });

  describe("Processing claims", () => {
    it("should reimburse damage minus 100G deductible", () => {
      expect(processClaim(item("sword"), 500)).toBe(400);
    });
    it("should reimburse 50% for items with enchantment level >= 8", () => {
      expect(processClaim(item("staff", { enchantment: 8 }), 500)).toBe(200);
    });
    it("should fully reimburse damage to dragon material items", () => {
      expect(processClaim(item("sword", { material: "dragon" }), 500)).toBe(500);
    });
    it("should return zero payout when deductible exceeds damage", () => {
      expect(processClaim(item("sword"), 50)).toBe(0);
    });
  });
});
