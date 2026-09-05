import { describe, it, expect } from "vitest";
import { execFileSync, spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

const runCli = (scenario: unknown): string =>
  execFileSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [] }],
      });

      expect(result).toEqual({ results: [{ premium: 5 }] });
    });
    it("a sword → base premium 100 G (+10 G first insurance +5 G fee = 115 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("an amulet → base premium 60 G (+6 G first insurance +5 G fee = 71 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "amulet" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("a staff → base premium 80 G (+8 G first insurance +5 G fee = 93 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("a potion → base premium 40 G (+4 G first insurance +5 G fee = 49 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "potion" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 49 }] });
    });
    it("a single rune → base premium 25 G (+2.5 G first insurance +5 G fee → 33 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
    it("a single moonstone → base premium 25 G (+2.5 G first insurance +5 G fee → 33 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 33 }] });
    });
  });

  describe("quote — component blocks of 3 alike", () => {
    it("2 runes → 50 G base premium (no block) (+5 G first insurance +5 G fee = 60 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 60 }] });
    });
    it("3 runes → 60 G base premium (block applies) (+6 G first insurance +5 G fee = 71 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 71 }] });
    });
    it("4 runes → 100 G base premium (no block — block requires exactly 3) (+10 G first insurance +5 G fee = 115 G)", () => {
      const result = runScenario({
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
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("7 runes → 175 G base premium (no block for 7) (+17.5 G first insurance +5 G fee → 198 G)", () => {
      const result = runScenario({
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
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types) (→ 88 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 88 }] });
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) (+12 G first insurance +5 G fee = 137 G)", () => {
      const result = runScenario({
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
      });

      expect(result).toEqual({ results: [{ premium: 137 }] });
    });
  });

  describe("quote — premium modifiers", () => {
    it("cursed sword adds 50 % of its base premium (50 G surcharge) → 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword", material: "steel", enchantment: 3, cursed: true },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("sword with exactly enchantment 5 adds 30 % high-enchantment surcharge (30 G) → 145 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 5,
                cursed: false,
              },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 145 }] });
    });
    it("sword with enchantment 4 → no high-enchantment surcharge → 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 4,
                cursed: false,
              },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("cursed sword with enchantment 5 → both surcharges apply → 195 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 5,
                cursed: true,
              },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 195 }] });
    });
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies → 95 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 95 }] });
    });
    it("customer with 1 year with MHPCO → no loyalty discount → 115 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 1 },
        steps: [{ op: "quote", items: [{ type: "sword" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 115 }] });
    });
    it("first insurance adds 10 % initial assessment surcharge (staff: 80 → +8 G → 93 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "staff" }] }],
      });

      expect(result).toEqual({ results: [{ premium: 93 }] });
    });
    it("second contract in a scenario receives a 15 % follow-up discount → 115 G then 100 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "sword" }] },
        ],
      });

      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 100 }],
      });
    });
    // "a 5 G processing fee is added to every premium" is pinned by the
    // empty-item-list test above (premium 5 G = fee only) and is a term in
    // every other premium expectation in this file.
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword (100 G) + plain amulet (60 G) → policy base 160 G, curse adds 50 G (not 50 % of the policy total) → 231 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
            ],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 231 }] });
    });
    it("policy-wide modifiers apply to the sum of all item base premiums (sword + amulet, 2-year customer → 149 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 2 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }, { type: "amulet" }],
          },
        ],
      });

      expect(result).toEqual({ results: [{ premium: 149 }] });
    });
  });

  describe("quote — rounding in the MHPCO's favor", () => {
    // "a premium calculation yielding 197.5 G → 198 G (rounded up)" is exactly
    // the 7-runes case above: 175 + 17.5 + 5 = 197.5 → 198.
    it("intermediate amounts are kept as fractions; only the final premium is rounded (2 runes on a follow-up contract → 52.5 → 53 G, not 52 G)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
        ],
      });

      // 50 base + 5 first insurance − 7.5 follow-up + 5 fee = 52.5 → 53.
      // Rounding each term as it is computed would yield 52 instead.
      expect(result).toEqual({
        results: [{ premium: 115 }, { premium: 53 }],
      });
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword (steel, ench. 3) → premium 165 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
        ],
      });

      // 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
      expect(result).toEqual({ results: [{ premium: 165 }] });
    });
    it("3-year customer's second quote with a cursed sword (steel, ench. 7) → premium 160 G (first insurance still applies per item)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 3 },
        steps: [
          { op: "quote", items: [{ type: "potion" }] },
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 7,
                cursed: true,
              },
            ],
          },
        ],
      });

      // 100 base + 50 curse + 30 high enchantment − 20 loyalty
      // + 10 first insurance − 15 follow-up = 155 + 5 fee = 160
      expect(result.results[1]).toEqual({ premium: 160 });
    });
  });

  describe("claim — standard reimbursement", () => {
    it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
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

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (value 250 G), damage 200 G → payout 100 G (no special clause)", () => {
      const result = runScenario({
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
      });

      expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
    it("deductible applies once per damaged item: sword 500 G + amulet 300 G → payout 600 G", () => {
      const result = runScenario({
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
      });

      expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "dragon",
                enchantment: 5,
                cursed: false,
              },
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
      });

      expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 9,
                cursed: false,
              },
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
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over full reimbursement)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "dragon",
                enchantment: 9,
                cursed: false,
              },
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
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "dragon",
                enchantment: 8,
                cursed: false,
              },
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
      });

      expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    // "sword + amulet → insurance sum 1600 G, cap 3200 G" is pinned by the
    // per-item deductible test above: remainingCap 2600 after a 600 G payout
    // is only consistent with a 3200 G cap.
    it("cursed sword (premium 165 G) → cap 2000 G, based on the unmodified insurance value (premium modifiers do not raise the cap)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: true,
              },
            ],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 2500 }],
            },
          },
        ],
      });

      expect(result.results[0]).toEqual({ premium: 165 });
      // Desired payout 2400 exceeds the cap, so it is clamped to exactly 2000.
      expect(result.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
    });
    it("policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G (the block discount affects the premium only)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              { type: "sword" },
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
              damages: [{ itemType: "sword", amount: 4000 }],
            },
          },
        ],
      });

      // Desired payout 3900 exceeds the cap, so it clamps to exactly 3500.
      expect(result.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
    // "first claim of 1500 G → payout 1400 G, remainingCap 600 G" is asserted
    // as the first claim of the cap-exhaustion test below, which is the same
    // two-claim scenario from the spec.
    it("sword (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G (desired 1400 G reduced to the remaining cap)", () => {
      const claim = {
        op: "claim",
        policy: 0,
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1500 }],
        },
      };
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          claim,
          { ...claim },
        ],
      });

      expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — rounding in the MHPCO's favor", () => {
    it("a payout calculation yielding 350.5 G → final payout 350 G (rounded down)", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 9,
                cursed: false,
              },
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
      });

      // 901 × 50 % = 450.5, − 100 deductible = 350.5 → rounded down to 350.
      expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 5000 }],
            },
          },
        ],
      });

      // Desired payout 4900 exceeds the cap, so it clamps to exactly 4000.
      expect(result.results[1]).toEqual({ payout: 4000, remainingCap: 0 });
    });
    it("two sword damage entries against two insured swords → each treated as a separate damage with its own deductible", () => {
      const result = runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "sword",
                material: "steel",
                enchantment: 3,
                cursed: false,
              },
              {
                type: "sword",
                material: "steel",
                enchantment: 9,
                cursed: false,
              },
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

      // The plain sword pays 500 − 100 = 400; the enchantment-9 sword is
      // halved: 300 × 50 % = 150, − 100 = 50. Total 450.
      expect(result.results[1]).toEqual({ payout: 450, remainingCap: 3550 });
    });
    it("more damage entries of a type than insured items (two sword damages, one sword) → error, claim rejected", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
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
        }),
      ).toThrow(/sword/);
    });
  });

  describe("errors", () => {
    it("quote with an unknown item type (e.g. broomstick) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
      ).toThrow(/broomstick/);
    });
    it("claim referencing an item not part of the policy (amulet damaged, only sword insured) → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "amulet", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow(/amulet/);
    });
    it("claim referencing a damage entry with an unknown item type → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
            {
              op: "claim",
              policy: 0,
              incident: {
                cause: "fire",
                damages: [{ itemType: "broomstick", amount: 200 }],
              },
            },
          ],
        }),
      ).toThrow(/broomstick/);
    });
    it("claim containing a damage entry with amount -200 → error", () => {
      expect(() =>
        runScenario({
          customer: { yearsWithMHPCO: 0 },
          steps: [
            { op: "quote", items: [{ type: "sword" }] },
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
      ).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
      const stdout = runCli({
        customer: { yearsWithMHPCO: 5 },
        steps: [
          {
            op: "quote",
            items: [
              {
                type: "amulet",
                material: "silver",
                enchantment: 2,
                cursed: false,
              },
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
      });

      expect(JSON.parse(stdout)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    // "quote result contains premium; claim result contains payout and
    // remainingCap" is pinned by the CLI test above: its `toEqual` asserts
    // both result objects have exactly those keys, in step order.
    it("on an invalid scenario exits with a non-zero status code and writes an error description to stderr, with no results on stdout", () => {
      const result = spawnSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify({
          customer: { yearsWithMHPCO: 0 },
          steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
        }),
        encoding: "utf8",
      });

      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("broomstick");
      expect(result.stdout).not.toContain("results");
      // A description of the problem, not a crash dump.
      expect(result.stderr).not.toContain("at ");
      expect(result.stderr.trim().split("\n")).toHaveLength(1);
    });
  });
});
