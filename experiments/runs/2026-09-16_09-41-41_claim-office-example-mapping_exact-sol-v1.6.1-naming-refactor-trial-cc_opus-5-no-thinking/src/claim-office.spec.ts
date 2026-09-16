import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { claim, insuranceSum, quote } from "./claim-office.js";
import type { Policy } from "./claim-office.js";

interface CliRun {
  status: number;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliRun {
  try {
    const stdout = execFileSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
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
  // --- Quote: processing fee and empty policy ---
  it("quotes an empty item list as premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 0)).toBe(5);
  });

  // --- Quote: base premiums per main item type (parallel price-list catalogue) ---
  it("quotes a plain sword as premium 105 G (100 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("quotes a plain amulet as premium 65 G (60 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }], 0)).toBe(71);
  });
  it("quotes a plain staff as premium 85 G (80 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }], 0)).toBe(93);
  });
  it("quotes a plain potion as premium 45 G (40 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }], 0)).toBe(49);
  });

  // --- Quote: component base premiums (parallel component catalogue) ---
  it("quotes a single rune as premium 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }], 0)).toBe(33);
  });
  it("quotes a single moonstone as premium 30 G (25 G base + 5 G fee)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }], 0)).toBe(33);
  });

  // --- Quote: building block of 3 alike components ---
  it("quotes 2 runes as base premium 50 G (no block)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }], 0)).toBe(60);
  });
  it("quotes 3 runes as base premium 60 G (block applies)", () => {
    const threeRunes = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(quote({ yearsWithMHPCO: 0 }, threeRunes, 0)).toBe(71);
  });
  it("quotes 4 runes as base premium 100 G (no block -- block requires exactly 3)", () => {
    const runes = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(115);
  });
  it("quotes 7 runes as base premium 175 G (no block at 7)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone as base premium 75 G (no block: alike means same type)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones as base premium 120 G (two separate blocks)", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(137);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium (cursed sword, 0 years, premium 165 G)", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment exactly 5 (sword enchantment 5)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4 (sword enchantment 4)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 4, cursed: false };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(115);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    const sword = { type: "sword", material: "steel", enchantment: 5, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [sword], 0)).toBe(195);
  });
  it("applies item-specific surcharges only to the affected item: cursed sword + plain amulet -> 210 G before policy modifiers and fee", () => {
    const items = [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(quote({ yearsWithMHPCO: 0 }, items, 0)).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount on the policy base premium at exactly 2 years with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 0)).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies a 10 % first-insurance surcharge on the policy base premium for every quote", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("applies a 15 % follow-up discount on the policy base premium for each contract after the first quote", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("applies no follow-up discount to the customer's first quote", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });

  // --- Quote: rounding in the MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G (MHPCO's favour)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(198);
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    // 5 runes, one cursed: base 125, curse 12.5, first insurance 12.5, fee 5.
    // Exact arithmetic gives 155 G; rounding each intermediate up would give 156 G.
    const runes = [
      { type: "rune", cursed: true },
      ...Array.from({ length: 4 }, () => ({ type: "rune", cursed: false })),
    ];
    expect(quote({ yearsWithMHPCO: 0 }, runes, 0)).toBe(155);
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed sword (0 years, first contract, enchantment 3) as premium 165 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
  });
  it("quotes a long-standing customer's second contract (3 years, cursed sword, enchantment 7) as premium 160 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    expect(quote({ yearsWithMHPCO: 3 }, [cursedSword], 1)).toBe(160);
  });

  // --- Quote: rejection ---
  it("rejects a quote containing an unknown item type (e.g. broomstick): CLI exits non-zero, error on stderr, no results on stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).toBeGreaterThan(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).not.toMatch(/results/);
  });

  // --- Claim: insurance sum and cap ---
  it("caps a single-sword policy at 2000 G (2 x insurance sum 1000 G)", () => {
    expect(insuranceSum([{ type: "sword" }])).toBe(1000);
  });
  it("sums insurance values across items: sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "amulet" }])).toBe(1600);
  });
  it("bases the cap on unmodified insurance values: cursed sword (premium 165 G) -> cap 2000 G", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword], 0)).toBe(165);
    expect(insuranceSum([cursedSword])).toBe(1000);
  });
  it("excludes the block discount from the insurance sum: sword + 3 runes -> insurance sum 1750 G, cap 3500 G", () => {
    const items = [
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ];
    expect(insuranceSum(items)).toBe(1750);
  });
  it("sums two swords to insurance sum 2000 G, cap 4000 G", () => {
    expect(insuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });

  // --- Claim: standard reimbursement and deductible ---
  it("pays out 400 G for a steel sword (enchantment 3) with 500 G damage (full minus 100 G deductible)", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    expect(claim(policy, [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
  });
  it("pays out 100 G for a rune with 200 G damage (no enchantment or material, so no special clause)", () => {
    const policy: Policy = { items: [{ type: "rune" }], remainingCap: 500 };
    expect(claim(policy, [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G + amulet 300 G -> payout 600 G", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "amulet" }],
      remainingCap: 3200,
    };
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ];
    expect(claim(policy, damages).payout).toBe(600);
  });
  it("treats two damage entries of the same item type as separate damages with their own deductible (two swords)", () => {
    const policy: Policy = {
      items: [{ type: "sword" }, { type: "sword" }],
      remainingCap: 4000,
    };
    const damages = [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ];
    expect(claim(policy, damages).payout).toBe(600);
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item with enchantment exactly 8 at 50 %: dragon sword, 1000 G damage -> payout 400 G", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
      remainingCap: 2000,
    };
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("fully reimburses dragon-material damage: dragon sword enchantment 5, 800 G damage -> payout 700 G", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
      remainingCap: 2000,
    };
    expect(claim(policy, [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("lets the 50 % high-enchantment clause win over dragon material: dragon sword enchantment 9, 1000 G damage -> payout 400 G", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("applies only the high-enchantment clause to a steel sword enchantment 9, 1000 G damage -> payout 400 G", () => {
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    expect(claim(policy, [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });

  it("reimburses a plain steel sword (enchantment 3) in full, showing dragon material adds nothing below enchantment 8", () => {
    const steel: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const dragon: Policy = {
      items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
      remainingCap: 2000,
    };
    const damages = [{ itemType: "sword", amount: 800 }];
    expect(claim(steel, damages).payout).toBe(700);
    expect(claim(dragon, damages).payout).toBe(700);
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays out 1400 G on a first 1500 G claim against a 1000 G sword policy, leaving cap 600 G", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 2000 };
    expect(claim(policy, [{ itemType: "sword", amount: 1500 }])).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
    const policy: Policy = { items: [{ type: "sword" }], remainingCap: 600 };
    expect(claim(policy, [{ itemType: "sword", amount: 1500 }])).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // --- Claim: rounding in the MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G (MHPCO's favour)", () => {
    // enchantment 9 -> 50 % of 901 = 450.5, minus the 100 G deductible = 350.5
    const policy: Policy = {
      items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
      remainingCap: 2000,
    };
    expect(claim(policy, [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });

  // --- Claim: rejections ---
  it("rejects a claim whose damaged item is not part of the policy (amulet damaged, only a sword insured): CLI exits non-zero, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(run.status).toBeGreaterThan(0);
    expect(run.stderr).toMatch(/amulet/);
  });
  it("rejects a claim referencing an unknown item type: CLI exits non-zero, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
        },
      ],
    });
    expect(run.status).toBeGreaterThan(0);
    expect(run.stderr).toMatch(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers (two sword damages, one sword insured): CLI exits non-zero, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 200 },
            ],
          },
        },
      ],
    });
    expect(run.status).toBeGreaterThan(0);
    expect(run.stderr).toMatch(/sword/);
  });
  it("rejects a claim containing a damage entry with a negative amount (-200): CLI exits non-zero, error on stderr", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(run.status).toBeGreaterThan(0);
    expect(run.stderr).toMatch(/-200|negative/);
  });

  // --- CLI: end-to-end scenario processing ---
  it("reads a scenario from stdin and writes one result per step in order (schema example: quote then claim)", () => {
    const run = runCli({
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
    expect(run.status).toBe(0);
    // amulet: 60 base, 5 years -> -20 % loyalty, +10 % first insurance, +5 fee = 59
    // claim: 200 - 100 deductible = 100; cap 1200 - 100 = 1100
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("processes steps sequentially so a claim refers to the policy created by the quote step at its zero-based index", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });
    expect(run.status).toBe(0);
    const results = JSON.parse(run.stdout).results;
    // the claim hits policy 1 (the amulet, insurance sum 600, cap 1200)
    expect(results[2]).toEqual({ payout: 200, remainingCap: 1000 });
  });
});
