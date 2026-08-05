import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Step {
  op: "quote" | "claim";
  items?: QuoteItem[];
  policy?: number;
  incident?: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

function quote(items: QuoteItem[]): Step {
  return { op: "quote", items };
}

function claim(
  policy: number,
  damages: { itemType: string; amount: number }[],
): Step {
  return { op: "claim", policy, incident: { cause: "dragon", damages } };
}

function scenario(yearsWithMHPCO: number, steps: Step[]): Scenario {
  return { customer: { yearsWithMHPCO }, steps };
}

function runCli(input: unknown): {
  status: number | null;
  stdout: string;
  stderr: string;
} {
  const result = spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe("MHPCO Claim Office", () => {
  it("quote with empty item list yields premium 5 G (processing fee only)", () => {
    const result = runScenario(scenario(0, [quote([])]));
    expect(result.results).toEqual([{ premium: 5 }]);
  });
  it("quote single plain sword, new customer, first contract -- premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario(scenario(0, [quote([{ type: "sword" }])]));
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quote 2 runes -- premium 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const result = runScenario(scenario(0, [quote([{ type: "rune" }, { type: "rune" }])]));
    expect(result.results).toEqual([{ premium: 60 }]);
  });
  it("quote 3 runes -- block applies, premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])]),
    );
    expect(result.results).toEqual([{ premium: 71 }]);
  });
  it("quote 4 runes -- no block, premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]),
      ]),
    );
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("quote 7 runes -- premium 198 G (175 base + 17.50 first insurance + 5 fee = 197.50, rounded up)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario(scenario(0, [quote(runes)]));
    expect(result.results).toEqual([{ premium: 198 }]);
  });
  it("quote 2 runes + 1 moonstone -- no block across types, premium 88 G (75 base + 7.50 + 5 fee = 87.50, rounded up)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])]),
    );
    expect(result.results).toEqual([{ premium: 88 }]);
  });
  it("quote 3 runes + 3 moonstones -- two separate blocks, premium 137 G (120 base + 12 + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [
        quote([
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
          { type: "moonstone" },
          { type: "moonstone" },
          { type: "moonstone" },
        ]),
      ]),
    );
    expect(result.results).toEqual([{ premium: 137 }]);
  });
  it("newcomer with cursed sword (steel, ench 3) -- premium 165 G (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]),
      ]),
    );
    expect(result.results).toEqual([{ premium: 165 }]);
  });
  it("sword with enchantment exactly 5 -- high-enchantment surcharge applies, premium 145 G (100 + 30 + 10 + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "sword", enchantment: 5 }])]),
    );
    expect(result.results).toEqual([{ premium: 145 }]);
  });
  it("sword with enchantment 4 -- no high-enchantment surcharge, premium 115 G", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "sword", enchantment: 4 }])]),
    );
    expect(result.results).toEqual([{ premium: 115 }]);
  });
  it("cursed sword with enchantment 5 -- both surcharges, premium 195 G (100 + 50 + 30 + 10 + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "sword", enchantment: 5, cursed: true }])]),
    );
    expect(result.results).toEqual([{ premium: 195 }]);
  });
  it("customer with exactly 2 years -- loyalty discount applies, plain sword premium 95 G (100 + 10 - 20 + 5 fee)", () => {
    const result = runScenario(scenario(2, [quote([{ type: "sword" }])]));
    expect(result.results).toEqual([{ premium: 95 }]);
  });
  it("second quote in scenario -- 15% follow-up discount, plain sword (0 years) premium 100 G (100 + 10 - 15 + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "sword" }]), quote([{ type: "sword" }])]),
    );
    expect(result.results).toEqual([{ premium: 115 }, { premium: 100 }]);
  });
  it("cursed sword + plain amulet -- curse applies to sword only, premium 231 G (160 base + 50 curse + 16 first insurance + 5 fee)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "sword", cursed: true }, { type: "amulet" }])]),
    );
    expect(result.results).toEqual([{ premium: 231 }]);
  });
  it("long-standing customer's second contract: 3 years, cursed sword ench 7 -- premium 160 G (100 + 50 + 30 - 20 + 10 - 15 + 5 fee)", () => {
    const result = runScenario(
      scenario(3, [
        quote([{ type: "amulet" }]),
        quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }]),
      ]),
    );
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("premium 197.50 G rounds up to 198 G (cursed sword + 2 runes, follow-up contract, 0 years)", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "amulet" }]),
        quote([{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }]),
      ]),
    );
    expect(result.results[1]).toEqual({ premium: 198 });
  });
  it("claim: regular sword (steel, ench 3), damage 500 -- payout 400 G, remainingCap 1600 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "steel", enchantment: 3 }]),
        claim(0, [{ itemType: "sword", amount: 500 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: rune damage 200 -- payout 100 G, remainingCap 400 G (cap 500 = 2x250)", () => {
    const result = runScenario(
      scenario(0, [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])]),
    );
    expect(result.results).toEqual([
      { premium: 33 },
      { payout: 100, remainingCap: 400 },
    ]);
  });
  it("claim: sword (500) and amulet (300) damaged -- deductible per item, payout 600 G, remainingCap 2600 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword" }, { type: "amulet" }]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 181 },
      { payout: 600, remainingCap: 2600 },
    ]);
  });
  it("claim: dragon sword ench exactly 8, damage 1000 -- 50% rule wins, payout 400 G, remainingCap 1600 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "dragon", enchantment: 8 }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: dragon sword ench 9, damage 1000 -- both clauses, 50% wins, payout 400 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "dragon", enchantment: 9 }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: dragon sword ench 5, damage 800 -- full reimbursement, payout 700 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "dragon", enchantment: 5 }]),
        claim(0, [{ itemType: "sword", amount: 800 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 700, remainingCap: 1300 },
    ]);
  });
  it("claim: steel sword ench 9, damage 1000 -- 50% clause, payout 400 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "steel", enchantment: 9 }]),
        claim(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 400, remainingCap: 1600 },
    ]);
  });
  it("claim: payout 350.50 rounds down to 350 G (steel sword ench 9, damage 901)", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword", material: "steel", enchantment: 9 }]),
        claim(0, [{ itemType: "sword", amount: 901 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 145 },
      { payout: 350, remainingCap: 1650 },
    ]);
  });
  it("claim: policy with two swords, two sword damages -- each own deductible, payout 800 G, remainingCap 3200 G", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword" }, { type: "sword" }]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 225 },
      { payout: 800, remainingCap: 3200 },
    ]);
  });
  it("claim: cap exhaustion -- sword, two claims of 1500 each: payouts 1400 then 600, remainingCap 600 then 0", () => {
    const result = runScenario(
      scenario(0, [
        quote([{ type: "sword" }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
        claim(0, [{ itemType: "sword", amount: 1500 }]),
      ]),
    );
    expect(result.results).toEqual([
      { premium: 115 },
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("error: quote with unknown item type 'broomstick' -- non-zero exit, stderr message, no results on stdout", () => {
    const { status, stdout, stderr } = runCli(
      scenario(0, [quote([{ type: "broomstick" }])]),
    );
    expect(status).not.toBe(0);
    expect(stderr).toContain("broomstick");
    expect(stdout).not.toContain("results");
  });
  it("error: claim damage for item not in policy -- non-zero exit, stderr message", () => {
    const { status, stdout, stderr } = runCli(
      scenario(0, [
        quote([{ type: "sword" }]),
        claim(0, [{ itemType: "amulet", amount: 100 }]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr).toContain("amulet");
    expect(stdout).not.toContain("results");
  });
  it("error: more damage entries of a type than the policy covers -- non-zero exit, claim rejected", () => {
    const { status, stdout, stderr } = runCli(
      scenario(0, [
        quote([{ type: "sword" }]),
        claim(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr).toContain("sword");
    expect(stdout).not.toContain("results");
  });
  it("error: claim with negative damage amount -- non-zero exit, stderr message", () => {
    const { status, stdout, stderr } = runCli(
      scenario(0, [
        quote([{ type: "sword" }]),
        claim(0, [{ itemType: "sword", amount: -200 }]),
      ]),
    );
    expect(status).not.toBe(0);
    expect(stderr).toContain("-200");
    expect(stdout).not.toContain("results");
  });
});
