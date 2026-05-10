import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { quote, claim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote - empty and processing fee", () => {
    it("should return 5 G premium for an empty item list (just the processing fee)", () => {
      expect(quote({ yearsWithMHPCO: 0, items: [] })).toBe(5);
    });
  });

  describe("Quote - single main items (base premiums + 5 G fee)", () => {
    it("should return 105 G for a single plain sword", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toBe(105);
    });
    it("should return 65 G for a single plain amulet", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "amulet", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toBe(65);
    });
    it("should return 85 G for a single plain staff", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "staff", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toBe(85);
    });
    it("should return 45 G for a single plain potion", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "potion", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toBe(45);
    });
  });

  describe("Quote - components (runes and moonstones)", () => {
    it("should charge 25 G base premium per single rune (1 rune → 30 G total)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "rune", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toBe(30);
    });
    it("should charge 50 G base premium for 2 runes (no block) → 55 G total", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(55);
    });
    it("should charge 60 G base premium for a block of 3 alike runes → 65 G total", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(65);
    });
    it("should charge 100 G base premium for 4 runes (no block, exactly 3 required) → 105 G total", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(105);
    });
    it("should charge 175 G base premium for 7 runes (one block of 3 + 4 singles) → 180 G total", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(180);
    });
    it("should charge 75 G base premium for 2 runes + 1 moonstone (different types do not form a block) → 80 G total", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(80);
    });
    it("should charge 120 G base premium for 3 runes + 3 moonstones (two separate blocks) → 125 G total", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
            { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
            { type: "moonstone", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(125);
    });
  });

  describe("Quote - item-specific modifiers", () => {
    it("should add 50% curse surcharge on the cursed item's base premium (cursed sword → 100 + 50 + 5 = 155 G)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        })
      ).toBe(155);
    });
    it("should add 30% high-enchantment surcharge for enchantment exactly 5 (sword e=5 → 100 + 30 + 5 = 135 G)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        })
      ).toBe(135);
    });
    it("should NOT add high-enchantment surcharge for enchantment 4 (sword e=4 → 105 G)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        })
      ).toBe(105);
    });
    it("should stack curse and high-enchantment surcharges on the same item (cursed sword e=5 → 100+50+30+5 = 185 G)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        })
      ).toBe(185);
    });
  });

  describe("Quote - policy-wide modifiers", () => {
    it("should apply 20% loyalty discount for customer with exactly 2 years with MHPCO", () => {
      expect(
        quote({
          yearsWithMHPCO: 2,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toBe(85);
    });
    it("should apply 10% first-insurance surcharge per item in the quote", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          applyFirstInsurance: true,
        })
      ).toBe(115);
    });
    it("should apply 15% follow-up contract discount on customer's second quote in the scenario", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          applyFollowUpDiscount: true,
        })
      ).toBe(90);
    });
    it("should apply curse surcharge only to the cursed item's base, not the policy total (cursed sword + plain amulet → 100+60+50+5 = 215 G)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "steel", enchantment: 0, cursed: false },
          ],
        })
      ).toBe(215);
    });
  });

  describe("Quote - rounding", () => {
    it("should round the final premium UP to whole G in MHPCO's favor (197.5 → 198)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
            { type: "rune", material: "steel", enchantment: 0, cursed: false },
          ],
          applyFirstInsurance: true,
        })
      ).toBe(198);
    });
    it("should keep intermediate amounts as fractions and round only the final premium", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "rune", material: "steel", enchantment: 0, cursed: false }],
          applyFirstInsurance: true,
        })
      ).toBe(33);
    });
  });

  describe("Quote - integration examples from the spec", () => {
    it("should compute 165 G for a newcomer (0 yrs, first contract) with a cursed sword (steel, e=3)", () => {
      expect(
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          applyFirstInsurance: true,
        })
      ).toBe(165);
    });
    it("should compute 160 G for a 3-yr customer's second contract with a cursed sword (steel, e=7)", () => {
      expect(
        quote({
          yearsWithMHPCO: 3,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          applyFirstInsurance: true,
          applyFollowUpDiscount: true,
        })
      ).toBe(160);
    });
  });

  describe("Quote - error cases", () => {
    it("should reject a quote with an unknown item type (CLI exits non-zero, error to stderr, no results on stdout)", () => {
      expect(() =>
        quote({
          yearsWithMHPCO: 0,
          items: [{ type: "broomstick", material: "steel", enchantment: 0, cursed: false }],
        })
      ).toThrow();
    });
  });

  describe("Claim - standard reimbursement", () => {
    it("should pay damage minus 100 G deductible for a regular sword (steel, e=3, damage 500 → payout 400)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          damages: [{ itemType: "sword", amount: 500 }],
        }).payout
      ).toBe(400);
    });
    it("should pay damage minus 100 G deductible for a damaged rune (damage 200 → payout 100)", () => {
      expect(
        claim({
          items: [{ type: "rune", material: "steel", enchantment: 0, cursed: false }],
          damages: [{ itemType: "rune", amount: 200 }],
        }).payout
      ).toBe(100);
    });
  });

  describe("Claim - high enchantment clause (≥8)", () => {
    it("should reimburse 50% then subtract deductible for steel sword e=9, damage 1000 → payout 400", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
          damages: [{ itemType: "sword", amount: 1000 }],
        }).payout
      ).toBe(400);
    });
  });

  describe("Claim - dragon material clause", () => {
    it("should fully reimburse minus deductible for dragon sword e=5, damage 800 → payout 700", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          damages: [{ itemType: "sword", amount: 800 }],
        }).payout
      ).toBe(700);
    });
    it("should apply 50% rule before dragon override when enchantment ≥8 (dragon sword e=9, damage 1000 → payout 400)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          damages: [{ itemType: "sword", amount: 1000 }],
        }).payout
      ).toBe(400);
    });
    it("should apply 50% rule at exactly enchantment 8 (dragon sword e=8, damage 1000 → payout 400)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          damages: [{ itemType: "sword", amount: 1000 }],
        }).payout
      ).toBe(400);
    });
  });

  describe("Claim - per-damage deductible", () => {
    it("should apply 100 G deductible per damage entry (sword 500 + amulet 300 → payout 600)", () => {
      expect(
        claim({
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "steel", enchantment: 3, cursed: false },
          ],
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        }).payout
      ).toBe(600);
    });
  });

  describe("Claim - cap based on insurance sum", () => {
    it("should set cap = 2 × insurance sum (sword 1000 → cap 2000)", () => {
      const result = claim({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        damages: [{ itemType: "sword", amount: 500 }],
      });
      expect(result.remainingCap).toBe(1600);
    });
    it("should base cap on unmodified insurance values, not premium modifiers (cursed sword → cap 2000)", () => {
      const result = claim({
        items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        damages: [{ itemType: "sword", amount: 500 }],
      });
      expect(result.payout).toBe(400);
      expect(result.remainingCap).toBe(1600);
    });
    it("should base cap on insurance sum without block discount (sword + 3 runes → insurance sum 1750, cap 3500)", () => {
      const result = claim({
        items: [
          { type: "sword", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
          { type: "rune", material: "steel", enchantment: 0, cursed: false },
        ],
        damages: [{ itemType: "sword", amount: 200 }],
      });
      expect(result.payout).toBe(100);
      expect(result.remainingCap).toBe(3400);
    });
  });

  describe("Claim - cap exhaustion across successive claims", () => {
    it("should reduce successive payouts to remaining cap (sword cap 2000, two 1500 claims → 1400 then 600, remainingCap 0)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false } as const;
      const r1 = claim({
        items: [sword],
        damages: [{ itemType: "sword", amount: 1500 }],
      });
      expect(r1.payout).toBe(1400);
      expect(r1.remainingCap).toBe(600);
      const r2 = claim({
        items: [sword],
        damages: [{ itemType: "sword", amount: 1500 }],
        remainingCap: r1.remainingCap,
      });
      expect(r2.payout).toBe(600);
      expect(r2.remainingCap).toBe(0);
    });
  });

  describe("Claim - rounding", () => {
    it("should round the final payout DOWN to whole G in MHPCO's favor (350.5 → 350)", () => {
      expect(
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
          damages: [{ itemType: "sword", amount: 901 }],
        }).payout
      ).toBe(350);
    });
  });

  describe("Claim - multiple items of same type", () => {
    it("should treat each damage entry of the same type as a separate event with its own deductible (two insured swords, two damages)", () => {
      const sword = { type: "sword", material: "steel", enchantment: 0, cursed: false } as const;
      const result = claim({
        items: [sword, sword],
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      });
      expect(result.payout).toBe(800);
      expect(result.remainingCap).toBe(3200);
    });
    it("should reject the claim when damages contain more entries of a type than the policy covers (CLI exits non-zero)", () => {
      expect(() =>
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ],
        })
      ).toThrow();
    });
  });

  describe("Claim - error cases", () => {
    it("should reject a claim referencing an item not part of the policy (CLI exits non-zero, error to stderr)", () => {
      expect(() =>
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          damages: [{ itemType: "amulet", amount: 300 }],
        })
      ).toThrow();
    });
    it("should reject a claim with a negative damage amount (CLI exits non-zero, error to stderr)", () => {
      expect(() =>
        claim({
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          damages: [{ itemType: "sword", amount: -200 }],
        })
      ).toThrow();
    });
  });

  describe("CLI - scenario processing", () => {
    it("should read a JSON scenario from stdin and write a results array of the same length and order to stdout", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      };
      const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      expect(result.status).toBe(0);
      expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
    });
    it("should resolve a claim's `policy` field to the zero-based step index of an earlier quote", () => {
      const scenario = {
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
      };
      const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results).toHaveLength(2);
      expect(parsed.results[1]).toMatchObject({ payout: 400, remainingCap: 1600 });
    });
    it("should treat each item in a quote as a first insurance (per-item 10% surcharge applies regardless of customer history)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results[0]).toEqual({ premium: 115 });
    });
    it("should apply the follow-up contract discount only on the customer's quotes after their first quote in the scenario", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
          },
        ],
      };
      const result = spawnSync("pnpm", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf-8",
      });
      expect(result.status).toBe(0);
      const parsed = JSON.parse(result.stdout);
      expect(parsed.results).toHaveLength(2);
      expect(parsed.results[0]).toEqual({ premium: 115 });
      expect(parsed.results[1]).toEqual({ premium: 100 });
    });
  });
});
