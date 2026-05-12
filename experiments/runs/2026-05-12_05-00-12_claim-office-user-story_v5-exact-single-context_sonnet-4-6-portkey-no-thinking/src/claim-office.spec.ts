import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should quote a single sword with base premium plus processing fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false }
            ]
          }
        ]
      });
      // sword base: 100 G, first insurance surcharge: +10% = 110 G, processing fee: +5 G = 115 G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should quote each main item type at its correct base premium", () => {
      const newCustomer = { yearsWithMHPCO: 0 };
      const normalItem = (type: string) => ({ type, material: "steel", enchantment: 3, cursed: false });

      // amulet: 60 base + 10% surcharge = 66 + 5 fee = 71
      expect(processScenario({ customer: newCustomer, steps: [{ op: "quote", items: [normalItem("amulet")] }] }).results[0])
        .toEqual({ premium: 71 });
      // staff: 80 base + 10% surcharge = 88 + 5 fee = 93
      expect(processScenario({ customer: newCustomer, steps: [{ op: "quote", items: [normalItem("staff")] }] }).results[0])
        .toEqual({ premium: 93 });
      // potion: 40 base + 10% surcharge = 44 + 5 fee = 49
      expect(processScenario({ customer: newCustomer, steps: [{ op: "quote", items: [normalItem("potion")] }] }).results[0])
        .toEqual({ premium: 49 });
    });
    it("should quote a single component at 25 G base premium plus processing fee", () => {
      // component: 25 G base + 10% first-insurance surcharge = 27.5 → ceil = 28 G + 5 G fee = 33 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply a special base premium of 60 G for a building block of 3 alike components", () => {
      // 3 alike components = building block: base 60 G + 10% first-insurance surcharge = 66 G + 5 G fee = 71 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should add 50% risk surcharge for cursed items", () => {
      // cursed sword: 100 base * 1.5 cursed = 150 * 1.1 first-insurance = 165 + 5 fee = 170 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% risk surcharge for highly enchanted items (enchantment >= 5)", () => {
      // highly enchanted sword: 100 base * 1.3 enchantment = 130 * 1.1 first-insurance = 143 + 5 fee = 148 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 148 });
    });
    it("should give a 20% loyalty discount to long-standing customers (>= 2 years)", () => {
      // long-standing customer (3 years): 100 base * 0.8 loyalty * 1.1 first-insurance = 88 + 5 fee = 93 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should add a 10% initial assessment surcharge on the first insurance", () => {
      // staff for new customer: 80 base + 10% surcharge = 88 + 5 fee = 93 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should give a 15% discount on each contract after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }]
          },
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }]
          }
        ]
      });
      // first quote: sword 100 * 1.1 + 5 = 115 G
      expect(result.results[0]).toEqual({ premium: 115 });
      // second quote: amulet 60 * 0.85 (multi-contract discount) = 51 + 5 fee = 56 G
      expect(result.results[1]).toEqual({ premium: 56 });
    });
    it("should add a 5 G processing fee to every premium", () => {
      // potion for new customer: 40 base + 10% first-insurance surcharge = 44 + 5 fee = 49 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 49 });
    });
    it("should round premium up to whole G in MHPCO's favor", () => {
      // rune (component): 25 base * 1.1 (first-insurance) = 27.5 → ceil = 28 G + 5 fee = 33 G
      // (27.5 rounds UP to 28 in MHPCO's favor, not down to 27)
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      expect(result.results[0]).toEqual({ premium: 33 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply a 100 G deductible per damage event", () => {
      // amulet insurance value: 600 G, payout cap: 2 * 600 = 1200 G
      // damage: 200 G - 100 G deductible = 100 G payout, remainingCap: 1200 - 100 = 1100 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }]
            }
          }
        ]
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      // amulet insurance value: 600 G, cap: 2 × 600 = 1200 G
      // damage: 1500 G - 100 G deductible = 1400 G → capped at 1200 G
      // remainingCap: 1200 - 1200 = 0 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "amulet", amount: 1500 }] } }
        ]
      });
      expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
    });
    it("should reimburse damage to high enchantment items (>= 8) at 50% of damage amount", () => {
      // sword insurance value: 1000 G, cap: 2 × 1000 = 2000 G
      // damage: 300 G at 50% reimbursement rate = 150 G effective damage
      // payout: 150 - 100 G deductible = 50 G
      // remainingCap: 2000 - 50 = 1950 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] } }
        ]
      });
      expect(result.results[1]).toEqual({ payout: 50, remainingCap: 1950 });
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      // dragon sword with high enchantment (9) — without dragon rule, 50% reduction would apply
      // sword insurance value: 1000 G, cap: 2 × 1000 = 2000 G
      // dragon material overrides 50% enchantment reduction → full reimbursement
      // damage: 400 G - 100 G deductible = 300 G payout
      // remainingCap: 2000 - 300 = 1700 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "theft", damages: [{ itemType: "sword", amount: 400 }] } }
        ]
      });
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should round payout down to whole G in MHPCO's favor", () => {
      // sword insurance value: 1000 G, cap: 2000 G
      // enchantment 9 → 50% reimbursement: effectiveDamage = 201 * 0.5 = 100.5
      // payout = 100.5 - 100 deductible = 0.5 → floor = 0 G (round down in MHPCO's favor)
      // remainingCap: 2000 - 0 = 2000 G
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "curse", damages: [{ itemType: "sword", amount: 201 }] } }
        ]
      });
      expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
    });
    it("should track remaining cap after each claim", () => {
      // amulet insurance value: 600 G, cap: 2 × 600 = 1200 G
      // claim 1: damage 300 - 100 deductible = 200 payout, remainingCap: 1200 - 200 = 1000
      // claim 2: damage 300 - 100 deductible = 200 payout, remainingCap: 1000 - 200 = 800
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] } },
          { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "amulet", amount: 300 }] } }
        ]
      });
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1000 });
      expect(result.results[2]).toEqual({ payout: 200, remainingCap: 800 });
    });
  });
});
