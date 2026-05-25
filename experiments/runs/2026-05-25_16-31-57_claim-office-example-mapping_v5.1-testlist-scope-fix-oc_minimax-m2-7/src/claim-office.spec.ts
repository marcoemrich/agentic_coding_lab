import { describe, it, expect } from "vitest";
import { quote, ClaimOffice, Scenario, Results } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote - Base Premiums", () => {
    it("should return 5 G premium for empty item list", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [], 1)).toBe(5);
    });
    it("should return 100 G base premium for a sword", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(115);
    });
    it("should return 60 G base premium for an amulet", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 1)).toBe(71);
    });
    it("should return 80 G base premium for a staff", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 1)).toBe(93);
    });
    it("should return 40 G base premium for a potion", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 1)).toBe(49);
    });
    it("should return 25 G base premium for a single component", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 1)).toBe(33);
    });
  });

  describe("Quote - Component Building Blocks", () => {
    it("should return 50 G base premium for 2 runes", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 1)).toBe(60);
    });
    it("should return 60 G base premium for 3 runes (block)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }], 1)).toBe(71);
    });
    it("should return 100 G base premium for 4 runes", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], 1)).toBe(115);
    });
    it("should return 175 G base premium for 7 runes", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "rune" }
      ], 1)).toBe(198);
    });
  });

  describe("Quote - Alike Components", () => {
    it("should return 75 G for 2 runes + 1 moonstone", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" }
      ], 1)).toBe(88);
    });
    it("should return 120 G for 3 runes + 3 moonstones", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }
      ], 1)).toBe(137);
    });
  });

  describe("Quote - Cursed Modifier", () => {
    it("should add 50% surcharge for cursed sword", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }], 1)).toBe(170);
    });
    it("should add 50% surcharge for cursed amulet", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet", cursed: true }], 1)).toBe(104);
    });
  });

  describe("Quote - High Enchantment Modifier", () => {
    it("should add 30% surcharge for sword with enchantment 5", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 1)).toBe(148);
    });
    it("should NOT add surcharge for sword with enchantment 4", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 1)).toBe(115);
    });
    it("should apply both cursed and high-enchantment surcharges", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }], 1)).toBe(203);
    });
  });

  describe("Quote - Customer History Modifiers", () => {
    it("should apply 20% loyalty discount for customer with 2 years", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 1)).toBe(93);
    });
    it("should NOT apply loyalty discount for customer with 1 year", () => {
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 1)).toBe(115);
    });
  });

  describe("Quote - First Insurance Surcharge", () => {
    it("should apply 10% first insurance surcharge", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(115);
    });
  });

  describe("Quote - Follow-up Contract Discount", () => {
    it("should apply 15% discount for follow-up contracts", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 2)).toBe(73);
    });
  });

  describe("Integration - Multi-step Scenarios", () => {
    it("should process scenario with quote then claim", () => {
      const office = new ClaimOffice();
      office.quoteForPolicy({ yearsWithMHPCO: 0 }, [{ type: "sword" }]);
      expect(office.claim(0, "dragon", [{ itemType: "sword", amount: 500 }])).toBe(400);
    });
  });
});
