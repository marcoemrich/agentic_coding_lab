import { describe, it, expect } from "vitest";
import { runScenario, runScenarioRaw } from "./test-helpers.ts";

// MHPCO Claim Office kata -- complete inactive test list.
//
// Every test exercises the `claim-office` CLI (src/cli.ts) end to end:
// a JSON scenario on stdin -> a JSON `results` array on stdout.
//
// Unless a test says otherwise, the customer is a newcomer
// (yearsWithMHPCO = 0) and the scenario contains a single quote step,
// so the premium always includes: +10% first-insurance assessment on
// the policy base premium and the 5 G processing fee, and never the
// loyalty or follow-up discounts.
//
// Adopted premium model (spec "Modifier scope on multi-item policies"):
//   policyBase = sum of item base premiums (component blocks included)
//   itemSurcharges = 50% of each cursed item's base premium
//                 + 30% of each item's base premium with enchantment >= 5
//   policyModifiers = policyBase * (10% first insurance
//                                  - 20% loyalty if yearsWithMHPCO >= 2
//                                  - 15% follow-up for each quote after
//                                    the customer's first in the scenario)
//   premium = ceil(policyBase + itemSurcharges + policyModifiers + 5)
// (rounded up in the MHPCO's favor; intermediates stay fractional)
//
// Adopted payout model (spec claim rules):
//   per damage entry: 50% of amount if the covered item's enchantment
//   >= 8 (this clause wins over dragon material), otherwise the full
//   amount; minus the 100 G deductible per damaged item; the desired
//   payout is reduced to the policy's remaining cap (2x the unmodified
//   insurance sum); the final payout is rounded down in the MHPCO's
//   favor.
//
// Adopted CLI error contract for every rejection case (unknown item
// type, damage for an item not covered, negative damage amount, more
// damage entries of a type than covered): non-zero exit status, an
// error description on stderr, and no `results` on stdout (the whole
// claim/scenario is rejected).

