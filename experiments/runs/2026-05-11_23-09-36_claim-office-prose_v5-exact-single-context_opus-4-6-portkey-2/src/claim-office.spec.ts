import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote Premium", () => {
    it("should compute base premium for a single sword with first-insurance surcharge and processing fee", () => {
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
      // sword base premium: 100G
      // first insurance surcharge: +10% → 110G
      // processing fee: +5G → 115G
      expect(result.results[0].premium).toBe(115);
    });
    it("should compute base premium for each item type (amulet, staff, potion)", () => {
      const quoteAmulet = processScenario({
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
      // amulet base premium: 60G
      // first insurance surcharge: +10% → 66G
      // processing fee: +5G → 71G
      expect(quoteAmulet.results[0].premium).toBe(71);

      const quoteStaff = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "oak", enchantment: 1, cursed: false },
            ],
          },
        ],
      });
      // staff base premium: 80G
      // first insurance surcharge: +10% → 88G
      // processing fee: +5G → 93G
      expect(quoteStaff.results[0].premium).toBe(93);

      const quotePotion = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // potion base premium: 40G
      // first insurance surcharge: +10% → 44G
      // processing fee: +5G → 49G
      expect(quotePotion.results[0].premium).toBe(49);
    });
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
      // sword base premium: 100G
      // cursed surcharge: +50% → 150G
      // first insurance: +10% → 165G
      // processing fee: +5G → 170G
      expect(result.results[0].premium).toBe(170);
    });
    it("should add 30% surcharge for highly enchanted item (enchantment >= 5)", () => {
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
      // sword base premium: 100G
      // enchantment surcharge (>=5): +30% → 130G
      // first insurance: +10% → 143G
      // processing fee: +5G → 148G
      expect(result.results[0].premium).toBe(148);
    });
    it("should apply 20% loyalty discount for long-standing customer (>= 2 years)", () => {
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
      // sword base premium: 100G
      // first insurance: +10% → 110G
      // loyalty discount: -20% → 88G
      // processing fee: +5G → 93G
      expect(result.results[0].premium).toBe(93);
    });
    it("should apply 15% discount on subsequent contracts after the first", () => {
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
      // First quote: sword 100G, first insurance +10% → 110G, +5G fee → 115G
      expect(result.results[0].premium).toBe(115);
      // Second quote: sword 100G, subsequent -15% → 85G, +5G fee → 90G
      expect(result.results[1].premium).toBe(90);
    });
    it("should sum premiums for multiple items in a single quote", () => {
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
      // sword 100G + amulet 60G = 160G
      // first insurance: +10% → 176G
      // processing fee: +5G → 181G
      expect(result.results[0].premium).toBe(181);
    });
    it("should compute component premium at 25G each and 60G for a block of 3 alike", () => {
      // 2 runes: individual pricing
      const twoRunes = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 2 × 25G = 50G, first insurance +10% → 55G, +5G fee → 60G
      expect(twoRunes.results[0].premium).toBe(60);

      // 3 alike runes: block pricing
      const threeRunes = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // block of 3 runes: 60G, first insurance +10% → 66G, +5G fee → 71G
      expect(threeRunes.results[0].premium).toBe(71);
    });
    it("should round amounts in MHPCO's favor (ceiling for premiums)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // rune base: 25G
      // first insurance: +10% → 27.5G
      // processing fee: +5G → 32.5G
      // rounded up (MHPCO's favor): 33G
      expect(result.results[0].premium).toBe(33);
    });
  });

  describe("Process Claims", () => {
    it("should apply 100G deductible to a basic damage claim", () => {
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
      // sword insurance value: 1000G, cap: 2000G
      // damage: 300G, deductible: 100G → payout: 200G
      // remaining cap: 2000 - 200 = 1800G
      expect(result.results[1].payout).toBe(200);
      expect(result.results[1].remainingCap).toBe(1800);
    });
    it("should cap total payout at twice the insurance sum", () => {
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
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // sword insurance: 1000G, cap: 2000G
      // damage: 2500G, deductible: 100G → uncapped payout: 2400G
      // capped at 2000G
      expect(result.results[1].payout).toBe(2000);
      expect(result.results[1].remainingCap).toBe(0);
    });
    it("should reimburse damage to high-enchantment items (>= 8) at 50%", () => {
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
              damages: [{ itemType: "sword", amount: 400, enchantment: 8 }],
            },
          },
        ],
      });
      // damage: 400G at 50% → 200G effective damage
      // deductible: 100G → payout: 100G
      expect(result.results[1].payout).toBe(100);
    });
    it("should fully reimburse damage to dragon material items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "dragon", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "tavern brawl",
              damages: [{ itemType: "sword", amount: 400, material: "dragon" }],
            },
          },
        ],
      });
      // dragon material: fully reimbursed (no deductible reduction for this damage)
      // damage: 400G, fully reimbursed → 400G effective
      // deductible: 100G → payout: 300G
      expect(result.results[1].payout).toBe(300);
    });
  });

  describe("CLI Integration", () => {
    it("should read JSON from stdin and write results JSON to stdout", async () => {
      const { execSync } = await import("node:child_process");
      const input = JSON.stringify({
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
      const stdout = execSync("node_modules/.bin/tsx src/cli.ts", {
        input,
        encoding: "utf-8",
      });
      const output = JSON.parse(stdout);
      expect(output.results[0].premium).toBe(115);
    });
  });
});
