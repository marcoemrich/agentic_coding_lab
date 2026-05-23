import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote — base premiums and edge cases", () => {
    it("empty item list → premium 5 G (only processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single plain sword for newcomer → 100 base + 10 first-insurance + 5 fee = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("single amulet for newcomer → 60 + 6 first-ins + 5 fee = 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("single staff for newcomer → 80 + 8 first-ins + 5 fee = 93 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("single potion for newcomer → 40 + 4 first-ins + 5 fee = 49 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("Quote — component blocks", () => {
    it("2 runes → 50 G base + 5 first-ins + 5 fee = 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base (block) + 6 first-ins + 5 fee = 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base (no block) + 10 first-ins + 5 fee = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base + 17.5 first-ins + 5 fee = 197.5 → 198 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        }],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base + 7.5 first-ins + 5 fee = 87.5 → 88 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base + 12 first-ins + 5 fee = 137 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("Quote — premium modifiers", () => {
    it("cursed sword (newcomer) → 100 + 50 curse + 10 first-ins + 5 fee = 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword ench 5 (newcomer) → 100 + 30 high-ench + 10 first-ins + 5 fee = 145 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword ench 4 (newcomer) → 100 + 10 first-ins + 5 fee = 115 G (no high-ench)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword ench 5 (newcomer) → 100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee = 195 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("long-standing customer (3 years) sword → 100 - 20 loyalty + 10 first-ins + 5 fee = 95 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with exactly 2 years sword → 100 - 20 loyalty + 10 first + 5 fee = 95 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("first insurance: newcomer sword premium reflects +10% on base = 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("second quote is follow-up: sword (newcomer-style: 0 yrs) → 100 + 10 first - 15 follow + 5 = 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("cursed sword + plain amulet (newcomer) → 100+60 base + 50 curse + 16 first + 5 = 231 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote — rounding", () => {
    it("premium 197.5 G → final 198 G (rounded up; covered by 7 runes test)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
  });

  describe("Quote — integration examples", () => {
    it("integration 1: newcomer (0 yrs) cursed sword steel ench 3 → 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("integration 2: 3-yr customer's 2nd quote, cursed sword steel ench 7 → 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      const secondQuote = (result as { results: { premium: number }[] }).results[1];
      expect(secondQuote).toEqual({ premium: 160 });
    });
  });

  describe("Quote — errors", () => {
    it("unknown item type (broomstick) → throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
  });

  describe("Claim — standard reimbursement", () => {
    it("regular sword damage 500 → payout 400 (500 - 100 deductible); cap 2000 → remaining 1600", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      const claimResult = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claimResult).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune damage 200 → payout 100 (200 - 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "spell", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("Claim — special clauses", () => {
    it("high-ench sword (ench 8, steel), damage 1000 → 400 (50% then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fight", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword (ench 5), damage 800 → 700 (dragon only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fight", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("dragon sword ench 9 damage 1000 → 400 (50% rule wins)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fight", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("steel sword ench 9 damage 1000 → 400 (50% then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fight", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon sword ench 8 damage 1000 → 400 (high-ench applies, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fight", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon clause: dragon sword ench 3, damage 500 → 400", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fight", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("Claim — deductible per event/item", () => {
    it("attack: sword(500) + amulet(300) → payout 600 (deductible per item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim?.payout).toBe(600);
    });
  });

  describe("Claim — multiple items of same type", () => {
    it("policy with two swords → cap 4000; after two sword damages (500 each) → payout 800, remaining 3200", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 800, remainingCap: 3200 });
    });
    it("damages array with more entries of a type than covered → throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Claim — cap exhaustion", () => {
    it("sword+amulet policy: cap 3200 (1600 × 2)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 100, remainingCap: 3100 });
    });
    it("cursed sword: cap is 2000 (unmodified insurance value × 2)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", cursed: true }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 100, remainingCap: 1900 });
    });
    it("sword + 3 runes (block): insurance sum 1750, cap 3500 — block doesn't affect cap", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it("sword cap 2000; two claims of 1500 each → 1400 then 600; remaining 0", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      const results = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results;
      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("Claim — payout rounding", () => {
    it("payout 350.5 → 350 (rounded down): dragon sword ench 8, damage 901 → 350.5 → 350", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });
      const claim = (result as { results: Array<{ payout?: number; remainingCap?: number }> }).results[1];
      expect(claim?.payout).toBe(350);
    });
  });

  describe("Claim — errors", () => {
    it("damage references item not in policy → throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
            },
          ],
        }),
      ).toThrow();
    });
    it("damage with negative amount → throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      ).toThrow();
    });
  });
});
