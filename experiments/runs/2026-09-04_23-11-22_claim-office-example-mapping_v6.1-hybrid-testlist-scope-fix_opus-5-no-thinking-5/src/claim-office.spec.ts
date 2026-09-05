import { execFileSync, spawnSync } from "node:child_process";
import { describe, it, expect } from "vitest";
import { runScenario, type Step } from "./claim-office.js";

/**
 * Runs the steps for a customer of `years` standing and returns just the
 * results. Tests that do not turn on loyalty pass 0 — the default below — so
 * the customer object stays out of their way.
 */
const resultsOf = (steps: Step[], years = 0): unknown[] =>
  runScenario({ customer: { yearsWithMHPCO: years }, steps }).results;

/** Pipes a scenario through the real CLI. Returns the full spawn result. */
const runCli = (input: string) =>
  spawnSync("npx", ["tsx", "src/cli.ts"], { input, encoding: "utf8" });

/** As runCli, but for the success path: parses stdout, throwing on failure. */
const cliOutputFor = (scenario: unknown): unknown =>
  JSON.parse(
    execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
    }),
  );

describe("MHPCO Claim Office", () => {
  describe("quote — base premiums", () => {
    it("empty item list → premium 5 G (only the processing fee)", () => {
      const results = resultsOf([{ op: "quote", items: [] }]);

      expect(results).toEqual([{ premium: 5 }]);
    });
    it("a single sword → base premium 100 G (+10 first insurance, +5 fee = 115 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "sword" }] }]);

      expect(results).toEqual([{ premium: 115 }]);
    });
    it("a single amulet → base premium 60 G (+6 first insurance, +5 fee = 71 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "amulet" }] }]);

      expect(results).toEqual([{ premium: 71 }]);
    });
    it("a single staff → base premium 80 G (+8 first insurance, +5 fee = 93 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "staff" }] }]);

      expect(results).toEqual([{ premium: 93 }]);
    });
    it("a single potion → base premium 40 G (+4 first insurance, +5 fee = 49 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "potion" }] }]);

      expect(results).toEqual([{ premium: 49 }]);
    });
    it("a single rune (component) → base premium 25 G (+2.5 first insurance, +5 fee = 32.5 → 33 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "rune" }] }]);

      expect(results).toEqual([{ premium: 33 }]);
    });
    it("a single moonstone (component) → base premium 25 G (+2.5 first insurance, +5 fee = 32.5 → 33 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "moonstone" }] }]);

      expect(results).toEqual([{ premium: 33 }]);
    });
  });

  describe("quote — building block of 3 alike components", () => {
    it("2 runes → 50 G base premium (+5 first insurance, +5 fee = 60 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]);

      expect(results).toEqual([{ premium: 60 }]);
    });
    it("3 runes → 60 G base premium (block applies; +6 first insurance, +5 fee = 71 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]);

      expect(results).toEqual([{ premium: 71 }]);
    });
    it("4 runes → 100 G base premium (no block; +10 first insurance, +5 fee = 115 G)", () => {
      const results = resultsOf([
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ]);

      expect(results).toEqual([{ premium: 115 }]);
    });
    it("7 runes → 175 G base premium (no sub-blocks; +17.5 first insurance, +5 fee = 197.5 → 198 G)", () => {
      const results = resultsOf([{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }]);

      expect(results).toEqual([{ premium: 198 }]);
    });
    it("2 runes + 1 moonstone → 75 G base premium (no block: different types; +7.5, +5 = 87.5 → 88 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }]);

      expect(results).toEqual([{ premium: 88 }]);
    });
    it("3 runes + 3 moonstones → 120 G base premium (two separate blocks; +12, +5 = 137 G)", () => {
      const results = resultsOf([
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
      ]);

      expect(results).toEqual([{ premium: 137 }]);
    });
  });

  describe("quote — item-specific modifiers", () => {
    it("cursed sword adds 50 % risk surcharge → 50 G on top of 100 G base (+10 first insurance, +5 fee = 165 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ]);

      expect(results).toEqual([{ premium: 165 }]);
    });
    it("sword with exactly enchantment 5 → high-enchantment surcharge applies (30 G; +10, +5 = 145 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ]);

      expect(results).toEqual([{ premium: 145 }]);
    });
    it("sword with enchantment 4 → no high-enchantment surcharge (100 + 10 + 5 = 115 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ]);

      expect(results).toEqual([{ premium: 115 }]);
    });
    it("cursed sword with enchantment 5 → both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ]);

      expect(results).toEqual([{ premium: 195 }]);
    });
    it("cursed sword with enchantment 4 → only the curse surcharge applies (100 + 50 + 10 + 5 = 165 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: true }],
        },
      ]);

      expect(results).toEqual([{ premium: 165 }]);
    });
  });

  describe("quote — policy-wide modifiers", () => {
    it("customer with exactly 2 years with MHPCO → 20 % loyalty discount applies (100 − 20 + 10 + 5 = 95 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "sword" }] }], 2);

      expect(results).toEqual([{ premium: 95 }]);
    });
    it("customer with 1 year with MHPCO → no loyalty discount (100 + 10 + 5 = 115 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "sword" }] }], 1);

      expect(results).toEqual([{ premium: 115 }]);
    });
    it("first quote in a scenario → 10 % initial assessment surcharge on the policy base premium (160 + 16 + 5 = 181 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "staff" }, { type: "staff" }] }]);

      expect(results).toEqual([{ premium: 181 }]);
    });
    it("second quote in a scenario → 15 % follow-up contract discount (cursed sword ench. 7 → 160 G)", () => {
      const results = resultsOf([
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ], 3);

    expect(results).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it("the first insurance surcharge still applies on a follow-up contract (115 G then 100 G)", () => {
    const results = resultsOf([
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ]);

      expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
    });
  });

  describe("quote — modifier scope on multi-item policies", () => {
    it("cursed sword + plain amulet → curse adds 50 G (50 % of the cursed item only), not of the policy total (160 + 50 + 16 + 5 = 231 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ]);

      expect(results).toEqual([{ premium: 231 }]);
    });
    it("policy-wide modifiers apply to the sum of all item base premiums; the fee is added at the very end (160 − 32 + 16 + 5 = 149 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }], 5);

      expect(results).toEqual([{ premium: 149 }]);
    });
  });

  describe("quote — processing fee and rounding", () => {
    it("a 5 G processing fee is added to every premium — including an empty policy, which is fee only", () => {
      const results = resultsOf([
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "staff" }] },
      ]);

      // Empty policy is the bare fee; the staff policy is 80 + 8 − 12 (follow-up) + 5.
      expect(results).toEqual([{ premium: 5 }, { premium: 81 }]);
    });
    it("a fractional premium is rounded up, in the MHPCO's favour (76.5 G → 77 G)", () => {
      const results = resultsOf([{ op: "quote", items: [{ type: "potion" }, { type: "rune" }] }]);

      expect(results).toEqual([{ premium: 77 }]);
    });
    it("intermediate amounts are kept as fractions; only the final premium is rounded (25 + 12.5 + 7.5 + 2.5 + 5 = 52.5 → 53 G)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "rune", cursed: true, enchantment: 5 }],
        },
      ]);

      // Curse 12.5 and high-enchantment 7.5 are both fractional, as is the 2.5
      // first-insurance surcharge; rounding any of them early would overshoot.
      expect(results).toEqual([{ premium: 53 }]);
    });
  });

  describe("quote — integration examples", () => {
    it("newcomer (0 years, no previous contract) with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ]);

      expect(results).toEqual([{ premium: 165 }]);
    });
    it("long-standing customer (3 years), second quote, cursed sword (steel, enchantment 7) → premium 160 G", () => {
      const results = resultsOf([
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ], 3);

    // 100 base + 50 curse + 30 high enchantment − 20 loyalty + 10 first
    // insurance − 15 follow-up = 155, + 5 fee = 160.
    expect(results[1]).toEqual({ premium: 160 });
  });
});

