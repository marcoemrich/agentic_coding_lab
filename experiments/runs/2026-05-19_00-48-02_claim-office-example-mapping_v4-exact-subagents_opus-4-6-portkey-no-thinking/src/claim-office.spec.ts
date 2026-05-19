import { describe, it, expect } from "vitest";
import { processSteps } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - base premiums", () => {
    it("should return 5 G for an empty item list (processing fee only)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 5 }]);
    });
    it("should return base premium plus fee for a single sword (100 + 10 + 5 = 115 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 115 }]);
    });
    it("should return base premium plus fee for a single amulet (60 + 6 + 5 = 71 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 71 }]);
    });
    it("should return base premium plus fee for a single staff (80 + 8 + 5 = 93 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 93 }]);
    });
    it("should return base premium plus fee for a single potion (40 + 4 + 5 = 49 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 49 }]);
    });
    it("should return sum of base premiums plus fee for multiple different items", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 181 }]);
    });
  });

  describe("Quote - components", () => {
    it("should return 25 G base premium per individual component (1 rune = 25 + 2.5 + 5 = 32.5 -> 33 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "rune" }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 33 }]);
    });
    it("should return 50 G for 2 runes (no block, 50 + 5 + 5 = 60 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 60 }]);
    });
    it("should return 60 G for exactly 3 alike components (block discount, 60 + 6 + 5 = 71 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 71 }]);
    });
    it("should return 100 G for 4 runes (no block for 4, 100 + 10 + 5 = 115 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 115 }]);
    });
    it("should return 75 G for 2 runes and 1 moonstone (different types, no block, 75 + 7.5 + 5 = 87.5 -> 88 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 88 }]);
    });
    it("should return 120 G for 3 runes and 3 moonstones (two separate blocks, 120 + 12 + 5 = 137 G)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 137 }]);
    });
  });

  describe("Quote - item-level modifiers", () => {
    it("should add 50% surcharge for a cursed item", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 165 }]);
    });
    it("should add 30% surcharge for high enchantment (level >= 5)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 145 }]);
    });
    it("should apply both cursed and high enchantment surcharges to same item", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 195 }]);
    });
  });

  describe("Quote - policy-level modifiers", () => {
    it("should add 10% first insurance surcharge (each item treated as first insurance)", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 115 }]);
    });
    it("should apply -20% loyalty discount for long-standing customer (>= 2 years)", () => {
      const customer = { yearsWithMHPCO: 3 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 95 }]);
    });
    it("should apply -15% follow-up discount for each contract after the first", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
  });

  describe("Quote - rounding and integration", () => {
    it("should round final premium up in MHPCO's favor", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "rune" }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 33 }]);
    });
    it("should compute newcomer cursed sword as 165 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 165 }]);
    });
    it("should compute long-standing customer second contract cursed sword enchantment 7 as 160 G", () => {
      const customer = { yearsWithMHPCO: 3 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("Claim - basic processing", () => {
    it("should subtract 100 G deductible from damage amount", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should cap total payout at 2x insurance sum", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "explosion", damages: [{ itemType: "potion", amount: 1000 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 49 },
        { payout: 800, remainingCap: 0 },
      ]);
    });
    it("should return remaining cap after a claim", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim" as const, policy: 0, incident: { cause: "theft", damages: [{ itemType: "sword", amount: 1500 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("Claim - special reimbursement rules", () => {
    it("should reimburse at 50% for enchantment >= 8", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should fully reimburse for dragon material", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ]);
    });
    it("should apply 50% when both dragon material and enchantment >= 8", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should fully reimburse for dragon material with enchantment < 8, then deductible", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ];
      const result = processSteps(customer, steps);
      expect(result).toEqual([
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ]);
    });
  });

  describe("Error handling", () => {
    it("should reject claim referencing an item not in the policy", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ];
      expect(() => processSteps(customer, steps)).toThrow();
    });
    it("should reject negative damage amount", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ];
      expect(() => processSteps(customer, steps)).toThrow();
    });
    it("should reject more damage entries of a type than policy covers", () => {
      const customer = { yearsWithMHPCO: 0 };
      const steps = [
        { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 300 },
        ] } },
      ];
      expect(() => processSteps(customer, steps)).toThrow();
    });
  });
});
