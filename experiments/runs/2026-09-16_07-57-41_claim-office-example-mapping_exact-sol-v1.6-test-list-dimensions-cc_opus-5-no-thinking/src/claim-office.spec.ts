import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliOutcome {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return { status: failure.status, stdout: failure.stdout, stderr: failure.stderr };
  }
}

/**
 * Observable contract for rejection cases.
 *
 * The specification states that invalid scenarios make "the CLI exit with a
 * non-zero status code and write an error description to stderr". It does not
 * name an error type or message. Chosen reading: the domain layer throws a
 * plain `Error` whose message describes the rejection, and the CLI adapter
 * translates any thrown error into exit code 1 plus a stderr description.
 * Domain-level tests assert only that an `Error` is thrown; CLI-level tests
 * assert exit code, empty stdout, and non-empty stderr.
 */

describe("MHPCO Claim Office", () => {
  // --- Quote: simplest case -------------------------------------------------
  it("quote with an empty item list -- premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  // --- Quote: main item base premiums (parallel price-list catalogue) -------
  it("quote for a plain sword -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for a plain amulet -- premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quote for a plain staff -- premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quote for a plain potion -- premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: component base premiums (parallel component catalogue) --------
  it("quote for a single rune -- premium 32.5 -> 33 G (25 base + 2.5 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quote for a single moonstone -- premium 32.5 -> 33 G (25 base + 2.5 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });

  // --- Quote: building block of 3 alike components -------------------------
  it("quote for 2 runes -- base premium 50 G (no block)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quote for 3 runes -- base premium 60 G (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quote for 4 runes -- base premium 100 G (no block -- block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for 7 runes -- base premium 175 G (no block at 7)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quote for 2 runes + 1 moonstone -- base premium 75 G (no block: alike means same type)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });

    expect(results).toEqual([{ premium: 88 }]);
  });
  it("quote for 3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    const results = runScenario({
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

    expect(results).toEqual([{ premium: 137 }]);
  });

  // --- Quote: item-specific modifiers --------------------------------------
  it("quote for a cursed sword -- curse adds 50 % of that item's base premium (+50 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quote for a sword with enchantment 5 -- high-enchantment surcharge applies (+30 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 145 }]);
  });
  it("quote for a sword with enchantment 4 -- no high-enchantment surcharge", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote for a cursed sword with enchantment 5 -- both surcharges apply (+50 G +30 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 195 }]);
  });

  // --- Quote: item-specific modifier scope on multi-item policies ----------
  it("quote for a cursed sword + plain amulet -- policy base 160 G, curse adds 50 G (of the sword only) -> 210 G before policy modifiers and fee", () => {
    const results = runScenario({
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

    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Quote: policy-wide modifiers ----------------------------------------
  it("quote for a customer with 2 years with MHPCO -- 20 % loyalty discount applies (threshold met)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("quote for a customer with 1 year with MHPCO -- no loyalty discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quote's first item always carries the 10 % initial assessment surcharge on the policy base", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 225 }]);
  });
  it("second quote step in a scenario -- 15 % follow-up contract discount on the policy base", () => {
    const plainSword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [plainSword] },
        { op: "quote", items: [plainSword] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("first quote step in a scenario -- no follow-up contract discount", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("third quote step in a scenario -- 15 % follow-up contract discount still applies", () => {
    const plainSword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [plainSword] },
        { op: "quote", items: [plainSword] },
        { op: "quote", items: [plainSword] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }, { premium: 100 }]);
  });
  it("first insurance surcharge still applies on a follow-up contract (each quote is a first insurance for its items)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rounding in MHPCO's favor ------------------------------------
  it("premium of 197.5 G rounds up to 198 G (MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("intermediate premium amounts are kept as fractions; only the final premium is rounded", () => {
    // base 25, +2.5 first insurance, -5 loyalty, +5 fee = 27.5 -> 28
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 28 }]);
  });

  // --- Quote: integration examples -----------------------------------------
  it("newcomer (0 years, first contract) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ----------------------------------------------------
  it("quote with an unknown item type (e.g. broomstick) -- throws an Error (CLI: non-zero exit, stderr, no results)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: insurance sum and cap ----------------------------------------
  it("policy covering a sword -- insurance sum 1000 G, cap 2000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("policy covering a sword and an amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const results = runScenario({
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
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3300 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("policy covering two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 4200 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("policy covering a sword and 3 runes -- insurance sum 1750 G (block discount affects premium only), cap 3500 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            ...Array.from({ length: 3 }, () => ({ type: "rune" })),
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3700 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("cursed sword with premium modifiers (premium 165 G) -- cap 2000 G, based on the unmodified insurance value", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    });

    expect(results).toEqual([
      { premium: 165 },
      { payout: 2000, remainingCap: 0 },
    ]);
  });

  // --- Claim: standard reimbursement and deductible ------------------------
  it("claim on a regular steel sword enchantment 3, damage 500 G -- payout 400 G (full minus 100 G deductible)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune, damage 200 G -- payout 100 G (components have no enchantment or material)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim whose damage amount is below the deductible -- payout 0 G, never negative", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 60 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: special clauses ----------------------------------------------
  it("claim on a steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % first, then deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a steel sword enchantment 8, damage 1000 G -- payout 400 G (threshold >= 8 applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a steel sword enchantment 7, damage 1000 G -- payout 900 G (no high-enchantment clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 900, remainingCap: 1100 });
  });
  it("claim on a dragon-material sword enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claim on a dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (50 % rule wins over dragon material)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a dragon-material sword enchantment 8, damage 1000 G -- payout 400 G (high-enchantment clause, then deductible)", () => {
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: deductible per damage event ----------------------------------
  it("claim with damages to a sword (500 G) and an amulet (300 G) -- payout 600 G (deductible once per damaged item)", () => {
    const results = runScenario({
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
            cause: "dragon",
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
  it("claim with two sword damage entries on a two-sword policy -- each entry gets its own deductible", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const results = runScenario({
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
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 700, remainingCap: 3300 });
  });

  // --- Claim: cap exhaustion across successive claims ----------------------
  it("first claim of 1500 G on a sword policy -- payout 1400 G, remainingCap 600 G", () => {
    const results = runScenario({
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
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("second claim of 1500 G on the same policy -- payout 600 G, remainingCap 0 G (reduced to remaining cap)", () => {
    const results = runScenario({
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
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding in MHPCO's favor ------------------------------------
  it("payout of 350.5 G rounds down to 350 G (MHPCO's favor)", () => {
    // 901 damage at 50 % = 450.5, minus the 100 G deductible = 350.5 -> 350
    const results = runScenario({
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

    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection ----------------------------------------------------
  it("claim referencing an item not covered by the policy (amulet damaged, only a sword insured) -- throws an Error", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("claim referencing a damage entry with an unknown item type -- throws an Error", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws an Error", () => {
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
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 400 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("claim with a negative damage amount (-200) -- throws an Error", () => {
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
      }),
    ).toThrow(/-200|negative/);
  });

  // --- CLI adapter ---------------------------------------------------------
  it("CLI reads a scenario from stdin and writes {results: [...]} to stdout in step order", () => {
    const outcome = runCli({
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

    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI writes a quote result as {premium} and a claim result as {payout, remainingCap}", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    const parsed = JSON.parse(outcome.stdout) as { results: Record<string, number>[] };
    expect(Object.keys(parsed.results[0])).toEqual(["premium"]);
    expect(Object.keys(parsed.results[1]).sort()).toEqual(["payout", "remainingCap"]);
  });
  it("CLI exits non-zero, writes stderr, and writes no results on an invalid scenario", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(outcome.status).not.toBe(0);
    expect(outcome.stdout).toBe("");
    expect(outcome.stderr).toMatch(/broomstick/);
  });
});
