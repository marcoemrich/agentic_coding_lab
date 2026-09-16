import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const CLI = fileURLToPath(new URL("./cli.ts", import.meta.url));

function runCli(scenario: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("npx", ["tsx", CLI], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(results).toEqual([{ premium: 5 }]);
  });

  // --- Quote: main item base premiums (price list catalogue) ---
  it("quotes a plain sword for a 0-year customer as 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes a plain amulet for a 0-year customer as 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });
  it("quotes a plain staff for a 0-year customer as 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });

    expect(results).toEqual([{ premium: 93 }]);
  });
  it("quotes a plain potion for a 0-year customer as 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });

    expect(results).toEqual([{ premium: 49 }]);
  });

  // --- Quote: component base premiums and the block of 3 alike ---
  it("quotes 1 rune with base premium 25 G (25 * 1.1 + 5 = 32.5 -> 33 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes 1 moonstone with base premium 25 G (25 * 1.1 + 5 = 32.5 -> 33 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });

    expect(results).toEqual([{ premium: 33 }]);
  });
  it("quotes 2 runes with base premium 50 G (no block; 50 * 1.1 + 5 = 60 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(results).toEqual([{ premium: 60 }]);
  });
  it("quotes 3 runes with base premium 60 G (block of 3 alike applies; 60 * 1.1 + 5 = 71 G)", () => {
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
  it("quotes 4 runes with base premium 100 G (no block -- block requires exactly 3; 100 * 1.1 + 5 = 115 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(4).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes with base premium 175 G (no block -- block requires exactly 3; 175 * 1.1 + 5 = 197.5 -> 198 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("quotes 2 runes + 1 moonstone with base premium 75 G (no block: alike means same type; 75 * 1.1 + 5 = 87.5 -> 88 G)", () => {
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
  it("quotes 3 runes + 3 moonstones with base premium 120 G (two separate blocks; 120 * 1.1 + 5 = 137 G)", () => {
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
  it("quotes 3 moonstones with base premium 60 G (block applies to moonstones too; 60 * 1.1 + 5 = 71 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(3).fill({ type: "moonstone" }) }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium (base 100 + 10 first insurance + 50 curse + 5 fee = 165 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 (base 100 + 10 first insurance + 30 enchantment + 5 fee = 145 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });

    expect(results).toEqual([{ premium: 145 }]);
  });
  it("adds no high-enchantment surcharge at enchantment 4 (base stays 100; 100 * 1.1 + 5 = 115 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 (base 100 + 10 first insurance + 50 curse + 30 enchantment + 5 fee = 195 G)", () => {
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
  it("applies item-specific surcharges only to the affected item: cursed sword + plain amulet (base 160 + 16 first insurance + 50 curse on the sword only + 5 fee = 231 G)", () => {
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

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO (100 - 20 + 10 = 90; + 5 fee = 95 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies no loyalty discount at 1 year with MHPCO (100 + 10 = 110; + 5 fee = 115 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 115 }]);
  });
  it("applies the 10 % first-insurance surcharge even to a long-standing customer's new item (3 years: 100 - 20 + 10 = 90; + 5 fee = 95 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });

    expect(results).toEqual([{ premium: 95 }]);
  });
  it("applies a 15 % follow-up discount to the second quote (100 + 10 - 15 = 95; + 5 fee = 100 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies no follow-up discount to the first quote in a scenario (first result 115 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    });

    expect(results[0]).toEqual({ premium: 71 });
  });
  it("applies the 15 % follow-up discount to the third quote as well (100 G, not only to the second)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });

    expect(results).toEqual([
      { premium: 115 },
      { premium: 100 },
      { premium: 100 },
    ]);
  });
  it("adds the 5 G processing fee after all percentage modifiers (60 * 1.1 + 5 = 71 G, not (60 + 5) * 1.1 = 72 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(3).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 71 }]);
  });

  // --- Quote: rounding ---
  it("rounds a premium of 197.5 G up to 198 G (rounding in the MHPCO's favour)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });

    expect(results).toEqual([{ premium: 198 }]);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium (block of 3 runes, one cursed: block base 60 + 6 first insurance + 10 curse on the 20 G share + 5 fee = 81 G)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", cursed: true },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 81 }]);
  });

  // --- Quote: integration examples from the spec ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years) as 165 G (100 base + 50 curse + 10 first insurance = 160 + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            {
              type: "sword",
              material: "steel",
              enchantment: 3,
              cursed: true,
            },
          ],
        },
      ],
    });

    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quotes a 3-year customer's second contract for a cursed steel sword (enchantment 7) as 160 G (100 + 50 + 30 - 20 + 10 - 15 = 155 + 5 fee)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
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
    });

    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ---
  // The spec fixes only the CLI contract (non-zero exit, stderr description).
  // Reading adopted: the domain layer signals rejection by throwing an Error,
  // which the CLI translates into that exit status and message.
  it("rejects a quote containing an unknown item type (e.g. broomstick) by throwing an Error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a single-sword policy at 2000 G (twice the 1000 G insurance sum): claim 1500 G -> payout 1400 G, remainingCap 600 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("computes the insurance sum of a sword + amulet policy as 1600 G and its cap as 3200 G (desired 3800 G is limited to 3200 G)", () => {
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
              { itemType: "sword", amount: 2000 },
              { itemType: "amulet", amount: 2000 },
            ],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("computes the insurance sum of a two-sword policy as 2000 G and its cap as 4000 G (desired 4800 G is limited to 4000 G)", () => {
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
              { itemType: "sword", amount: 2500 },
              { itemType: "sword", amount: 2500 },
            ],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("computes the insurance sum of a sword + 3 runes policy as 1750 G, cap 3500 G (the block discount does not lower the insurance sum)", () => {
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 2000 },
              { itemType: "rune", amount: 700 },
              { itemType: "rune", amount: 700 },
              { itemType: "rune", amount: 700 },
            ],
          },
        },
      ],
    });

    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("bases the cap on the unmodified insurance value: cursed sword (premium 165 G) still has cap 2000 G", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 2200 }],
          },
        },
      ],
    });

    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });

  // --- Claim: deductible and standard reimbursement ---
  it("pays out 400 G for a steel sword with enchantment 3 damaged by 500 G (full reimbursement minus 100 G deductible)", () => {
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
  it("pays out 100 G for a rune damaged by 200 G (no enchantment or material, so no special clause)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "clumsiness",
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
  it("treats two damage entries of the same item type as two separate damages, each with its own deductible (500 + 500 -> 800 G)", () => {
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

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment exactly 8 at 50 %: dragon sword, damage 1000 G -> payout 400 G", () => {
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
  it("reimburses dragon-material damage in full: dragon sword enchantment 5, damage 800 G -> payout 700 G", () => {
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
  it("lets the 50 % rule win over dragon material: dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
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
  it("applies only the high-enchantment clause to a steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
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

  // --- Claim: cap exhaustion across successive claims ---
  it("reports the remaining cap after a claim: sword policy (cap 2000 G), claim 1500 G -> payout 1400 G, remainingCap 600 G", () => {
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
      ],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a later payout to the remaining cap: second claim 1500 G -> payout 600 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });

    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: rounding ---
  it("rounds a payout of 350.5 G down to 350 G (enchantment 8 halves 901 G to 450.5 G, minus the 100 G deductible)", () => {
    const results = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
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

    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Claim: rejection ---
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
              damages: [{ itemType: "amulet", amount: 300 }],
            },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim naming an unknown item type by throwing an Error", () => {
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
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) by throwing an Error", () => {
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
  it("rejects a claim with a negative damage amount (-200) by throwing an Error", () => {
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
    ).toThrow(/-200|negative/);
  });
  it("rejects a claim referencing a policy step index that is not a quote", () => {
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

  // --- Scenario runner ---
  it("returns one result per step, in order, for a quote followed by a claim (the spec's schema example)", () => {
    const results = runScenario({
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

    expect(results).toEqual([
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ]);
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes {results:[...]} JSON to stdout with exit code 0", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2 }],
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

    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for an unknown item type, writing no results to stdout", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick/);
    expect(result.stdout).toBe("");
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for a damage on an uninsured item", () => {
    const result = runCli({
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
    });

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet/);
    expect(result.stdout).toBe("");
  });
  it("CLI exits with a non-zero status and writes an error description to stderr for a negative damage amount", () => {
    const result = runCli({
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

    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/-200|negative/);
    expect(result.stdout).toBe("");
  });
});
