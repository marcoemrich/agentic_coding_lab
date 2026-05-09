import { describe, it, expect } from "vitest";
import { quotePolicy } from "./quote.js";

const newCustomer = { yearsWithMHPCO: 0 };
const loyalCustomer = { yearsWithMHPCO: 3 };
const midCustomer = { yearsWithMHPCO: 1 };

describe("quotePolicy", () => {
  describe("base premiums", () => {
    it("quotes a single sword for a first-time customer", () => {
      // sword base = 100, first insurance +10% → 110, +5 fee = 115, ceil = 115
      const { premium } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(115);
    });

    it("quotes a single amulet for a first-time customer", () => {
      // amulet base = 60, first insurance +10% → 66, +5 fee = 71
      const { premium } = quotePolicy(newCustomer, [
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(71);
    });

    it("quotes a single staff for a first-time customer", () => {
      // staff base = 80, first insurance +10% → 88, +5 fee = 93
      const { premium } = quotePolicy(newCustomer, [
        { type: "staff", material: "oak", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(93);
    });

    it("quotes a single potion for a first-time customer", () => {
      // potion base = 40, first insurance +10% → 44, +5 fee = 49
      const { premium } = quotePolicy(newCustomer, [
        { type: "potion", material: "glass", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(49);
    });

    it("quotes a single component (rune) for a first-time customer", () => {
      // rune base = 25, first insurance +10% → 27.5, +5 = 32.5, ceil = 33
      const { premium } = quotePolicy(newCustomer, [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(33);
    });
  });

  describe("component bundles", () => {
    it("prices 3 alike runes as a building block", () => {
      // bundle base = 60, first insurance +10% → 66, +5 = 71
      const { premium } = quotePolicy(newCustomer, [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(71);
    });

    it("prices 4 alike runes as 1 bundle + 1 single", () => {
      // bundle=60 + single=25 = 85, first insurance +10% → 93.5, +5 = 98.5, ceil = 99
      const { premium } = quotePolicy(newCustomer, [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(99);
    });

    it("prices 6 alike moonstones as 2 bundles", () => {
      // 2 × 60 = 120, first insurance +10% → 132, +5 = 137
      const { premium } = quotePolicy(newCustomer, [
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
        { type: "moonstone", material: "crystal", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(137);
    });
  });

  describe("risk surcharges", () => {
    it("applies cursed surcharge (+50%) to a sword", () => {
      // sword base = 100, cursed ×1.5 = 150, first insurance +10% → 165, +5 = 170
      const { premium } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
      ], 0);
      expect(premium).toBe(170);
    });

    it("applies high enchantment surcharge (+30%) to a staff", () => {
      // staff base = 80, enchantment 5 ×1.3 = 104, first insurance +10% → 114.4, +5 = 119.4, ceil = 120
      const { premium } = quotePolicy(newCustomer, [
        { type: "staff", material: "oak", enchantment: 5, cursed: false },
      ], 0);
      expect(premium).toBe(120);
    });

    it("stacks cursed and high enchantment surcharges", () => {
      // amulet base = 60, cursed +50% + enchant +30% = ×1.8, = 108, first +10% → 118.8, +5 = 123.8, ceil = 124
      const { premium } = quotePolicy(newCustomer, [
        { type: "amulet", material: "gold", enchantment: 6, cursed: true },
      ], 0);
      expect(premium).toBe(124);
    });

    it("does not apply high enchantment surcharge below threshold", () => {
      // sword base = 100, enchantment 4 → no surcharge, first +10% = 110, +5 = 115
      const { premium } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ], 0);
      expect(premium).toBe(115);
    });

    it("applies high enchantment surcharge exactly at threshold (5)", () => {
      // sword base = 100, enchantment 5 ×1.3 = 130, first +10% → 143, +5 = 148
      const { premium } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ], 0);
      expect(premium).toBe(148);
    });
  });

  describe("customer discounts and surcharges", () => {
    it("applies loyalty discount (-20%) for customer with 2+ years", () => {
      // sword base = 100, second+ contract -15%, loyalty -20% → ×0.65 = 65, +5 = 70
      const { premium } = quotePolicy(loyalCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 1);
      expect(premium).toBe(70);
    });

    it("applies subsequent contract discount (-15%) for non-first policy", () => {
      // sword base = 100, second contract -15% → 85, +5 = 90
      const { premium } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 1);
      expect(premium).toBe(90);
    });

    it("applies first insurance surcharge only on first quote for 0-year customer", () => {
      // quoteCount=0, yearsWithMHPCO=0 → first insurance +10%
      const { premium: first } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 0);
      // quoteCount=1 → subsequent -15%
      const { premium: second } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 1);
      expect(first).toBeGreaterThan(second);
    });

    it("does not apply first insurance surcharge for customer with years > 0", () => {
      // yearsWithMHPCO=1, quoteCount=0 → subsequent contract discount applies
      // sword base = 100, subsequent -15% = 85, +5 = 90
      const { premium } = quotePolicy(midCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 0);
      expect(premium).toBe(90);
    });
  });

  describe("insurance sum tracking", () => {
    it("sets correct insurance sum for single sword", () => {
      const { policy } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 0);
      expect(policy.insuranceSum).toBe(1000);
      expect(policy.remainingCap).toBe(2000);
    });

    it("sets correct insurance sum for mixed items", () => {
      const { policy } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ], 0);
      // 1000 + 600 + 250 = 1850
      expect(policy.insuranceSum).toBe(1850);
      expect(policy.remainingCap).toBe(3700);
    });
  });

  describe("processing fee", () => {
    it("always adds the 5 G processing fee", () => {
      const { premium } = quotePolicy(newCustomer, [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ], 0);
      // Verify fee is included: without fee would be ceil(100*1.1) = 110, with fee = 115
      expect(premium).toBe(115);
    });
  });
});
