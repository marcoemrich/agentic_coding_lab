import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { quote, runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  // The CLI is the specification's observable contract for rejection: a
  // non-zero exit status with an error description on stderr and no results
  // on stdout.
  interface CliOutcome {
    status: number;
    stdout: string;
    stderr: string;
  }

  function runCli(scenario: unknown): CliOutcome {
    try {
      const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
        input: JSON.stringify(scenario),
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return { status: 0, stdout, stderr: "" };
    } catch (error) {
      const failure = error as { status?: number; stdout?: string; stderr?: string };
      return {
        status: failure.status ?? 1,
        stdout: failure.stdout ?? "",
        stderr: failure.stderr ?? "",
      };
    }
  }

  // --- Quote: base premiums per item type ---
  it("quotes an empty item list as 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 5 }, [])).toBe(5);
  });
  it("quotes a single plain sword -- base premium 100 G, +10 % first insurance, +5 G fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("quotes a single plain amulet -- base premium 60 G, +10 % first insurance, +5 G fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("quotes a single plain staff -- base premium 80 G, +10 % first insurance, +5 G fee = 93 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("quotes a single plain potion -- base premium 40 G, +10 % first insurance, +5 G fee = 49 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("quotes 2 runes -- component base premium 25 G each = 50 G, +10 % first insurance, +5 G fee = 60 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 2 moonstones -- component base premium 25 G each = 50 G, +10 % first insurance, +5 G fee = 60 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }, { type: "moonstone" }])).toBe(60);
  });

  // --- Insurance values per item type (observable via claim cap) ---
  it("insures a sword at 1000 G -- policy cap 2000 G (twice the insurance sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("insures a amulet at 600 G -- policy cap 1200 G (twice the insurance sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("insures a staff at 800 G -- policy cap 1600 G (twice the insurance sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "staff" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "staff", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("insures a potion at 400 G -- policy cap 800 G (twice the insurance sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "potion", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 700 });
  });
  it("insures a rune at 250 G -- policy cap 500 G (twice the insurance sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("insures a moonstone at 250 G -- policy cap 500 G (twice the insurance sum)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "moonstone" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "moonstone", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Component building blocks ---
  it("quotes 2 runes -- 50 G base premium, no block (block requires exactly 3)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes 3 runes -- 60 G base premium (block of 3 alike components applies), +10 % +5 G fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes -- 100 G base premium (no block -- block requires exactly 3), +10 % +5 G fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(4).fill({ type: "rune" }))).toBe(115);
  });
  it("quotes 7 runes -- 175 G base premium (no block), +10 % +5 G fee = 197.5 G rounded up to 198 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone -- 75 G base premium, no block ('alike' means the same type), +10 % +5 G fee = 87.5 rounded up to 88 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones -- 120 G base premium (two separate blocks), +10 % +5 G fee = 137 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })])).toBe(137);
  });
  it("quotes a sword + 3 runes with insurance sum 1750 G (= 1000 + 3x250) -- the block discount affects the premium only, cap 3500 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // --- Item-specific premium modifiers ---
  it("adds a 50 % curse surcharge to a cursed sword -- base 100 G becomes 150 G; policy-wide modifiers apply to the 100 G policy base premium: +10 G first insurance +5 G fee = 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }])).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge for enchantment exactly 5 -- sword base 100 G becomes 130 G; +10 G first insurance (10 % of the 100 G policy base premium) +5 G fee = 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }])).toBe(145);
  });
  it("adds no high-enchantment surcharge for enchantment 4 -- sword base premium stays 100 G, +10 % +5 G fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }])).toBe(115);
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -- 100 + 50 + 30 = 180 G; +10 G first insurance +5 G fee = 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("applies item-specific surcharges only to the affected item: cursed sword + plain amulet -> 160 G base + 50 G curse = 210 G; +16 G first insurance (10 % of the 160 G policy base premium) +5 G fee = 231 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });

  // --- Policy-wide premium modifiers ---
  it("applies a 20 % loyalty discount for a customer with exactly 2 years with MHPCO -- sword 100 G - 20 G loyalty + 10 G first insurance + 5 G fee = 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO -- sword 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge to the policy base premium -- amulet 60 G + 6 G + 5 G fee = 71 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("applies a 15 % follow-up discount to every quote after the customer's first quote -- second sword quote 100 G + 10 G first insurance - 15 G follow-up + 5 G fee = 100 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("applies no follow-up discount to the customer's first quote -- sword 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(results).toEqual([{ premium: 115 }]);
  });
  it("adds the 5 G processing fee at the very end of every premium -- it is not scaled by any modifier: a 2-year customer's sword is 95 G, not 99 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("still applies the first-insurance surcharge on a follow-up contract -- each quoted item is treated as a first insurance: second sword quote 100 + 10 - 15 + 5 = 100 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 100 });
  });

  // --- Rounding (premium) ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour): 7 runes, 175 G base + 17.5 G first insurance + 5 G fee", () => {
    expect(quote({ yearsWithMHPCO: 0 }, Array(7).fill({ type: "rune" }))).toBe(198);
  });
  it("keeps intermediate premium amounts as fractions and rounds only the final premium: a follow-up quote of 2 runes + 1 moonstone is 75 + 7.5 - 11.25 + 5 = 76.25 -> 77 G, not 76 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 77 });
  });

  // --- Quote integration examples ---
  it("quotes a newcomer's cursed steel sword (enchantment 3, 0 years, first contract) as 165 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(results).toEqual([{ premium: 165 }]);
  });
  it("quotes a long-standing customer's second contract for a cursed steel sword (enchantment 7, 3 years) as 160 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("pays out 400 G for a regular steel sword (enchantment 3) with 500 G damage -- full reimbursement minus the 100 G deductible", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays out 100 G for a damaged rune (insurance value 250 G) with 200 G damage -- runes have no enchantment or material, so no special clause applies", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 100 G deductible once per damaged item: a dragon attack damaging a sword (500 G) and an amulet (300 G) pays out 600 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
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
  it("reimburses damage to an item with enchantment exactly 8 at 50 %: dragon-material sword, damage 1000 G -> payout 400 G (50 % first, then deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a steel sword with enchantment 9 and damage 1000 G at 50 % then deductible -> payout 400 G (only the high-enchantment clause applies)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a dragon-material sword with enchantment 5 and damage 800 G fully then deductible -> payout 700 G (only the dragon-material clause applies)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("applies the 50 % rule ahead of full dragon reimbursement: dragon-material sword enchantment 9, damage 1000 G -> payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: cap ---
  it("reports remainingCap 600 G after a first 1500 G claim on a sword policy (cap 2000 G, payout 1400 G)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("reduces a second 1500 G claim to the remaining cap 600 G -> payout 600 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("caps a policy of sword + amulet at 3200 G (insurance sum 1600 G = 1000 + 600)", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("bases the cap on unmodified insurance values: a cursed sword quotes at 165 G but its cap is still 2000 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(results[0]).toEqual({ premium: 165 });
    expect(results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });

  // --- Claim: multiple items of the same type ---
  it("treats two sword damage entries on a two-sword policy (insurance sum 2000 G, cap 4000 G) as separate damages with their own deductibles -> payout 800 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
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
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured) -- runScenario throws, which the CLI reports as a non-zero exit with an error on stderr", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 5 },
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

  // --- Rounding (payout) ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour): enchantment 9 sword, damage 901 G -> 450.5 covered - 100 deductible", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("keeps intermediate payout amounts as fractions and rounds only the final payout: two enchantment 9 swords damaged 901 G each -> 701 G, not 700 G", () => {
    const { results } = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9 },
            { type: "sword", material: "steel", enchantment: 9 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 901 },
              { itemType: "sword", amount: 901 },
            ],
          },
        },
      ],
    });
    expect(results[1]).toEqual({ payout: 701, remainingCap: 3299 });
  });

  // --- Error cases (observable contract: CLI exits non-zero, writes to stderr, no results on stdout) ---
  it("rejects a quote containing an unknown item type (broomstick) -- non-zero exit, error on stderr, no results on stdout", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toContain("broomstick");
    expect(outcome.stdout).not.toContain("results");
  });
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured) -- non-zero exit, error on stderr", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toContain("amulet");
    expect(outcome.stdout).not.toContain("results");
  });
  it("rejects a claim damage entry with an unknown item type -- non-zero exit, error on stderr", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toContain("broomstick");
    expect(outcome.stdout).not.toContain("results");
  });
  it("rejects a claim damage entry with a negative amount (-200) -- non-zero exit, error on stderr", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr).toContain("-200");
    expect(outcome.stdout).not.toContain("results");
  });

  // --- CLI contract ---
  it("reads a scenario JSON from stdin and writes {results: [...]} to stdout in the same order as the input steps", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("writes a quote result as {premium} and a claim result as {payout, remainingCap}, all whole numbers", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 201 }] } },
      ],
    });
    const { results } = JSON.parse(outcome.stdout) as {
      results: [{ premium: number }, { payout: number; remainingCap: number }];
    };
    expect(results[0]).toEqual({ premium: 33 });
    expect(results[1]).toEqual({ payout: 101, remainingCap: 399 });
    for (const amount of [results[0].premium, results[1].payout, results[1].remainingCap]) {
      expect(Number.isInteger(amount)).toBe(true);
    }
  });
  it("resolves a claim step's policy field as the zero-based index of the quote step that created the policy", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 1, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(outcome.status).toBe(0);
    expect(JSON.parse(outcome.stdout).results[2]).toEqual({ payout: 100, remainingCap: 1100 });
  });
});
