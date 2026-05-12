import { describe, it, expect } from "vitest";
import { quote, claim } from "./mhpco.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - Base Premiums", () => {
    it("should calculate empty item list premium (only processing fee)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, []);
      expect(result.premium).toBe(5);
    });
    it("should calculate single sword premium", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]);
      expect(result.premium).toBe(105); // 100 base + 5 fee
    });
    it("should calculate single amulet premium", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }]);
      expect(result.premium).toBe(65); // 60 base + 5 fee
    });
    it("should calculate single staff premium", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }]);
      expect(result.premium).toBe(85); // 80 base + 5 fee
    });
    it("should calculate single potion premium", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }]);
      expect(result.premium).toBe(45); // 40 base + 5 fee
    });
    it("should calculate single component premium", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }]);
      expect(result.premium).toBe(30); // 25 base + 5 fee
    });
    it("should calculate multiple items premium (sum of base premiums + fee)", () => {
      const result = quote({ yearsWithMHPCO: 0 }, [
        { type: "sword" },
        { type: "amulet" }
      ]);
      expect(result.premium).toBe(165); // 100 + 60 base + 5 fee
    });
  });

  describe("Quote - Processing Fee", () => {
    it("should add 5 G processing fee to every premium", () => {
      const result = quote({ yearsWithMHPCO: 0 }, []);
      expect(result.premium).toBe(5); // Processing fee only
    });
  });

  describe("Claim - Deductible", () => {
    it("should apply 100 G deductible per damage event", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]);
      const result = claim(
        { yearsWithMHPCO: 0 },
        policy,
        { damages: [{ itemType: "sword", amount: 500 }] }
      );
      expect(result.payout).toBe(400); // 500 - 100 deductible
    });
    it("should process damage to single item with deductible", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]);
      const result = claim(
        { yearsWithMHPCO: 0 },
        policy,
        { damages: [{ itemType: "sword", amount: 500 }] }
      );
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBeDefined();
    });
    it.todo("should process damage to multiple items (deductible per item)");
  });

  describe("Claim - Cap", () => {
    it("should calculate cap as twice the total insurance value", () => {
      const policy = quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }]);
      // Sword: 1000 G insurance value, so cap = 2000 G
      const result = claim(
        { yearsWithMHPCO: 0 },
        policy,
        { damages: [{ itemType: "sword", amount: 500 }] }
      );
      expect(result.remainingCap).toBe(1600); // 2000 - 400 payout
    });
    it.todo("should enforce cap limit on payout");
    it.todo("should reduce remaining cap after payout");
    it.todo("should handle zero remaining cap on subsequent claims");
  });

  describe("Claim - Item Matching", () => {
    it.todo("should reject claim with unknown item type");
    it.todo("should reject claim with more item damages than insured");
  });
});
