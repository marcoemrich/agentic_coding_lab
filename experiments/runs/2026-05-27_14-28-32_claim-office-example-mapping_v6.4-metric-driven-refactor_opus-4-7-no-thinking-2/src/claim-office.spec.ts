import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote: base premiums for single items", () => {
    it("empty item list → premium 5 G (processing fee only)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("single sword (newcomer) → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("single amulet (newcomer) → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("single staff (newcomer) → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("single potion (newcomer) → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
  });

  describe("quote: components and building blocks", () => {
    it("1 rune (newcomer) → premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, ceil up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("2 runes (newcomer) → premium 60 G (50 base + 5 first insurance + 5 fee, no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes (newcomer) → premium 71 G (60 block base + 6 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes (newcomer) → premium 115 G (100 base + 10 first insurance + 5 fee, no block)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes (newcomer) → premium 198 G (175 base + 17.5 first insurance + 5 fee = 197.5, ceil up)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone (newcomer) → premium 88 G (75 base + 7.5 first insurance + 5 fee, no block: different types)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones (newcomer) → premium 137 G (60 + 60 = 120 base + 12 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "rune" }, { type: "rune" }, { type: "rune" },
              { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote: item-specific modifiers", () => {
    it("cursed sword (newcomer) → premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment 5 (newcomer) → premium 145 G (100 base + 30 high enchantment + 10 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 (newcomer) → premium 115 G (no high-enchantment surcharge)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 (newcomer) → premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
      });
      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
  });

  describe("quote: policy-wide modifiers", () => {
    it("sword, customer with exactly 2 years → premium 95 G (100 base + 10 first insurance − 20 loyalty + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("sword, customer with 1 year → premium 115 G (no loyalty discount)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("sword + amulet (newcomer) → first insurance applies to policy base 160 → 16 G surcharge", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }],
      });
      expect(result).toEqual({ results: [{ premium: 181 }] });
    });
    it("two quote steps (newcomer): second contract gets 15% follow-up discount", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(result).toEqual({
        results: [
          { premium: 115 },
          { premium: 100 },
        ],
      });
    });
    it("long-standing customer's second contract — first insurance applies on the new sword anyway: cursed sword (enchantment 7), 3 years, second quote → 160 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote: modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet (newcomer) → premium 231 G (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", cursed: true },
              { type: "amulet" },
            ],
          },
        ],
      });
      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("quote: rounding and fee", () => {
    it.todo("5 G processing fee is added at the very end (covered by single-item tests)");
    it.todo("premium 197.5 rounds up to 198 (covered by 7-runes test)");
  });

  describe("quote: integration examples", () => {
    it("newcomer with cursed sword (steel, enchantment 3), 0 years → premium 165 G", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
      });
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("long-standing customer's second contract: cursed sword (steel, enchantment 7), 3 years → premium 160 G (already covered by earlier integration test)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
        ],
      });
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("quote: errors", () => {
    it("unknown item type throws an error", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
  });

  describe("claim: insurance sum and cap", () => {
    it.todo("policy with sword: insurance sum 1000, cap 2000");
    it.todo("policy with sword + amulet: insurance sum 1600, cap 3200");
    it("policy with sword + 3 runes: insurance sum 1750, cap 3500 (block does not affect insurance sum)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
              { type: "rune" }, { type: "rune" }, { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
    });
    it.todo("cursed sword: cap based on unmodified insurance value (2000, not derived from modified premium)");
    it("policy with two swords: cap 4000, dragon attack damages both → payout 800, remainingCap 3200", () => {
      const result = processScenario({
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
      expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
    });
  });

  describe("claim: standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 → payout 400, remainingCap 1600", () => {
      const result = processScenario({
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
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("rune (no enchantment, no material), damage 200 → payout 100, remainingCap 400", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim: deductible per damage event", () => {
    it("dragon attack damages sword 500 and amulet 300 → payout 600 (deductible per damage event)", () => {
      const result = processScenario({
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
      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim: special reimbursement clauses", () => {
    it("dragon-material sword (enchantment 9), damage 1000 → payout 400 (50% wins over full, then 100 deductible)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword (enchantment 5), damage 800 → payout 700 (full reimbursement, then 100 deductible)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword (enchantment 9), damage 1000 → payout 400 (50%, then 100 deductible)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword (enchantment 8 exactly), damage 1000 → payout 400 (high-enchantment threshold inclusive)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim: cap exhaustion across successive claims", () => {
    it("sword (cap 2000): two successive 1500 claims → payouts 1400 then 600, cap exhausted", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim: rounding", () => {
    it("sword enchant 9, damage 901 → payout 350 (901×0.5 − 100 = 350.5, rounded down)", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
          },
        ],
      });
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim: errors", () => {
    it("damage references item type not in the policy throws", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 100 }] },
            },
          ],
        }),
      ).toThrow();
    });
    it("damage with negative amount throws", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      ).toThrow();
    });
    it("more damage entries of a type than insured items of that type throws", () => {
      expect(() =>
        processScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon",
                damages: [
                  { itemType: "sword", amount: 200 },
                  { itemType: "sword", amount: 200 },
                ],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("multi-step scenarios", () => {
    it("claim step references the correct quote step by zero-based policy index", () => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "amulet" }] },
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 1,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      });
      expect(result.results[2]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });
});
