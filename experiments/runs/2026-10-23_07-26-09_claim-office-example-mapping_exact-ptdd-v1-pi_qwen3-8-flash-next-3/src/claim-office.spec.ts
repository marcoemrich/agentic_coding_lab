import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario, type Scenario } from "./scenario.js";

function runCli(input: string): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync(
    "node_modules/.bin/tsx",
    ["src/cli.ts"],
    { input, encoding: "utf8" },
  );
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

// MHPCO Claim Office — complete inactive test list.
// Every entry is one observable behavior from prompt.md, ordered simple -> complex.
// Observable contract for rejections (spec leaves the mechanism open beyond "CLI exits
// non-zero + stderr description"): the domain throws ScenarioError (a plain Error
// subclass); the CLI adapter writes the message to stderr, prints no results to
// stdout, and exits with status 1. Tests assert the thrown ScenarioError for domain
// checks and the exit status / stderr / stdout shape for CLI checks.

describe("Quote premium basics", () => {
  it("empty item list yields premium 5 (processing fee only) -- new customer, first quote", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 5 }]);
  });
  it("single amulet for a newcomer yields premium 71 (60 base + 10% first insurance 6 + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet" }] },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 71 }]);
  });
  it("single sword for a newcomer yields premium 115 (100 base + 10% first insurance 10 + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("single staff for a newcomer yields premium 93 (80 base + 10% first insurance 8 + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "staff" }] },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 93 }]);
  });
  it("single potion for a newcomer yields premium 49 (40 base + 10% first insurance 4 + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "potion" }] },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 49 }]);
  });
});

describe("Component pricing and building blocks", () => {
  it("2 runes yield base premium 50 -> final 60 (50 + 10% first insurance 5 + 5 fee, no block)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 60 }]);
  });
  it("3 runes yield block base premium 60 -> final 71 (60 + 6 + 5, block of exactly 3 applies)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 71 }]);
  });
  it("4 runes yield base premium 100 -> final 115 (no block, block requires exactly 3 alike)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("7 runes yield base premium 175 -> 175 + 17.5 + 5 = 197.5 rounded up in MHPCO favor -> 198 (also covers rounding-up example)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
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
    };
    expect(runScenario(scenario)).toEqual([{ premium: 198 }]);
  });
  it("2 runes + 1 moonstone yield base premium 75 -> 75 + 7.5 + 5 = 87.5 -> 88 (alike means same type, no cross-type block)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 88 }]);
  });
  it("3 runes + 3 moonstones yield base premium 120 -> final 137 (two separate 60 G blocks + 12 + 5)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
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
    };
    expect(runScenario(scenario)).toEqual([{ premium: 137 }]);
  });
});

describe("Policy-wide premium modifiers", () => {
  it("customer with exactly 2 years with MHPCO gets loyalty discount -> single sword premium 95 (100 + 10 first - 20 loyalty + 5 fee)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote" as const, items: [{ type: "sword" }] }],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 95 }]);
  });
  it("customer with 1 year gets no loyalty discount -> single sword premium 115 (threshold is >= 2 years)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote" as const, items: [{ type: "sword" }] }],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("newcomer with cursed sword (steel, enchantment 3) yields premium 165 (100 base + 50 curse + 10 first insurance + 5 fee) -- integration example", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 165 }]);
  });
  it("cursed sword + plain amulet for newcomer yields premium 231: base 160, curse surcharge 50 (50% of cursed item base only, not policy total), first insurance 16 (10% of 160), fee 5 -- modifier scope example", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 231 }]);
  });
  it("sword with exactly enchantment 5 yields high-ench surcharge -> premium 145 (100 + 30 + 10 + 5)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", enchantment: 5 }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 not cursed yields no surcharge -> premium 115 (high-ench requires >= 5)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", enchantment: 4 }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with exactly enchantment 5 gets both surcharges -> premium 195 (100 + 50 + 30 + 10 + 5)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([{ premium: 195 }]);
  });
  it("second quote in scenario for 3-year customer, cursed sword enchantment 7 yields premium 160 (100 + 50 + 30 - 20 loyalty + 10 first insurance still applies per item - 15 follow-up + 5 fee); first quote (amulet) in same scenario yields 59 -- integration example with follow-up resolution", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet" }] },
        {
          op: "quote" as const,
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
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 59 },
      { premium: 160 },
    ]);
  });
});

describe("Claim reimbursement basics", () => {
  it("steel sword enchantment 3 damaged 500 -> payout 400 (full reimbursement minus 100 deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "duel",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("rune (no enchantment, no material) damaged 200 -> payout 100 (full minus 100 deductible, no special clause)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fall",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 33 },
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("dragon attack damages steel sword (500) and silver amulet (300) -> payout 600 (100 deductible once per damaged item)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel" },
            { type: "amulet", material: "silver" },
          ],
        },
        {
          op: "claim" as const,
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
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 181 },
      { payout: 600, remainingCap: 2600 },
    ]);
  });
});

