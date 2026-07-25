import { describe, it, expect } from "vitest";
import { quote, claim, processScenario, createPolicy } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("should return premium 5 G for empty item list -- only processing fee", () => {
      const customer = { yearsWithMHPCO: 0 };
      expect(quote(customer, [])).toBe(5);
    });
    it("should quote a single sword -- premium 115 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should quote a single amulet -- premium 71 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(71);
    });
    it("should quote a single staff -- premium 93 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "staff", material: "wood", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(93);
    });
    it("should quote a single potion -- premium 49 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "potion", material: "glass", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(49);
    });
    it("should quote 2 runes without block discount -- premium 60 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(60);
    });
    it("should quote 3 runes with block discount -- premium 71 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(71);
    });
    it("should quote 4 runes without block discount -- premium 115 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(115);
    });
    it("should quote 7 runes without block discount -- premium 198 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = Array.from({ length: 7 }, () => ({
        type: "rune",
        material: "stone",
        enchantment: 0,
        cursed: false,
      }));
      expect(quote(customer, items, 0)).toBe(198);
    });
    it("should quote 2 runes + 1 moonstone as different types -- premium 88 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "gem", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(88);
    });
    it("should quote 3 runes + 3 moonstones as two blocks -- premium 137 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
        { type: "moonstone", material: "gem", enchantment: 0, cursed: false },
        { type: "moonstone", material: "gem", enchantment: 0, cursed: false },
        { type: "moonstone", material: "gem", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(137);
    });
    it("should apply cursed surcharge to cursed sword -- premium 165 G final", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: true }];
      expect(quote(customer, items, 0)).toBe(165);
    });
    it("should apply high-enchantment surcharge at enchantment 5 -- premium 145 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 5, cursed: false }];
      expect(quote(customer, items, 0)).toBe(145);
    });
    it("should apply loyalty discount at exactly 2 years -- premium 95 G", () => {
      const customer = { yearsWithMHPCO: 2 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 0)).toBe(95);
    });
    it("should apply follow-up contract discount on second contract -- premium 100 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 0, cursed: false }];
      expect(quote(customer, items, 1)).toBe(100);
    });
    it("should handle newcomer with cursed sword -- premium 165 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
      expect(quote(customer, items, 0)).toBe(165);
    });
    it("should handle long-standing customer second contract with cursed enchanted sword -- premium 160 G", () => {
      const customer = { yearsWithMHPCO: 3 };
      const items = [{ type: "sword", material: "steel", enchantment: 7, cursed: true }];
      expect(quote(customer, items, 1)).toBe(160);
    });
    it("should quote two swords -- premium 225 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
        { type: "sword", material: "steel", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(225);
    });
    it("should quote a mixed policy with item-specific and policy-wide modifiers -- premium 231 G", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [
        { type: "sword", material: "steel", enchantment: 0, cursed: true },
        { type: "amulet", material: "silver", enchantment: 0, cursed: false },
      ];
      expect(quote(customer, items, 0)).toBe(231);
    });
    it("should reject unknown item type in quote", () => {
      const customer = { yearsWithMHPCO: 0 };
      const items = [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }];
      expect(() => quote(customer, items, 0)).toThrow("Unknown item type");
    });
  });

  describe("claim", () => {
    it("should pay regular sword damage 500 G minus deductible -- payout 400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 500 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should pay rune damage 200 G minus deductible -- payout 100 G", () => {
      const policy = createPolicy([
        { type: "rune", material: "stone", enchantment: 0, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "rune", amount: 200 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("should apply high-enchantment clause to dragon-material sword enchantment 8 -- payout 400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 8, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply dragon-material clause to enchantment 5 sword -- payout 700 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 5, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 800 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("should apply high-enchantment clause to steel sword enchantment 9 -- payout 400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 9, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply high-enchantment clause over dragon material when both apply -- payout 400 G", () => {
      const policy = createPolicy([
        { type: "sword", material: "dragon", enchantment: 9, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1000 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("should apply deductible per damaged item in multi-item incident", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ]);
      const incident = {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ],
      };
      expect(claim(policy, incident)).toEqual({ payout: 600, remainingCap: 2600 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 2500 }],
      };
      expect(claim(policy, incident)).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("should exhaust cap across successive claims", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      const incident1 = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      };
      expect(claim(policy, incident1)).toEqual({ payout: 1400, remainingCap: 600 });
      const incident2 = {
        cause: "flood",
        damages: [{ itemType: "sword", amount: 1500 }],
      };
      expect(claim(policy, incident2)).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("should reject claim for item not in policy", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "amulet", amount: 200 }],
      };
      expect(() => claim(policy, incident)).toThrow("not part of the policy");
    });
    it("should reject claim with negative damage amount", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: -200 }],
      };
      expect(() => claim(policy, incident)).toThrow("non-negative");
    });
    it("should reject claim with more damages of a type than policy covers", () => {
      const policy = createPolicy([
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ]);
      const incident = {
        cause: "fire",
        damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 300 },
        ],
      };
      expect(() => claim(policy, incident)).toThrow("More damages");
    });
  });

  describe("processScenario", () => {
    it("should process quote then claim from schema example", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      };
      expect(processScenario(scenario)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
  });
});
