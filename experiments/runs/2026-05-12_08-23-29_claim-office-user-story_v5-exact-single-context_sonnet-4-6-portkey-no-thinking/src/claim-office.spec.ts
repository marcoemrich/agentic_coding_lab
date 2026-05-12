import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should quote a single sword for a new customer: base premium + processing fee + initial assessment surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      // sword base premium: 100G
      // first insurance surcharge: +10% = 10G
      // processing fee: 5G
      // total: 115G
      expect(result.results[0].premium).toBe(115);
    });
    it("should quote a single amulet for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      });
      // amulet base premium: 60G
      // first insurance surcharge: +10% = 6G
      // processing fee: 5G
      // total: 71G
      expect(result.results[0].premium).toBe(71);
    });
    it("should quote a single staff for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      });
      // staff base premium: 80G
      // first insurance surcharge: +10% = 8G
      // processing fee: 5G
      // total: 93G
      expect(result.results[0].premium).toBe(93);
    });
    it("should quote a single potion for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      // potion base premium: 40G
      // first insurance surcharge: +10% = 4G
      // processing fee: 5G
      // total: 49G
      expect(result.results[0].premium).toBe(49);
    });
    it("should quote a single component for a new customer", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "component", material: "rune", enchantment: 0, cursed: false }],
          },
        ],
      });
      // component base premium: 25G
      // first insurance surcharge: +10% = 2.5G -> Math.ceil(32.5) = 33G
      // processing fee: 5G
      // total: Math.ceil(25 + 2.5 + 5) = Math.ceil(32.5) = 33G
      expect(result.results[0].premium).toBe(33);
    });
    it("should quote 3 alike components as a building block with special premium", () => {
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
      // 3 alike components = building block, special base premium: 60G
      // first insurance surcharge: +10% = 6G
      // processing fee: 5G
      // total: Math.ceil(60 + 6 + 5) = 71G
      expect(result.results[0].premium).toBe(71);
    });
    it("should apply 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      // sword base premium: 100G
      // cursed surcharge: +50% of base = 50G
      // first insurance surcharge: +10% of base = 10G
      // processing fee: 5G
      // total: Math.ceil(100 + 50 + 10 + 5) = 165G
      expect(result.results[0].premium).toBe(165);
    });
    it("should apply 30% surcharge for a highly enchanted item (level >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      // sword base premium: 100G
      // highly enchanted surcharge: +30% of base = 30G
      // first insurance surcharge: +10% of base = 10G
      // processing fee: 5G
      // total: Math.ceil(100 + 30 + 10 + 5) = 145G
      expect(result.results[0].premium).toBe(145);
    });
    it("should apply 20% loyalty discount for long-standing customer (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      });
      // sword base premium: 100G
      // long-standing customer (>= 2 years): loyalty discount -20% of base = -20G
      // NOT first insurance (has 2+ years), no 10% initial assessment surcharge
      // processing fee: 5G
      // total: Math.ceil(100 - 20 + 5) = 85G
      expect(result.results[0].premium).toBe(85);
    });
    it("should apply 15% discount on second and subsequent contracts", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      });
      // sword base premium: 100G
      // yearsWithMHPCO=1: NOT first insurance (no 10% surcharge)
      // yearsWithMHPCO=1: NOT long-standing (no 20% loyalty discount)
      // subsequent contract discount: -15% of base = -15G
      // processing fee: 5G
      // total: Math.ceil(100 - 15 + 5) = 90G
      expect(result.results[0].premium).toBe(90);
    });
    it("should add 5G processing fee to every premium", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      // potion base premium: 40G
      // first insurance surcharge: +10% = 4G
      // processing fee: 5G
      // total: Math.ceil(40 + 4 + 5) = 49G
      expect(result.results[0].premium).toBe(49);
    });
    it("should round all amounts to whole G in MHPCO's favor (ceiling)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "component", material: "rune", enchantment: 0, cursed: false }],
          },
        ],
      });
      // component base premium: 25G
      // first insurance surcharge: +10% = 2.5G (fractional)
      // processing fee: 5G
      // total before ceil: 32.5G → Math.ceil(32.5) = 33G (MHPCO's favor)
      expect(result.results[0].premium).toBe(33);
    });
  });

  describe("Processing a claim", () => {
    it("should pay out damage minus 100G deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
      });
      // amulet insurance sum: 600G, cap = 2 * 600 = 1200G
      // damage: 200G, deductible: 100G, payout = 200 - 100 = 100G
      // remainingCap = 1200 - 100 = 1100G
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // sword insurance sum: 1000G, cap = 2 * 1000 = 2000G
      // damage: 2500G, deductible: 100G, uncapped payout = 2400G > cap 2000G
      // payout capped at 2000G, remainingCap = 0G
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should reimburse at 50% for items with enchantment level >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell backfire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // sword insurance sum: 1000G, cap = 2000G
      // enchantment >= 8: 50% reimbursement — effective damage = 500 * 0.5 = 250G
      // payout = 250 - 100 (deductible) = 150G
      // remainingCap = 2000 - 150 = 1850G
      expect(result.results[1].payout).toBe(150);
      expect(result.results[1].remainingCap).toBe(1850);
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // dragon material: fully reimbursed — no deductible applied
      // sword insurance sum: 1000G, cap = 2000G
      // payout = 300G (full damage, no deductible)
      // remainingCap = 2000 - 300 = 1700G
      expect(result.results[1].payout).toBe(300);
      expect(result.results[1].remainingCap).toBe(1700);
    });
    it("should track remaining cap across multiple claims on same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "spell mishap",
              damages: [{ itemType: "amulet", amount: 250 }],
            },
          },
        ],
      });
      // amulet insurance sum: 600G, cap = 2 * 600 = 1200G
      // claim 1: damage 200G, deductible 100G, payout = 100G, remainingCap = 1100G
      // claim 2: damage 250G, deductible 100G, payout = 150G, remainingCap = 1100 - 150 = 950G
      expect(result.results[1].payout).toBe(100);
      expect(result.results[1].remainingCap).toBe(1100);
      expect(result.results[2].payout).toBe(150);
      expect(result.results[2].remainingCap).toBe(950);
    });
  });
});
