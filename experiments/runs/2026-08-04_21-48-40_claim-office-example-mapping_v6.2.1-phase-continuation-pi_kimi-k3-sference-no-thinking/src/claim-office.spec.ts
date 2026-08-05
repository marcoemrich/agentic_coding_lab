import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";

const TSX = "node_modules/.bin/tsx";
const CLI = "src/cli.ts";

interface CliResult {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliResult {
  try {
    const stdout = execFileSync(TSX, [CLI], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const err = error as { status?: number; stdout?: unknown; stderr?: unknown };
    return {
      status: err.status ?? 1,
      stdout: err.stdout?.toString() ?? "",
      stderr: err.stderr?.toString() ?? "",
    };
  }
}

function resultsOf(scenario: unknown): Array<Record<string, number>> {
  const result = runCli(scenario);
  expect(result.status).toBe(0);
  return (JSON.parse(result.stdout) as { results: Array<Record<string, number>> }).results;
}

const customer = (yearsWithMHPCO: number) => ({ yearsWithMHPCO });
const quote = (items: object[]) => ({ op: "quote", items });
const claim = (policy: number, damages: object[]) => ({
  op: "claim",
  policy,
  incident: { cause: "dragon attack", damages },
});

describe("MHPCO Claim Office", () => {
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const scenario = { customer: customer(0), steps: [quote([])] };
    expect(resultsOf(scenario)).toEqual([{ premium: 5 }]);
  });
  it("single sword -> premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 115 }]);
  });
  it("sword, amulet, staff and potion -> premium 313 G (280 base + 28 first insurance + 5 fee)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          { type: "staff", material: "oak", enchantment: 1, cursed: false },
          { type: "potion", material: "glass", enchantment: 1, cursed: false },
        ]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 313 }]);
  });
  it("2 runes -> premium 60 G (50 base premium)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "rune" }, { type: "rune" }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 60 }]);
  });
  it("3 runes -> premium 71 G (building block of 3 alike: 60 base premium)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 71 }]);
  });
  it("4 runes -> premium 115 G (no block - block requires exactly 3)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 115 }]);
  });
  it("7 runes -> premium 198 G (175 base; 197.5 rounded up in MHPCO's favor)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote(Array.from({ length: 7 }, () => ({ type: "rune" })))],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone -> premium 88 G (75 base; different types are not alike)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones -> premium 137 G (two separate blocks: 120 base)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 137 }]);
  });
  it("newcomer with a cursed sword -> premium 165 G (integration example)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 165 }]);
  });
  it("cursed sword + plain amulet -> premium 231 G (curse surcharge applies to the cursed item only)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 1, cursed: true },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 231 }]);
  });
  it("sword with enchantment exactly 5 -> premium 145 G (high-enchantment surcharge applies)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "sword", material: "steel", enchantment: 5, cursed: false }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 145 }]);
  });
  it("cursed sword with enchantment 5 -> premium 195 G (both surcharges apply)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "sword", material: "steel", enchantment: 5, cursed: true }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 195 }]);
  });
  it("sword with enchantment 4 -> premium 115 G (no high-enchantment surcharge)", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "sword", material: "steel", enchantment: 4, cursed: false }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 115 }]);
  });
  it("customer with exactly 2 years -> loyalty discount: sword premium 95 G", () => {
    const scenario = {
      customer: customer(2),
      steps: [quote([{ type: "sword", material: "steel", enchantment: 1, cursed: false }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 95 }]);
  });
  it("second contract -> 15% follow-up discount: second sword quote premium 100 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    const scenario = { customer: customer(0), steps: [quote([sword]), quote([sword])] };
    expect(resultsOf(scenario)).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("3-year customer's second quote of a cursed sword enchant 7 -> premium 160 G (integration example)", () => {
    const scenario = {
      customer: customer(3),
      steps: [
        quote([{ type: "amulet", material: "silver", enchantment: 1, cursed: false }]),
        quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 59 }, { premium: 160 }]);
  });
  it("claim: regular sword (steel, enchant 3), damage 500 -> payout 400, remainingCap 1600", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 3, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 500 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: rune damage 200 -> payout 100, remainingCap 400", () => {
    const scenario = {
      customer: customer(0),
      steps: [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 33 }, { payout: 100, remainingCap: 400 }]);
  });
  it("claim: sword 500 + amulet 300 in one incident -> payout 600 (deductible per damaged item), remainingCap 2600", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "amulet", material: "silver", enchantment: 1, cursed: false },
        ]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 181 }, { payout: 600, remainingCap: 2600 }]);
  });
  it("claim: dragon sword with enchantment exactly 8, damage 1000 -> payout 400", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 8, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: dragon sword enchant 9, damage 1000 -> payout 400 (50% rule wins over dragon clause)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 9, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: dragon sword enchant 5, damage 800 -> payout 700 (dragon clause only)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "dragon", enchantment: 5, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 800 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 145 }, { payout: 700, remainingCap: 1300 }]);
  });
  it("claim: steel sword enchant 9, damage 1000 -> payout 400 (high-enchantment clause only)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 145 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("claim: steel sword enchant 9, damage 901 -> payout 350 (350.5 rounded down in MHPCO's favor)", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 9, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 901 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 145 }, { payout: 350, remainingCap: 1650 }]);
  });
  it("policy covers two swords -> insurance sum 2000, cap 4000; two sword damages of 500 -> payout 800, remainingCap 3200", () => {
    const sword = { type: "sword", material: "steel", enchantment: 1, cursed: false };
    const scenario = {
      customer: customer(0),
      steps: [
        quote([sword, sword]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 225 }, { payout: 800, remainingCap: 3200 }]);
  });
  it("cursed sword -> cap 2000 based on unmodified insurance value: damage 1500 -> payout 1400, remainingCap 600", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 1, cursed: true }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 165 }, { payout: 1400, remainingCap: 600 }]);
  });
  it("sword + 3 runes -> insurance sum 1750, cap 3500: sword damage 2000 -> payout 1900, remainingCap 1600", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([
          { type: "sword", material: "steel", enchantment: 1, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ]),
        claim(0, [{ itemType: "sword", amount: 2000 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([{ premium: 181 }, { payout: 1900, remainingCap: 1600 }]);
  });
  it("cap exhaustion: two successive claims of 1500 on a sword -> 1400/600 then 600/0", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 1, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
      ],
    };
    expect(resultsOf(scenario)).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("schema example: 5-year customer, silver amulet enchant 2 -> premium 59; fire claim 200 -> payout 100, remainingCap 1100", () => {
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
    expect(resultsOf(scenario)).toEqual([{ premium: 59 }, { payout: 100, remainingCap: 1100 }]);
  });
  it("quote with unknown item type -> non-zero exit, error on stderr, no results on stdout", () => {
    const scenario = { customer: customer(0), steps: [quote([{ type: "broomstick" }])] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).not.toContain("results");
  });
  it("claim damaging an item type not part of the policy -> non-zero exit, error on stderr", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 1, cursed: false }]),
        claim(0, [{ itemType: "amulet", amount: 200 }]),
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("claim with unknown item type -> non-zero exit, error on stderr", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 1, cursed: false }]),
        claim(0, [{ itemType: "broomstick", amount: 200 }]),
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("claim with more damage entries of a type than the policy covers -> non-zero exit, error on stderr", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 1, cursed: false }]),
        claim(0, [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 300 },
        ]),
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
  it("claim with negative damage amount -> non-zero exit, error on stderr", () => {
    const scenario = {
      customer: customer(0),
      steps: [
        quote([{ type: "sword", material: "steel", enchantment: 1, cursed: false }]),
        claim(0, [{ itemType: "sword", amount: -200 }]),
      ],
    };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
  });
});
