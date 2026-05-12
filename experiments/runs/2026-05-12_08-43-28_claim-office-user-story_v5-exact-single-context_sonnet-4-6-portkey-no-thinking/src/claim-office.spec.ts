import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums", () => {
    it("should return base premium + processing fee for a single sword (new customer, first contract)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // sword base: 100, +10% initial assessment: 110, +5 processing fee = 115
      expect(result.results[0].premium).toBe(115);
    });
    it("should return correct base premium for an amulet", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // amulet base: 60, +10% initial assessment: 66, +5 processing fee = 71
      expect(result.results[0].premium).toBe(71);
    });
    it("should return correct base premium for a staff", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // staff base: 80, +10% initial assessment: 88, +5 processing fee = 93
      expect(result.results[0].premium).toBe(93);
    });
    it("should return correct base premium for a potion", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // potion base: 40, +10% initial assessment: 44, +5 processing fee = 49
      expect(result.results[0].premium).toBe(49);
    });
    it("should return correct base premium for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "component", material: "crystal", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // component base: 25, +10% initial assessment: 27.5 → floor = 27, +5 processing fee = 32
      expect(result.results[0].premium).toBe(32);
    });
    it("should return special rate for 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "component", material: "rune", enchantment: 0, cursed: false },
              { type: "component", material: "rune", enchantment: 0, cursed: false },
              { type: "component", material: "rune", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 3 alike components: special base 60, +10% initial assessment: 66, +5 processing fee = 71
      expect(result.results[0].premium).toBe(71);
    });
  });

  describe("Quote — surcharges and discounts", () => {
    it("should add 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // sword base: 100, cursed +50%: 150, +10% initial assessment: 165, +5 fee = 170
      expect(result.results[0].premium).toBe(170);
    });
    it("should add 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // sword base: 100, highly enchanted +30%: 130, +10% initial assessment: 143, +5 fee = 148
      expect(result.results[0].premium).toBe(148);
    });
    it("should give 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // sword base: 100, loyalty -20%: 80, +10% initial assessment: 88, +5 fee = 93
      expect(result.results[0].premium).toBe(93);
    });
    it("should add 10% initial assessment surcharge on first contract", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // sword base: 100, +10% initial assessment: 110, +5 processing fee = 115
      expect(result.results[0].premium).toBe(115);
    });
    it("should give 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
        ],
      });
      // first contract (step 0): sword base 100 + 10% assessment = 110 + 5 fee = 115
      expect(result.results[0].premium).toBe(115);
      // second contract (step 1): sword base 100, -15% repeat = 85, no initial assessment, +5 fee = 90
      expect(result.results[1].premium).toBe(90);
    });
  });

  describe("Quote — multiple items", () => {
    it("should sum premiums for multiple items and add a single processing fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      // sword base 100 + amulet base 60 = 160, +10% initial assessment: 176, +5 fee = 181
      expect(result.results[0].premium).toBe(181);
    });
  });

  describe("Claim — basic payout", () => {
    it("should deduct 100 G deductible from damage amount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // sword insurance value: 1000, cap = 2000
      // damage 300 - 100 deductible = 200 payout, remainingCap = 2000 - 200 = 1800
      expect(result.results[1].payout).toBe(200);
      expect(result.results[1].remainingCap).toBe(1800);
    });
    it("should cap total payout at twice the insurance sum of the policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "catastrophe",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // sword insurance value: 1000, cap = 2000
      // damage 2500 - 100 deductible = 2400, capped at 2000, remainingCap = 0
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should reimburse at 50% for items with enchantment level >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "sword", enchantment: 8, amount: 400 }],
            },
          },
        ],
      });
      // damage 400, enchantment >= 8 so 50% reimbursement: effective damage = 200
      // payout = 200 - 100 deductible = 100, cap = 2000, remainingCap = 1900
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1900);
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", material: "dragon", enchantment: 9, amount: 400 }],
            },
          },
        ],
      });
      // dragon material: full reimbursement overrides the enchantment >= 8 reduction
      // payout = 400 - 100 deductible = 300 (not 400*0.5=200-100=100), cap = 2000, remainingCap = 1700
      expect(result.results[1].payout).toBe(300);
      expect(result.results[1].remainingCap).toBe(1700);
    });
  });

  describe("Claim — remaining cap tracking", () => {
    it("should track remaining cap after a claim and reduce it for subsequent claims", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", material: "steel", enchantment: 3, amount: 600 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", material: "steel", enchantment: 3, amount: 800 }],
            },
          },
        ],
      });
      // sword insurance value: 1000, payoutCap = 2000
      // claim 1: damage 600 - 100 deductible = 500 payout, remainingCap = 2000 - 500 = 1500
      expect(result.results[1].payout).toBe(500);
      expect(result.results[1].remainingCap).toBe(1500);
      // claim 2: damage 800 - 100 deductible = 700, remainingCap was 1500, min(700, 1500) = 700, remainingCap = 1500 - 700 = 800
      expect(result.results[2].payout).toBe(700);
      expect(result.results[2].remainingCap).toBe(800);
    });
  });
});
