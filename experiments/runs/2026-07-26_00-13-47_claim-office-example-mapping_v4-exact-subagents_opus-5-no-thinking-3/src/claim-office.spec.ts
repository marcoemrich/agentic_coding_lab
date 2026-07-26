import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("should return a premium of 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 5 }]);
    });
    it("should charge 100 G base premium for a sword", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 115 }]);
    });
    it("should charge 60 G base premium for an amulet", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 71 }]);
    });
    it("should charge 80 G base premium for a staff", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "staff",
                material: "wood",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 93 }]);
    });
    it("should charge 40 G base premium for a potion", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "potion",
                material: "glass",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 49 }]);
    });
    it("should sum the base premiums of several main items", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 0,
                cursed: false,
              },
              {
                type: "amulet",
                material: "silver",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 181 }]);
    });
  });

  describe("quote — components and building blocks", () => {
    it("should charge 25 G base premium per single component", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 33 }]);
    });
    it("should charge 50 G base premium for 2 runes", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 60 }]);
    });
    it("should charge 60 G base premium for exactly 3 runes (block applies)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 71 }]);
    });
    it("should charge 100 G base premium for 4 runes (no block, block requires exactly 3)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 115 }]);
    });
    it("should charge 175 G base premium for 7 runes (no block)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 198 }]);
    });
    it("should charge 75 G base premium for 2 runes and 1 moonstone (no block: different types)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 88 }]);
    });
    it("should charge 120 G base premium for 3 runes and 3 moonstones (two separate blocks)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 137 }]);
    });
    it("should not apply the component block discount to 3 alike main items (3 swords)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 335 }]);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("should add 50 % of the item's base premium for a cursed item", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: true,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 101 }]);
    });
    it("should add 30 % of the item's base premium for enchantment level 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 5,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 89 }]);
    });
    it("should not add the high-enchantment surcharge for enchantment level 4", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 4,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 115 }]);
    });
    it("should add both surcharges for a cursed item with enchantment level 5", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 5,
                cursed: true,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 195 }]);
    });
    it("should apply the cursed surcharge only to the cursed item's base premium in a multi-item policy (cursed sword + plain amulet)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 231 }]);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("should add 10 % first insurance surcharge per item on every quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "staff",
                material: "wood",
                enchantment: 0,
                cursed: false,
              },
              {
                type: "potion",
                material: "glass",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 137 }]);
    });
    it("should subtract 20 % loyalty discount for a customer with 2 years with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 95 }]);
    });
    it("should not apply the loyalty discount for a customer with 1 year with MHPCO", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 115 }]);
    });
    it("should subtract 15 % follow-up discount on the customer's second quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("should not apply the follow-up discount on the customer's first quote", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 115 }]);
    });
    it("should add the 5 G processing fee at the very end", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "staff",
                material: "wood",
                enchantment: 1,
                cursed: false,
              },
            ],
          },
          {
            op: "quote",
            items: [
              {
                type: "staff",
                material: "wood",
                enchantment: 1,
                cursed: false,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 77 }, { premium: 65 }]);
    });
    it("should round the final premium up (197.5 G becomes 198 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 143 }]);
    });
  });

  describe("quote — integration examples", () => {
    it("should charge 165 G for a newcomer's cursed steel sword with enchantment 3", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 165 }]);
    });
    it("should charge 160 G for a 3-year customer's second quote of a cursed steel sword with enchantment 7", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("claim — standard reimbursement", () => {
    it("should pay 400 G for 500 G damage to a regular sword (deductible of 100 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should pay 100 G for 200 G damage to a rune (no enchantment level or material)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ]);
    });
    it("should apply the 100 G deductible once per damage entry (sword 500 G + amulet 300 G pays 600 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ]);
    });
    it("should round the final payout down (350.5 G becomes 350 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 8,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 901 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ]);
    });
  });

  describe("claim — special clauses", () => {
    it("should reimburse 50 % before the deductible for enchantment level 8 (1000 G damage pays 400 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 8,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should fully reimburse dragon material before the deductible (800 G damage pays 700 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "dragon",
                enchantment: 5,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ]);
    });
    it("should apply the 50 % rule for a steel sword with enchantment 9 (1000 G damage pays 400 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 9,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
    it("should let the 50 % rule win over dragon material when both apply (dragon sword, enchantment 9, 1000 G damage pays 400 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "dragon",
                enchantment: 9,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ]);
    });
  });

  describe("claim — insurance sum and cap", () => {
    it("should cap the payout at twice the insurance sum of the policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 115 },
        { payout: 2000, remainingCap: 0 },
      ]);
    });
    it("should report the remaining cap after a claim", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 71 },
        { payout: 200, remainingCap: 1000 },
      ]);
    });
    it("should base the insurance sum on the items' insurance values (sword + amulet = 1600 G, cap 3200 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 181 },
        { payout: 3200, remainingCap: 0 },
      ]);
    });
    it("should not raise the cap through premium modifiers (cursed sword still has cap 2000 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 165 },
        { payout: 2000, remainingCap: 0 },
      ]);
    });
    it("should not reduce the insurance sum through the component block discount (sword + 3 runes = 1750 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 181 },
        { payout: 3500, remainingCap: 0 },
      ]);
    });
    it("should use the insurance sum of both swords for a policy covering two swords (2000 G, cap 4000 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 225 },
        { payout: 4000, remainingCap: 0 },
      ]);
    });
    it("should reduce a later payout to the remaining cap (two 1500 G claims on a sword pay 1400 G then 600 G)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("should treat two damage entries of the same item type as separate damages with their own deductible", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };

      const output = runScenario(scenario);

      expect(output.results).toEqual([
        { premium: 225 },
        { payout: 600, remainingCap: 3400 },
      ]);
    });
  });

  describe("errors", () => {
    it("should reject a quote containing an item with an unknown type", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "broomstick" }],
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("should reject a claim whose damage references an item type not covered by the policy", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 0,
                cursed: false,
              },
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

      expect(() => runScenario(scenario)).toThrow();
    });
    it("should reject a claim whose damage references an unknown item type", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("should reject a claim with more damage entries of a type than the policy insures", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
    it("should reject a claim with a negative damage amount", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 0,
                cursed: false,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      };

      expect(() => runScenario(scenario)).toThrow();
    });
  });
});
