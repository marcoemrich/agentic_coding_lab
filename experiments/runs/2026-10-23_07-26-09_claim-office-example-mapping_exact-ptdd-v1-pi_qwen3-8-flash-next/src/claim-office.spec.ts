import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./scenario.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));
const TSX_PATH = fileURLToPath(
  new URL("../node_modules/.bin/tsx", import.meta.url)
);

function runCli(stdin: string): { status: number | null; stdout: string; stderr: string } {
  const proc = spawnSync(TSX_PATH, [CLI_PATH], {
    input: stdin,
    encoding: "utf8",
    timeout: 30000,
  });
  return { status: proc.status, stdout: proc.stdout, stderr: proc.stderr };
}

// MHPCO Claim Office kata - complete inactive test list.
// Chosen observable error contract where the spec is explicit:
//   CLI-level rejections exit with a non-zero status code and write an error
//   description to stderr with no `results` on stdout; at the application
//   boundary (runScenario) this is expressed as a thrown Error that the CLI
//   adapter converts to that exit code + stderr.
describe("quote premium", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword -> premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet -> premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff -> premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion -> premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune -> premium 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up from 32.5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone -> premium 33 G (component 25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes -> premium 60 G (base 50, no block: 50 + 5 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 alike runes -> premium 71 G (block base 60: 60 + 6 + 5)", () => {
    const runes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> premium 115 G (no block, exactly 3 required: base 100 -> 100 + 10 + 5)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> premium 198 G (base 175 + 17.5 first-insurance + 5 = 197.5 rounded up, spec rounding example)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: runes }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> premium 88 G (alike means same type, no block: base 75 -> 87.5 rounded up)", () => {
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> premium 137 G (two separate blocks: base 120 -> 120 + 12 + 5)", () => {
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
  it("customer with exactly 2 years with MHPCO -> loyalty discount applies: sword premium 95 G (100 - 20 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year -> no loyalty discount: sword premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword with exactly enchantment 5 -> high-enchantment surcharge: premium 145 G (100 + 30 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sword cursed with enchantment 5 -> both surcharges apply -> premium 195 G (100 + 50 + 30 + 10 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("modifier scope: cursed sword + plain amulet -> item surcharge only on cursed item: 160 + 50 + 16 + 5 = 231 G", () => {
    const items = [
      { type: "sword", cursed: true },
      { type: "amulet" },
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("integration newcomer cursed steel sword enchantment 3, 0 years -> premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("follow-up contract: second quote in scenario gets 15 percent discount -> first 115, second 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("integration long-standing 3-year customer second quote, cursed steel sword enchantment 7 -> premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });
});

describe("claim payout", () => {
  it("standard reimbursement: steel sword enchantment 3, damage 500 -> payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (no enchantment or material): damage 200 -> payout 100, remainingCap 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fall", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("deductible per damage event: dragon attack damages sword 500 and amulet 300 -> payout 600, remainingCap 2600", () => {
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
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });
  it("high enchantment clause: steel sword enchantment 9, damage 1000 -> payout 400 (50 percent then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon material clause: dragon sword enchantment 5, damage 800 -> payout 700 (full reimbursement then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("both clauses: dragon sword enchantment 9, damage 1000 -> payout 400 (50 percent rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("enchantment exactly 8 with dragon material, damage 1000 -> payout 400 (50 percent clause applies, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("payout rounding in MHPCO favor: steel sword enchantment 9, damage 901 -> 450.5 - 100 = 350.5 -> payout 350 (rounded down)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "curse", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
  it("two swords insured, damages sword 500 and sword 300 -> payout 600 (each entry own deductible), remainingCap 3400 (cap 4000)", () => {
    const result = runScenario({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("cap uses unmodified insurance value: cursed sword, damage 2100 -> payout 2000, remainingCap 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "crash", damages: [{ itemType: "sword", amount: 2100 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("cap exhaustion: sword policy, two successive claims of 1500 -> payout 1400 remainingCap 600, then payout 600 remainingCap 0", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "raid", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        claim,
        claim,
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("components count toward insurance sum: sword + 3 runes (block), claim rune 200 -> payout 100, remainingCap 3400 (cap 2 x 1750)", () => {
    const items = [
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "quake", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 100, remainingCap: 3400 }],
    });
  });
  it("schema example end-to-end (5-year customer so loyalty applies): amulet quote -> premium 59, claim 200 -> payout 100 remainingCap 1100", () => {
    const result = runScenario({
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
    expect(result).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});

describe("scenario rejections", () => {
  it("quote with unknown item type (broomstick) -> runScenario fails with an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow(Error);
  });
  it("CLI: quote with unknown item type -> non-zero exit code, error description on stderr, no results on stdout", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const outcome = runCli(scenario);
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/broomstick/);
    expect(outcome.stdout).not.toMatch(/results/);
  });
  it("claim damage entry references an item type not part of the policy -> runScenario fails with an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      })
    ).toThrow(Error);
  });
  it("claim damage entry with an unknown item type -> runScenario fails with an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "mystery", damages: [{ itemType: "broomstick", amount: 100 }] },
          },
        ],
      })
    ).toThrow(Error);
  });
  it("claim damage entry with negative amount -200 -> runScenario fails with an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "audit", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    ).toThrow(Error);
  });
  it("CLI: claim with negative damage amount -> non-zero exit code, error description on stderr", () => {
    const outcome = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "audit", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      })
    );
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toMatch(/negative/);
    expect(outcome.stdout).not.toMatch(/results/);
  });
  it("claim with more damage entries of a type than insured (two sword damages, one sword) -> whole claim rejected with an Error", () => {
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
      })
    ).toThrow(Error);
  });
});
