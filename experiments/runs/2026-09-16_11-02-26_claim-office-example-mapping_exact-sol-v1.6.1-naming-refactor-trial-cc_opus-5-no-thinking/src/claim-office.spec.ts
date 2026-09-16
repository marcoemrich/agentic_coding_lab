import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

interface CliOutcome {
  exitCode: number;
  stdout: string;
  stderr: string;
}

async function runCli(input: unknown): Promise<CliOutcome> {
  const child = execFile("npx", ["tsx", CLI_PATH]);
  child.stdin?.end(JSON.stringify(input));

  let stdout = "";
  let stderr = "";
  child.stdout?.on("data", (chunk: string) => (stdout += chunk));
  child.stderr?.on("data", (chunk: string) => (stderr += chunk));

  const exitCode = await new Promise<number>((resolve) => {
    child.on("close", (code) => resolve(code ?? 0));
  });

  return { exitCode, stdout, stderr };
}

const REJECTED_SCENARIOS = {
  unknownQuoteItem: {
    customer: { yearsWithMHPCO: 0 },
    steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
  },
  uninsuredClaimItem: {
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [{ type: "sword" }] },
      {
        op: "claim",
        policy: 0,
        incident: {
          cause: "fire",
          damages: [{ itemType: "amulet", amount: 200 }],
        },
      },
    ],
  },
  negativeDamage: {
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
  },
};

describe("MHPCO claim office", () => {
  // --- Quote: base premiums per item type (parallel catalogue: one test per entry) ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });
  it("quotes a plain sword as 115 G (100 base + 10 first insurance + 5 fee)", () => {
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
  it("quotes a plain amulet as 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff as 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion as 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });
  it("quotes a single rune as 32.5 -> 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes a single moonstone as 32.5 -> 33 G (25 base + 2.5 first insurance + 5 fee, rounded up)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("rejects a quote with an unknown item type ('broomstick') by throwing an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Quote: component building blocks ---
  it("quotes 2 runes at base premium 50 G (no block)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 2 }, () => ({ type: "rune" })),
        },
      ],
    });

    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quotes 3 runes at base premium 60 G (block applies)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 3 }, () => ({ type: "rune" })),
        },
      ],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes at base premium 100 G (no block -- block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 4 }, () => ({ type: "rune" })),
        },
      ],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes at base premium 175 G (no block -- block requires exactly 3)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quotes 2 runes + 1 moonstone at base premium 75 G (no block: 'alike' means same type)", () => {
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
  it("quotes 3 runes + 3 moonstones at base premium 120 G (two separate blocks)", () => {
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

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to a cursed item's base premium", () => {
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
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5", () => {
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
  it("adds no high-enchantment surcharge at enchantment 4", () => {
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
  it("adds both curse and high-enchantment surcharges to a cursed item with enchantment exactly 5", () => {
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

  // --- Quote: policy-wide modifiers ---
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies a 10 % first-insurance surcharge to each item in every quote, regardless of customer history", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies a 15 % follow-up discount on the customer's second quote but not on the first", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("adds the 5 G processing fee at the very end, after all other modifiers", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 28 }]);
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("applies the curse surcharge to the cursed item's base premium only: cursed sword + plain amulet -> 210 G before further modifiers and fee", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 231 }]);
  });

  // --- Quote: rounding ---
  it("rounds a premium of 197.5 G up to 198 G (in the MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "moonstone" }] },
      ],
    });

    // base 50, first insurance 5, fee 5 -> 60 exactly; the single-rune case
    // (25 + 2.5 + 5 = 32.5 -> 33) proves the 2.5 intermediate is not truncated.
    expect(results).toEqual([{ premium: 60 }]);
  });

  // --- Quote: integration examples ---
  it("newcomer with a cursed steel sword (enchantment 3), 0 years -> premium 165 G", () => {
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

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("long-standing customer's (3 years) second quote, cursed steel sword (enchantment 7) -> premium 160 G", () => {
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

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a regular steel sword (enchantment 3) with 500 G damage (500 - 100 deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
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
  it("pays out 100 G for a damaged rune (250 G value) with 200 G damage (no enchantment/material clause)", () => {
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
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
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

  // --- Claim: special clauses ---
  it("reimburses 50 % for damage to an item with enchantment exactly 8: dragon sword, 1000 G damage -> payout 400 G", () => {
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
  it("fully reimburses dragon-material damage: dragon sword enchantment 5, 800 G damage -> payout 700 G", () => {
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
  it("lets the 50 % rule win over dragon material: dragon sword enchantment 9, 1000 G damage -> payout 400 G", () => {
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
  it("applies only the high-enchantment clause to a steel sword enchantment 9, 1000 G damage -> payout 400 G", () => {
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
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: insurance sum and cap ---
  it("caps a two-sword policy at 4000 G (insurance sum 2000 G, cap = 2x)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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

    expect(results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("caps a sword + amulet policy at 3200 G (insurance sum 1600 G)", () => {
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

    expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("bases the cap on unmodified insurance values: cursed sword -> cap 2000 G despite premium modifiers", () => {
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

    expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("counts component insurance values in full: sword + 3 runes (a block) -> insurance sum 1750 G, cap 3500 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
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
  it("reports remainingCap 600 G after a first 1500 G claim on a 2000 G cap (payout 1400 G)", () => {
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
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
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

    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type ---
  it("treats each damages entry as a separate damage with its own deductible when two swords are insured", () => {
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
  it("rejects a claim with more damage entries of a type than the policy covers by throwing an Error", () => {
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

  // --- Claim: rounding ---
  it("rounds a payout of 350.5 G down to 350 G (in the MHPCO's favor)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            // 901 at half reimbursement = 450.5, minus the 100 G deductible
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection cases ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) by throwing an Error", () => {
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
              damages: [{ itemType: "amulet", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim whose damaged item has an unknown type by throwing an Error", () => {
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
              damages: [{ itemType: "broomstick", amount: 200 }],
            },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim containing a damage entry with a negative amount (-200) by throwing an Error", () => {
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

  // --- Scenario processing ---
  it("processes steps sequentially and returns one result per step in order", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
        { op: "quote", items: [{ type: "potion" }] },
      ],
    });

    expect(results).toEqual([
      { premium: 115 },
      { payout: 200, remainingCap: 1800 },
      // follow-up contract: 40 base + 4 first insurance - 6 follow-up + 5 fee
      { premium: 43 },
    ]);
  });
  it("resolves a claim's policy field as the zero-based index of the quote step that created the policy", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 1,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });

    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
  it("runs the schema example end to end: 5-year customer, silver amulet quote then 200 G amulet claim", () => {
    const results = runScenario({
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
    });

    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  // --- CLI adapter ---
  it("CLI reads a scenario from stdin and writes {results: [...]} JSON to stdout with exit code 0", async () => {
    const outcome = await runCli({
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
    });

    expect(outcome.exitCode).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for an unknown quote item type, writing no results to stdout", async () => {
    const outcome = await runCli(REJECTED_SCENARIOS.unknownQuoteItem);

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).not.toBe("");
    expect(outcome.stdout).toBe("");
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for a claim on an item not in the policy", async () => {
    const outcome = await runCli(REJECTED_SCENARIOS.uninsuredClaimItem);

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).not.toBe("");
    expect(outcome.stdout).toBe("");
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for a negative damage amount", async () => {
    const outcome = await runCli(REJECTED_SCENARIOS.negativeDamage);

    expect(outcome.exitCode).not.toBe(0);
    expect(outcome.stderr).not.toBe("");
    expect(outcome.stdout).toBe("");
  });
});
