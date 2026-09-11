import { describe, it, expect } from "vitest";
import { runScenario, type Result } from "./claim-office.js";

const asClaimResult = (result: Result): { payout: number; remainingCap: number } =>
  result as { payout: number; remainingCap: number };
const asQuoteResult = (result: Result): { premium: number } => result as { premium: number };

describe("MHPCO Claim Office", () => {
  describe("Quote — basics", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(5);
    });
    it("single plain sword, newcomer, first insurance → premium 115 G (100 base + 10 first insurance = 110 + 5 fee = 115)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(115);
    });
    it("single plain amulet, no modifiers besides first insurance → base 60 G + 10% first insurance + 5 fee = 71 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(71);
    });
    it("single staff, newcomer → premium 93 G (80 base + 10% first insurance = 88 + 5 fee = 93)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(93);
    });
    it("single potion, newcomer → premium 49 G (40 base + 10% first insurance = 44 + 5 fee = 49)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(49);
    });
  });

  describe("Quote — components and building blocks", () => {
    it("2 runes, newcomer → premium 60 G (base 50 = 2×25, no block; +10% first insurance = 55 + 5 fee = 60)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(60);
    });
    it("3 runes, newcomer → premium 71 G (base 60 block price; +10% first insurance = 66 + 5 fee = 71)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(71);
    });
    it("4 runes, newcomer → premium 115 G (base 100 = 4×25, no block; +10% first insurance = 110 + 5 fee = 115)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(115);
    });
    it("7 runes, newcomer → premium 198 G (base 175 = 7×25, no block; +10% first insurance = 192.5 + 5 fee = 197.5, rounded up to 198)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(198);
    });
    it("2 runes + 1 moonstone, newcomer → premium 88 G (base 75 = 2×25+1×25, no block; +10% = 82.5 + 5 fee = 87.5, rounded up to 88)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(88);
    });
    it("3 runes + 3 moonstones, newcomer → premium 137 G (base 120 = two blocks of 60; +10% = 132 + 5 fee = 137)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
              { type: "moonstone" },
              { type: "moonstone" },
              { type: "moonstone" },
            ],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(137);
    });
  });

  describe("Quote — item-specific modifiers", () => {
    it("cursed sword, newcomer → premium 165 G (base 100 + 50 curse + 10 first insurance = 160 + 5 fee = 165)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(165);
    });
    it("highly enchanted sword (enchantment 5), newcomer → premium 145 G (base 100 + 30 enchantment + 10 first insurance = 140 + 5 fee = 145)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(145);
    });
    it("sword with enchantment 4, newcomer → premium 115 G (no high-enchantment surcharge; base 100, +10% = 110 + 5 fee = 115)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(115);
    });
    it("sword with enchantment 5 and cursed, newcomer → premium 195 G (base 100 + 50 curse + 30 enchantment + 10 first insurance = 190 + 5 fee = 195)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(195);
    });
  });

  describe("Quote — policy-wide modifiers and scope", () => {
    it("policy with cursed sword + plain amulet, newcomer → premium 231 G (policy base 160 + 50 curse (on sword's own base) = 210; +10% of base 160 = 16 → 226 + 5 fee = 231)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(231);
    });
    it("customer with exactly 2 years with MHPCO → premium 95 G (base 100 + 10 first insurance - 20 loyalty = 90 + 5 fee = 95)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(95);
    });
    it("customer with 1 year with MHPCO → premium 115 G (no loyalty discount; base 100, +10% = 110 + 5 fee = 115)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(115);
    });
    it("first quote in a scenario with two quote steps → premium 115 G (base 100, +10% first insurance = 110 + 5 fee = 115, no follow-up discount)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(115);
    });
    it("second quote in a scenario for the same customer → premium 100 G (base 100 + 10 first insurance - 15 follow-up = 95 + 5 fee = 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
        ],
      });
      expect(asQuoteResult(result.results[1]).premium).toBe(100);
    });
  });

  describe("Quote — rounding", () => {
    it("potion + rune, newcomer → premium 77 G (base 65 = 40+25; +10% first insurance = 71.5 + 5 fee = 76.5, rounded up to 77)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion" }, { type: "rune" }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(77);
    });
  });

  describe("Quote — integration examples", () => {
    it("newcomer with cursed sword (steel, enchantment 3) → premium 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(asQuoteResult(result.results[0]).premium).toBe(165);
    });
    it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → premium 160 G (100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion" }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(asQuoteResult(result.results[1]).premium).toBe(160);
    });
  });

  describe("Quote — error cases", () => {
    it("quote includes an item with unknown type (e.g. broomstick) → runScenario throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        })
      ).toThrow();
    });
  });

  describe("Claim — cap and insurance sum", () => {
    it("policy with sword + amulet → cap 3200 G (insurance sum 1000+600=1600, cap = 2x)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).remainingCap).toBe(3200);
    });
    it("policy with two swords → cap 4000 G (insurance sum 2×1000=2000, cap = 2x)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).remainingCap).toBe(4000);
    });
    it("policy with sword + 3 runes (a block) → cap 3500 G (insurance sum 1000+3×250=1750; block discount affects premium only, not insurance sum)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).remainingCap).toBe(3500);
    });
    it("cursed sword (insurance value 1000 G, premium with modifiers 165 G) → cap 2000 G (unmodified insurance value; premium modifiers do not raise the cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).remainingCap).toBe(2000);
    });
  });

  describe("Claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(400);
      expect(asClaimResult(result.results[1]).remainingCap).toBe(1600);
    });
    it("damage to a rune, damage 200 G → payout 100 G (200 - 100 deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(100);
    });
  });

  describe("Claim — special clauses", () => {
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (50% high-enchantment reimbursement, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(400);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins, then deductible: 500 - 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(400);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (only dragon-material clause applies: full reimbursement, then deductible: 800 - 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(700);
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause applies: 50% first, then deductible: 500 - 100)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(400);
    });
  });

  describe("Claim — deductible per damage event", () => {
    it("dragon attack damages an insured sword (500 G) and amulet (300 G) → payout 600 G (100 G deductible applies once per damaged item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "amulet", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(600);
    });
    it("two swords insured; damages array contains two separate sword damage entries → each entry gets its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
              { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(600);
    });
  });

  describe("Claim — cap exhaustion across successive claims", () => {
    it("sword insured (cap 2000 G); first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(1400);
      expect(asClaimResult(result.results[1]).remainingCap).toBe(600);
    });
    it("same policy, second claim of 1500 G after first → payout 600 G, remainingCap 0 G (desired 1400 G reduced to remaining cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[2]).payout).toBe(600);
      expect(asClaimResult(result.results[2]).remainingCap).toBe(0);
    });
  });

  describe("Claim — rounding", () => {
    it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });
      expect(asClaimResult(result.results[1]).payout).toBe(350);
    });
  });

  describe("Claim — error cases", () => {
    it("claim references a damage entry whose item is not part of the policy → runScenario throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
            },
          ],
        })
      ).toThrow();
    });
    it("claim references a damage entry with an unknown item type → runScenario throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
            },
          ],
        })
      ).toThrow();
    });
    it("damages array contains more entries of a type than the policy covers (two sword damages, one sword insured) → runScenario throws", () => {
      expect(() =>
        runScenario({
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
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        })
      ).toThrow();
    });
    it("claim contains a damage entry with amount: -200 → runScenario throws", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        })
      ).toThrow();
    });
  });

  describe("CLI — end-to-end schema", () => {
    it("schema example from spec: single amulet quote then claim → results array matches {premium} then {payout, remainingCap} shape", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      });
      expect(result.results).toHaveLength(2);
      expect(typeof (result.results[0] as { premium: number }).premium).toBe("number");
      expect(typeof (result.results[1] as { payout: number }).payout).toBe("number");
      expect(typeof (result.results[1] as { remainingCap: number }).remainingCap).toBe("number");
    });
    it("results array has same length and order as input steps array", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] },
          { op: "quote", items: [{ type: "potion" }] },
        ],
      });
      expect(result.results).toHaveLength(3);
      expect(typeof (result.results[0] as { premium: number }).premium).toBe("number");
      expect(typeof (result.results[1] as { premium: number }).premium).toBe("number");
      expect(typeof (result.results[2] as { premium: number }).premium).toBe("number");
    });
  });
});
