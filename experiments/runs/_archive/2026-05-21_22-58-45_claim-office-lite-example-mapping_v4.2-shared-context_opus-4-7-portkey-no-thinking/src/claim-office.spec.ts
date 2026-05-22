import { describe, it, expect } from "vitest";
import { quote, claim } from "./claim-office.js";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const CLI_PATH = resolve(dirname(fileURLToPath(import.meta.url)), "cli.ts");

function runCli(stdin: string): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync("npx", ["tsx", CLI_PATH], {
    input: stdin,
    encoding: "utf8",
  });
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

describe("Claim Office — quote / premium calculation", () => {
  it("empty item list → premium 5 G (processing fee only)", () => {
    expect(quote({ customer: { yearsWithMHPCO: 0 }, items: [] })).toBe(5);
  });

  it("single potion, newcomer (0 years), no modifiers → 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "potion" }],
      })
    ).toBe(49);
  });

  it("single amulet, newcomer (0 years), no modifiers → 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "amulet" }],
      })
    ).toBe(71);
  });

  it("single staff, newcomer (0 years), no modifiers → 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "staff" }],
      })
    ).toBe(93);
  });

  it("single sword, newcomer (0 years), no modifiers → 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword" }],
      })
    ).toBe(115);
  });

  it("single rune component, newcomer → 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }],
      })
    ).toBe(33);
  });

  it("2 runes (no building block) → 60 G base premium, premium 60 G (50 + 5 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }],
      })
    ).toBe(60);
  });

  it("3 runes (building block applies) → 60 G base, premium 71 G (60 + 6 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
      })
    ).toBe(71);
  });

  it("4 runes (no block — requires exactly 3) → 100 G base, premium 115 G (100 + 10 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      })
    ).toBe(115);
  });

  it("7 runes (1 block of 3 + 4 individuals) → 175 G base, premium 198 G (175 + 17.5 first-insurance + 5 fee, rounded up from 197.5)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
      })
    ).toBe(198);
  });

  it("2 runes + 1 moonstone → no block (different types) → 75 G base, premium 88 G (75 + 7.5 + 5, rounded up from 87.5)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      })
    ).toBe(88);
  });

  it("3 runes + 3 moonstones → two separate blocks → 120 G base, premium 137 G (120 + 12 first-insurance + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ],
      })
    ).toBe(137);
  });

  it("sword enchantment 4, not cursed → no high-enchantment surcharge → 115 G (boundary: below 5)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 4, cursed: false }],
      })
    ).toBe(115);
  });

  it("sword enchantment exactly 5, not cursed → high-enchantment surcharge applies → 145 G (100 + 30 high-ench + 10 first-ins + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 5, cursed: false }],
      })
    ).toBe(145);
  });

  it("cursed sword enchantment 5 → both curse and high-enchantment surcharges → 195 G (100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", enchantment: 5, cursed: true }],
      })
    ).toBe(195);
  });

  it("customer with exactly 2 years, single plain sword → loyalty discount applies → 95 G (100 + 10 first-ins − 20 loyalty + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 2 },
        items: [{ type: "sword" }],
      })
    ).toBe(95);
  });

  it("customer with 1 year, single plain sword → no loyalty → 115 G (boundary: below 2 years)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 1 },
        items: [{ type: "sword" }],
      })
    ).toBe(115);
  });

  it("newcomer with cursed sword (steel, enchantment 3) → 165 G (100 base + 50 curse + 10 first-insurance + 5 fee) [E10 integration]", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      })
    ).toBe(165);
  });

  it("cursed sword + plain amulet, newcomer → 231 G (160 policy base + 50 curse on sword only + 16 first-ins + 5 fee) [E2 modifier scope]", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 0 },
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
      })
    ).toBe(231);
  });

  it("long-standing customer (3 yrs), first quote in scenario, single plain sword → 95 G (no follow-up discount on first quote: 100 + 10 first-ins − 20 loyalty + 5 fee)", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 3 },
        items: [{ type: "sword" }],
      })
    ).toBe(95);
  });

  it("long-standing customer's second quote in scenario: cursed sword enchantment 7 → 160 G (100 + 50 curse + 30 high-ench − 20 loyalty + 10 first-ins − 15 follow-up + 5 fee) [E11 integration]", () => {
    expect(
      quote({
        customer: { yearsWithMHPCO: 3 },
        items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        previousQuoteCount: 1,
      })
    ).toBe(160);
  });
});

