import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { runScenario } from "./claim-office.js";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliRun {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });

    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };

    return {
      status: failure.status,
      stdout: failure.stdout ?? "",
      stderr: failure.stderr ?? "",
    };
  }
}

/**
 * Test list for the MHPCO Claim Office kata.
 *
 * Observable contract chosen for rejection cases (stated explicitly, as the
 * specification defines the CLI-level outcome but not the internal mechanism):
 * the domain layer throws an `Error` whose message describes the problem, and
 * the CLI adapter catches it, writes the message to stderr and exits non-zero
 * without writing `results` to stdout. Tests below assert `toThrow()` at the
 * domain level and the exit-code / stream contract at the CLI level.
 */

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and the simplest possible policy ---------------
  it("quote for an empty item list -- premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  // --- Quote: main item base premiums (parallel catalogue: one test each) ---
  it("quote for a single sword -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for a single amulet -- premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quote for a single staff -- premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quote for a single potion -- premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: component base premiums (parallel catalogue) -----------------
  it("quote for a single rune -- premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quote for a single moonstone -- premium 33 G (25 base + 2.5 first insurance + 5 fee = 32.5, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- Quote: unknown item type is rejected --------------------------------
  it("quote with an unknown item type 'broomstick' -- throws an error describing the unknown type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Building block of 3 alike components (spec examples verbatim) -------
  it("base premium for 2 runes -- 50 G (no block), premium 60 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 60 }]);
  });
  it("base premium for 3 runes -- 60 G (block applies), premium 71 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("base premium for 3 swords -- 300 G (no block: the block rule covers components only), premium 335 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }, { type: "sword" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 335 }]);
  });
  it("base premium for 4 runes -- 100 G (no block -- block requires exactly 3), premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("base premium for 7 runes -- 175 G (no block -- block requires exactly 3), premium 198 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });

  // --- 'Alike' means same type, not same family (clarifying question) ------
  it("base premium for 2 runes + 1 moonstone -- 75 G (no block: different types), premium 88 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 88 }]);
  });
  it("base premium for 3 runes + 3 moonstones -- 120 G (two separate blocks), premium 137 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            ...Array(3).fill({ type: "rune" }),
            ...Array(3).fill({ type: "moonstone" }),
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Item-specific modifiers --------------------------------------------
  it("cursed sword adds a 50 % surcharge on that item's base premium -- premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("sword with exactly enchantment 5 adds a 30 % high-enchantment surcharge -- premium 145 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });

    expect(results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge -- premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 gets both surcharges -- premium 195 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Modifier scope on multi-item policies (clarifying question) ---------
  it("cursed sword + plain amulet -- curse surcharge is 50 G (50 % of the cursed sword only, not the policy total) -- premium 231 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Policy-wide modifiers ----------------------------------------------
  it("customer with exactly 2 years with MHPCO -- 20 % loyalty discount applies -- premium 95 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year with MHPCO -- no loyalty discount -- premium 115 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("first insurance adds a 10 % surcharge on the policy base premium -- staff 80 G base becomes 93 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    // 80 base + 8 (10 % first insurance) + 5 fee = 93; without the surcharge it
    // would be 85, so this value discriminates the first-insurance rule.
    expect(results).toEqual([{ premium: 93 }]);
  });
  it("each contract after the first gets a 15 % follow-up discount -- second sword quote 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("the first quote in a scenario gets no follow-up discount -- sword 115 G, not 100 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("the first insurance surcharge still applies on a follow-up contract (each quoted item is a first insurance)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // Second quote: 100 base + 50 curse + 30 enchantment - 20 loyalty
    // + 10 first insurance - 15 follow-up = 155, + 5 fee = 160.
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding in the MHPCO's favour --------------------------------------
  it("a premium calculation yielding 197.5 G -- final premium 198 G (rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    // 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198.
    expect(results).toEqual([{ premium: 198 }]);
  });

  it("intermediate premium amounts are kept as fractions -- only the final premium is rounded", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune", cursed: true }] }],
    });

    // 25 base + 12.5 curse + 2.5 first insurance + 5 fee = 45 exactly.
    // Rounding either fractional intermediate up in the MHPCO's favour before
    // summing would yield 46, so this value discriminates the rule.
    expect(results).toEqual([{ premium: 45 }]);
  });

  // --- Quote integration examples -----------------------------------------
  it("newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const results = runScenario({
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

    // 100 base + 50 curse + 10 first insurance = 160, + 5 fee = 165.
    expect(results).toEqual([{ premium: 165 }]);
  });

  it("3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment - 20 loyalty
    // + 10 first insurance - 15 follow-up = 155, + 5 fee = 160.
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Insurance sum and cap ----------------------------------------------
  it("policy covering a sword and an amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    // Cap = 2 x (1000 + 600) = 3200; payout 200 - 100 deductible = 100.
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("policy covering two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("policy covering a sword and 3 runes -- insurance sum 1750 G, cap 3500 G (block discount affects the premium only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, ...Array(3).fill({ type: "rune" })],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("cursed sword with premium 165 G -- cap 2000 G (premium modifiers do not raise the cap)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });

    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  // --- Claim: standard reimbursement and deductible ------------------------
  it("claim on a steel sword enchantment 3, damage 500 G -- payout 400 G (full reimbursement minus 100 G deductible)", () => {
    const results = runScenario({
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
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune (no enchantment, no material), damage 200 G -- payout 100 G (no special clause applies)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim whose damage is below the deductible -- payout 0 G (the deductible never produces a negative payout)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: special clauses ---------------------------------------------
  it("claim on a steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % high-enchantment clause first, then deductible)", () => {
    const results = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a dragon-material sword enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim on a dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const results = runScenario({
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a dragon-material sword with exactly enchantment 8, damage 1000 G -- payout 400 G (threshold is inclusive)", () => {
    const results = runScenario({
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a steel sword enchantment 7, damage 1000 G -- payout 900 G (below the high-enchantment threshold)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7 }],
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

    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });

  // --- Claim: deductible is per damage event -------------------------------
  it("one incident damaging a sword (500 G) and an amulet (300 G) -- payout 600 G (100 G deductible per damaged item)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("one incident damaging two insured swords -- each damage entry gets its own deductible -- payout 800 G", () => {
    const results = runScenario({
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
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Claim: cap exhaustion across successive claims -----------------------
  it("sword policy (cap 2000 G), two successive claims of 1500 G -- payouts 1400 G then 600 G, cap exhausted", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding in the MHPCO's favour --------------------------------
  it("a payout calculation yielding 350.5 G -- final payout 350 G (rounded down)", () => {
    const results = runScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    // 901 x 50 % = 450.5, - 100 deductible = 350.5 -> 350 (MHPCO's favour).
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection cases ----------------------------------------------
  it("claim naming an item type not covered by the policy (amulet damaged, only a sword insured) -- throws an error", () => {
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
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });

  it("claim naming an unknown item type -- throws an error", () => {
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
              damages: [{ itemType: "broomstick", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws an error", () => {
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
                { itemType: "sword", amount: 500 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("claim with a negative damage amount (-200) -- throws an error", () => {
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
  it("claim referencing a policy step index that is not a quote -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 5,
            incident: {
              cause: "fire",
              damages: [{ itemType: "sword", amount: 500 }],
            },
          },
        ],
      }),
    ).toThrow(/policy/i);
  });

  // --- CLI adapter ---------------------------------------------------------
  it("CLI reads the schema example from stdin and writes results to stdout with exit code 0", () => {
    const run = runCli({
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

    expect(run.status).toBe(0);
    // 60 base - 12 loyalty + 6 first insurance + 5 fee = 59; payout 200 - 100.
    expect(JSON.parse(run.stdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
  it("CLI processes steps sequentially so a later claim uses the policy created by the referenced quote step", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "potion" }] },
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

    expect(run.status).toBe(0);
    // Claim resolves against the sword policy (cap 2000), not the potion one.
    expect(JSON.parse(run.stdout).results[2]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("CLI on an unknown quote item type -- exits non-zero, writes an error description to stderr, writes no results to stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).not.toMatch(/results/);
  });

  it("CLI on an invalid claim -- exits non-zero and writes an error description to stderr", () => {
    const run = runCli({
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
    });

    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/-200/);
    expect(run.stdout).not.toMatch(/results/);
  });
});