describe("MHPCO claim office CLI", () => {
  describe("quote: base premiums and processing fee", () => {
    it("empty item list -> premium 5 (only the 5 G processing fee; no items, no first-insurance surcharge)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });
      expect(output).toEqual({ results: [{ premium: 5 }] });
    });
    it("single plain sword -> premium 115 (100 base + 10 first-insurance + 5 fee)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("single plain amulet -> premium 71 (60 base + 6 first-insurance + 5 fee)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 71 }] });
    });
    it("single plain staff -> premium 93 (80 base + 8 first-insurance + 5 fee)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 93 }] });
    });
    it("single plain potion -> premium 49 (40 base + 4 first-insurance + 5 fee)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 49 }] });
    });
    it("single moonstone -> premium 33 (25 base + 2.5 first-insurance + 5 fee = 32.5, rounded up)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote: building blocks of alike components", () => {
    it("2 runes -> premium 60 (50 base, no block: below 3)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes -> premium 71 (60 base: block of exactly 3 alike + 6 first-insurance + 5 fee)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes -> premium 115 (100 base: no block, block requires exactly 3 + 10 + 5)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes -> premium 198 (175 base + 17.5 first-insurance + 5 fee = 197.5, rounded up -- the spec's 197.5 -> 198 example)", async () => {
      const output = await runScenario({
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
      });
      expect(output).toEqual({ results: [{ premium: 198 }] });
    });
    it("2 runes + 1 moonstone -> premium 88 (75 base: no block, different types are not alike; 75 + 7.5 + 5 = 87.5 -> 88)", async () => {
      const output = await runScenario({
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
      });
      expect(output).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones -> premium 137 (120 base: two separate blocks of exactly 3 alike + 12 + 5)", async () => {
      const output = await runScenario({
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
      expect(output).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote: premium modifiers", () => {
    it("newcomer with cursed sword (steel, enchantment 3) -> premium 165 (100 base + 50 curse + 10 first-insurance + 5 fee) -- spec integration example", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with exactly enchantment 5 -> premium 145 (100 + 30 high-enchantment + 10 + 5)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5 }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4, not cursed -> premium 115 (no high-enchantment surcharge)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 4 }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 -> premium 195 (100 + 50 curse + 30 high-enchantment + 10 + 5: both surcharges apply)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 195 }] });
    });
    it("customer with exactly 2 years with MHPCO -> loyalty discount applies: single plain sword -> premium 95 (100 + 10 first-insurance - 20 loyalty + 5)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });
      expect(output).toEqual({ results: [{ premium: 95 }] });
    });
    it("follow-up contract: customer's second quote in the scenario gets 15% off the policy base: two plain-sword quotes for a 0-year customer -> premiums 115 then 100 (100 + 10 - 15 + 5)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
    });
    it("long-standing customer's second contract (spec integration example): 3 years, quote an amulet, then a cursed sword (steel, enchantment 7) -> second premium 160 (100 + 50 curse + 30 high-ench - 20 loyalty + 10 first-insurance - 15 follow-up + 5); the first-insurance surcharge still applies to the new sword", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1 }] },
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
    });
    it("modifier scope on multi-item policies: cursed sword + plain amulet, 0-year customer -> premium 231 (policy base 160 + 50 curse on the sword's base only + 16 first-insurance on the policy base + 5 fee; the spec's 210 G before further modifiers and fee)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
              { type: "amulet", material: "silver", enchantment: 1 },
            ],
          },
        ],
      });
      expect(output).toEqual({ results: [{ premium: 231 }] });
    });
  });

  describe("claim: standard reimbursement and deductible", () => {
    it("schema example: customer 5 years; quote silver amulet (enchantment 2) then claim amulet damage 200 (cause fire) -> premium 59 (60 + 6 - 12 loyalty + 5), payout 100, remainingCap 1100 (cap 2x600)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
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
      });
      expect(output).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("regular steel sword (enchantment 3), damage 500 -> payout 400 (full reimbursement minus 100 deductible; no special clause), remainingCap 1600", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
      });
    });
    it("damage to a rune (policy covers 2 runes), damage 200 -> payout 100 (full reimbursement minus deductible; runes have no enchantment or material), remainingCap 900 (insurance sum 500, cap 1000)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "rune", amount: 200 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [{ premium: 60 }, { payout: 100, remainingCap: 900 }],
      });
    });
    it("dragon attack damages an insured sword (500) and an insured amulet (300) -> payout 600 (the 100 G deductible applies once per damaged item), remainingCap 2600", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 1 },
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
      expect(output).toEqual({
        results: [
          { premium: 181 },
          { payout: 600, remainingCap: 2600 },
        ],
      });
    });
  });

  describe("claim: high-enchantment and dragon-material clauses", () => {
    it("dragon-material sword with exactly enchantment 8, damage 1000 -> payout 400 (high-enchantment clause applies, then deductible: 500 - 100), remainingCap 1600", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 8 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon-material sword, enchantment 9, damage 1000 -> payout 400 (both clauses apply; the 50% rule wins, then deductible: 500 - 100), remainingCap 1600", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("dragon-material sword, enchantment 5, damage 800 -> payout 700 (only the dragon-material clause: full reimbursement, then deductible: 800 - 100), remainingCap 1300", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "dragon", enchantment: 5 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 800 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 145 },
          { payout: 700, remainingCap: 1300 },
        ],
      });
    });
    it("steel sword, enchantment 9, damage 1000 -> payout 400 (only the high-enchantment clause: 50% first, then deductible: 500 - 100), remainingCap 1600", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 1000 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 145 },
          { payout: 400, remainingCap: 1600 },
        ],
      });
    });
    it("payout rounding down in the MHPCO's favor: steel sword (enchantment 9), damage 501 -> 250.5 - 100 = 150.5 -> payout 150, remainingCap 1850 (intermediates stay fractional; only the final payout is rounded)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 9 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
              damages: [{ itemType: "sword", amount: 501 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 145 },
          { payout: 150, remainingCap: 1850 },
        ],
      });
    });
  });

  describe("claim: insurance sum and payout cap", () => {
    it("sword + amulet policy -> insurance sum 1600, cap 3200: claim sword damage 100 -> payout 0 (deductible absorbs it), remainingCap 3200", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "amulet", material: "silver", enchantment: 1 },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 100 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 181 },
          { payout: 0, remainingCap: 3200 },
        ],
      });
    });
    it("cursed sword policy (premium 165) -> cap 2000 based on the unmodified insurance value: claim sword damage 100 -> payout 0, remainingCap 2000 (premium modifiers do not raise the cap)", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 100 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 165 },
          { payout: 0, remainingCap: 2000 },
        ],
      });
    });
    it("sword + 3 runes (a block) -> insurance sum 1750, cap 3500 (the block discount affects the premium only): claim rune damage 100 -> payout 0, remainingCap 3500", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
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
              damages: [{ itemType: "rune", amount: 100 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 181 },
          { payout: 0, remainingCap: 3500 },
        ],
      });
    });
    it("cap exhaustion: sword insured (cap 2000); two successive claims of 1500 -> first payout 1400, remainingCap 600; second payout 600 (desired 1400 reduced to the remaining cap), remainingCap 0", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "flood",
              damages: [{ itemType: "sword", amount: 1500 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 115 },
          { payout: 1400, remainingCap: 600 },
          { payout: 600, remainingCap: 0 },
        ],
      });
    });
    it("two swords -> insurance sum 2000, cap 4000; dragon attack with damages [sword 500, sword 500] -> payout 800 (each entry is a separate damage with its own deductible: 400 + 400), remainingCap 3200", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3 },
              { type: "sword", material: "steel", enchantment: 3 },
            ],
          },
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
      expect(output).toEqual({
        results: [
          { premium: 225 },
          { payout: 800, remainingCap: 3200 },
        ],
      });
    });
    it("staff insurance value 800 -> cap 1600: claim staff damage 100 -> payout 0, remainingCap 1600", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "staff", material: "wood", enchantment: 2 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "staff", amount: 100 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 93 },
          { payout: 0, remainingCap: 1600 },
        ],
      });
    });
    it("potion insurance value 400 -> cap 800: claim potion damage 100 -> payout 0, remainingCap 800", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "potion" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "potion", amount: 100 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 49 },
          { payout: 0, remainingCap: 800 },
        ],
      });
    });
    it("moonstone insurance value 250: policy covers 4 moonstones -> insurance sum 1000, cap 2000: claim moonstone damage 100 -> payout 0, remainingCap 2000", async () => {
      const output = await runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "moonstone", amount: 100 }],
            },
          },
        ],
      });
      expect(output).toEqual({
        results: [
          { premium: 115 },
          { payout: 0, remainingCap: 2000 },
        ],
      });
    });
  });

  describe("CLI error contract (non-zero exit, error on stderr, no results on stdout)", () => {
    it("quote includes an item with unknown type broomstick -> CLI exits non-zero, writes an error description to stderr, and writes no results to stdout", async () => {
      const raw = await runScenarioRaw({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      });
      expect(raw.exitCode).not.toBe(0);
      expect(raw.stderr).not.toBe("");
      expect(raw.parsed).toBeNull();
    });
    it("claim references a damage entry whose item is not part of the policy (amulet damaged, only a sword insured) -> non-zero exit, error on stderr, no results on stdout (whole claim rejected)", async () => {
      const raw = await runScenarioRaw({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
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
      });
      expect(raw.exitCode).not.toBe(0);
      expect(raw.stderr).not.toBe("");
      expect(raw.parsed).toBeNull();
    });
    it("claim contains a damage entry with unknown type broomstick -> non-zero exit, error on stderr, no results on stdout", async () => {
      const raw = await runScenarioRaw({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      });
      expect(raw.exitCode).not.toBe(0);
      expect(raw.stderr).not.toBe("");
      expect(raw.parsed).toBeNull();
    });
    it("claim contains a damage entry with amount -200 -> non-zero exit, error on stderr, no results on stdout", async () => {
      const raw = await runScenarioRaw({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
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
      });
      expect(raw.exitCode).not.toBe(0);
      expect(raw.stderr).not.toBe("");
      expect(raw.parsed).toBeNull();
    });
    it("damages array contains more entries of a type than the policy covers (two sword damages, one sword insured) -> non-zero exit, error on stderr, no results on stdout; the whole claim is rejected", async () => {
      const raw = await runScenarioRaw({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3 }],
          },
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
      expect(raw.exitCode).not.toBe(0);
      expect(raw.stderr).not.toBe("");
      expect(raw.parsed).toBeNull();
    });
  });
});
