import { describe, it, expect } from "vitest";
import { createQuote, processClaim, processMultipleDamages } from "./claim-office.js";

describe("MHPCO Claim Office System", () => {
  // Quote Operations - Base Functionality
  describe("Quote Operations", () => {
    it("should return 5G for empty item list (processing fee only)", () => {
      expect(createQuote([])).toBe(5);
    });

    it("should calculate base premium for single sword", () => {
      expect(createQuote([{ type: "sword", damage: 50 }])).toBe(105);
    });
    it("should calculate base premium for single amulet", () => {
      expect(createQuote([{ type: "amulet", damage: 50 }])).toBe(65);
    });
    it("should calculate base premium for single staff", () => {
      expect(createQuote([{ type: "staff", damage: 50 }])).toBe(85);
    });
    it("should calculate base premium for single potion", () => {
      expect(createQuote([{ type: "potion", damage: 50 }])).toBe(75);
    });
    it("should calculate base premium for single component", () => {
      expect(createQuote([{ type: "component", damage: 50 }])).toBe(55);
    });

    it("should add processing fee to calculated premium", () => {
      expect(createQuote([{ type: "component", damage: 50 }, { type: "potion", damage: 50 }])).toBe(125);
    });

    it("should sum premiums for two different items", () => {
      expect(createQuote([{ type: "sword", damage: 50 }, { type: "amulet", damage: 50 }])).toBe(175);
    });
    it("should sum premiums for three different items", () => {
      expect(createQuote([{ type: "sword", damage: 50 }, { type: "amulet", damage: 50 }, { type: "staff", damage: 50 }])).toBe(250);
    });

    it("should apply cursed item surcharge (50%)", () => {
      expect(createQuote([{ type: "sword", damage: 50, cursed: true }])).toBe(160);
    });
    it("should apply enchanted item surcharge (level 5) to sword", () => {
      expect(createQuote([{ type: "sword", damage: 50, enchantment: 5 }])).toBe(131);
    });
    it("should apply high enchantment surcharge (level 5+, 30%)", () => {
      expect(createQuote([{ type: "sword", damage: 50, enchantment: 5 }])).toBe(130);
    });
    it("should apply cursed surcharge and enchanted surcharge together", () => {
      expect(createQuote([{ type: "sword", damage: 50, cursed: true, enchantment: 5 }])).toBe(185);
    });

    it("should apply long-standing customer discount (2+ years)", () => {
      expect(createQuote([{ type: "sword", damage: 50 }], { yearsAsCustomer: 2 })).toBe(84);
    });
    it("should apply first insurance surcharge (10%) when isFirstInsurance is true", () => {
      expect(createQuote([{ type: "sword", damage: 50 }], { isFirstInsurance: true })).toBe(116);
    });
    it("should apply follow-up contract discount (-15%) when isFollowUpContract is true", () => {
      expect(createQuote([{ type: "sword", damage: 50 }], { isFollowUpContract: true })).toBe(89);
    });

    it("should round premium up to nearest gold in MHPCO's favor", () => {
      expect(createQuote([{ type: "staff", damage: 50 }], { isFirstInsurance: true })).toBe(95);
    });

    it("should reject unknown item type with error", () => {
      expect(() => createQuote([{ type: "unknown", damage: 50 }])).toThrow("Unknown item type: unknown");
    });
    it("should reject negative damage amount with error", () => {
      expect(() => createQuote([{ type: "sword", damage: -50 }])).toThrow();
    });
  });

  // Claim Operations - Base Functionality
  describe("Claim Operations", () => {
    it("should process claim for single item with damage below deductible", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damage = { type: "sword", amount: 50 };
      expect(processClaim(policy, damage)).toBe(0);
    });
    it("should return payout minus deductible when damage exceeds deductible", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damage = { type: "sword", amount: 150 };
      expect(processClaim(policy, damage)).toBe(50);
    });

    it("should subtract 100G deductible from damage", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damage = { type: "sword", amount: 200 };
      expect(processClaim(policy, damage)).toBe(100);
    });

    it("should cap payout at 2x insurance value", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damage = { type: "sword", amount: 350 };
      expect(processClaim(policy, damage)).toBe(200);
    });

    it("should reimburse high enchantment damage at 50%", () => {
      const policy = { items: [{ type: "sword", damage: 50, enchantment: 8 }], coverage: 100 };
      const damage = { type: "sword", amount: 250 };
      expect(processClaim(policy, damage)).toBe(300);
    });
    it("should apply dragon material full reimbursement", () => {
      const policy = { items: [{ type: "sword", damage: 50, dragonMaterial: true }], coverage: 100 };
      const damage = { type: "sword", amount: 150 };
      expect(processClaim(policy, damage)).toBe(150);
    });

    it("should process multiple damage events to same item type with separate deductibles", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damages = [
        { type: "sword", amount: 130 },
        { type: "sword", amount: 130 }
      ];
      const result = processMultipleDamages(policy, damages);
      expect(result).toBe(60); // (130-100) + (130-100) = 30 + 30 = 60
    });
    it("should apply separate deductible for each damage event", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damages = [
        { type: "sword", amount: 130 },
        { type: "sword", amount: 130 }
      ];
      const result = processMultipleDamages(policy, damages);
      expect(result).toBe(60); // (130-100) + (130-100) = 30 + 30 = 60
    });

    it("should reject claim for damage to item not in policy", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damage = { type: "amulet", amount: 150 };
      expect(() => processClaim(policy, damage)).toThrow();
    });
    it("should reject claim with negative damage amount", () => {
      const policy = { items: [{ type: "sword", damage: 50 }], coverage: 100 };
      const damage = { type: "sword", amount: -50 };
      expect(() => processClaim(policy, damage)).toThrow();
    });
  });
});
