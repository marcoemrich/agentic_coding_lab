import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote - base premiums", () => {
    it("empty item list yields premium of 5 G (processing fee only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single plain sword yields 100 G base + 10 G first insurance + 5 G fee = 115 G for newcomer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("single plain amulet yields 60 G base + 6 G first insurance + 5 G fee = 71 G for newcomer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("single plain staff yields 80 G base + 8 G first insurance + 5 G fee = 93 G for newcomer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("single plain potion yields 40 G base + 4 G first insurance + 5 G fee = 49 G for newcomer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("single rune yields 25 G base + 3 G first insurance (rounded up) + 5 G fee = 33 G for newcomer", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote - component building blocks", () => {
    it("2 runes yields 50 G base premium (no block)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      // 50 base + 5 first ins + 5 fee = 60 G
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes yields 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      // 60 block base + 6 first ins + 5 fee = 71 G
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes yields 100 G base premium (no block)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      // 100 base + 10 first ins + 5 fee = 115 G
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("3 runes + 3 moonstones yields 120 G base premium (two separate blocks)", () => {
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
      // 120 base + 12 first ins + 5 fee = 137 G
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote - item modifiers", () => {
    it("cursed sword adds 50% surcharge on that item's base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      // 100 base + 50 curse + 10 first ins + 5 fee = 165 G
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment 5 adds 30% high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      // 100 base + 30 ench + 10 first ins + 5 fee = 145 G
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 does not add high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      // 100 base + 0 ench + 10 first ins + 5 fee = 115 G
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 stacks both surcharges", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      });
      // 100 base + 50 curse + 30 ench + 10 first ins + 5 fee = 195 G
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
  });

  describe("quote - policy modifiers", () => {
    it("customer with 2 years receives 20% loyalty discount on policy base", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      // 100 base - 20 loyalty + 10 first ins + 5 fee = 95 G
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("first insurance surcharge applies on policy base (sword + amulet)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
      });
      // 160 base + 16 first ins + 5 fee = 181 G
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("second contract gets 15% follow-up discount on policy base", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      // first: 100 base + 10 first ins + 5 fee = 115 G
      // second: 100 base + 10 first ins - 15 follow-up + 5 fee = 100 G
      expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
  });

  describe("quote - integration examples", () => {
    it("newcomer with cursed steel sword (enchantment 3) yields premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("3-year customer's second quote of cursed sword enchantment 7 yields premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      // second: 100 base + 50 curse + 30 ench - 20 loyalty + 10 first ins - 15 follow-up + 5 fee = 160 G
      const results = (result as { results: Array<{ premium: number }> }).results;
      expect(results[1]).toEqual({ premium: 160 });
    });
    it("cursed sword + plain amulet for newcomer yields 232 G total premium", () => {
      // Per spec: 160 G policy base + 50 G curse (only on sword) = 210 G before policy modifiers
      // newcomer: + 16 first ins (10% of 160) + 5 fee = 231 G + 50 curse = 231 G... let me recompute
      // base=160, curse=50, first ins=16 (10% of 160), no loyalty, no follow-up, fee=5
      // total = 160 + 50 + 16 + 5 = 231 G
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        }],
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote - rounding", () => {
    it("premium that yields fractional amount is rounded up in MHPCO's favor", () => {
      // calculation yielding 197.5 → 198
      // sword + 2 runes: base 150, + 15 first ins (15) + 5 fee = 170. No fractional.
      // Use: cursed staff (base 80) for 1-year customer
      // base=80, curse=40, first ins=8, fee=5 = 133. Not fractional.
      // Need fractional. cursed rune: base 25, curse 12.5, first ins 2.5, fee 5 = 45 G. ceil(45)=45.
      // cursed sword enchantment 5: 100 + 50 + 30 + 10 + 5 = 195. No.
      // 1 rune for newcomer: 25 + 2.5 + 5 = 32.5 → ceil 33. Already tested.
      // Use: 1 cursed rune. base=25, curse=12.5, first ins=2.5, fee=5 = 45 G. ceil(45)=45.
      // 1 cursed rune enchantment 5: 25 + 12.5 + 7.5 + 2.5 + 5 = 52.5 → ceil = 53.
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune", cursed: true, enchantment: 5 }] }],
      });
      // 25 base + 12.5 curse + 7.5 ench + 2.5 first ins + 5 fee = 52.5 → 53 G
      expect(result).toEqual({ results: [{ premium: 53 }] });
    });
  });

  describe("claim - base payouts", () => {
    it("regular steel sword enchantment 3 with 500 G damage yields payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
        ],
      });
      // premium 115, payout = 500 - 100 deductible = 400
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 400 });
    });
    it("rune with 200 G damage yields payout 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
        ],
      });
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 100 });
    });
    it("dragon-material sword enchantment 8 with 1000 G damage yields payout 400 G (50% then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 400 });
    });
    it("dragon-material sword enchantment 5 with 800 G damage yields payout 700 G (full minus deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
        ],
      });
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 700 });
    });
    it("steel sword enchantment 9 with 1000 G damage yields payout 400 G (50% then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
        ],
      });
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 400 });
    });
  });

  describe("claim - multiple damages", () => {
    it("dragon attack on sword (500 G) and amulet (300 G) yields payout 600 G (deductible per item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ]}},
        ],
      });
      // (500-100) + (300-100) = 400 + 200 = 600
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 600 });
    });
    it("two swords in policy, both damaged yields per-item deductible applied", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 400 },
            { itemType: "sword", amount: 600 },
          ]}},
        ],
      });
      // (400-100) + (600-100) = 800
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 800 });
    });
  });

  describe("claim - rounding", () => {
    it("payout that yields fractional amount is rounded down in MHPCO's favor", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 701 }] } },
        ],
      });
      // 701 * 0.5 = 350.5; - 100 = 250.5; floor = 250
      const results = (result as { results: Array<unknown> }).results;
      expect(results[1]).toEqual({ payout: 250 });
    });
  });

  describe("error handling", () => {
    it("quote with unknown item type throws an error", () => {
      expect(() => runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })).toThrow();
    });
    it("claim referencing item not in policy throws an error", () => {
      expect(() => runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
        ],
      })).toThrow();
    });
    it("claim with negative damage amount throws an error", () => {
      expect(() => runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      })).toThrow();
    });
    it("claim with more damages of a type than insured throws an error", () => {
      expect(() => runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ] } },
        ],
      })).toThrow();
    });
  });
});