describe("Claim special clauses: enchantment and dragon material", () => {
  it("dragon-material sword enchantment 8 damaged 1000 -> payout 400 (high-ench 50% clause applies at >= 8 even for dragon, then deductible: 500 - 100)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 8 },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "siege",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword enchantment 9 damaged 1000 -> payout 400 (both clauses, 50% rule wins: 500 - 100)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 9 },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("dragon-material sword enchantment 5 damaged 800 -> payout 700 (dragon full reimbursement, then deductible)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 5 },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("steel sword enchantment 9 damaged 1000 -> payout 400 (only 50% clause: 500 - 100)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9 },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "wizard duel",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("steel sword enchantment 9 damaged 901 -> 450.5 - 100 = 350.5 rounded down in MHPCO favor -> payout 350 (rounding-down example, intermediates kept as fractions)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9 },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "wild magic",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 145 },
      { payout: 350, remainingCap: 1650 },
    ]);
  });
});

describe("Policy cap across claims", () => {
  it("sword policy: successive claims of 1500 and 1500 -> payouts 1400 then 600, remainingCap 600 then 0 (cap 2000 = 2x insurance value)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel" }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "ambush",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("two swords insured -> insurance sum 2000, cap 4000: damages sword 2500 + sword 2500 -> payout 4000, remainingCap 0 (each damage entry has its own deductible, cap 2x summed values)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel" },
            { type: "sword", material: "steel" },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 2500 },
              { itemType: "sword", amount: 2500 },
            ],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 225 },
      { payout: 4000, remainingCap: 0 },
    ]);
  });
  it("cursed sword (premium 165) damaged 3000 -> payout 2000 (cap 2000 based on unmodified insurance value, premium modifiers do not raise cap)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", cursed: true }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "curse backlash",
            damages: [{ itemType: "sword", amount: 3000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 165 },
      { payout: 2000, remainingCap: 0 },
    ]);
  });
  it("sword + 3 runes block -> insurance sum 1750, cap 3500: sword damaged 4000 -> payout 3500, remainingCap 0 (block discount affects premium only)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "explosion",
            damages: [{ itemType: "sword", amount: 4000 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 181 },
      { payout: 3500, remainingCap: 0 },
    ]);
  });
  it("sword + amulet -> insurance sum 1600, cap 3200: damages sword 2000 + amulet 1500 -> payout 3200, remainingCap 0", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel" },
            { type: "amulet", material: "silver" },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "castle collapse",
            damages: [
              { itemType: "sword", amount: 2000 },
              { itemType: "amulet", amount: 1500 },
            ],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 181 },
      { payout: 3200, remainingCap: 0 },
    ]);
  });
  it("staff + potion -> insurance sum 1200, cap 2400: staff damaged 2500 -> desired 2400 equals cap exactly -> payout 2400, remainingCap 0 (staff value 800, potion value 400)", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "staff", material: "oak" },
            { type: "potion", material: "glass" },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "shelf collapse",
            damages: [{ itemType: "staff", amount: 2500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario)).toEqual([
      { premium: 137 },
      { payout: 2400, remainingCap: 0 },
    ]);
  });
});

describe("Multi-step scenario through the CLI (schema example)", () => {
  it("5-year customer: quote amulet -> premium 59 (60 + 10% first - 20% loyalty + 5 fee); claim fire amulet damaged 200 -> payout 100, remainingCap 1100 (cap 1200 = 2x600)", () => {
    const cli = runCli(
      JSON.stringify({
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
      }),
    );
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    });
  });
});

describe("Rejections via the CLI (non-zero exit, stderr description, no results on stdout)", () => {
  it("quote including unknown item type broomstick -> CLI exits non-zero, writes error description to stderr, writes no results to stdout", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "broomstick" }] },
        ],
      }),
    );
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
    expect(cli.stdout).not.toContain("results");
  });
  it("claim damages item not covered by policy (amulet damaged when only sword insured) -> CLI exits non-zero with stderr description", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "theft attempt",
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    );
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
    expect(cli.stdout).not.toContain("results");
  });
  it("claim damage entry with unknown itemType -> CLI exits non-zero with stderr description", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "poltergeist",
              damages: [{ itemType: "broomstick", amount: 100 }],
            },
          },
        ],
      }),
    );
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
    expect(cli.stdout).not.toContain("results");
  });
  it("claim damage entry with amount -200 -> CLI exits non-zero with stderr description", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel" }],
          },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "vandalism",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      }),
    );
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
    expect(cli.stdout).not.toContain("results");
  });
  it("claim with more damage entries of a type than insured (two sword damages, one sword) -> CLI exits non-zero, whole claim rejected", () => {
    const cli = runCli(
      JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel" }],
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
    );
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
    expect(cli.stdout).not.toContain("results");
  });
});
