import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote", () => {
    it("returns 5G processing fee for an empty item list", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote" as const, items: [] }],
      });
      expect(result.results[0]).toEqual({ premium: 5 });
    });
    it("computes base premium plus fee for a single sword", () => {
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
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("computes base premium plus fee for each item type (amulet, staff, potion)", () => {
      const quoteFor = (type: string, premium: number) => {
        const result = processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type, material: "silver", enchantment: 0, cursed: false },
              ],
            },
          ],
        });
        expect(result.results[0]).toEqual({ premium });
      };
      quoteFor("amulet", 71);
      quoteFor("staff", 93);
      quoteFor("potion", 49);
    });
    it("computes base premium of 25G per component (rune)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 60 });
    });
    it("applies block discount of 60G for exactly 3 alike components", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 71 });
    });
    it("does not apply block discount for components that are not alike", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result.results[0]).toEqual({ premium: 88 });
    });
    it("adds 50% cursed surcharge to the cursed item's base premium only", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: true },
              { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // sword base 100 + 50% curse = 50 surcharge, amulet base 60, raw bases 160
      // first-ins 10% of 160 = 16, total 160+50+16+5 = 231
      expect(result.results[0]).toEqual({ premium: 231 });
    });
    it("adds 30% high-enchantment surcharge for enchantment level >= 5", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 5, cursed: false },
            ],
          },
        ],
      });
      // sword base 100 + 30% enchant surcharge = 30, first-ins 10%(100)=10, total 100+30+10+5 = 145
      expect(result.results[0]).toEqual({ premium: 145 });
    });
    it("applies 20% loyalty discount for customers with >= 2 years", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // sword base 100, loyalty -20%(100)=-20, first-ins +10%(100)=+10, total 100-20+10+5 = 95
      expect(result.results[0]).toEqual({ premium: 95 });
    });
    it("applies 10% first-insurance surcharge to policy base premium", () => {
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
      // sword base 100 + 10% first-insurance = 110 + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
    });
    it("applies 15% follow-up contract discount on second quote", () => {
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
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 0, cursed: false },
            ],
          },
        ],
      });
      // first quote: 100 base + 10%(10) first-ins + 5 fee = 115
      expect(result.results[0]).toEqual({ premium: 115 });
      // second quote: 100 base + 10%(10) first-ins - 15%(15) follow-up + 5 fee = 100
      expect(result.results[1]).toEqual({ premium: 100 });
    });
    it("combines multiple modifiers: cursed sword for newcomer yields 165G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });
      // sword base 100 + cursed 50%(100)=50 + first-ins 10%(100)=10 + 5 fee = 165
      expect(result.results[0]).toEqual({ premium: 165 });
    });
    it("combines multiple modifiers: long-standing customer second contract cursed highly-enchanted sword yields 160G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 5 },
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
              { type: "sword", material: "steel", enchantment: 7, cursed: true },
            ],
          },
        ],
      });
      // second quote: sword base 100, cursed +50, enchant +30
      // policy: first-ins 10%(100)=10, loyalty -20%(100)=-20, follow-up -15%(100)=-15
      // total: 100 + 80 + (-25) + 5 = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
    it("rounds premium up in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "rune" }],
          },
        ],
      });
      // rune base 25, first-ins 10%(25)=2.5, loyalty -20%(25)=-5
      // total: 25 + (2.5 - 5) + 5 = 27.5 → rounded up to 28
      expect(result.results[0]).toEqual({ premium: 28 });
    });
    it("rejects unknown item type with error", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote" as const,
              items: [
                { type: "dragon_egg", material: "obsidian", enchantment: 0, cursed: false },
              ],
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("claim", () => {
    it("applies 100G deductible per damaged item", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon_attack",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      // sword insurance value 1000G, cap 2000G
      // damage 500 - 100 deductible = 400 payout
      // remaining cap = 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("fully reimburses dragon-material items minus deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "dragon", enchantment: 5, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon_attack",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      // dragon-material: full reimbursement, then deductible: 800 - 100 = 700
      // insurance sum 1000, cap 2000, remaining 2000 - 700 = 1300
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("reimburses 50% for items with enchantment >= 8 then applies deductible", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "dragon_attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // enchantment >= 8: 50% of 1000 = 500, then deductible: 500 - 100 = 400
      // insurance sum 1000, cap 2000, remaining 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("applies 50% rule when item is both dragon-material and enchantment >= 8", () => {
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
              cause: "dragon_attack",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      // both dragon-material and enchantment >= 8: 50% wins
      // 50% of 1000 = 500, then deductible: 500 - 100 = 400
      // insurance sum 1000, cap 2000, remaining 2000 - 400 = 1600
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("caps total payout at twice the insurance sum", () => {
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
              cause: "dragon_attack",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });
      // sword insurance value 1000, cap 2000
      // damage 2500 - 100 deductible = 2400, capped at 2000
      // remaining cap = 0
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("tracks remaining cap across multiple claims on same policy", () => {
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
              cause: "dragon_attack",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      // first claim: 1500 - 100 = 1400, cap 2000 - 1400 = 600
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      // second claim: 1500 - 100 = 1400, capped at 600, remaining 0
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
    it("rounds payout down in MHPCO's favor", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [
              { type: "sword", material: "steel", enchantment: 9, cursed: false },
            ],
          },
          {
            op: "claim" as const,
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      });
      // enchantment >= 8: 50% of 501 = 250.5, deductible: 250.5 - 100 = 150.5
      // rounded down to 150
      expect(result.results[1]).toEqual({ payout: 150, remainingCap: expect.any(Number) });
    });
    it("rejects claim for item not covered by policy", () => {
      expect(() =>
        processScenario({
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
                cause: "theft",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("rejects claim with more damages of a type than insured", () => {
      expect(() =>
        processScenario({
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
                cause: "dragon_attack",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
    it("rejects claim with negative damage amount", () => {
      expect(() =>
        processScenario({
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
                cause: "accident",
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });
});
