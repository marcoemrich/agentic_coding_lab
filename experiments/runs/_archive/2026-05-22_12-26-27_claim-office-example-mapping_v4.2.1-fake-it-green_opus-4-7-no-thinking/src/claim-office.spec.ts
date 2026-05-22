import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
// Implementation lives in ./claim-office.js (logic) and ../src/cli.ts (CLI).
import { quote, claim } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums (R1) ---
  it("empty item list → premium 5 G (processing fee only)", () => {
    expect(quote({ items: [] })).toEqual({ premium: 5 });
  });
  it("single sword → premium 105 G (100 base + 5 fee), neutral customer", () => {
    expect(quote({ items: [{ type: "sword" }] })).toEqual({ premium: 105 });
  });
  it("single amulet → premium 65 G (60 base + 5 fee)", () => {
    expect(quote({ items: [{ type: "amulet" }] })).toEqual({ premium: 65 });
  });
  it("single staff → premium 85 G (80 base + 5 fee)", () => {
    expect(quote({ items: [{ type: "staff" }] })).toEqual({ premium: 85 });
  });
  it("single potion → premium 45 G (40 base + 5 fee)", () => {
    expect(quote({ items: [{ type: "potion" }] })).toEqual({ premium: 45 });
  });
  it("single rune component → premium 30 G (25 base + 5 fee)", () => {
    expect(quote({ items: [{ type: "rune" }] })).toEqual({ premium: 30 });
  });

  // --- Quote: component block (R2) ---
  it("2 runes → 50 G base premium (no block)", () => {
    expect(quote({ items: [{ type: "rune" }, { type: "rune" }] })).toEqual({
      premium: 55,
    });
  });
  it("3 runes → 60 G base premium (block of exactly 3)", () => {
    expect(
      quote({ items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }),
    ).toEqual({ premium: 65 });
  });
  it("4 runes → 100 G base premium (no block; block requires exactly 3)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      }),
    ).toEqual({ premium: 105 });
  });
  it("7 runes → 175 G base premium (7×25; not exactly 3, all singles)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      }),
    ).toEqual({ premium: 180 });
  });
  it("2 runes + 1 moonstone → 75 G base premium (different types, no block)", () => {
    expect(
      quote({
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }),
    ).toEqual({ premium: 80 });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks of 60)", () => {
    expect(
      quote({
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
      }),
    ).toEqual({ premium: 125 });
  });

  // --- Quote: item-specific modifiers (R3) ---
  it("cursed sword → curse adds 50% of item base (100 → +50 base premium)", () => {
    expect(quote({ items: [{ type: "sword", cursed: true }] })).toEqual({
      premium: 155,
    });
  });
  it("sword with enchantment exactly 5 → high-enchantment surcharge +30% applies", () => {
    expect(quote({ items: [{ type: "sword", enchantment: 5 }] })).toEqual({
      premium: 135,
    });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge", () => {
    expect(quote({ items: [{ type: "sword", enchantment: 4 }] })).toEqual({
      premium: 105,
    });
  });
  it("cursed sword with enchantment ≥5 → both curse and high-enchantment surcharges apply", () => {
    expect(
      quote({ items: [{ type: "sword", cursed: true, enchantment: 5 }] }),
    ).toEqual({ premium: 185 });
  });

  // --- Quote: policy-wide modifiers (R3) ---
  it("customer with exactly 2 years → 20% loyalty discount applies to policy base", () => {
    expect(
      quote({ items: [{ type: "sword" }], yearsWithMHPCO: 2 }),
    ).toEqual({ premium: 85 });
  });
  it("first insurance → +10% surcharge per item base premium", () => {
    expect(
      quote({ items: [{ type: "sword" }], firstInsurance: true }),
    ).toEqual({ premium: 115 });
  });
  it("second quote in scenario → 15% follow-up discount applies policy-wide", () => {
    expect(
      quote({ items: [{ type: "sword" }], followUp: true }),
    ).toEqual({ premium: 90 });
  });

  // --- Quote: modifier scope on multi-item policies (R3) ---
  it("cursed sword (base 100) + plain amulet (base 60) → 210 G before fee (curse on sword base only)", () => {
    expect(
      quote({ items: [{ type: "sword", cursed: true }, { type: "amulet" }] }),
    ).toEqual({ premium: 215 });
  });

  // --- Quote: integration examples (R3) ---
  it("newcomer (0 years) cursed sword steel ench 3 → premium 165 G (100+50 curse+10 first +5 fee)", () => {
    expect(
      quote({
        items: [
          { type: "sword", cursed: true, material: "steel", enchantment: 3 },
        ],
        yearsWithMHPCO: 0,
        firstInsurance: true,
      }),
    ).toEqual({ premium: 165 });
  });
  it("3-year customer 2nd quote, cursed sword steel ench 7 → premium 160 G (100+50+30-20+10-15+5)", () => {
    expect(
      quote({
        items: [
          { type: "sword", cursed: true, material: "steel", enchantment: 7 },
        ],
        yearsWithMHPCO: 3,
        followUp: true,
        firstInsurance: true,
      }),
    ).toEqual({ premium: 160 });
  });

  // --- Quote: rounding (R4) ---
  it("premium yielding 197.5 G → final premium 198 G (rounded up)", () => {
    expect(
      quote({
        items: [
          { type: "sword", cursed: true, enchantment: 5 },
          { type: "rune" },
        ],
        yearsWithMHPCO: 2,
        firstInsurance: true,
      }),
    ).toEqual({ premium: 198 });
  });

  // --- Claim: standard reimbursement (R5) ---
  it("steel sword ench 3, damage 500 → payout 400 G (full minus 100 deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (value 250), damage 200 → payout 100 G (no clause; minus 100 deductible)", () => {
    expect(
      claim(
        [{ type: "rune" }],
        { cause: "theft", damages: [{ itemType: "rune", amount: 200 }] },
      ),
    ).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: deductible per damage event (R5) ---
  it("dragon attack damages sword (500) + amulet (300) → payout 600 G (deductible per item)", () => {
    expect(
      claim(
        [{ type: "sword" }, { type: "amulet" }],
        {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      ),
    ).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: enchantment threshold vs dragon material (R5) ---
  it("dragon sword ench exactly 8, damage 1000 → payout 400 G (50% rule wins, then deductible)", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 8 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 9, damage 1000 → payout 400 G (both clauses, 50% wins: 500−100)", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 9 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 5, damage 800 → payout 700 G (dragon clause only: 800−100)", () => {
    expect(
      claim(
        [{ type: "sword", material: "dragon", enchantment: 5 }],
        { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
      ),
    ).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9, damage 1000 → payout 400 G (high-enchantment only: 500−100)", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
      ),
    ).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: payout rounding (R4) ---
  it("payout yielding 350.5 G → final payout 350 G (rounded down)", () => {
    expect(
      claim(
        [{ type: "sword", material: "steel", enchantment: 9 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
      ),
    ).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: cap (R5) ---
  it("policy sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    expect(
      claim(
        [{ type: "sword" }, { type: "amulet" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
      ),
    ).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword (modified premium 165 G) → cap 2000 G (based on unmodified insurance value)", () => {
    expect(
      claim(
        [{ type: "sword", cursed: true, material: "steel", enchantment: 3 }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
      ),
    ).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("policy sword + 3 runes (block) → insurance sum 1750 G (block affects premium only, not sum)", () => {
    expect(
      claim(
        [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
      ),
    ).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("policy with two swords → insurance sum 2000 G, cap 4000 G", () => {
    expect(
      claim(
        [{ type: "sword" }, { type: "sword" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
      ),
    ).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("sword (cap 2000), first claim 1500 → payout 1400 G, remainingCap 600 G", () => {
    expect(
      claim(
        [{ type: "sword" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
      ),
    ).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000), second successive claim 1500 → payout 600 G (capped), remainingCap 0 G", () => {
    expect(
      claim(
        [{ type: "sword" }],
        { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        600,
      ),
    ).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- CLI surface (R7) ---
  it("CLI reads JSON scenario from stdin and writes {results:[...]} to stdout", () => {
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
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI processes quote then claim sequentially; claim references policy by zero-based index", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
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
    };
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- CLI error cases (R6) ---
  it("CLI: quote with unknown item type (broomstick) → non-zero exit, error to stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    };
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).not.toContain("results");
  });
  it("CLI: claim references item not in policy (amulet, only sword insured) → non-zero exit + stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
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
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).not.toContain("results");
  });
  it("CLI: claim damage amount -200 → non-zero exit + stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
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
    };
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).not.toContain("results");
  });
  it("CLI: more damage entries of a type than insured (2 sword damages, 1 sword) → non-zero exit, claim rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    };
    const { status, stdout, stderr } = runCli(scenario);
    expect(status).not.toBe(0);
    expect(stderr).not.toBe("");
    expect(stdout).not.toContain("results");
  });
});