describe("claim — standard reimbursement", () => {
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G (full reimbursement minus deductible)", () => {
    const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G (no enchantment or material, so no special clause)", () => {
      const results = resultsOf([
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
    });
  });

  describe("claim — special clauses", () => {
    it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
    });
    it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; the 50 % rule wins)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
    it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G (threshold is inclusive)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
    });
  });

  describe("claim — deductible per damage event", () => {
    it("dragon attack damages a sword (500 G) and an amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
      const results = resultsOf([
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
      ]);

      expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
    });
  });

  describe("claim — insurance sum and cap", () => {
    // "sword + amulet → sum 1600, cap 3200" is asserted by the dragon-attack
    // deductible test; "two swords → sum 2000, cap 4000" by the two-swords test.
    it("a policy covering a cursed sword (premium 165 G) → cap 2000 G (premium modifiers do not raise the cap)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ]);

      // The cap follows the unmodified insurance value (1000 → 2000), not the premium.
      expect(results).toEqual([{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
    });
    it("a policy covering a sword and 3 runes (a block) → insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ]);

      // Insurance sum 1000 + 3×250 = 1750 → cap 3500, which clamps the 4900 claimed.
      expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
    });
  });

  describe("claim — cap exhaustion across successive claims", () => {
    it("sword (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
      const results = resultsOf([
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ]);

      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    });
    it("sword (cap 2000 G), second claim of 1500 G → payout 600 G, remainingCap 0 G (reduced to the remaining cap)", () => {
      const claim = {
        op: "claim" as const,
        policy: 0,
        incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      };

      const results = resultsOf([{ op: "quote", items: [{ type: "sword" }] }, claim, claim]);

      expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
      expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
    });
  });

  describe("claim — multiple items of the same type", () => {
    it("two insured swords (insurance sum 2000 G, cap 4000 G), two sword damage entries → each has its own deductible", () => {
      const results = resultsOf([
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
      ]);

      expect(results[1]).toEqual({ payout: 600, remainingCap: 3400 });
    });
    it("more damage entries of a type than the policy covers → error (two sword damages, one sword insured)", () => {
      expect(() =>
        resultsOf([
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
        ]),
      ).toThrow(/sword/);
    });
  });

  describe("claim — rounding", () => {
    it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down, in the MHPCO's favour)", () => {
      const results = resultsOf([
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ]);

      // 901 × 50 % = 450.5, − 100 deductible = 350.5 → 350.
      expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    });
  });

  describe("errors", () => {
    it("quote with an item of unknown type (e.g. broomstick) → error, no results", () => {
      expect(() =>
        resultsOf([{ op: "quote", items: [{ type: "broomstick" }] }]),
      ).toThrow(/broomstick/);
    });
    it("claim referencing a damage entry whose item is not part of the policy → error", () => {
      expect(() =>
        resultsOf([
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ]),
      ).toThrow(/amulet/);
    });
    it("claim referencing a damage entry with an unknown item type → error", () => {
      expect(() =>
        resultsOf([
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ]),
      ).toThrow(/broomstick/);
    });
    it("claim with a damage entry of amount -200 → error", () => {
      expect(() =>
        resultsOf([
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ]),
      ).toThrow(/-200/);
    });
  });

  describe("CLI", () => {
    it("reads a scenario from stdin and writes {results: [...]} to stdout", () => {
      const scenario = {
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
      };

      // Premium: 60 base − 6 (net policy rate 0.1 − 0.2) + 5 fee = 59.
      // Cap: 2 × 600 = 1200; payout 200 − 100 = 100; remaining 1100.
      expect(cliOutputFor(scenario)).toEqual({
        results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
      });
    });
    it("returns one result per step, in order (quote → premium, claim → payout and remainingCap)", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
          },
          { op: "quote", items: [{ type: "amulet" }] },
        ],
      };

      // The third step is the customer's second quote, so the follow-up
      // discount applies: 60 − 3 (rate 0.1 − 0.15) + 5 fee = 62.
      expect(cliOutputFor(scenario)).toEqual({
        results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }, { premium: 62 }],
      });
    });
    it("reports malformed JSON on stdin as an error description, not a stack trace", () => {
      const result = runCli("not json");

      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr).toContain("JSON");
      expect(result.stderr).not.toContain("    at ");
    });

    it("exits with a non-zero status code and writes an error description to stderr on invalid input", () => {
      const scenario = {
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      };

      const result = runCli(JSON.stringify(scenario));

      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      // A description of the problem, not an uncaught stack trace.
      expect(result.stderr.trim()).toBe("unknown item type: broomstick");
    });
  });
});
