import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { runScenario, type Item } from "./claim-office.js";

// A one-step quote is the shape of most premium examples. Asserting the whole
// result envelope (not just the number) keeps the result-list shape pinned.
// Scenarios with several steps or with claims call runScenario directly.
const expectQuotePremium = (
  items: Item[],
  expectedPremium: number,
  yearsWithMHPCO = 0,
): void => {
  const out = runScenario({
    customer: { yearsWithMHPCO },
    steps: [{ op: "quote", items }],
  });
  expect(out).toEqual({ results: [{ premium: expectedPremium }] });
};

describe("MHPCO Claim Office", () => {
  // --- Simplest cases -------------------------------------------------
  it("empty item list -- premium 5 G (only the processing fee)", () => {
    expectQuotePremium([], 5);
  });
  it("single plain sword for a newcomer -- 100 base + 10 first insurance + 5 fee = 115 G", () => {
    expectQuotePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      115,
    );
  });
  it("single plain amulet for a newcomer -- 60 + 6 + 5 = 71 G", () => {
    expectQuotePremium([{ type: "amulet" }], 71);
  });
  it("single plain staff for a newcomer -- 80 + 8 + 5 = 93 G", () => {
    expectQuotePremium([{ type: "staff" }], 93);
  });
  it("single plain potion for a newcomer -- 40 + 4 + 5 = 49 G", () => {
    expectQuotePremium([{ type: "potion" }], 49);
  });

  // --- Components and building blocks ---------------------------------
  it("2 runes -- base premium 50 G", () => {
    // base 50 -> 50 + 10 % first insurance + 5 fee = 60
    expectQuotePremium([{ type: "rune" }, { type: "rune" }], 60);
  });
  it("3 runes -- base premium 60 G (block applies)", () => {
    // base 60 -> 60 + 6 + 5 = 71
    expectQuotePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }], 71);
  });
  it("4 runes -- base premium 100 G (no block, block requires exactly 3)", () => {
    // base 100 -> 100 + 10 + 5 = 115
    expectQuotePremium(
      [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
      115,
    );
  });
  it("7 runes -- base premium 175 G", () => {
    // base 175 -> 175 + 17.5 + 5 = 197.5 -> 198
    expectQuotePremium(Array.from({ length: 7 }, () => ({ type: "rune" })), 198);
  });
  it("2 runes + 1 moonstone -- base premium 75 G (no block: different types)", () => {
    // base 75 -> 75 + 7.5 + 5 = 87.5 -> 88
    expectQuotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], 88);
  });
  it("3 runes + 3 moonstones -- base premium 120 G (two separate blocks)", () => {
    // base 120 -> 120 + 12 + 5 = 137
    expectQuotePremium(
      [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ],
      137,
    );
  });

  // --- Premium modifiers ----------------------------------------------
  it("cursed sword adds 50 % risk surcharge of the item's base premium", () => {
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expectQuotePremium([{ type: "sword", cursed: true }], 165);
  });
  it("sword with enchantment 5 -- high-enchantment surcharge applies (threshold)", () => {
    // 100 base + 30 enchantment + 10 first insurance + 5 fee = 145
    expectQuotePremium([{ type: "sword", enchantment: 5 }], 145);
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge", () => {
    expectQuotePremium([{ type: "sword", enchantment: 4 }], 115);
  });
  it("cursed sword with enchantment 5 -- both surcharges apply", () => {
    // 100 + 50 curse + 30 enchantment + 10 first insurance + 5 fee = 195
    expectQuotePremium([{ type: "sword", enchantment: 5, cursed: true }], 195);
  });
  it("customer with exactly 2 years -- 20 % loyalty discount applies", () => {
    // 100 base - 20 loyalty + 10 first insurance + 5 fee = 95
    expectQuotePremium([{ type: "sword" }], 95, 2);
  });
  it("customer with 1 year -- no loyalty discount", () => {
    expectQuotePremium([{ type: "sword" }], 115, 1);
  });
  it("second contract in a scenario -- 15 % follow-up discount on the policy base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    // second: 100 + 10 first insurance - 15 follow-up + 5 fee = 100
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("cursed sword + plain amulet -- policy base 160 G, curse adds 50 G (item scope) -> 210 G before further modifiers and fee", () => {
    // 160 base + 50 curse + 16 first insurance + 5 fee = 231
    expectQuotePremium([{ type: "sword", cursed: true }, { type: "amulet" }], 231);
  });
  it("premium rounding is in MHPCO's favor -- 197.5 G becomes 198 G", () => {
    // 7 runes: 175 base + 17.5 first insurance + 5 fee = 197.5 -> 198
    expectQuotePremium(Array.from({ length: 7 }, () => ({ type: "rune" })), 198);
  });

  // --- Integration examples -------------------------------------------
  it("newcomer with a cursed sword -- premium 165 G", () => {
    expectQuotePremium(
      [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      165,
    );
  });
  it("long-standing customer's second contract with cursed sword enchantment 7 -- premium 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Claims ----------------------------------------------------------
  it("regular sword (steel, enchantment 3), damage 500 G -- payout 400 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (value 250 G), damage 200 G -- payout 100 G", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("steel sword enchantment 9, damage 1000 G -- payout 400 G (50 % then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 G -- payout 700 G (full then deductible)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword enchantment 9, damage 1000 G -- payout 400 G (50 % rule wins)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G -- payout 400 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon attack damages sword (500 G) and amulet (300 G) -- payout 600 G (deductible per damaged item)", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("payout rounding is in MHPCO's favor -- 350.5 G becomes 350 G", () => {
    // enchantment 9 -> 50 % of 901 = 450.5, minus 100 deductible = 350.5 -> 350
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Cap --------------------------------------------------------------
  it("policy with sword and amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword -- premium 165 G and cap 2000 G (modifiers do not raise the cap)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("policy with a sword and 3 runes -- insurance sum 1750 G, cap 3500 G (block affects premium only)", () => {
    const out = runScenario({
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    // premium: 160 base + 16 first insurance + 5 fee = 181
    expect(out).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two successive claims of 1500 G on a sword -- payouts 1400 G then 600 G, remaining cap 600 G then 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(out.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("two sword damage entries -- each entry gets its own deductible", () => {
    const out = runScenario({
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
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });

  // --- Errors ------------------------------------------------------------
  it("quote with unknown item type (broomstick) -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });
  it("claim referencing an item not in the policy -- throws an error", () => {
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
      }),
    ).toThrow(/amulet/);
  });
  it("claim with more damage entries of a type than insured -- throws an error", () => {
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
  it("claim with a negative damage amount -- throws an error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- CLI ----------------------------------------------------------------
  it("CLI reads a scenario from stdin and writes results JSON to stdout", () => {
    const scenario = JSON.stringify({
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], { input: scenario });
    expect(JSON.parse(stdout.toString())).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status and writes to stderr for an unknown item type", () => {
    const scenario = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    let status = 0;
    let stderr = "";
    let stdout = "";
    try {
      execFileSync("npx", ["tsx", "src/cli.ts"], { input: scenario, stdio: "pipe" });
    } catch (error) {
      const failure = error as { status: number; stderr: Buffer; stdout: Buffer };
      status = failure.status;
      stderr = failure.stderr.toString();
      stdout = failure.stdout.toString();
    }
    expect(status).not.toBe(0);
    expect(stderr).toMatch(/broomstick/);
    expect(stdout).toBe("");
  });
});
