import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should quote a single sword for a new customer's first policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      // Sword base premium: 100G
      // First policy: +10% initial assessment surcharge → 110G
      // Processing fee: +5G → 115G
      expect(result.results[0].premium).toBe(115);
    });
    it("should quote a single amulet for a new customer's first policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      // Amulet base premium: 60G
      // First policy: +10% initial assessment surcharge → 66G
      // Processing fee: +5G → 71G
      expect(result.results[0].premium).toBe(71);
    });
    it("should quote multiple items for a new customer's first policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      // Sword base: 100G + Amulet base: 60G = 160G total base
      // First policy: +10% initial assessment surcharge → 160 * 110/100 = 176G
      // Processing fee: +5G → 181G
      expect(result.results[0].premium).toBe(181);
    });
    it("should add a 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true }
            ]
          }
        ]
      });
      // Sword base: 100G
      // Cursed: +50% risk surcharge → 100 * 150/100 = 150G
      // First policy: +10% initial assessment surcharge → 150 * 110/100 = 165G
      // Processing fee: +5G → 170G
      expect(result.results[0].premium).toBe(170);
    });
    it("should add a 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
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
      // Sword base: 100G
      // Enchantment >= 5: +30% risk surcharge → 100 * 130/100 = 130G
      // First policy: +10% initial assessment surcharge → 130 * 110/100 = 143G
      // Processing fee: +5G → 148G
      expect(result.results[0].premium).toBe(148);
    });
    it("should apply a 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      // Amulet base: 60G
      // First contract: +10% initial assessment surcharge → 66G
      // Loyalty discount (3 years >= 2): -20% → 66 * 80/100 = 52.8 → ceil = 53G
      // Processing fee: +5G → 58G
      expect(result.results[0].premium).toBe(58);
    });
    it("should apply a 15% discount on contracts after the first", () => {
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
      // Second contract (step index 1): no initial assessment surcharge
      // Amulet base: 60G
      // Multi-contract discount: -15% → 60 * 85/100 = 51G
      // Processing fee: +5G → 56G
      expect(result.results[1].premium).toBe(56);
    });
    it("should quote component items at 25G base premium each", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "moonstone", material: "crystal", enchantment: 0, cursed: false }
            ]
          }
        ]
      });
      // Components (rune, moonstone): 25G each → total base = 50G
      // First contract: +10% assessment → 55G
      // Processing fee: +5G → 60G
      expect(result.results[0].premium).toBe(60);
    });
    it("should apply special 60G base premium for a group of 3 alike components", () => {
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
      // 3 alike runes → special group base premium of 60G (not 3 × 25G = 75G)
      // First contract: +10% assessment → 66G
      // Processing fee: +5G → 71G
      expect(result.results[0].premium).toBe(71);
    });
  });

  describe("Processing a claim", () => {
    it("should process a basic claim applying the 100G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false }
            ]
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
      // Amulet insurance value: 600G → policy cap: 2 × 600 = 1200G
      // Damage: 200G, deductible: 100G → payout: 100G
      // Remaining cap: 1200 - 100 = 1100G
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
    });
    it("should cap claim payout at twice the policy insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false }
            ]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "amulet", amount: 1500 }]
            }
          }
        ]
      });
      // Amulet insurance value: 600G → policy cap: 2 × 600 = 1200G
      // Damage: 1500G, deductible: 100G → raw payout: 1400G
      // Capped at policy cap: 1200G → remaining cap: 0G
      expect(result.results[1].payout).toBe(1200);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should reimburse at 50% for items with enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "silver", enchantment: 8, cursed: false }
            ]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 400 }]
            }
          }
        ]
      });
      // Amulet insurance: 600G → policy cap: 1200G
      // Damage: 400G, enchantment >= 8: reimburse at 50% → effective damage: 200G
      // Deductible: 100G → payout: 100G
      // Remaining cap: 1200 - 100 = 1100G
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "amulet", material: "dragon", enchantment: 0, cursed: false }
            ]
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 300 }]
            }
          }
        ]
      });
      // Amulet insurance: 600G → policy cap: 1200G
      // Dragon material: fully reimbursed (no deductible applies)
      // Damage: 300G → payout: 300G
      // Remaining cap: 1200 - 300 = 900G
      expect(result.results[1].payout).toBe(300);
      expect(result.results[1].remainingCap).toBe(900);
    });
  });
});
