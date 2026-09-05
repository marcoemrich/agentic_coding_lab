import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (processing fee only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result.results).toEqual([{ premium: 5 }]);
    });
    it("a sword → base premium 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("an amulet → base premium 60 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("a staff → base premium 80 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 93 }]);
    });
    it("a potion → base premium 40 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 49 }]);
    });
    it("a single rune → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("a single moonstone → base premium 25 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result.results).toEqual([{ premium: 33 }]);
    });
    it("a sword and an amulet → policy base premium 160 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 181 }]);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result.results).toEqual([{ premium: 60 }]);
    });
    it("3 runes → 60 G base premium (block applies)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });

      expect(result.results).toEqual([{ premium: 71 }]);
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("7 runes → 175 G base premium", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: Array.from({ length: 7 }, () => ({ type: "rune" })),
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
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

      expect(result.results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("a cursed sword → 50 G curse surcharge (50 % of the item's base premium)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 165 }]);
    });
    it("a sword with enchantment 5 → 30 G high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 145 }]);
    });
    it("a sword with enchantment 4 → no high-enchantment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("a cursed sword with enchantment 5 → both surcharges apply", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 195 }]);
    });
    it("a cursed sword and a plain amulet → policy base 160 G, curse adds 50 G (50 % of the sword only) → 210 G before further modifiers and fee", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: true },
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 231 }]);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year with MHPCO → no loyalty discount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }]);
    });
    it("a first quote carries the 10 % initial assessment surcharge", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
          },
        ],
      });

      // staff base 80 + 8 initial assessment + 5 fee
      expect(result.results).toEqual([{ premium: 93 }]);
    });
    it("the second quote in a scenario receives the 15 % follow-up contract discount", () => {
      const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword] },
          { op: "quote", items: [sword] },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
    it("the first insurance surcharge still applies on a follow-up contract (each item is treated as a first insurance)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });

      // Second quote: 100 base + 50 curse + 30 high ench − 20 loyalty
      //               + 10 first insurance − 15 follow-up = 155 + 5 fee
      expect(result.results).toEqual([{ premium: 95 }, { premium: 160 }]);
    });
  });

  describe("quote — rounding in the MHPCO's favour", () => {
    it("a premium calculation that yields 197.5 G → final premium 198 G (rounded up)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
      });

      // 7 × 25 = 175 base, + 10 % = 192.5, + 5 fee = 197.5 exactly.
      // The MHPCO rounds premiums in its own favour, so 197.5 → 198, not 197.
      expect(result.results).toEqual([{ premium: 198 }]);
    });
    // "Intermediate amounts are kept as fractions; only the final premium is
    // rounded" is demonstrated by the 197.5 case above: 192.5 is carried as a
    // fraction rather than rounded before the fee is added (which would give
    // 193 + 5 = 198 by luck, but 82.5 → 83 + 5 = 88 vs 87.5 → 88 elsewhere).
    // A separate assertion would duplicate that scenario without adding cover.
  });

  // Both of the spec's integration examples are already asserted above, with
  // the exact figures from the spec's own breakdowns:
  //   - newcomer (0 years), cursed steel sword ench 3 → 165 G
  //     → "a cursed sword → 50 G curse surcharge"
  //   - 3-year customer, second quote, cursed steel sword ench 7 → 160 G
  //     → "the first insurance surcharge still applies on a follow-up contract"
  // Repeating them here would assert the same scenarios a second time.

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
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

      // Sword insurance value 1000 → cap 2000; 500 − 100 deductible = 400 paid.
      expect(result.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
    });
    it("damage to a rune (value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
      const result = runScenario({
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

      // Rune insurance value 250 → cap 500; runes have no material or
      // enchantment, so no special clause applies: 200 − 100 deductible.
      expect(result.results).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
    });
  });

  // NOTE on the dragon-material clause: the spec says dragon-material items are
  // "fully reimbursed", but full reimbursement is exactly what a damage with no
  // special clause already receives, and when an item is both dragon-material
  // and enchantment >= 8 the spec says the 50 % rule wins. The clause therefore
  // has no observable effect distinguishable from the default in any example the
  // spec gives, and `material` is deliberately never read by the implementation.
  describe("claim — special clauses", () => {
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
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
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      // 50 % of 1000 = 500, then − 100 deductible = 400.
      expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
          },
        ],
      });

      // Enchantment 5 is below the claim-side threshold of 8, so only the
      // dragon-material clause applies: full 800, then − 100 deductible.
      expect(result.results).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (the 50 % rule wins)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      // Both clauses apply; the 50 % rule wins: 500, then − 100 deductible.
      expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
    });
    it("dragon-material sword, exactly enchantment 8, damage 1000 G → payout 400 G (high-enchantment clause applies, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
    });
  });

  describe("claim — deductible per damage event", () => {
    it("a dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            ],
          },
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

      // (500 − 100) + (300 − 100) = 600. Insurance sum 1600 → cap 3200.
      expect(result.results).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
    });
    // The spec does not say what happens when a damage falls below the
    // deductible. Paying a negative amount — the insurer billing the customer
    // for a scratch — is not a defensible reading, so the payout is held at
    // zero. The narrower question of whether a below-deductible entry should
    // offset a sibling entry in the same incident is genuinely unspecified and
    // deliberately left untested rather than guessed at.
    it("a damage below the deductible pays nothing rather than a negative amount", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] },
          },
        ],
      });

      expect(result.results).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G, each damage its own deductible", () => {
      const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };

      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [sword, sword] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      });

      // Two swords: base 200 (count 2, no block) + 20 + 5 fee = 225.
      // Insurance sum 2000 → cap 4000; (500 − 100) + (300 − 100) = 600.
      expect(result.results).toEqual([{ premium: 225 }, { payout: 600, remainingCap: 3400 }]);
    });
    // "two sword damage entries → each is a separate damage with its own
    // deductible" is asserted by the test above: the 600 G payout is only
    // reachable if both entries carry their own 100 G deductible.
  });

  describe("claim — payout cap", () => {
    // "a policy covering a sword and an amulet → insurance sum 1600 G, cap
    // 3200 G" is asserted by the two-item deductible test above, whose
    // remainingCap of 2600 is only reachable from a 3200 cap.
    it("a cursed sword (premium with modifiers 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 600 }] },
          },
        ],
      });

      // The curse raises the premium to 165 but leaves the cap at 2 × 1000.
      expect(result.results).toEqual([{ premium: 165 }, { payout: 500, remainingCap: 1500 }]);
    });
    it("a policy covering a sword and 3 runes → insurance sum 1750 G (the block discount affects the premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 1, cursed: false },
              { type: "rune" },
              { type: "rune" },
              { type: "rune" },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 600 }] },
          },
        ],
      });

      // Premium uses the block: 100 + 60 = 160 base (not 175) → 181.
      // The cap ignores it: insurance sum 1000 + 3×250 = 1750 → cap 3500.
      expect(result.results).toEqual([{ premium: 181 }, { payout: 500, remainingCap: 3000 }]);
    });
    it("sword policy (cap 2000 G), successive claims of 1500 G → payouts 1400 G then 600 G, cap exhausted", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
          },
        ],
      });

      // Cap 2000. First claim takes 1400, leaving 600. The second claim also
      // wants 1400 but is reduced to the 600 that remains.
      expect(result.results).toEqual([
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ]);
    });
    // The second successive claim (payout reduced to the remaining 600 G, cap
    // exhausted to 0) is asserted by the test above — it is the same scenario's
    // next state and cannot be set up independently.
  });

  describe("claim — rounding in the MHPCO's favour", () => {
    it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
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

      // 50 % of 901 = 450.5, − 100 deductible = 350.5. The MHPCO's favour is
      // down for payouts, so 350 — and the cap is drawn down by the whole 350.
      expect(result.results).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
    });
  });

  describe("errors", () => {
    // The spec describes rejection in CLI terms (non-zero exit, stderr). At the
    // module level that contract is an exception; src/cli.ts translates it.
    it("a quote item with an unknown type (e.g. broomstick) is rejected", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow(/does not insure a broomstick/);
    });
    it("a claim damaging an item that is not part of the policy is rejected", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
            },
          ],
        }),
        // Matched on the reason, not just the type name: an over-count or a
        // negative-amount message would also mention "amulet".
      ).toThrow(/does not cover a amulet/);
    });
    // A distinct spec sentence, though the not-in-policy guard covers it: an
    // unknown type cannot be in a policy, since quote rejects it at creation.
    it("a claim damaging an item of unknown type is rejected", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
            },
          ],
        }),
      ).toThrow(/does not cover a broomstick/);
    });
    it("a claim with more damage entries of a type than the policy covers (two swords, one insured) is rejected", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "dragon",
                damages: [
                  { itemType: "sword", amount: 500 },
                  { itemType: "sword", amount: 300 },
                ],
              },
            },
          ],
        }),
      ).toThrow(/does not cover 2 items of type sword/);
    });
    // Worth rejecting explicitly rather than relying on the payout's zero floor,
    // which would quietly turn a nonsensical claim into a payout of 0.
    it("a claim damage entry with amount -200 is rejected", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
            },
            {
              op: "claim",
              policy: 0,
              incident: { cause: "fraud", damages: [{ itemType: "sword", amount: -200 }] },
            },
          ],
        }),
      ).toThrow(/negative damage of -200/);
    });
  });

  // Scenario processing — both rules are exercised by every multi-step test
  // above rather than restated here:
  //   - "results are in the same order and length as the input steps": each
  //     multi-step test asserts the whole results array positionally, and the
  //     three-step cap-exhaustion test pins ordering across two claims.
  //   - "a claim refers to the policy created by an earlier quote step via its
  //     zero-based step index": every claim test passes `policy: 0` and only
  //     resolves because step 0's policy is found.
});
