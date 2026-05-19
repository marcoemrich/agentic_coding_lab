import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  describe("quote", () => {
    it("should return premium of 5 G for an empty item list (processing fee only)", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [{ type: "quote", items: [] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(5);
    });

    it("should return base premium plus processing fee for a single sword", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
    });

    it("should return base premium plus processing fee for a single amulet", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });

    it("should return base premium plus processing fee for a single staff", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(93);
    });

    it("should return base premium plus processing fee for a single potion", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(49);
    });

    it("should return 25 G base premium per individual component", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(60);
    });

    it("should apply building block discount of 60 G for exactly 3 alike components", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [{ type: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(71);
    });

    it("should sum base premiums of multiple different items", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(181);
    });

    it("should add 50% cursed surcharge to the cursed item base premium only", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(231);
    });

    it("should add 30% high enchantment surcharge for enchantment level 5 or above", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(145);
    });

    it("should apply both cursed and high enchantment surcharges to the same item", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(195);
    });

    it("should add 10% first insurance surcharge to every item in every quote", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Quote 1: sword base 100, +10% = 110, +5 fee = 115
      expect(result.results[0].premium).toBe(115);
      // Quote 2: amulet base 60, +10% = 66, -15% follow-up = -9, +5 fee = 62
      expect(result.results[1].premium).toBe(62);
    });

    it("should apply 20% loyalty discount for customers with 2 or more years", () => {
      const scenario = {
        customer: { years: 2 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Policy base premium (items premium) = 100
      // First insurance surcharge: +10% of 100 = +10
      // Loyalty discount: -20% of 100 = -20
      // Adjusted premium: 100 + 10 - 20 = 90
      // Processing fee: +5 = 95
      expect(result.results[0].premium).toBe(95);
    });

    it("should apply 15% follow-up contract discount on second and subsequent quotes", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // First quote: 100 base + 10 first insurance + 5 fee = 115 (no follow-up discount)
      expect(result.results[0].premium).toBe(115);
      // Second quote: 100 base + 10 first insurance - 15 follow-up (15% of 100) + 5 fee = 100
      expect(result.results[1].premium).toBe(100);
    });

    it("should round final premium up to whole G in MHPCO favor", () => {
      const scenario = {
        customer: { years: 2 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "potion", enchantment: 0, cursed: false },
              { type: "rune" },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Items premium: 40 + 25 = 65
      // First insurance: +10% of 65 = +6.5
      // Loyalty discount: -20% of 65 = -13
      // Premium before fee: 65 + 6.5 - 13 = 58.5
      // Processing fee: +5 = 63.5
      // Rounded UP (MHPCO favor): 64
      expect(result.results[0].premium).toBe(64);
    });

    it("should compute 165 G for newcomer with cursed sword (integration)", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(165);
    });

    it("should compute 160 G for long-standing customer second contract with cursed enchanted sword (integration)", () => {
      const scenario = {
        customer: { years: 3 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      };
      const result = processScenario(scenario);
      // Step 0: sword base 100, surcharge +10, loyalty -20, no follow-up, +5 fee = 95
      // Step 1: items premium 100+50+30=180, policy base 100, surcharge +10, loyalty -20, follow-up -15, +5 fee = 160
      expect(result.results[1].premium).toBe(160);
    });
  });

  describe("claim", () => {
    it("should subtract 100 G deductible from damage for a standard item", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[0].premium).toBe(115);
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });

    it("should reimburse at 50% for items with enchantment level 8 or above then apply deductible", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "curse",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });

    it("should fully reimburse dragon material items then apply deductible", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(700);
      expect(result.results[1].remainingCap).toBe(1300);
    });

    it("should apply 50% rule when both dragon material and enchantment >= 8 apply", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "curse",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(400);
      expect(result.results[1].remainingCap).toBe(1600);
    });

    it("should apply 100 G deductible per damaged item when multiple items are damaged", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "claim",
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
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(600);
      expect(result.results[1].remainingCap).toBe(2600);
    });

    it("should cap total payout at twice the insurance sum", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });

    it("should reduce payout to remaining cap when cap is partially exhausted by prior claim", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // First claim: 1500 - 100 deductible = 1400, cap 2000 - 1400 = 600 remaining
      expect(result.results[1].payout).toBe(1400);
      expect(result.results[1].remainingCap).toBe(600);
      // Second claim: desired 1400 but only 600 cap left, payout capped at 600
      expect(result.results[2].payout).toBe(600);
      expect(result.results[2].remainingCap).toBe(0);
    });

    it("should round payout down to whole G in MHPCO favor", () => {
      const scenario = {
        customer: { years: 0 },
        steps: [
          {
            type: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            type: "claim",
            policy: 0,
            incident: {
              cause: "curse",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      };
      const result = processScenario(scenario);
      // 501 * 0.5 = 250.5 (high enchantment), minus 100 deductible = 150.5
      // Rounded DOWN (MHPCO favor for payouts): 150
      expect(result.results[1].payout).toBe(150);
      expect(result.results[1].remainingCap).toBe(1850);
    });
  });
});
