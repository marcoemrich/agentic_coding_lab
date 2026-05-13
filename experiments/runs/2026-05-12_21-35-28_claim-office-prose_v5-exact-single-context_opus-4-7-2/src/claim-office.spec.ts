import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("quotes a single sword for a new customer (base 100 + 10% first-insurance + 5G fee)", () => {
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
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("quotes each main item type (sword 1000/100, amulet 600/60, staff 800/80, potion 400/40)", () => {
      const quoteFor = (type: string) =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type, material: "steel", enchantment: 0, cursed: false }],
            },
          ],
        });
      // Each base premium * 1.10 (first-insurance surcharge) rounded up + 5G fee
      expect(quoteFor("sword")).toEqual({ results: [{ premium: 115 }] }); // 100*1.1=110, +5
      expect(quoteFor("amulet")).toEqual({ results: [{ premium: 71 }] }); // 60*1.1=66, +5
      expect(quoteFor("staff")).toEqual({ results: [{ premium: 93 }] }); // 80*1.1=88, +5
      expect(quoteFor("potion")).toEqual({ results: [{ premium: 49 }] }); // 40*1.1=44, +5
    });
    it("quotes 3 alike components as a special block (60G base premium instead of 75G)", () => {
      const result = processScenario({
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
      // Block of 3 alike components: 60G base. *1.10 first = 66, +5 = 71
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("adds 50% surcharge for a cursed item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
            ],
          },
        ],
      });
      // 100 * 1.5 (cursed) * 1.10 (first-insurance) = 165, +5 fee = 170
      expect(result).toEqual({ results: [{ premium: 170 }] });
    });
    it("adds 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
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
      // 100 * 1.30 (highly enchanted) * 1.10 (first-insurance) = 143, +5 = 148
      expect(result).toEqual({ results: [{ premium: 148 }] });
    });
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // 100 * 0.80 (loyalty) * 1.10 (first-insurance) = 88, +5 fee = 93
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("applies 15% discount on contracts after the first", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // First: 100 * 1.10 (first-insurance) = 110, +5 = 115
      // Second: 100 * 0.85 (after-first) = 85, +5 = 90
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 90 }],
      });
    });
    it("rounds the final premium up (in MHPCO's favor)", () => {
      // 1 rune = 25G base. First-insurance: 25 * 1.10 = 27.5 → ceil = 28. +5 = 33.
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
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("claim", () => {
    it("reimburses damage minus 100G deductible for a normal item", () => {
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
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // Sword insurance sum 1000, cap = 2000. Damage 500 - 100 deductible = 400.
      // Remaining cap = 2000 - 400 = 1600.
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("reimburses 50% of damage for items with enchantment >= 8", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "wood", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "explosion",
              damages: [{ itemType: "staff", amount: 600 }],
            },
          },
        ],
      });
      // Staff insurance 800, cap 1600. High enchant: 600 * 0.5 = 300, - 100 deductible = 200.
      // Remaining cap = 1600 - 200 = 1400.
      expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1400 });
    });
    it("reimburses 100% of damage for items made of dragon material", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "staff", material: "dragon", enchantment: 8, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "trap",
              damages: [{ itemType: "staff", amount: 600 }],
            },
          },
        ],
      });
      // Dragon material overrides 50% enchant rule. Full reimbursement: 600 - 100 = 500.
      // Remaining cap = 1600 - 500 = 1100.
      expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1100 });
    });
    it("caps total payout per policy at twice the insurance sum", () => {
      const result = processScenario({
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
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1700 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // Sword insurance 1000, cap = 2000.
      // First claim: 1700 - 100 = 1600 payout. Remaining cap = 400.
      // Second claim: 1000 - 100 = 900 would be paid, but cap is 400.
      // So payout = 400, remaining cap = 0.
      expect(result.results[1]).toEqual({ payout: 1600, remainingCap: 400 });
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 0 });
    });
  });
});
