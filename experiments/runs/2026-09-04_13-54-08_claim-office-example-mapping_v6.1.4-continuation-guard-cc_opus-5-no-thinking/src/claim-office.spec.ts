import { describe, it, expect } from "vitest";
import { runScenario, type Scenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium: 5 }] });
    });
    // premium = base + 10 % initial assessment surcharge + 5 G processing fee
    it.each([
      { type: "sword", base: 100, premium: 115 },
      { type: "amulet", base: 60, premium: 71 },
      { type: "staff", base: 80, premium: 93 },
      { type: "potion", base: 40, premium: 49 },
      { type: "rune", base: 25, premium: 33 },
      { type: "moonstone", base: 25, premium: 33 },
    ])("a single $type → base premium $base G", ({ type, premium }) => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type }] }],
      };

      expect(runScenario(scenario)).toEqual({ results: [{ premium }] });
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      };

      // 2 × 25 = 50 base (no block: requires exactly 3)
      // 50 + 5 initial assessment = 55, + 5 fee = 60
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      };

      // block of 3 alike components → 60 base (not 3 × 25 = 75)
      // 60 + 6 initial assessment = 66, + 5 fee = 71
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
      };

      // 4 × 25 = 100 base (the block does not apply to a subset of 3)
      // 100 + 10 initial assessment = 110, + 5 fee = 115
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
      };

      // 7 × 25 = 175 base (the block does not repeat: not 2 blocks + 1)
      // 175 + 17.5 initial assessment = 192.5, + 5 fee = 197.5 → rounds up to 198
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      };

      // Pins "alike" = the SAME TYPE, not the same family: 3 components but
      // no block, because the rune group is 2 and the moonstone group is 1.
      // 3 × 25 = 75 base; 75 + 7.5 = 82.5, + 5 fee = 87.5 → rounds up to 88
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              ...Array.from({ length: 3 }, () => ({ type: "rune" })),
              ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
            ],
          },
        ],
      };

      // each type forms its own block: 60 + 60 = 120 base
      // 120 + 12 initial assessment = 132, + 5 fee = 137
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword → 50 % risk surcharge on that item's base premium", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      };

      // Spec's "Newcomer with a cursed sword" integration example:
      // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G
      // Note the 10 G is 10 % of the policy BASE premium (100), not of 150 —
      // policy-wide modifiers apply to the sum of item base premiums.
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with enchantment 5 → 30 % high-enchantment surcharge applies", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      };

      // enchantment exactly 5 is the threshold boundary (>= 5), so it applies
      // 100 base + 30 high enchantment + 10 initial assessment (10 % of the
      // unmodified 100) = 140, + 5 fee = 145
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      };

      // pins the lower side of the >= 5 threshold: 4 does not qualify
      // 100 base + 10 initial assessment = 110, + 5 fee = 115
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 → both surcharges apply", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      };

      // Both surcharges stack ADDITIVELY — each is a percentage of the same
      // 100 G base, not compounded (compounding would give 197.5, not 195).
      // 100 base + 50 curse + 30 high enchantment = 180,
      // + 10 initial assessment (10 % of the unmodified 100) = 190, + 5 fee = 195
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };

      // exactly 2 years is the threshold boundary (>= 2), so loyalty applies
      // loyalty and initial assessment are both rates on the unmodified base 100:
      // 100 − 20 loyalty + 10 initial assessment = 90, + 5 fee = 95
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      };

      // pins the lower side of the >= 2 year threshold: 1 year does not qualify
      // 100 base + 10 initial assessment = 110, + 5 fee = 115
      expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }] });
    });
    it.todo("first insurance → 10 % initial assessment surcharge on the policy base premium");
    it("the customer's second quote → additional 15 % follow-up contract discount", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      };

      // The discount applies from the SECOND contract onward. Both quotes still
      // get the initial assessment surcharge — the spec's second integration
      // example (3 years, second quote) includes it alongside the follow-up discount.
      // step 0: 100 base + 10 initial assessment = 110, + 5 fee = 115
      // step 1: 100 base + 10 initial assessment − 15 follow-up = 95, + 5 fee = 100
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it.todo(
      "cursed sword (100 G) + plain amulet (60 G) → policy base 160 G; curse adds 50 G (50 % of the cursed item only) → 210 G before further modifiers and fee",
    );
  });

  describe("quote — rounding in the MHPCO's favour", () => {
    it.todo("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)");
    it.todo("intermediate amounts are kept as fractions; only the final premium is rounded");
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
        ],
      };

      // No special clause: enchantment 3 < 8, steel is not dragon material.
      // Full reimbursement minus the 100 G deductible: 500 − 100 = 400
      // Insurance sum 1000 → cap 2000; after the payout, 2000 − 400 = 1600
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("damage to a rune (no enchantment or material), damage 200 G → payout 100 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
          },
        ],
      };

      // Runes have no enchantment level or material, so no special clause applies.
      // 200 − 100 deductible = 100
      // Insurance sum 250 → cap 500; after the payout, 500 − 100 = 400
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon clause only)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      };

      // Premium is 145, not 115: enchantment 5 crosses the >= 5 PREMIUM
      // surcharge threshold (100 + 30 + 10 + 5). That is a pricing rule and is
      // unrelated to the claim clauses, whose threshold is enchantment >= 8.
      //
      // Payout: enchantment 5 < 8, so no 50 % clause; dragon material means
      // full reimbursement, then the deductible: 800 − 100 = 700.
      // Insurance sum 1000 → cap 2000; after the payout, 2000 − 700 = 1300
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % clause, then deductible)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      };

      // Premium 145: enchantment 9 crosses the >= 5 premium surcharge threshold.
      //
      // Payout: enchantment 9 >= 8 and steel is not dragon, so only the 50 %
      // clause applies — halve FIRST, then deduct: 1000 × 0.5 = 500, − 100 = 400
      // Insurance sum 1000 → cap 2000; after the payout, 2000 − 400 = 1600
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (50 % clause at the threshold)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      };

      // Enchantment exactly 8 pins the lower boundary of the CLAIM clause
      // (>= 8) — distinct from the premium surcharge threshold of >= 5.
      // The 50 % clause applies and wins over dragon material:
      // 1000 × 0.5 = 500, − 100 deductible = 400
      // Insurance sum 1000 → cap 2000; after the payout, 2000 − 400 = 1600
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over dragon material)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      };

      // Both clauses apply; the 50 % rule wins, then the deductible:
      // 1000 × 0.5 = 500, − 100 = 400
      // With the enchantment-8 case above, this pins that the precedence holds
      // at the threshold and above it.
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (100 G deductible once per damaged item)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
      };

      // premium: base 100 + 60 = 160, + 16 initial assessment = 176, + 5 fee = 181
      //
      // The deductible is per damage ENTRY, not per claim — which is what makes
      // this 600 rather than 700: (500 − 100) + (300 − 100) = 400 + 200
      // Insurance sum 1000 + 600 = 1600 → cap 3200; after the payout, 2600
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
    it.todo("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)");
  });

  describe("claim — insurance sum and cap", () => {
    // "sword + amulet → insurance sum 1600 G, cap 3200 G" is covered by the
    // dragon-attack test above, whose remainingCap of 2600 implies cap 3200.
    // "two swords → insurance sum 2000 G, cap 4000 G" is asserted by the
    // two-swords test in "claim — multiple items of the same type" below.
    it("a policy covering a sword and 3 runes → insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
          },
        ],
      };

      // PREMIUM uses the block: 100 (sword) + 60 (block of 3 runes) = 160 base,
      // + 16 initial assessment = 176, + 5 fee = 181.
      //
      // INSURANCE SUM does not: 1000 + 3 × 250 = 1750 → cap 3500. The block
      // discount is a pricing concession, not a reduction in cover.
      // Payout 200 − 100 = 100, so remainingCap 3500 − 100 = 3400 — and that
      // 3400 is what proves the sum is 1750 rather than a discounted figure.
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
      });
    });
    it("a cursed sword → cap 2000 G based on the unmodified insurance value (premium modifiers do not raise the cap)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
          },
        ],
      };

      // Premium and cover are independent quantities. The curse raises the
      // PREMIUM to 165, but the cap is 2 × the UNMODIFIED insurance value
      // (1000) = 2000 — paying more does not buy more cover.
      // Payout 300 − 100 = 200, so remainingCap 2000 − 200 = 1800, which is
      // what rules out a cap derived from the 165 premium or a cursed value.
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 165 }, { payout: 200, remainingCap: 1800 }],
      });
    });
    it("successive claims draw down one shared cap — 1500 G then 1500 G on a 2000 G cap → 1400 then 600", () => {
      const damages = [{ itemType: "sword", amount: 1500 }];
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages } },
          { op: "claim", policy: 0, incident: { cause: "flood", damages } },
        ],
      };

      // Insurance sum 1000 → cap 2000.
      // First claim:  1500 − 100 = 1400 → cap remaining 600
      // Second claim: the desired 1400 is reduced to the remaining cap 600 → 0
      expect(runScenario(scenario)).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covers two swords; two sword damage entries → each is a separate damage with its own deductible (cap 4000 G)", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      };

      // premium: base 200, + 20 initial assessment = 220, + 5 fee = 225
      //
      // Two entries of the same type are two separate damages, each with its
      // own deductible: (500 − 100) + (400 − 100) = 400 + 300 = 700
      // Insurance sum 2 × 1000 = 2000 → cap 4000; remainingCap 4000 − 700 = 3300
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 225 }, { payout: 700, remainingCap: 3300 }],
      });
    });
    it("more damage entries of a type than the policy covers (two sword damages, one sword insured) → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      };

      // The whole claim is rejected. This is the test that makes the CONSUMING
      // match falsifiable — a non-consuming `find` would happily match both
      // entries to the one insured sword and pay out twice for it.
      expect(() => runScenario(scenario)).toThrow(/sword/);
    });
  });

  describe("errors", () => {
    it("quote includes an item with an unknown type (e.g. broomstick) → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      // The message must name the offending type — a useful error, not just a throw.
      expect(() => runScenario(scenario)).toThrow(/broomstick/);
    });
    it("claim references a damage entry whose item is not part of the policy (amulet damaged, only a sword insured) → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      };

      // The regex matters: an undefined-dereference TypeError would satisfy a
      // bare .toThrow(), so requiring the message to name "amulet" is what
      // distinguishes a deliberate error from an accidental crash.
      expect(() => runScenario(scenario)).toThrow(/amulet/);
    });
    it("claim references a damage entry with an unknown item type → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      };

      // An unknown type is a special case of "not insured": no policy item can
      // ever match it, so the same guard catches it.
      expect(() => runScenario(scenario)).toThrow(/broomstick/);
    });
    it("claim contains a damage entry with amount -200 → error", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      };

      // Without this guard a negative damage yields a negative payout, which
      // SUBTRACTS from the drawdown and so INFLATES the remaining cap — a
      // customer could report negative damage to buy themselves more cover.
      expect(() => runScenario(scenario)).toThrow(/-200|negative/);
    });
  });

  describe("integration examples", () => {
    // The newcomer example (0 years, cursed steel sword ench 3 → 165 G) is
    // covered verbatim by "cursed sword → 50 % risk surcharge" above.

    it("long-standing customer (3 years), second quote, cursed steel sword (enchantment 7) → premium 160 G", () => {
      const scenario: Scenario = {
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      };

      // step 0 (first quote): 100 base − 20 loyalty + 10 initial assessment = 90, + 5 fee = 95
      //
      // step 1 — the spec's second integration example, verbatim:
      //   100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
      //   + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee = 160 G
      // Every policy-wide rate is taken on the unmodified base 100, not on a
      // running total — that is what this example verifies.
      expect(runScenario(scenario)).toEqual({
        results: [{ premium: 95 }, { premium: 160 }],
      });
    });
  });
});
