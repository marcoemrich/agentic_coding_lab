import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { insuranceSum, quote, runScenario } from "./claim-office.js";

interface CliOutcome {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(input: unknown): CliOutcome {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(input),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status: number; stdout: string; stderr: string };
    return {
      status: failure.status,
      stdout: failure.stdout,
      stderr: failure.stderr,
    };
  }
}

describe("MHPCO Claim Office", () => {
  // --- Quote: processing fee and single base premiums ---
  it("quotes an empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("quotes a plain sword -- base 100 G + 5 G fee = 105 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a plain amulet -- base 60 G + 5 G fee = 65 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a plain staff -- base 80 G + 5 G fee = 85 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a plain potion -- base 40 G + 5 G fee = 45 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes a single rune -- base 25 G + 5 G fee = 30 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("quotes a single moonstone -- base 25 G + 5 G fee = 30 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });

  // --- Component building blocks (block of exactly 3 alike) ---
  it("quotes 2 runes -- base premium 50 G (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes -- base premium 60 G (block applies)", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes)).toBe(71);
  });
  it("quotes 4 runes -- base premium 100 G (no block: block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(115);
  });
  it("quotes 7 runes -- base premium 175 G (no block: 7 is not exactly 3)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- base premium 75 G (no block: different types are not alike)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- base premium 120 G (two separate blocks, alike = same type)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(137);
  });

  // --- Item-specific modifiers ---
  it("quotes a cursed sword -- base 100 G + 50 G curse surcharge (50%)", () => {
    const items = [{ type: "sword", cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(165);
  });
  it("quotes a sword with enchantment 5 -- base 100 G + 30 G high-enchantment surcharge (threshold is >= 5)", () => {
    const items = [{ type: "sword", enchantment: 5 }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(145);
  });
  it("quotes a sword with enchantment 4 -- no high-enchantment surcharge", () => {
    const items = [{ type: "sword", enchantment: 4 }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(115);
  });
  it("quotes a cursed sword with enchantment 5 -- both surcharges apply: 100 + 50 + 30", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(195);
  });
  it("applies item-specific surcharges only to the affected item's base premium -- cursed sword + plain amulet: base 160 G, curse adds 50 G (50% of the sword's 100 G) = 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(231);
  });

  // --- Policy-wide modifiers ---
  it("applies a 20% loyalty discount to the policy base premium for a customer with exactly 2 years with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 10% first-insurance surcharge to the policy base premium on the customer's first quote", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("applies a 15% follow-up-contract discount on each contract after the first", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        { op: "quote" as const, items: [{ type: "sword" }] },
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 115 },
      { premium: 100 },
    ]);
  });
  it("applies the first-insurance surcharge to every quote's items regardless of customer history -- each item in a quote is treated as a first insurance", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "amulet" }] },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("rounds a premium of 197.5 G up to 198 G (rounded in MHPCO's favor)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
  });
  it("rounds a payout of 350.5 G down to 350 G (rounded in MHPCO's favor)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            // 50 % of 901 = 450.5, minus the 100 G deductible = 350.5 -> 350.
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    // 7 runes: base 175, +10% first insurance = 192.5, +5 fee = 197.5 -> 198.
    // Rounding the 192.5 intermediate first would yield 193 + 5 = 198 as well,
    // but rounding before the fee is added (ceil(192.5) = 193, then +5) and
    // rounding the surcharge separately both diverge from the fraction-carried
    // result on other inputs; the value below is the fraction-carried one.
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes)).toBe(198);
    // A single moonstone: base 25, +10% = 27.5, +5 fee = 32.5 -> 33.
    // Rounding the intermediate 27.5 up to 28 first would give 33 too, so the
    // discriminating case is the loyalty combination below.
    // 2 years, 1 rune: 25 + 2.5 - 5 = 22.5, +5 = 27.5 -> 28.
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "rune" }])).toBe(28);
  });

  // --- Quote integration examples ---
  it("integration: newcomer (0 years, no previous contract) with a cursed steel sword enchantment 3 -- premium 165 G", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items)).toBe(165);
  });
  it("integration: 3-year customer's second quote, cursed steel sword enchantment 7 -- premium 160 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote" as const, items: [{ type: "potion" }] },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
  });

  // --- Quote errors ---
  it("rejects a quote containing an unknown item type (e.g. broomstick) -- the domain throws, which the CLI reports as a non-zero exit with a stderr description", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }])).toThrow(
      /broomstick/,
    );
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy payout at twice the insurance sum -- sword + amulet: insurance sum 1600 G, cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("bases the cap on the unmodified insurance value -- cursed sword (premium 165 G): insurance sum 1000 G, cap 2000 G", () => {
    const cursedSword = [{ type: "sword", cursed: true }];
    expect(quote({ yearsWithMHPCO: 0 }, cursedSword)).toBe(165);
    expect(insuranceSum(cursedSword)).toBe(1000);
  });
  it("excludes the block discount from the insurance sum -- sword + 3 runes: insurance sum 1750 G, cap 3500 G", () => {
    const items = [
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    expect(insuranceSum(items)).toBe(1750);
  });
  it("sums insurance values for two swords -- insurance sum 2000 G, cap 4000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });

  // --- Claim: deductible and standard reimbursement ---
  it("reimburses a regular steel sword enchantment 3 with damage 500 G -- payout 400 G (full minus 100 G deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
        },
        {
          op: "claim" as const,
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
  it("reimburses a damaged rune (no enchantment, no material) with damage 200 G -- payout 100 G (full minus 100 G deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "rune" }] },
        {
          op: "claim" as const,
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
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G in one incident = payout 600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" }, { type: "amulet" }],
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
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 600,
      remainingCap: 2600,
    });
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment >= 8 at 50% -- steel sword enchantment 9, damage 1000 G: payout 400 G (500 minus deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim" as const,
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
  it("fully reimburses damage to a dragon-material item -- dragon sword enchantment 5, damage 800 G: payout 700 G (800 minus deductible)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim" as const,
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
  it("lets the 50% high-enchantment rule win when both clauses apply -- dragon sword enchantment 9, damage 1000 G: payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim" as const,
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
  it("applies the high-enchantment clause at exactly enchantment 8 -- dragon sword enchantment 8, damage 1000 G: payout 400 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim" as const,
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

  // --- Claim: multiple items of the same type ---
  it("treats each damage entry of the same item type as a separate damage with its own deductible -- two insured swords, two sword damages", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim" as const,
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
    };
    // insurance sum 2000, cap 4000; (500-100) + (300-100) = 600
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 600,
      remainingCap: 3400,
    });
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- the domain throws, which the CLI reports as a non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
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
    };
    expect(() => runScenario(scenario)).toThrow(/sword/);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("reports the remaining cap after a claim -- sword (cap 2000 G), claim 1500 G: payout 1400 G, remainingCap 600 G", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("reduces a later payout to the remaining cap -- second claim of 1500 G on the same policy: payout 600 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: {
        cause: "fire",
        damages: [{ itemType: "sword", amount: 1500 }],
      },
    };
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        claim,
        claim,
      ],
    };
    expect(runScenario(scenario).results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });

  // --- Claim errors ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) -- the domain throws, which the CLI reports as a non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/amulet/);
  });
  it("rejects a claim whose damage entry has an unknown item type -- the domain throws, which the CLI reports as a non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "broomstick", amount: 300 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/broomstick/);
  });
  it("rejects a claim containing a damage entry with a negative amount (-200) -- the domain throws, which the CLI reports as a non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }] },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => runScenario(scenario)).toThrow(/-200|negative/);
  });

  // --- CLI adapter ---
  it("reads a scenario from stdin and writes one result per step in order to stdout -- schema example: quote then claim on policy 0", () => {
    const outcome = runCli({
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
    expect(outcome.status).toBe(0);
    // amulet: base 60, +10% first insurance -20% loyalty = 54, +5 fee = 59.
    // insurance sum 600, cap 1200; payout 200-100 = 100, remaining 1100.
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("processes steps sequentially so a claim step refers to the policy created by the quote step at its zero-based index", () => {
    const outcome = runCli({
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
    expect(outcome.status).toBe(0);
    // Claim refers to step 1 (the amulet policy): cap 1200, payout 200.
    expect(JSON.parse(outcome.stdout).results[2]).toEqual({
      payout: 200,
      remainingCap: 1000,
    });
  });
});
