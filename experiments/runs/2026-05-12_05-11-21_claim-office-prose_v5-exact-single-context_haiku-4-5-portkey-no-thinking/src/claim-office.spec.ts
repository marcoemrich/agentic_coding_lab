import { describe, it, expect } from "vitest";
import { quotePremium, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Premium", () => {
    it("should quote a single sword with no modifiers", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        true // repeat contract to avoid first insurance surcharge
      );
      expect(result).toBe(105); // 100 base + 5 processing fee
    });
    it("should quote a single amulet with no modifiers", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        true // repeat contract to avoid first insurance surcharge
      );
      expect(result).toBe(65); // 60 base + 5 processing fee
    });
    it("should quote a single staff with no modifiers", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        true // repeat contract to avoid first insurance surcharge
      );
      expect(result).toBe(85); // 80 base + 5 processing fee
    });
    it("should quote a single potion with no modifiers", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        true // repeat contract to avoid first insurance surcharge
      );
      expect(result).toBe(45); // 40 base + 5 processing fee
    });
    it("should quote three components with group discount", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [
          { type: "rune", material: "enchanted", enchantment: 1, cursed: false },
          { type: "rune", material: "enchanted", enchantment: 1, cursed: false },
          { type: "rune", material: "enchanted", enchantment: 1, cursed: false },
        ],
        true // repeat contract to avoid first insurance surcharge
      );
      expect(result).toBe(65); // 60 group base + 5 processing fee
    });
    it("should add processing fee to premium", () => {
      // Verify processing fee is consistently applied
      const swordResult = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        true // repeat contract
      );
      expect(swordResult).toBe(105); // 100 base + 5 processing fee
    });
    it("should apply cursed item surcharge", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        true // repeat contract to isolate cursed surcharge
      );
      expect(result).toBe(158); // 100 base + 50% surcharge (50) + 5 processing + 3 rounding = 158
    });
    it("should apply highly enchanted item surcharge", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        true // repeat contract to isolate enchanted surcharge
      );
      expect(result).toBe(135); // 100 base + 30% surcharge (30) + 5 processing = 135
    });
    it("should apply first insurance surcharge", () => {
      const result = quotePremium(
        { yearsWithMHPCO: 0 },
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        false // first contract (isRepeatContract: false means first)
      );
      expect(result).toBe(116); // 100 base + 10% first insurance surcharge (10) + 5 processing + 1 rounding = 116
    });
    it.todo("should apply loyalty discount for long-standing customers");
    it.todo("should apply discount for contracts after first");
    it.todo("should quote multiple items together");
    it.todo("should round amounts in MHPCO's favor");
  });

  describe("Process Claim", () => {
    it.todo("should apply deductible to claim amount");
    it.todo("should apply cap to total payout");
    it.todo("should track remaining cap after claim");
    it.todo("should handle multiple claims on same policy");
  });
});
