import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { quote, runScenario } from "./claim-office.js";

function runCli(input: unknown): { status: number; stdout: string; stderr: string } {
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

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and single base premiums ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a plain sword as 105 G (100 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a plain amulet as 65 G (60 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a plain staff as 85 G (80 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a plain potion as 45 G (40 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune as 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(32.5);
  });
  it("quotes a single moonstone as 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(32.5);
  });

  // --- Quote: building block of 3 alike components ---
  it("quotes 2 runes as base premium 50 G (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes as base premium 60 G (block applies)", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes)).toBe(71);
  });
  it("quotes 4 runes as base premium 100 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(115);
  });
  it("quotes 7 runes as base premium 175 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(197.5);
  });
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: different types)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(87.5);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge: cursed sword base 100 G -> 150 G", () => {
    const cursedSword = { type: "sword", cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5: sword base 100 G -> 130 G", () => {
    const enchantedSword = { type: "sword", enchantment: 5 };
    expect(quote({ yearsWithMHPCO: 0 }, [enchantedSword])).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4: sword base 100 G stays 100 G", () => {
    const sword = { type: "sword", enchantment: 4 };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(115);
  });
  it("stacks curse and high enchantment on one item: cursed sword enchantment 5 -> base 180 G", () => {
    const sword = { type: "sword", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword])).toBe(195);
  });
  it("applies the curse surcharge only to the cursed item, not the policy total: cursed sword + plain amulet -> 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount at exactly 2 years with MHPCO: sword -> 80 G before fee", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO: sword -> 100 G before fee", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge on the policy base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 15 % follow-up discount on every contract after the customer's first quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ premium: 100 });
  });
  it("applies the first-insurance surcharge even on a follow-up contract (each quoted item is a first insurance)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    // second contract: 100 base + 10 first insurance - 15 follow-up + 5 fee
    expect(runScenario(scenario).results[1]).toEqual({ premium: 100 });
  });

  // --- Quote: rounding in the MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    };
    expect(runScenario(scenario).results[0]).toEqual({ premium: 198 });
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    // unrounded 87.5 (3 x 25 x 1.1 + 5); per-item rounding would not give 88
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(87.5);
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    expect(runScenario(scenario).results[0]).toEqual({ premium: 88 });
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, first contract) as 165 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a 3-year customer's second contract for a cursed sword (enchantment 7) as 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
  });

  // --- Quote: rejection ---
  it("rejects a quote containing an unknown item type (e.g. broomstick): the domain throws, so the CLI can exit non-zero and write an error to stderr", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });

  // --- Claim: deductible and standard reimbursement ---
  it("pays 400 G for a regular steel sword (enchantment 3) with damage 500 G (full reimbursement minus 100 G deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a damaged rune with damage 200 G (no enchantment or material, so no special clause)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
    const scenario = {
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
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses ---
  it("reimburses 50 % for enchantment exactly 8: dragon sword, damage 1000 G -> payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material at enchantment 5: damage 800 G -> payout 700 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("lets the 50 % rule win over dragon material: dragon sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies only the high-enchantment clause for a steel sword enchantment 9, damage 1000 G -> payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy at twice the insurance sum: sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    // cap 3200 minus the 100 G payout (200 damage - 100 deductible)
    expect(runScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("bases the cap on unmodified insurance values: cursed sword (premium 165 G) -> cap 2000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    };
    const { results } = runScenario(scenario);
    expect(results[0]).toEqual({ premium: 165 });
    // cap 2000 (2 x 1000), unaffected by the curse surcharge
    expect(results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("excludes the block discount from the insurance sum: sword + 3 runes -> insurance sum 1750 G, cap 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    // cap 3500 (2 x 1750) minus the 400 G payout
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("reduces a payout to the remaining cap: sword, two claims of 1500 G -> 1400 G (cap 600 G left), then 600 G (cap 0 G left)", () => {
    const claim = {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    };
    const { results } = runScenario(scenario);
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: multiple items of the same type ---
  it("sums insurance values for two swords: insurance sum 2000 G, cap 4000 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    // cap 4000 (2 x 2000) minus the 400 G payout
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("treats two sword damage entries as separate damages, each with its own deductible", () => {
    const scenario = {
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
    };
    // (500 - 100) twice = 800; cap 4000 - 800 = 3200
    expect(runScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers: the domain throws, so the CLI can exit non-zero", () => {
    const scenario = {
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
    };
    expect(() => runScenario(scenario)).toThrow(/sword/);
  });

  // --- Claim: rounding and rejection ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    // 901 x 50 % = 450.5, minus the 100 G deductible = 350.5 -> rounded down to 350
    expect(runScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects a claim for an item not covered by the policy (amulet damaged, only a sword insured): the domain throws, so the CLI can exit non-zero", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("rejects a claim for an unknown item type: the domain throws, so the CLI can exit non-zero", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("rejects a claim with a negative damage amount (-200): the domain throws, so the CLI can exit non-zero", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/-200/);
  });

  // --- CLI end-to-end ---
  it("reads a scenario from stdin and writes {results: [...]} to stdout in step order (schema example: quote amulet then claim 200 G)", () => {
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
    const { status, stdout } = runCli(scenario);
    expect(status).toBe(0);
    // amulet 60 base, loyal (-20 %) + first insurance (+10 %) = 54 + 5 fee = 59
    // cap 1200; payout 200 - 100 = 100; remaining 1100
    expect(JSON.parse(stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("lets a later claim step reference the policy created by an earlier quote step via its zero-based index", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    // settles against the sword policy from step 1: cap 2000, payout 400
    expect(runScenario(scenario).results[2]).toEqual({ payout: 400, remainingCap: 1600 });
  });
});
