import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { claimOn, policyFor, quote } from "./claim-office.js";

/** Runs the real `claim-office` entry point with the scenario on stdin. */
function runCli(scenario: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

describe("MHPCO quote -- base premiums", () => {
  it("empty item list -- premium 5 G (processing fee only)", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [])).toBe(5);
  });
  it("single sword, no modifiers -- base premium 100 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("single amulet, no modifiers -- base premium 60 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "amulet" }])).toBe(71);
  });
  it("single staff, no modifiers -- base premium 80 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "staff" }])).toBe(93);
  });
  it("single potion, no modifiers -- base premium 40 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "potion" }])).toBe(49);
  });
  it("single rune (component) -- base premium 25 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }])).toBe(33);
  });
  it("single moonstone (component) -- base premium 25 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "moonstone" }])).toBe(33);
  });
  it("policy base premium is the sum of item base premiums -- sword + amulet = 160 G", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }, { type: "amulet" }]),
    ).toBe(181);
  });
});

describe("MHPCO quote -- component building block of 3 alike", () => {
  it("2 runes -- 50 G base premium (no block)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("3 runes -- 60 G base premium (block applies)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(71);
  });
  it("4 runes -- 100 G base premium (no block -- block requires exactly 3)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(115);
  });
  it("7 runes -- 175 G base premium (no block -- block requires exactly 3)", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });
  it("alike means the same type: 2 runes + 1 moonstone -- 75 G base premium (no block, different types)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(88);
  });
  it("alike blocks form per type: 3 runes + 3 moonstones -- 120 G base premium (two separate blocks)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(137);
  });
});

describe("MHPCO quote -- item-specific modifiers", () => {
  it("cursed sword -- 50 % risk surcharge on that item's base premium (100 G -> 150 G)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true }]),
    ).toBe(165);
  });
  it("sword with enchantment 5 -- 30 % high-enchantment surcharge applies (threshold is >= 5)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }]),
    ).toBe(145);
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }]),
    ).toBe(115);
  });
  it("cursed sword with enchantment 5 -- both surcharges apply, each on the item base premium (100 + 50 + 30)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true, enchantment: 5 },
      ]),
    ).toBe(195);
  });
  it("item-specific modifiers apply only to the affected item: cursed sword + plain amulet -- 160 G base + 50 G curse = 210 G before policy modifiers and fee", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ]),
    ).toBe(231);
  });
});

describe("MHPCO quote -- policy-wide modifiers", () => {
  it("customer with 2 years with MHPCO -- 20 % loyalty discount applies (threshold is >= 2)", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
  it("customer with 1 year with MHPCO -- no loyalty discount", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }])).toBe(115);
  });
  it("each quoted item carries a 10 % initial assessment surcharge for first insurance", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }])).toBe(115);
  });
  it("second and later contracts receive a 15 % follow-up discount on the policy base premium", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 1)).toBe(100);
  });
  it("first contract receives no follow-up discount", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword" }], 0)).toBe(115);
  });
  it("a 5 G processing fee is added at the very end of every premium", () => {
    // the fee is outside the policy-wide modifiers: 100 base + 10 first
    // insurance - 20 loyalty = 90, then + 5 fee (not 90 * modifiers + fee)
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }])).toBe(95);
  });
});

describe("MHPCO quote -- rounding in the MHPCO's favor", () => {
  it("premium of 197.5 G rounds up to 198 G", () => {
    // 7 runes: 175 base * 1.1 first insurance + 5 fee = 197.5 -> 198
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote({ yearsWithMHPCO: 0 }, sevenRunes)).toBe(198);
  });
  it("intermediate amounts are kept as fractions -- only the final premium is rounded", () => {
    // one rune: 25 base * 1.1 = 27.5 (fractional intermediate), + 5 fee =
    // 32.5, rounded once at the end -> 33. The premium is always a whole G.
    const premium = quote({ yearsWithMHPCO: 0 }, [{ type: "rune" }]);
    expect(premium).toBe(33);
    expect(Number.isInteger(premium)).toBe(true);
  });
});

describe("MHPCO quote -- integration examples", () => {
  it("newcomer (0 years, first contract) with a cursed sword -- premium 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      quote({ yearsWithMHPCO: 0 }, [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ]),
    ).toBe(165);
  });
  it("long-standing customer (3 years) second quote, cursed sword enchantment 7 -- premium 160 G (100 + 50 + 30 - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee)", () => {
    expect(
      quote(
        { yearsWithMHPCO: 3 },
        [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        1,
      ),
    ).toBe(160);
  });
});

describe("MHPCO quote -- rejections", () => {
  it("quote with an unknown item type (e.g. broomstick) -- throws an Error (chosen reading: the domain signals rejection by throwing; the spec fixes no error type or message)", () => {
    expect(() =>
      quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }]),
    ).toThrow(Error);
  });
});

