import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quoting a premium", () => {
    it("should calculate base premium for a single sword plus processing fee", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Sword base premium: 100G
      // First insurance surcharge: 10% -> 100 * 1.10 = 110G
      // Processing fee: 5G
      // Total: 115G
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("should calculate base premium for each main item type (amulet, staff, potion)", () => {
      // Amulet: 60G base, first insurance +10% = 66G + 5G fee = 71G
      const amuletResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(amuletResult.results[0]).toEqual({ premium: 71 });

      // Staff: 80G base, first insurance +10% = 88G + 5G fee = 93G
      const staffResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(staffResult.results[0]).toEqual({ premium: 93 });

      // Potion: 40G base, first insurance +10% = 44G + 5G fee = 49G
      const potionResult = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      expect(potionResult.results[0]).toEqual({ premium: 49 });
    });
    it("should calculate base premium for a single component", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Component (rune) base premium: 25G
      // First insurance surcharge: 10% -> ceil(25 * 10 / 100) = ceil(2.5) = 3G
      // Premium so far: 28G
      // Processing fee: 5G
      // Total: 33G
      expect(result.results[0]).toEqual({ premium: 33 });
    });
    it("should apply building block premium for 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 3 alike components = building block: 60G special premium (not 3 × 25 = 75G)
      // First insurance surcharge: 10% -> ceil(60 * 10 / 100) = 6G
      // Premium so far: 66G
      // Processing fee: 5G
      // Total: 71G
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("should combine premiums for multiple items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Sword: 100G + Amulet: 60G = 160G base
      // First insurance surcharge: ceil(160 * 10 / 100) = 16G
      // Premium: 176G + 5G fee = 181G
      expect(result.results[0]).toEqual({ premium: 181 });
    });
    it("should add 50% surcharge for cursed items", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // Sword base: 100G
      // Cursed surcharge: 50% -> ceil(100 * 50 / 100) = 50G
      // Item premium: 150G
      // First insurance surcharge: ceil(150 * 10 / 100) = 15G
      // Premium: 165G + 5G fee = 170G
      expect(result.results[0]).toEqual({ premium: 170 });
    });
    it("should add 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // Staff base: 80G
      // Enchantment surcharge (level >= 5): 30% -> ceil(80 * 30 / 100) = 24G
      // Item premium: 104G
      // First insurance surcharge: ceil(104 * 10 / 100) = ceil(10.4) = 11G
      // Premium: 115G + 5G fee = 120G
      expect(result.results[0]).toEqual({ premium: 120 });
    });
    it("should apply both cursed and enchantment surcharges when both apply", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "amulet", material: "silver", enchantment: 6, cursed: true },
            ],
          },
        ],
      });
      // Amulet base: 60G
      // Cursed surcharge: ceil(60 * 50 / 100) = 30G -> 90G
      // Enchantment surcharge (level 6 >= 5): ceil(90 * 30 / 100) = 27G -> 117G
      // First insurance surcharge: ceil(117 * 10 / 100) = ceil(11.7) = 12G -> 129G
      // Processing fee: 5G
      // Total: 134G
      expect(result.results[0]).toEqual({ premium: 134 });
    });
    it("should apply 20% loyalty discount for long-standing customers (>= 2 years)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // Sword base: 100G
      // First insurance surcharge: ceil(100 * 10 / 100) = 10G -> 110G
      // Loyalty discount (>= 2 years): floor(110 * 20 / 100) = 22G -> 88G
      // Processing fee: 5G
      // Total: 93G
      expect(result.results[0]).toEqual({ premium: 93 });
    });
    it("should apply 10% initial assessment surcharge for first insurance", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First quote (potion): 40G base + ceil(40*10/100)=4G surcharge = 44G + 5G = 49G
      expect(result.results[0]).toEqual({ premium: 49 });
      // Second quote (sword): NO first insurance surcharge, 15% subsequent discount
      // 100G base - floor(100*15/100)=15G = 85G + 5G fee = 90G
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it("should apply 15% discount on contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First quote (potion): 40G + 10% first surcharge = 44G + 5G fee = 49G
      expect(result.results[0]).toEqual({ premium: 49 });
      // Second quote (sword): 100G base, no first surcharge, 15% discount = floor(100*15/100) = 15G off -> 85G + 5G fee = 90G
      expect(result.results[1]).toEqual({ premium: 90 });
    });
    it("should round amounts in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote" as const,
            items: [
              { type: "rune", material: "stone", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First quote (potion, loyal, first contract):
      // 40G base + ceil(40*10/100)=ceil(4.0)=4G surcharge = 44G
      // Loyalty: floor(44*20/100)=floor(8.8)=8G discount -> 36G
      // Fee: 5G -> 41G
      // (ceil rounds UP charges, floor rounds DOWN discounts = MHPCO's favor)
      expect(result.results[0]).toEqual({ premium: 41 });

      // Second quote (rune, loyal, subsequent contract):
      // 25G base component
      // Subsequent: floor(25*15/100)=floor(3.75)=3G discount -> 22G
      // Loyalty: floor(22*20/100)=floor(4.4)=4G discount -> 18G
      // Fee: 5G -> 23G
      expect(result.results[1]).toEqual({ premium: 23 });
    });
  });

  describe("Processing a claim", () => {
    it("should apply 100G deductible per damage event", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      // Quote result: sword 115G premium
      expect(result.results[0]).toEqual({ premium: 115 });
      // Claim: 300G damage - 100G deductible = 200G payout
      // Cap: 2 * 1000G (sword value) = 2000G, remaining: 2000G - 200G = 1800G
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
    });
    it("should cap total payout at twice the insurance sum", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "potion", material: "glass", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "potion", amount: 1000 }],
            },
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 49 });
      // Damage: 1000G - 100G deductible = 900G raw payout
      // Cap: 2 * 400G (potion value) = 800G
      // Payout capped at 800G, remaining cap: 0G
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
    });
    it("should reimburse at 50% for items with enchantment level >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "staff", material: "wood", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "magical overload",
              damages: [{ itemType: "staff", amount: 400 }],
            },
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 120 });
      // Staff enchantment 8 >= 8: reimbursed at 50%
      // Effective damage: floor(400 * 50 / 100) = 200G
      // Deductible: 100G
      // Payout: 200 - 100 = 100G
      // Cap: 2 * 800 = 1600G, remaining: 1600 - 100 = 1500G
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1500 });
    });
    it("should fully reimburse damage to items made of dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "battle damage",
              damages: [{ itemType: "sword", amount: 400 }],
            },
          },
        ],
      });
      // Sword base: 100G + 30% enchantment = 130G + 10% first = 143G + 5G = 148G
      expect(result.results[0]).toEqual({ premium: 148 });
      // Dragon material: fully reimbursed (overrides 50% enchantment rule)
      // 400G damage at 100% = 400G - 100G deductible = 300G payout
      // Cap: 2 * 1000 = 2000G, remaining: 2000 - 300 = 1700G
      expect(result.results[1]).toEqual({ payout: 300, remainingCap: 1700 });
    });
    it("should track remaining cap across multiple claims on the same policy", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "theft",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 115 });
      // Claim 1: 300 - 100 deductible = 200G payout, cap 2000, remaining 1800
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
      // Claim 2: 500 - 100 deductible = 400G payout, remaining cap from 1800: 1800 - 400 = 1400
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 1400 });
    });
  });

  describe("CLI integration", () => {
    it("should process a quote step and return premium", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output.trim());
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("should process a quote followed by a claim and return both results", () => {
      const { execSync } = require("child_process");
      const input = JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [{ itemType: "sword", amount: 300 }],
            },
          },
        ],
      });
      const output = execSync(`echo '${input}' | npx tsx src/cli.ts`, {
        encoding: "utf-8",
      });
      const result = JSON.parse(output.trim());
      // Quote: sword 100G + 10% first surcharge = 110G + 5G fee = 115G
      // Claim: 300G - 100G deductible = 200G payout, cap 2*1000=2000, remaining 1800
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { payout: 200, remainingCap: 1800 },
        ],
      });
    });
  });
});
