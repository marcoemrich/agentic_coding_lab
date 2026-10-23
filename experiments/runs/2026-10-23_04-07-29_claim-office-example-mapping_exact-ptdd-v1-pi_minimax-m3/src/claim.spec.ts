import { describe, it, expect } from "vitest";
import { claim } from "./claim.js";
import type { Item, Policy } from "./types.js";
import { ITEM_INSURANCE_VALUES } from "./types.js";

function makePolicy(items: Item[], premium = 0): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUES[item.type], 0);
  return {
    items,
    insuranceSum,
    cap: insuranceSum * 2,
    remainingCap: insuranceSum * 2,
    premium,
  };
}

describe("claim", () => {
  describe("standard reimbursement (no special clause)", () => {
    it("regular sword (steel, enchantment 3), damage 500 → payout 400 (full - 100)", () => {
      const policy = makePolicy([{ type: "sword", material: "steel", enchantment: 3 }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("rune damage 200 → payout 100 (full - 100; no enchantment/material)", () => {
      const policy = makePolicy([{ type: "rune" }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      });
      expect(result.payout).toBe(100);
    });
    it("amulet damage 200 → payout 100 (full - 100)", () => {
      const policy = makePolicy([{ type: "amulet" }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      });
      expect(result.payout).toBe(100);
    });
  });

  describe("special clauses: high enchantment", () => {
    it("enchantment >=8 → 50% reimbursement", () => {
      const policy = makePolicy([{ type: "sword", enchantment: 9 }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      // 1000 * 0.5 - 100 = 400
      expect(result.payout).toBe(400);
    });
    it("enchantment exactly 8 → 50% reimbursement applies", () => {
      const policy = makePolicy([{ type: "sword", enchantment: 8 }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      // 1000 * 0.5 - 100 = 400
      expect(result.payout).toBe(400);
    });
    it("enchantment 7 → full reimbursement applies", () => {
      const policy = makePolicy([{ type: "sword", enchantment: 7 }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      });
      // 500 - 100 = 400
      expect(result.payout).toBe(400);
    });
  });

  describe("special clauses: dragon material", () => {
    it("dragon material → full reimbursement", () => {
      const policy = makePolicy([{ type: "sword", material: "dragon" }]);
      const result = claim(policy, {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 500 }],
      });
      // 500 - 100 = 400 (no enchantment clause)
      expect(result.payout).toBe(400);
    });
  });

  describe("special clauses: enchantment vs dragon material", () => {
    it("dragon sword enchantment 9 damage 1000 → payout 400 (50% rule wins)", () => {
      const policy = makePolicy([{ type: "sword", material: "dragon", enchantment: 9 }]);
      const result = claim(policy, {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      // 1000 * 0.5 - 100 = 400
      expect(result.payout).toBe(400);
    });
    it("dragon sword enchantment 8 damage 1000 → payout 400 (50% rule wins, dragon sword + enchantment 8)", () => {
      const policy = makePolicy([{ type: "sword", material: "dragon", enchantment: 8 }]);
      const result = claim(policy, {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      // 1000 * 0.5 - 100 = 400
      expect(result.payout).toBe(400);
    });
    it("dragon sword enchantment 5 damage 800 → payout 700 (only dragon clause, full)", () => {
      const policy = makePolicy([{ type: "sword", material: "dragon", enchantment: 5 }]);
      const result = claim(policy, {
        cause: "dragon",
        damages: [{ itemType: "sword", amount: 800 }],
      });
      // 800 - 100 = 700
      expect(result.payout).toBe(700);
    });
    it("steel sword enchantment 9 damage 1000 → payout 400 (50% only)", () => {
      const policy = makePolicy([{ type: "sword", material: "steel", enchantment: 9 }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      });
      // 1000 * 0.5 - 100 = 400
      expect(result.payout).toBe(400);
    });
  });

  describe("deductible per damage item", () => {
    it("dragon attack damages sword (500) + amulet (300) → payout 600 (deductible per item)", () => {
      const policy = makePolicy([{ type: "sword" }, { type: "amulet" }]);
      const result = claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      });
      // (500 - 100) + (300 - 100) = 400 + 200 = 600
      expect(result.payout).toBe(600);
    });
  });

  describe("cap", () => {
    it("cap is 2x insurance sum (single sword = 2000 cap)", () => {
      const policy = makePolicy([{ type: "sword" }]);
      expect(policy.cap).toBe(2000);
    });
    it("cap is 2x insurance sum (sword + amulet = 3200 cap)", () => {
      const policy = makePolicy([{ type: "sword" }, { type: "amulet" }]);
      expect(policy.cap).toBe(3200);
    });
    it("cap based on unmodified insurance value (cursed sword cap = 2000)", () => {
      const policy = makePolicy([{ type: "sword", cursed: true }]);
      expect(policy.cap).toBe(2000);
    });
    it("block discount does not affect insurance sum (sword + 3 runes = 1750 insurance, 3500 cap)", () => {
      const policy = makePolicy([
        { type: "sword" },
        { type: "rune" }, { type: "rune" }, { type: "rune" },
      ]);
      expect(policy.insuranceSum).toBe(1750);
      expect(policy.cap).toBe(3500);
    });
    it("insurance sum for two swords = 2000 G (2x1000), cap 4000 G", () => {
      const policy = makePolicy([{ type: "sword" }, { type: "sword" }]);
      expect(policy.insuranceSum).toBe(2000);
      expect(policy.cap).toBe(4000);
    });
  });

  describe("cap exhaustion", () => {
    it("sword first claim 1500 → payout 1400, remainingCap 600", () => {
      const policy = makePolicy([{ type: "sword" }]);
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      });
      // 1500 - 100 = 1400; remaining cap 2000 - 1400 = 600
      expect(result.payout).toBe(1400);
      expect(result.remainingCap).toBe(600);
    });
    it("sword second claim 1500 → payout 600 (capped), remainingCap 0", () => {
      const policy = makePolicy([{ type: "sword" }]);
      policy.remainingCap = 600;
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      });
      // desired 1400 but capped to 600
      expect(result.payout).toBe(600);
      expect(result.remainingCap).toBe(0);
    });
  });

  describe("multiple damages of same type", () => {
    it("two sword damages on policy covering two swords → each treated separately with own deductible", () => {
      const policy = makePolicy([{ type: "sword" }, { type: "sword" }]);
      const result = claim(policy, {
        cause: "dragon",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 300 },
        ],
      });
      // (500-100) + (300-100) = 600
      expect(result.payout).toBe(600);
    });
  });

  describe("rounding", () => {
    it("payout is rounded down to whole G (floor) in MHPCO's favor", () => {
      const policy = makePolicy([{ type: "sword", enchantment: 9 }]);
      // Damage 701 → 50% = 350.5, -100 = 250.5 → floor 250
      const result = claim(policy, {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 701 }],
      });
      expect(result.payout).toBe(250);
    });
  });

  describe("edge cases", () => {
    it("throws error when damage item type is not part of policy", () => {
      const policy = makePolicy([{ type: "sword" }]);
      expect(() =>
        claim(policy, {
          cause: "fire",
          damages: [{ itemType: "amulet", amount: 200 }],
        }),
      ).toThrow(/not part of the policy/);
    });
    it("throws error on negative damage amount", () => {
      const policy = makePolicy([{ type: "sword" }]);
      expect(() =>
        claim(policy, {
          cause: "fire",
          damages: [{ itemType: "sword", amount: -200 }],
        }),
      ).toThrow(/negative/);
    });
    it("throws error when more damages of a type than covered items", () => {
      const policy = makePolicy([{ type: "sword" }]);
      expect(() =>
        claim(policy, {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 200 },
            { itemType: "sword", amount: 300 },
          ],
        }),
      ).toThrow(/than covered/);
    });
    it("throws error on unknown damage item type", () => {
      const policy = makePolicy([{ type: "sword" }]);
      expect(() =>
        claim(policy, {
          cause: "fire",
          damages: [{ itemType: "broomstick", amount: 200 }],
        }),
      ).toThrow(/not part of the policy/);
    });
  });
});
