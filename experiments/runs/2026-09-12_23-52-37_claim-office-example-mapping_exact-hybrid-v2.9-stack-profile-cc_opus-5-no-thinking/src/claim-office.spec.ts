import { execFileSync, spawnSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  describe("Quote: base premiums and insurance values", () => {
    it("should charge only the processing fee for an empty item list — premium 5 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [] }],
        }),
      ).toEqual({ results: [{ premium: 5 }] });
    });
    it("should quote a plain sword — base premium 100 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    it("should quote a plain amulet — base premium 60 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "amulet", material: "silver", enchantment: 2, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 71 }] });
    });
    it("should quote a plain staff — base premium 80 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "staff", material: "oak", enchantment: 2, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 93 }] });
    });
    it("should quote a plain potion — base premium 40 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "potion", material: "glass", enchantment: 1, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 49 }] });
    });
    it("should quote a single rune as a component — base premium 25 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "rune" }] }],
        }),
      ).toEqual({ results: [{ premium: 33 }] });
    });
    it("should quote a single moonstone as a component — base premium 25 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
        }),
      ).toEqual({ results: [{ premium: 33 }] });
    });
    it("should sum base premiums of several different main items — sword + amulet = 160 G base", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
                { type: "amulet", material: "silver", enchantment: 2, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 181 }] });
    });
  });

  describe("Quote: component building blocks", () => {
    it("should not apply a block to 2 runes — 50 G base premium", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
        }),
      ).toEqual({ results: [{ premium: 60 }] });
    });
    it("should apply the block to exactly 3 runes — 60 G base premium", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 71 }] });
    });
    it("should not apply a block to 4 runes — 100 G base premium (block requires exactly 3)", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    // 7 runes price as seven singles (7 × 25 = 175). A block applies only at an
    // exact count of 3, so it neither repeats nor partially applies here.
    it("should apply one block plus singles for 7 runes — 175 G base premium", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 198 }] });
    });
    // Resolves the spec's ❓ on "alike": blocks form per exact type, so three
    // components of mixed types do not block (2 × 25 + 1 × 25 = 75).
    it("should not block components of different types — 2 runes + 1 moonstone = 75 G base premium", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "rune" },
                { type: "rune" },
                { type: "moonstone" },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 88 }] });
    });
    // Blocks form per type, independently: each group of exactly 3 blocks at 60.
    it("should apply two separate blocks — 3 runes + 3 moonstones = 120 G base premium", () => {
      expect(
        runScenario({
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
        }),
      ).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("Quote: item-specific modifiers", () => {
    // 100 item base + 50 curse (50 % of the item base) = 150 before policy
    // modifiers; then +10 first insurance (10 % of the 100 policy base) + 5 fee.
    it("should add a 50 % curse surcharge to the cursed item's base premium — cursed sword = 150 G before policy modifiers", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: true },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 165 }] });
    });
    // Threshold is inclusive: enchantment exactly 5 qualifies. 100 item base
    // + 30 (30 % of the item base) = 130 before policy modifiers; then +10
    // first insurance (10 % of the 100 policy base) + 5 fee = 145.
    it("should add a 30 % surcharge for enchantment 5 — sword with enchantment 5 = 130 G before policy modifiers", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 5, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 145 }] });
    });
    // Pins the threshold from below: 4 is under the >= 5 cutoff, so the item
    // base stays 100 and the premium matches a plain sword's 115.
    it("should not add a high-enchantment surcharge for enchantment 4 — sword = 100 G before policy modifiers", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 4, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    // Both surcharges take a percentage of the item's ORIGINAL 100 base and are
    // summed: 100 + 50 + 30 = 180, not 100 × 1.5 × 1.3. Then +10 first
    // insurance (10 % of the 100 policy base) + 5 fee = 195.
    it("should stack curse and high-enchantment surcharges on the same item — cursed sword with enchantment 5 = 180 G before policy modifiers", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 5, cursed: true },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 195 }] });
    });
    // Scope: the curse is 50 % of the SWORD's 100 base (= 50), not 50 % of the
    // 160 policy total (= 80). Policy base 160 + 50 = 210; then first insurance
    // is 10 % of the 160 POLICY base (= 16) + 5 fee = 231.
    it("should apply the curse surcharge only to the cursed item, not the policy total — cursed sword + plain amulet = 210 G before policy modifiers and fee", () => {
      expect(
        runScenario({
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
        }),
      ).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("Quote: policy-wide modifiers", () => {
    // Pins the decomposition: 100 policy base + 10 (10 % of the policy base)
    // = 110 before the fee, then + 5 = 115.
    it("should apply a 10 % first-insurance surcharge to the policy base premium — sword = 110 G before fee", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    // Threshold is inclusive at exactly 2 years. Policy-wide modifiers are
    // summed against the 100 policy base: +10 first insurance, -20 loyalty,
    // net -10, then +5 fee = 95.
    it("should apply a 20 % loyalty discount at exactly 2 years with MHPCO", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 2 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 95 }] });
    });
    // Pins the loyalty threshold from below: 1 < 2, so no discount and the
    // premium stays at the plain 100 + 10 first insurance + 5 fee = 115.
    it("should not apply a loyalty discount at 1 year with MHPCO", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 1 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    // "Contract" = a quote step. The discount applies to every quote after the
    // first in the scenario, so asserting BOTH results pins that the second
    // gets -15 % (100 + 10 - 15 + 5 = 100) while the first does not (115).
    // The first-insurance +10 still applies on the follow-up contract.
    it("should apply a 15 % follow-up discount on the customer's second contract", () => {
      const sword = {
        type: "sword",
        material: "steel",
        enchantment: 3,
        cursed: false,
      };
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [sword] },
            { op: "quote", items: [sword] },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    // Guards the off-by-one: the FIRST contract gets no follow-up discount, so
    // the premium stays 100 + 10 first insurance + 5 fee = 115.
    it("should not apply a follow-up discount on the customer's first contract", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 115 }] });
    });
    // Resolves the spec's ❓ on "first insurance": it is per item in every
    // quote, never gated on customer history. A 3-year customer's second quote
    // still carries the +10 alongside both discounts — 100 +10 -20 -15 +5 = 80.
    // A 70 here would mean the surcharge was wrongly suppressed.
    it("should treat every item in a quote as a first insurance regardless of customer history", () => {
      const sword = {
        type: "sword",
        material: "steel",
        enchantment: 3,
        cursed: false,
      };
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 3 },
          steps: [
            { op: "quote", items: [sword] },
            { op: "quote", items: [sword] },
          ],
        }),
      ).toEqual({ results: [{ premium: 95 }, { premium: 80 }] });
    });
    // An empty policy has no base, so no percentage can apply and the whole
    // premium is the fee — pinning that it is added last and never scaled.
    it("should add the 5 G processing fee at the very end", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [] }],
        }),
      ).toEqual({ results: [{ premium: 5 }] });
    });
  });

  describe("Quote: rounding in the MHPCO's favor", () => {
    // 7 runes: 175 base -> +17.5 first insurance = 192.5 -> +5 fee = 197.5,
    // the spec's own rounding example, which must round UP to 198.
    it("should round a premium of 197.5 G up to 198 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
                { type: "rune" },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 198 }] });
    });
    // 2 runes on a follow-up contract: base 50, +5 first insurance, -7.5
    // follow-up, +5 fee = 52.5 -> 53. The 7.5 discount must stay fractional;
    // rounding it up to 8 mid-calculation would yield 52 instead.
    it("should keep intermediate amounts as fractions and round only the final premium", () => {
      const twoRunes = [{ type: "rune" }, { type: "rune" }];
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: twoRunes },
            { op: "quote", items: twoRunes },
          ],
        }),
      ).toEqual({ results: [{ premium: 60 }, { premium: 53 }] });
    });
  });

  describe("Quote: integration examples", () => {
    // The spec's published total: 100 base + 50 curse + 10 first insurance
    // = 160, + 5 fee = 165. Enchantment 3 is below the >= 5 threshold.
    it("should quote a newcomer's cursed steel sword (enchantment 3, 0 years) — premium 165 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: true },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 165 }] });
    });
    // The densest composition in the kata — five modifiers at once:
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first
    // insurance - 15 follow-up = 155, + 5 fee = 160. The first-insurance
    // surcharge survives even on a follow-up contract.
    it("should quote a long-standing customer's second contract for a cursed sword (enchantment 7, 3 years) — premium 160 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 3 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 7, cursed: true },
              ],
            },
          ],
        }),
      ).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
    });
  });

  describe("Quote: errors", () => {
    // Pins the guard in basePremiumOfType, which has thrown on unknown types
    // since the price table was introduced but had no test naming the rule.
    it("should reject a quote containing an item with an unknown type", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow();
    });
  });

  describe("Claim: standard reimbursement and deductible", () => {
    // No special clause (steel, enchantment 3 < 8): full reimbursement minus
    // the 100 G deductible. Insurance sum 1000 -> cap 2000, so 2000 - 400 left.
    it("should reimburse a regular sword (steel, enchantment 3) with damage 500 G — payout 400 G", () => {
      expect(
        runScenario({
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
        }),
      ).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    // A component has neither material nor enchantment, so no clause applies.
    // Cap uses the INSURANCE value 250 (-> 500), not the 25 base premium.
    it("should reimburse a damaged rune (damage 200 G) — payout 100 G (no enchantment or material clause)", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "rune" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "rune", amount: 200 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
      });
    });
    // One incident, two damage entries -> TWO deductibles: 400 + 200 = 600,
    // not 800 - 100 = 700. Insurance sum 1600 -> cap 3200, leaving 2600.
    it("should apply the 100 G deductible once per damaged item — sword 500 G + amulet 300 G = payout 600 G", () => {
      expect(
        runScenario({
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
        }),
      ).toEqual({
        results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
      });
    });
  });

  describe("Claim: special clauses", () => {
    // Clause first, deductible second: 50 % of 1000 = 500, then -100 = 400.
    // Not (1000 - 100) x 50 % = 450. Premium 145 = 100 base + 30 high
    // enchantment + 10 first insurance + 5 fee.
    it("should reimburse 50 % for enchantment 9 on a steel sword with damage 1000 G — payout 400 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 9, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 1000 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    // Pins the clause threshold ON the boundary (8 qualifies) and shows the
    // 50 % rule winning over dragon material: 500, then -100 = 400.
    it("should reimburse 50 % at exactly enchantment 8 on a dragon-material sword with damage 1000 G — payout 400 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "dragon", enchantment: 8, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 1000 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    // Enchantment 5 is below the CLAIM clause threshold of 8 (distinct from the
    // PREMIUM surcharge threshold of 5), so no 50 % rule: 800 - 100 = 700.
    it("should fully reimburse a dragon-material sword with enchantment 5 and damage 800 G — payout 700 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "dragon", enchantment: 5, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 800 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
      });
    });
    // Precedence: the item qualifies for BOTH clauses and the 50 % rule wins,
    // so 500 then -100 = 400 — not the 900 full reimbursement would give.
    it("should let the 50 % rule win over dragon material — dragon sword, enchantment 9, damage 1000 G = payout 400 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "dragon", enchantment: 9, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 1000 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
      });
    });
  });

  describe("Claim: insurance sum and cap", () => {
    // Cap is built from INSURANCE values (1000 + 600 = 1600), not base premiums
    // (100 + 60). The remainingCap of 2800 evidences the 3200 cap: 3200 - 400.
    it("should cap a policy at twice the insurance sum — sword + amulet = insurance sum 1600 G, cap 3200 G", () => {
      expect(
        runScenario({
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
                cause: "fire",
                damages: [{ itemType: "sword", amount: 500 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 181 }, { payout: 400, remainingCap: 2800 }],
      });
    });
    // Separation: the curse raises the PREMIUM to 165 but must not touch the
    // cap, which stays 2 x 1000 from the unmodified insurance value.
    it("should base the cap on unmodified insurance values — cursed sword = cap 2000 G despite premium modifiers", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: true },
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
        }),
      ).toEqual({
        results: [{ premium: 165 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    // Separation, mirroring the cursed-sword case: the block DISCOUNTS the
    // premium (base 160, not 175) but each rune still contributes its full
    // 250 G insurance value, so the cap is 2 x 1750 = 3500, leaving 3100.
    it("should count component insurance values in full despite the block discount — sword + 3 runes = insurance sum 1750 G", () => {
      expect(
        runScenario({
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
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 500 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 181 }, { payout: 400, remainingCap: 3100 }],
      });
    });
    // Resolves the spec's ❓ on duplicates: each of the two swords counts in
    // full. Premium 225 shows both priced (base 200); remainingCap 3600 shows
    // the cap built from 2 x 2000.
    it("should sum insurance values of two swords — insurance sum 2000 G, cap 4000 G", () => {
      expect(
        runScenario({
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
                cause: "fire",
                damages: [{ itemType: "sword", amount: 500 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 225 }, { payout: 400, remainingCap: 3600 }],
      });
    });
    // First claim only: desired 1400 is under the 2000 cap, so no clipping is
    // needed and 600 remains. The second claim (which must be clipped) has its
    // own test below.
    it("should exhaust the cap across successive claims — first claim of 1500 G pays 1400 G leaving cap 600 G", () => {
      expect(
        runScenario({
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
                damages: [{ itemType: "sword", amount: 1500 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
      });
    });
    // Asserting all three results pins that the FIRST claim is unaffected
    // (1400 sits under the 2000 cap) while the SECOND is clipped: the desired
    // 1400 is reduced to the 600 that remains, and the cap lands on 0 — never
    // negative.
    it("should reduce a later payout to the remaining cap — second claim of 1500 G pays 600 G leaving cap 0 G", () => {
      const incident = {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      };
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            { op: "claim", policy: 0, incident },
            { op: "claim", policy: 0, incident },
          ],
        }),
      ).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
  });

  describe("Claim: rounding in the MHPCO's favor", () => {
    // An enchantment-9 item halves the damage, so an ODD amount yields a .5:
    // 50 % of 901 = 450.5, -100 deductible = 350.5. Payouts round DOWN (350),
    // the mirror of premiums rounding UP — both in the MHPCO's favour.
    it("should round a payout of 350.5 G down to 350 G", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 9, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "sword", amount: 901 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
      });
    });
  });

  describe("Claim: multiple items of the same type", () => {
    // Two entries of the SAME type each take their own 100 G deductible:
    // (500-100) + (500-100) = 800, not 1000-100 = 900.
    it("should treat two sword damage entries as separate damages each with its own deductible", () => {
      expect(
        runScenario({
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
                  { itemType: "sword", amount: 500 },
                ],
              },
            },
          ],
        }),
      ).toEqual({
        results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
      });
    });
    // Two sword damages but only one sword insured: the whole claim is
    // rejected. The library signals this by throwing, matching how unknown
    // item types and missing policies are already handled; the CLI tests cover
    // turning a throw into a non-zero exit and a stderr message.
    it("should reject a claim with more damage entries of a type than the policy covers", () => {
      expect(() =>
        runScenario({
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
                cause: "dragon attack",
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

  describe("Claim: errors", () => {
    // The spec's own example: an amulet damaged when only a sword is insured.
    // The library throws; the CLI tests cover turning that into a non-zero exit
    // and a stderr message.
    it("should reject a claim whose damage references an item not covered by the policy", () => {
      expect(() =>
        runScenario({
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
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    // The spec's second illustration of one rule: a damage naming a type that
    // appears in no price list is as unclaimable as one the policy omits.
    it("should reject a claim whose damage references an unknown item type", () => {
      expect(() =>
        runScenario({
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
                damages: [{ itemType: "broomstick", amount: 300 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
    // A negative damage is not a refund: left unchecked it pays a negative
    // payout AND raises the remaining cap above its original value.
    it("should reject a claim containing a damage entry with a negative amount", () => {
      expect(() =>
        runScenario({
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
                damages: [{ itemType: "sword", amount: -200 }],
              },
            },
          ],
        }),
      ).toThrow();
    });
  });

  describe("Scenario processing", () => {
    // Pins the results contract itself — same length, same order — using a
    // mixed scenario so ordering is observable. The second quote is 62, not
    // 71: it is a follow-up contract (60 base + 6 first insurance - 9
    // follow-up + 5 fee).
    it("should return one result per step in the same order as the input steps", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            {
              op: "quote",
              items: [
                { type: "amulet", material: "silver", enchantment: 2, cursed: false },
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
        }),
      ).toEqual({
        results: [
          { premium: 115 },
          { premium: 62 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    // Two policies, claiming against the SECOND. The remainingCap of 1000 is
    // the evidence: it derives from the amulet's 1200 cap. Had the index been
    // misread as 0, the claim would have hit the sword-only policy and been
    // rejected outright rather than returning a value.
    it("should let a claim step reference the policy created by an earlier quote step via its zero-based index", () => {
      expect(
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            {
              op: "quote",
              items: [
                { type: "sword", material: "steel", enchantment: 3, cursed: false },
              ],
            },
            {
              op: "quote",
              items: [
                { type: "amulet", material: "silver", enchantment: 2, cursed: false },
              ],
            },
            {
              op: "claim",
              policy: 1,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 300 }],
              },
            },
          ],
        }),
      ).toEqual({
        results: [
          { premium: 115 },
          { premium: 62 },
          { payout: 200, remainingCap: 1000 },
        ],
      });
    });
    // The binding field names from the normative schema. toEqual already
    // rejects extra keys; asserting the key sets pins the shape explicitly
    // rather than leaving it an incidental consequence of the values.
    it("should report a quote result as { premium } and a claim result as { payout, remainingCap }", () => {
      const { results } = runScenario({
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
      expect(results).toEqual([
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ]);
      expect(Object.keys(results[0])).toEqual(["premium"]);
      expect(Object.keys(results[1])).toEqual(["payout", "remainingCap"]);
    });
  });
});

describe("claim-office CLI", () => {
  // The spec's own published schema example, end to end through the real
  // process: JSON in on stdin, JSON out on stdout. stdout is parsed rather
  // than string-compared so formatting stays free.
  it("should read a scenario from stdin and write { results } as JSON to stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    });
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  // spawnSync rather than execFileSync so a non-zero exit can be inspected
  // instead of thrown. The last assertion is the sharp one: stderr must carry
  // an error DESCRIPTION, and a stack dump — recognisable by its "    at "
  // frames — is not a description.
  it("should exit with a non-zero status and write an error to stderr for an invalid scenario, writing no results to stdout", () => {
    const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
      encoding: "utf8",
    });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("broomstick");
    expect(result.stderr).not.toContain("at ");
  });
});