describe("Claim Office — claim / payout calculation", () => {
  it("standard reimbursement: steel sword, enchantment 3, damage 500 G → payout 400 G (500 − 100 deductible)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 500 }],
        },
      })
    ).toBe(400);
  });

  it("standard reimbursement: damaged rune (no enchantment, no material), damage 200 G → payout 100 G (200 − 100 deductible)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "rune" }],
        },
        incident: {
          cause: "fire",
          damages: [{ itemType: "rune", amount: 200 }],
        },
      })
    ).toBe(100);
  });

  it("dragon attack damages a sword (500 G) and an amulet (300 G) in one event → payout 600 G (each item gets its own 100 G deductible: 400 + 200)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
        },
        incident: {
          cause: "dragon",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "amulet", amount: 300 },
          ],
        },
      })
    ).toBe(600);
  });

  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon clause: full reimbursement, then 100 G deductible)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        incident: {
          cause: "dragon",
          damages: [{ itemType: "sword", amount: 800 }],
        },
      })
    ).toBe(700);
  });

  it("dragon-material sword, enchantment exactly 8, damage 1000 G → payout 400 G (high-ench clause wins: 50% then deductible: 500 − 100)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        incident: {
          cause: "dragon",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      })
    ).toBe(400);
  });

  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (both clauses apply; 50% rule wins: 500 − 100)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        incident: {
          cause: "dragon",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      })
    ).toBe(400);
  });

  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (only high-enchantment clause: 50% then deductible: 500 − 100)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        incident: {
          cause: "fire",
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      })
    ).toBe(400);
  });

  it("policy covers two swords; claim has two sword damage entries → each treated separately with its own deductible (e.g. damages 500 and 300 → 400 + 200 = 600 G)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "sword", material: "steel", enchantment: 3 },
          ],
        },
        incident: {
          cause: "fire",
          damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 300 },
          ],
        },
      })
    ).toBe(600);
  });

  it("payout rounding: dragon-material sword enchantment 9, damage 1001 G → payout 400 G (50% = 500.5, − 100 deductible = 400.5 → rounded down)", () => {
    expect(
      claim({
        policy: {
          customer: { yearsWithMHPCO: 0 },
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        incident: {
          cause: "dragon",
          damages: [{ itemType: "sword", amount: 1001 }],
        },
      })
    ).toBe(400);
  });
});

describe("Claim Office CLI", () => {
  it("CLI reads scenario JSON from stdin (customer + quote + claim) and writes {results: [{premium}, {payout}]} JSON to stdout with exit code 0", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    const { stdout, status } = runCli(JSON.stringify(scenario));
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed).toEqual({
      results: [
        { premium: 59 },
        { payout: 100 },
      ],
    });
  });

  it("CLI: empty steps array → writes {results: []} to stdout, exit code 0", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [],
    };
    const { stdout, status } = runCli(JSON.stringify(scenario));
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed).toEqual({ results: [] });
  });

  it("CLI: quote includes an item with an unknown type (e.g. broomstick) → exits non-zero, writes error description to stderr, no results on stdout", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "broomstick" }],
        },
      ],
    };
    const { stdout, stderr, status } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).not.toContain("results");
  });

  it("CLI: claim references item type not present in the policy (e.g. amulet damage when only a sword is insured) → exits non-zero, writes error description to stderr", () => {
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
    const { stderr, status } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("CLI: claim references an item with an unknown type → exits non-zero, writes error description to stderr", () => {
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
            damages: [{ itemType: "broomstick", amount: 200 }],
          },
        },
      ],
    };
    const { stderr, status } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("CLI: claim contains a damage entry with amount -200 → exits non-zero, writes error description to stderr", () => {
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
    const { stderr, status } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("CLI: damages array contains more entries of a type than the policy covers (e.g. two sword damages but only one sword insured) → exits non-zero, whole claim rejected", () => {
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
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    const { stderr, status } = runCli(JSON.stringify(scenario));
    expect(status).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });

  it("CLI end-to-end: long-standing customer (3 yrs), two consecutive quotes for cursed sword (steel, ench 7) → second quote result is {premium: 160} [E11 scenario-scoped follow-up discount]", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const { stdout, status } = runCli(JSON.stringify(scenario));
    expect(status).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.results[1]).toEqual({ premium: 160 });
  });
});
