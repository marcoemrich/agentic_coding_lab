import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { ClaimOffice, quote } from "./claim-office.js";

type CliRun = { status: number; stdout: string; stderr: string };

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

const NEWCOMER = { yearsWithMHPCO: 0 };

describe("MHPCO claim office", () => {
  // --- Quote: simplest case and the processing fee ---
  it("quotes an empty item list as 5 G -- only the processing fee", () => {
    expect(quote([], NEWCOMER)).toBe(5);
  });

  // --- Quote: the main item price list (each entry is independent data) ---
  it("quotes a single plain sword as 115 G -- 100 G base + 10 G first insurance + 5 G fee", () => {
    expect(quote([{ type: "sword" }], NEWCOMER)).toBe(115);
  });
  it("quotes a single plain amulet as 71 G -- 60 G base + 6 G first insurance + 5 G fee", () => {
    expect(quote([{ type: "amulet" }], NEWCOMER)).toBe(71);
  });
  it("quotes a single plain staff as 93 G -- 80 G base + 8 G first insurance + 5 G fee", () => {
    expect(quote([{ type: "staff" }], NEWCOMER)).toBe(93);
  });
  it("quotes a single plain potion as 49 G -- 40 G base + 4 G first insurance + 5 G fee", () => {
    expect(quote([{ type: "potion" }], NEWCOMER)).toBe(49);
  });

  // --- Quote: components and the building block of 3 alike ---
  it("quotes a single rune as 33 G -- 25 G base + 2.5 G first insurance + 5 G fee, rounded up", () => {
    expect(quote([{ type: "rune" }], NEWCOMER)).toBe(33);
  });
  it("quotes a single moonstone as 33 G -- 25 G base + 2.5 G first insurance + 5 G fee, rounded up", () => {
    expect(quote([{ type: "moonstone" }], NEWCOMER)).toBe(33);
  });
  it("quotes 2 runes as 60 G -- 50 G base premium, no block, + 5 G first insurance + 5 G fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }], NEWCOMER)).toBe(60);
  });

  it("quotes 3 runes as 71 G -- 60 G block base premium + 6 G first insurance + 5 G fee", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }], NEWCOMER)).toBe(71);
  });
  it("quotes 4 runes as 115 G -- 100 G base premium, block requires exactly 3, + 10 G first insurance + 5 G fee", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })), NEWCOMER)).toBe(115);
  });

  it("quotes 7 runes as 198 G -- 175 G base premium + 17.5 G first insurance + 5 G fee, rounded up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), NEWCOMER)).toBe(198);
  });
  it("quotes 2 runes + 1 moonstone as 88 G -- 75 G base, no block across different types, + 7.5 G first insurance + 5 G fee, rounded up", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }], NEWCOMER)).toBe(88);
  });
  it("quotes 3 runes + 3 moonstones as 137 G -- 120 G base, two separate blocks, + 12 G first insurance + 5 G fee", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote(items, NEWCOMER)).toBe(137);
  });

  it("quotes 3 moonstones as 71 G -- the block rule applies per component type, not only to runes", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "moonstone" })), NEWCOMER)).toBe(71);
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium -- cursed sword is 100 + 50 + 10 first insurance + 5 = 165 G", () => {
    expect(quote([{ type: "sword", cursed: true }], NEWCOMER)).toBe(165);
  });
  it("adds a 30 % high-enchantment surcharge at enchantment 5 exactly -- sword enchantment 5 is 100 + 30 + 10 first insurance + 5 = 145 G", () => {
    expect(quote([{ type: "sword", enchantment: 5 }], NEWCOMER)).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- sword enchantment 4 is 115 G", () => {
    expect(quote([{ type: "sword", enchantment: 4 }], NEWCOMER)).toBe(115);
  });

  it("stacks curse and high-enchantment surcharges on the same item -- cursed sword enchantment 5 is 100 + 50 + 30 + 10 first insurance + 5 = 195 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }], NEWCOMER)).toBe(195);
  });
  it("applies item-specific surcharges only to the affected item -- cursed sword + plain amulet is 160 + 50 + 16 first insurance + 5 = 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }], NEWCOMER)).toBe(231);
  });

  // --- Quote: policy-wide modifiers ---
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO -- plain sword is 100 - 20 + 10 first insurance + 5 = 95 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 2 })).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO -- plain sword is 115 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 1 })).toBe(115);
  });
  it("applies the 10 % first-insurance surcharge to a long-standing customer's first quote -- 3 years, plain sword is 100 - 20 + 10 + 5 = 95 G", () => {
    expect(quote([{ type: "sword" }], { yearsWithMHPCO: 3 })).toBe(95);
  });
  it("applies the 15 % follow-up discount on the customer's second quote -- plain sword second quote is 100 + 10 - 15 + 5 = 100 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "sword" }])).toBe(100);
  });
  it("applies the 15 % follow-up discount on the third quote as well -- each contract after the first is 100 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    office.quote([{ type: "sword" }]);
    expect(office.quote([{ type: "sword" }])).toBe(100);
  });
  it("computes policy-wide modifiers from the policy base premium, not from item base premiums -- sword + amulet with loyalty is 160 - 32 + 16 + 5 = 149 G", () => {
    expect(quote([{ type: "sword" }, { type: "amulet" }], { yearsWithMHPCO: 2 })).toBe(149);
  });

  // --- Quote: rounding in the MHPCO's favour ---
  it("rounds a premium of 197.5 G up to 198 G -- rounding is in the MHPCO's favour", () => {
    // 7 runes: 175 G base + 10 % first insurance = 192.5 G, + 5 G fee = 197.5 G
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })), NEWCOMER)).toBe(198);
  });

  it("keeps intermediate amounts as fractions and rounds only the final premium -- an exact 115 G premium is not inflated to 116 G", () => {
    // 100 G base x 110 % is exactly 110 G; rounding an inexact intermediate would charge 116 G.
    expect(quote([{ type: "sword" }], NEWCOMER)).toBe(115);
    // 25 G base x 110 % = 27.5 G stays fractional until the fee is added: 32.5 G rounds up to 33 G.
    expect(quote([{ type: "rune" }], NEWCOMER)).toBe(33);
  });

  // --- Quote: integration examples from the spec ---
  it("newcomer with a cursed sword (0 years, first contract) -- premium 165 G", () => {
    // 100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], NEWCOMER)).toBe(165);
  });
  it("long-standing customer's second contract with a cursed sword enchantment 7 (3 years) -- premium 160 G", () => {
    // 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee
    const office = new ClaimOffice({ yearsWithMHPCO: 3 });
    office.quote([{ type: "amulet" }]);
    expect(office.quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])).toBe(160);
  });

  // --- Quote: rejection ---
  it("rejects a quote with an unknown item type -- documented reading: the domain throws an Error, which the CLI turns into a non-zero exit and a stderr message", () => {
    expect(() => quote([{ type: "broomstick" }], NEWCOMER)).toThrow(/broomstick/);
  });

  // --- Claim: deductible and standard reimbursement ---
  it("pays 400 G for a steel sword at enchantment 3 damaged 500 G -- full reimbursement minus the 100 G deductible", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "steel", enchantment: 3 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("pays 100 G for a rune damaged 200 G -- runes have no enchantment or material, so no special clause applies", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "rune" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] })).toEqual({
      payout: 100,
      remainingCap: 400,
    });
  });
  it("applies the 100 G deductible once per damaged item -- sword 500 G + amulet 300 G is a payout of 600 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    const result = office.claim(0, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "amulet", amount: 300 },
      ],
    });
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 0 G when the damage amount is below the deductible -- documented reading: a payout is never negative", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(office.claim(0, { cause: "scratch", damages: [{ itemType: "sword", amount: 40 }] })).toEqual({
      payout: 0,
      remainingCap: 2000,
    });
  });

  // --- Claim: special clauses ---
  it("reimburses damage to an item at enchantment 8 at 50 % -- steel sword enchantment 8 damaged 1000 G pays 400 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "steel", enchantment: 8 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("applies no high-enchantment clause at enchantment 7 -- steel sword damaged 1000 G pays 900 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "steel", enchantment: 7 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({
      payout: 900,
      remainingCap: 1100,
    });
  });
  it("reimburses dragon material fully -- dragon sword enchantment 5 damaged 800 G pays 700 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "dragon", enchantment: 5 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] })).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("lets the 50 % rule win over dragon material -- dragon sword enchantment 9 damaged 1000 G pays 400 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "dragon", enchantment: 9 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("applies the 50 % rule then the deductible for a dragon sword at exactly enchantment 8 damaged 1000 G -- payout 400 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "dragon", enchantment: 8 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("applies only the high-enchantment clause for a steel sword enchantment 9 damaged 1000 G -- payout 400 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "steel", enchantment: 9 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] })).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });

  // --- Claim: insurance sum and cap ---
  it("caps a policy at twice the insurance sum -- a single sword gives a cap of 2000 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] })).toEqual({
      payout: 2000,
      remainingCap: 0,
    });
  });
  it("sums the insurance values of all items -- sword + amulet gives an insurance sum of 1600 G and a cap of 3200 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }, { type: "amulet" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] })).toEqual({
      payout: 3200,
      remainingCap: 0,
    });
  });
  it("bases the cap on unmodified insurance values -- a cursed sword still has a cap of 2000 G despite its 165 G premium", () => {
    const office = new ClaimOffice(NEWCOMER);
    expect(office.quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 5000 }] })).toEqual({
      payout: 2000,
      remainingCap: 0,
    });
  });
  it("counts components at 250 G in the insurance sum despite the block discount -- sword + 3 runes gives an insurance sum of 1750 G and a cap of 3500 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] })).toEqual({
      payout: 3500,
      remainingCap: 0,
    });
  });
  it("reports the remaining cap after a claim -- sword, claim 1500 G pays 1400 G and leaves 600 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] })).toEqual({
      payout: 1400,
      remainingCap: 600,
    });
  });
  it("reduces a later claim to the remaining cap -- second 1500 G claim pays 600 G and leaves 0 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] });
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] })).toEqual({
      payout: 600,
      remainingCap: 0,
    });
  });

  // --- Claim: multiple items of the same type ---
  it("insures two swords as an insurance sum of 2000 G and a cap of 4000 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }, { type: "sword" }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 9000 }] })).toEqual({
      payout: 4000,
      remainingCap: 0,
    });
  });
  it("treats two sword damage entries as separate damages with their own deductible -- 2 entries of 500 G pay 800 G", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }, { type: "sword" }]);
    const result = office.claim(0, {
      cause: "dragon attack",
      damages: [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 500 },
      ],
    });
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Claim: rounding in the MHPCO's favour ---
  it("rounds a payout of 350.5 G down to 350 G -- rounding is in the MHPCO's favour", () => {
    // enchantment 8 halves 901 G to 450.5 G; the 100 G deductible leaves 350.5 G
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword", material: "steel", enchantment: 8 }]);
    expect(office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] })).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });

  // --- Claim: rejection ---
  it("rejects a claim whose damaged item is not covered by the policy -- amulet damage against a sword-only policy throws", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] }),
    ).toThrow(/amulet/);
  });

  it("rejects a claim with an unknown damaged item type -- documented reading: same error contract as an uncovered item", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] }),
    ).toThrow(/broomstick/);
  });
  it("rejects a claim with more damage entries of a type than the policy covers -- two sword damages against one insured sword throws", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, {
        cause: "dragon attack",
        damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ],
      }),
    ).toThrow(/sword/);
  });
  it("rejects a claim with a negative damage amount -- amount -200 throws", () => {
    const office = new ClaimOffice(NEWCOMER);
    office.quote([{ type: "sword" }]);
    expect(() =>
      office.claim(0, { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] }),
    ).toThrow(/-200/);
  });

  // --- CLI adapter: stdin/stdout contract ---
  it("writes {results:[{premium}]} to stdout for a quote-only scenario", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 165 }] });
  });
  it("writes {payout, remainingCap} for a claim step and resolves the policy by its zero-based step index", () => {
    // amulet: 60 base - 12 loyalty + 6 first insurance + 5 fee = 59 G; damage 200 - 100 deductible = 100 G
    const run = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("processes steps sequentially so a claim sees the cap left by an earlier claim on the same policy", () => {
    const claimStep = {
      op: "claim",
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claimStep, claimStep],
    });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("exits non-zero and writes an error description to stderr, with no results on stdout, for an invalid scenario", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).toBe("");
  });
});
