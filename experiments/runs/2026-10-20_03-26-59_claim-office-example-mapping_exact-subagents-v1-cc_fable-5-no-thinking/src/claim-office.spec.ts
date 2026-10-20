// claim-office.spec.ts
import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";

describe("Claim Office", () => {
  describe("Quote: base premiums", () => {
    it("should return 5 G for an empty item list (processing fee only)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
    });
    it("should return 115 G for a single plain sword (100 base + 10 surcharge + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
    });
    it("should return 71 G for a single plain amulet (60 base + 6 surcharge + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
    });
    it("should return 93 G for a single plain staff (80 base + 8 surcharge + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
    });
    it("should return 49 G for a single plain potion (40 base + 4 surcharge + 5 fee)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
    });
    it("should sum base premiums for multiple items (sword + amulet → 181 G)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }])).toBe(181);
    });
    it("should throw an error for an unknown item type", () => {
      expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow();
    });
  });

  describe("Quote: component block pricing", () => {
    it("should charge 25 G base premium per component (2 runes → 50 G base)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
    });
    it("should charge 60 G base premium for a block of exactly 3 alike components (3 runes)", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
    });
    it("should not apply the block to 4 alike components (4 runes → 100 G base)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ]),
      ).toBe(115);
    });
    it("should apply one block within 7 alike components (7 runes → 175 G base)", () => {
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        ),
      ).toBe(198);
    });
    it("should not form a block from different component types (2 runes + 1 moonstone → 75 G base)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
        ]),
      ).toBe(88);
    });
    it("should form separate blocks per component type (3 runes + 3 moonstones → 120 G base)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      ).toBe(137);
    });
  });

  describe("Quote: item-specific modifiers", () => {
    it("should add 50 % curse surcharge on the cursed item's base premium", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
    });
    it("should add 30 % surcharge for enchantment level of exactly 5", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
    });
    it("should not add a high-enchantment surcharge for enchantment level 4", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
    });
    it("should apply both curse and high-enchantment surcharges to the same item", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 7 }])).toBe(195);
    });
    it("should apply the curse surcharge only to the cursed item's base premium, not the policy total (cursed sword + plain amulet → 210 G before policy modifiers and fee)", () => {
      expect(
        quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }]),
      ).toBe(231);
    });
  });

  describe("Quote: policy-wide modifiers", () => {
    it("should always add 10 % first-insurance surcharge to the policy base premium", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
    });
    it("should apply 20 % loyalty discount for a customer with exactly 2 years with MHPCO", () => {
      expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
    });
    it("should not apply the loyalty discount for a customer with fewer than 2 years", () => {
      expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
    });
    it("should apply 15 % follow-up discount on each quote after the customer's first", () => {
      expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], { contractNumber: 2 })).toBe(100);
    });
  });

  describe("Quote: rounding", () => {
    it("should round the final premium up (197.5 G → 198 G)", () => {
      // 7 runes: 175 base + 17.5 first-insurance surcharge + 5 fee = 197.5
      const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
      expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
    });
  });

  describe("Quote: integration", () => {
    it("should quote 165 G for a newcomer's cursed steel sword with enchantment 3", () => {
      // 100 base + 50 curse + 10 first-insurance + 5 fee = 165
      expect(
        quote(
          { yearsWithMHPCO: 0 },
          [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          { contractNumber: 1 },
        ),
      ).toBe(165);
    });
    it("should quote 160 G for a 3-year customer's second quote of a cursed sword with enchantment 7", () => {
      // 100 base + 50 curse + 30 high enchantment + 10 first-insurance − 20 loyalty − 15 follow-up + 5 fee = 160
      expect(
        quote(
          { yearsWithMHPCO: 3 },
          [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          { contractNumber: 2 },
        ),
      ).toBe(160);
    });
  });

  describe("Claim: standard reimbursement", () => {
    it("should pay damage minus 100 G deductible for a regular item (steel sword ench 3, damage 500 → 400)", () => {
      const result = claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        [{ itemType: "sword", amount: 500 }],
      );
      expect(result.payout).toBe(400);
    });
    it("should pay damage minus deductible for a component (rune, damage 200 → 100)", () => {
      const result = claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]);
      expect(result.payout).toBe(100);
    });
  });

  describe("Claim: special clauses", () => {
    it("should reimburse 50 % before deductible for enchantment level ≥ 8 (steel sword ench 9, damage 1000 → 400)", () => {
      const result = claim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result.payout).toBe(400);
    });
    it("should reimburse fully before deductible for dragon material (dragon sword ench 5, damage 800 → 700)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        [{ itemType: "sword", amount: 800 }],
      );
      expect(result.payout).toBe(700);
    });
    it("should apply the 50 % rule when both clauses apply (dragon sword ench 9, damage 1000 → 400)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result.payout).toBe(400);
    });
    it("should apply the 50 % rule at exactly enchantment 8 (dragon sword ench 8, damage 1000 → 400)", () => {
      const result = claim(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        [{ itemType: "sword", amount: 1000 }],
      );
      expect(result.payout).toBe(400);
    });
  });

  describe("Claim: multi-item damage", () => {
    it("should apply the deductible once per damaged item (sword 500 + amulet 300 → 600)", () => {
      const result = claim(
        [{ type: "sword" }, { type: "amulet" }],
        [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      );
      expect(result.payout).toBe(600);
    });
  });

  describe("Claim: payout cap", () => {
    it("should cap the policy at twice the insurance sum (single sword → cap 2000)", () => {
      const result = claim([{ type: "sword" }], [{ itemType: "sword", amount: 500 }]);
      expect(result.remainingCap).toBe(1600);
    });
    it("should report the remaining cap after a claim (sword, claim 1500 → payout 1400, remaining 600)", () => {
      const result = claim([{ type: "sword" }], [{ itemType: "sword", amount: 1500 }]);
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });
    it("should limit a payout to the remaining cap on successive claims (second claim 1500 → payout 600, remaining 0)", () => {
      const sword = { type: "sword" };
      const first = claim([sword], [{ itemType: "sword", amount: 1500 }]);
      const second = claim([sword], [{ itemType: "sword", amount: 1500 }], {
        remainingCap: first.remainingCap,
      });
      expect(second.payout).toBe(600);
      expect(second.remainingCap).toBe(0);
    });
  });

  describe("Claim: rounding", () => {
    it("should round the final payout down (350.5 G → 350 G)", () => {
      // 50 % rule: 901 × 0.5 = 450.5 − 100 deductible = 350.5 → floor → 350
      const result = claim(
        [{ type: "sword", enchantment: 9 }],
        [{ itemType: "sword", amount: 901 }],
      );
      expect(result.payout).toBe(350);
    });
  });

  describe("Claim: errors", () => {
    it("should throw when a damage entry references an item not in the policy", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }]),
      ).toThrow();
    });
    it("should throw when more damage entries of a type exist than items insured", () => {
      expect(() =>
        claim(
          [{ type: "sword" }],
          [
            { itemType: "sword", amount: 300 },
            { itemType: "sword", amount: 300 },
          ],
        ),
      ).toThrow();
    });
    it("should throw for a negative damage amount", () => {
      expect(() =>
        claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }]),
      ).toThrow();
    });
  });
});
