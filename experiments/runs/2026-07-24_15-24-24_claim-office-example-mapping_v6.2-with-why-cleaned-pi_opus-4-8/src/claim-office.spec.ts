import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import {
  basePremium,
  insuranceSum,
  quotePremium,
  roundPremium,
  roundPayout,
  runScenario,
} from "./claim-office.js";

describe("basePremium - main item values", () => {
  it("sword base premium is 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("amulet base premium is 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("staff base premium is 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("potion base premium is 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("single component (rune) base premium is 25 G", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
});

describe("basePremium - building block of 3 alike components", () => {
  it("2 runes -> 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block, requires exactly 3)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("7 runes -> 175 G base premium", () => {
    expect(basePremium(Array(7).fill({ type: "rune" }))).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G (no block: different types)", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }]),
    ).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G (two separate blocks)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });
});

describe("insuranceSum", () => {
  it("sword + amulet -> insurance sum 1600 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("sword + 3 runes -> insurance sum 1750 G (block does not affect sum)", () => {
    expect(
      insuranceSum([
        { type: "sword" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(1750);
  });
  it("two swords -> insurance sum 2000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
});

describe("rounding in the MHPCO's favor", () => {
  it("roundPremium(197.5) -> 198 (rounded up)", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("roundPayout(350.5) -> 350 (rounded down)", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
});

describe("quotePremium - modifiers", () => {
  it("empty item list -> premium 5 G (processing fee only)", () => {
    expect(quotePremium([], 0, false)).toBe(5);
  });
  it("newcomer with cursed sword (ench 3) -> premium 165 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        0,
        false,
      ),
    ).toBe(165);
  });
  it("long-standing customer's 2nd contract, cursed sword (ench 7) -> premium 160 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        3,
        true,
      ),
    ).toBe(160);
  });
  it("cursed sword + plain amulet, newcomer -> premium 231 G (curse surcharge scoped to item)", () => {
    expect(
      quotePremium(
        [
          { type: "sword", material: "steel", enchantment: 3, cursed: true },
          { type: "amulet", material: "silver", enchantment: 2, cursed: false },
        ],
        0,
        false,
      ),
    ).toBe(231);
  });
  it("sword with enchantment exactly 5, newcomer -> premium 145 G (high-ench surcharge applies)", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        0,
        false,
      ),
    ).toBe(145);
  });
  it("cursed sword with enchantment 5, newcomer -> premium 195 G (both surcharges)", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        0,
        false,
      ),
    ).toBe(195);
  });
  it("sword with enchantment 4, newcomer -> premium 115 G (no high-ench surcharge)", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        0,
        false,
      ),
    ).toBe(115);
  });
  it("sword, customer with exactly 2 years -> premium 95 G (loyalty discount applies)", () => {
    expect(
      quotePremium(
        [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        2,
        false,
      ),
    ).toBe(95);
  });
});

describe("runScenario - quote sequencing", () => {
  it("second quote in scenario gets 15% follow-up discount -> [49, 43]", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "potion" }] },
      ],
    };
    expect(runScenario(scenario)).toEqual({
      results: [{ premium: 49 }, { premium: 43 }],
    });
  });
});

describe("runScenario - claims", () => {
  it("standard sword (steel, ench 3), damage 500 -> payout 400, remainingCap 1600", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("rune damage 200 -> payout 100, remainingCap 400", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("dragon sword ench 8, damage 1000 -> payout 400 (high-ench clause then deductible)", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon sword ench 9, damage 1000 -> payout 400 (both clauses, 50% wins)", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon sword ench 5, damage 800 -> payout 700 (dragon full reimbursement)", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("steel sword ench 9, damage 1000 -> payout 400 (high-ench only)", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("dragon attack damages sword 500 and amulet 300 -> payout 600 (deductible per event)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });
  it("cursed sword, damage 2500 -> payout 2000 (cap based on unmodified insurance value)", () => {
    const scenario = {
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
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 2000,
      remainingCap: 0,
    });
  });
  it("two successive claims of 1500 on a sword -> [1400/rem600, 600/rem0] (cap exhaustion)", () => {
    const scenario = {
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("two swords both damaged 500 each -> payout 800, remainingCap 3200", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 800,
      remainingCap: 3200,
    });
  });
});

describe("runScenario - errors", () => {
  it("unknown item type in quote -> throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim references item not in policy -> throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
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
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim references unknown item type -> throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
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
    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim damage with negative amount -> throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
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
    expect(() => runScenario(scenario)).toThrow();
  });
  it("more damage entries of a type than covered -> throws", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow();
  });
});

describe("CLI integration", () => {
  it("schema example: amulet quote + claim -> [{premium:59},{payout:100,remainingCap:1100}]", () => {
    const input = JSON.stringify({
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
    const out = execFileSync("npx", ["tsx", "src/cli.ts"], { input });
    expect(JSON.parse(out.toString())).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits non-zero on unknown item type, writes stderr, no stdout results", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    let exitCode = 0;
    let stdout = "";
    let stderr = "";
    try {
      stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
        input,
        stdio: ["pipe", "pipe", "pipe"],
      }).toString();
    } catch (err: any) {
      exitCode = err.status;
      stdout = err.stdout?.toString() ?? "";
      stderr = err.stderr?.toString() ?? "";
    }
    expect(exitCode).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
    expect(stdout).toBe("");
  });
  it("CLI exits non-zero on negative damage amount", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    let exitCode = 0;
    let stderr = "";
    try {
      execFileSync("npx", ["tsx", "src/cli.ts"], {
        input,
        stdio: ["pipe", "pipe", "pipe"],
      });
    } catch (err: any) {
      exitCode = err.status;
      stderr = err.stderr?.toString() ?? "";
    }
    expect(exitCode).not.toBe(0);
    expect(stderr.length).toBeGreaterThan(0);
  });
});