describe("MHPCO policy -- insurance sum and cap", () => {
  it("a sword -- insurance sum 1000 G, cap 2000 G (twice the insurance sum)", () => {
    const policy = policyFor([{ type: "sword" }]);
    expect(policy.insuranceSum).toBe(1000);
    expect(policy.cap).toBe(2000);
  });
  it("sword + amulet -- insurance sum 1600 G, cap 3200 G", () => {
    const policy = policyFor([{ type: "sword" }, { type: "amulet" }]);
    expect(policy.insuranceSum).toBe(1600);
    expect(policy.cap).toBe(3200);
  });
  it("two swords -- insurance sum 2000 G, cap 4000 G", () => {
    const policy = policyFor([{ type: "sword" }, { type: "sword" }]);
    expect(policy.insuranceSum).toBe(2000);
    expect(policy.cap).toBe(4000);
  });
  it("sword + 3 runes (a block) -- insurance sum 1750 G; the block discount affects the premium only", () => {
    const policy = policyFor([
      { type: "sword" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ]);
    expect(policy.insuranceSum).toBe(1750);
    expect(policy.cap).toBe(3500);
  });
  it("cursed sword -- cap 2000 G based on the unmodified insurance value; premium modifiers do not raise the cap", () => {
    const cursedSword = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    const policy = policyFor([cursedSword]);
    expect(policy.insuranceSum).toBe(1000);
    expect(policy.cap).toBe(2000);
    // the curse raises the premium but not the cap
    expect(quote({ yearsWithMHPCO: 0 }, [cursedSword])).toBe(165);
  });
});

describe("MHPCO claim -- standard reimbursement and deductible", () => {
  it("regular sword (steel, enchantment 3), damage 500 G -- payout 400 G (500 - 100 deductible)", () => {
    const policy = policyFor([
      { type: "sword", material: "steel", enchantment: 3 },
    ]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 500 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("rune (no enchantment level, no material), damage 200 G -- payout 100 G (no special clause applies)", () => {
    const policy = policyFor([{ type: "rune" }]);
    const result = claimOn(policy, [{ itemType: "rune", amount: 200 }]);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(400);
  });
  it("the 100 G deductible applies once per damaged item -- dragon attack on sword (500 G) and amulet (300 G) pays 600 G", () => {
    const policy = policyFor([{ type: "sword" }, { type: "amulet" }]);
    const result = claimOn(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });
});

describe("MHPCO claim -- special clauses", () => {
  it("steel sword, enchantment 9, damage 1000 G -- payout 400 G (50 % clause first, then deductible)", () => {
    const policy = policyFor([
      { type: "sword", material: "steel", enchantment: 9 },
    ]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("dragon-material sword, enchantment 5, damage 800 G -- payout 700 G (full reimbursement, then deductible)", () => {
    const policy = policyFor([
      { type: "sword", material: "dragon", enchantment: 5 },
    ]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 800 }]);
    expect(result.payout).toBe(700);
    expect(result.remainingCap).toBe(1300);
  });
  it("dragon-material sword, enchantment 8, damage 1000 G -- payout 400 G (high-enchantment clause applies at the threshold, then deductible)", () => {
    const policy = policyFor([
      { type: "sword", material: "dragon", enchantment: 8 },
    ]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
  it("dragon-material sword, enchantment 9, damage 1000 G -- payout 400 G (both clauses apply; the 50 % rule wins, then deductible)", () => {
    const policy = policyFor([
      { type: "sword", material: "dragon", enchantment: 9 },
    ]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 1000 }]);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(1600);
  });
});

describe("MHPCO claim -- multi-item incidents", () => {
  it("dragon attack damages sword (500 G) and amulet (300 G) -- payout 600 G (deductible once per damaged item)", () => {
    const policy = policyFor([{ type: "sword" }, { type: "amulet" }]);
    const result = claimOn(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "amulet", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(2600);
  });
  it("two swords insured, both damaged -- each damages entry is a separate damage with its own deductible", () => {
    const policy = policyFor([{ type: "sword" }, { type: "sword" }]);
    const result = claimOn(policy, [
      { itemType: "sword", amount: 500 },
      { itemType: "sword", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(3400);
  });
});

describe("MHPCO claim -- cap exhaustion across claims", () => {
  it("sword insured (cap 2000 G), first claim of 1500 G -- payout 1400 G, remaining cap 600 G", () => {
    const policy = policyFor([{ type: "sword" }]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });
  it("second claim of 1500 G on the same policy -- payout 600 G, remaining cap 0 G (desired 1400 G reduced to remaining cap)", () => {
    const policy = policyFor([{ type: "sword" }]);
    claimOn(policy, [{ itemType: "sword", amount: 1500 }]);
    const second = claimOn(policy, [{ itemType: "sword", amount: 1500 }]);
    expect(second.payout).toBe(600);
    expect(second.remainingCap).toBe(0);
  });
});

describe("MHPCO claim -- rounding in the MHPCO's favor", () => {
  it("payout of 350.5 G rounds down to 350 G", () => {
    // enchantment 9 halves the damage: 901 * 0.5 = 450.5, - 100 deductible
    // = 350.5, rounded in the MHPCO's favour (down) -> 350
    const policy = policyFor([
      { type: "sword", material: "steel", enchantment: 9 },
    ]);
    const result = claimOn(policy, [{ itemType: "sword", amount: 901 }]);
    expect(result.payout).toBe(350);
    expect(result.remainingCap).toBe(1650);
  });
});

describe("MHPCO claim -- rejections", () => {
  it("damage to an item not part of the policy (amulet damaged, only a sword insured) -- throws an Error (chosen reading: rejection is signalled by throwing)", () => {
    const policy = policyFor([{ type: "sword" }]);
    expect(() =>
      claimOn(policy, [{ itemType: "amulet", amount: 300 }]),
    ).toThrow(Error);
  });
  it("damage entry with an unknown item type -- throws an Error", () => {
    const policy = policyFor([{ type: "sword" }]);
    expect(() =>
      claimOn(policy, [{ itemType: "broomstick", amount: 300 }]),
    ).toThrow(Error);
  });
  it("more damage entries of a type than the policy covers (two sword damages, one sword insured) -- throws an Error; the whole claim is rejected", () => {
    const policy = policyFor([{ type: "sword" }]);
    expect(() =>
      claimOn(policy, [
        { itemType: "sword", amount: 500 },
        { itemType: "sword", amount: 300 },
      ]),
    ).toThrow(Error);
  });
  it("damage entry with a negative amount (-200) -- throws an Error", () => {
    const policy = policyFor([{ type: "sword" }]);
    expect(() =>
      claimOn(policy, [{ itemType: "sword", amount: -200 }]),
    ).toThrow(Error);
  });
});

describe("claim-office CLI", () => {
  it("reads a scenario from stdin and writes {results} to stdout with one result per step, in order", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
      ],
    };
    const run = runCli(scenario);
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      // the second quote is a follow-up contract: 60 * 1.1 - 60 * 0.15 + 5 = 62
      results: [{ premium: 115 }, { premium: 62 }],
    });
  });
  it("quote step result contains premium as an integer", () => {
    // one rune would be 32.5 before rounding; the JSON must carry a whole G
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(run.status).toBe(0);
    const { results } = JSON.parse(run.stdout);
    expect(results[0].premium).toBe(33);
    expect(Number.isInteger(results[0].premium)).toBe(true);
  });
  it("claim step result contains payout and remainingCap as integers", () => {
    // enchantment 9 halves 901 -> 450.5, - 100 deductible = 350.5 -> 350
    const run = runCli({
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
            cause: "dragon",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(run.status).toBe(0);
    const { results } = JSON.parse(run.stdout);
    expect(results[1]).toEqual({ payout: 350, remainingCap: 1650 });
    expect(Number.isInteger(results[1].payout)).toBe(true);
    expect(Number.isInteger(results[1].remainingCap)).toBe(true);
  });
  it("a claim step refers to its policy by the zero-based index of the quote step", () => {
    // the claim names policy 1 (the amulet), not policy 0 (the sword)
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "claim",
          policy: 1,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 500 }],
          },
        },
      ],
    });
    expect(run.status).toBe(0);
    const { results } = JSON.parse(run.stdout);
    expect(results[2]).toEqual({ payout: 400, remainingCap: 800 });
  });
  it("schema example: 5-year customer, amulet quote then 200 G amulet claim -- results match the documented shape", () => {
    // premium: 60 base + 6 first insurance - 12 loyalty + 5 fee = 59
    // payout: 200 damage - 100 deductible = 100; cap 1200 - 100 = 1100
    const run = runCli({
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
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("unknown item type in a quote -- exits non-zero, writes an error description to stderr, writes no results to stdout", () => {
    const run = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/broomstick/);
    expect(run.stdout).not.toMatch(/results/);
  });
  it("claim against an item not in the policy -- exits non-zero and writes an error description to stderr", () => {
    const run = runCli({
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
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/amulet/);
    expect(run.stdout).not.toMatch(/results/);
  });
  it("claim with a negative damage amount -- exits non-zero and writes an error description to stderr", () => {
    const run = runCli({
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
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/-200/);
    expect(run.stdout).not.toMatch(/results/);
  });
});
