import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";

interface CliResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

function runCli(scenario: unknown): CliResult {
  const result = spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf-8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function scenario(yearsWithMHPCO: number, steps: unknown[]) {
  return { customer: { yearsWithMHPCO }, steps };
}

function quoteStep(items: unknown[]) {
  return { op: "quote", items };
}

function claimStep(policy: number, damages: unknown[]) {
  return { op: "claim", policy, incident: { cause: "dragon attack", damages } };
}

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums ---
  it("empty item list -> premium 5 G (only the processing fee)", () => {
    const result = runCli(scenario(0, [quoteStep([])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword -> base 100 G + 10 G first insurance + 5 G fee = 115 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet -> base 60 G -> premium 71 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "amulet" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff -> base 80 G -> premium 93 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "staff" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion -> base 40 G -> premium 49 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "potion" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 49 }] });
  });
  it("single rune -> base 25 G -> premium 32.5 G rounded up to 33 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "rune" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 33 }] });
  });
  it("single moonstone -> component base 25 G -> premium 33 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "moonstone" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Quote: building blocks of alike components ---
  it("2 runes -> 50 G base premium -> premium 60 G (no block)", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "rune" }, { type: "rune" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> 60 G base premium (building block applies) -> premium 71 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "rune" }, { type: "rune" }, { type: "rune" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> 100 G base premium (block requires exactly 3) -> premium 115 G", () => {
    const result = runCli(scenario(0, [quoteStep(Array(4).fill({ type: "rune" }))]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> 175 G base premium -> premium 198 G (197.5 rounded up)", () => {
    const result = runCli(scenario(0, [quoteStep(Array(7).fill({ type: "rune" }))]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> 75 G base (no block: different types) -> premium 88 G", () => {
    const result = runCli(
      scenario(0, [quoteStep([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> 120 G base (two separate blocks) -> premium 137 G", () => {
    const items = [...Array(3).fill({ type: "rune" }), ...Array(3).fill({ type: "moonstone" })];
    const result = runCli(scenario(0, [quoteStep(items)]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Quote: item-specific modifiers ---
  it("cursed sword -> 100 + 50 curse + 10 first insurance + 5 fee = 165 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 -> high-enchantment surcharge -> 145 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword", enchantment: 5 }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed sword with enchantment 5 -> both surcharges -> 195 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword", enchantment: 5, cursed: true }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 195 }] });
  });
  it("sword with enchantment 4 -> no high-enchantment surcharge -> 115 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword", enchantment: 4 }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 4 -> only curse surcharge -> 165 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword", enchantment: 4, cursed: true }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Quote: modifier scope on multi-item policies ---
  it("cursed sword + plain amulet -> 160 base, curse adds 50 (item scope only) -> 231 G", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword", cursed: true }, { type: "amulet" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years -> loyalty discount applies -> 95 G", () => {
    const result = runCli(scenario(2, [quoteStep([{ type: "sword" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year -> no loyalty discount -> 115 G", () => {
    const result = runCli(scenario(1, [quoteStep([{ type: "sword" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }] });
  });
  it("second quote in scenario -> 15% follow-up contract discount -> [115, 100]", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "sword" }]), quoteStep([{ type: "sword" }])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("long-standing customer's second contract (cursed sword ench 7) -> [175, 160]", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = runCli(scenario(3, [quoteStep([item]), quoteStep([item])]));
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 175 }, { premium: 160 }] });
  });

  // --- Quote: errors ---
  it("quote with unknown item type (broomstick) -> non-zero exit, stderr, no results", () => {
    const result = runCli(scenario(0, [quoteStep([{ type: "broomstick" }])]));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).not.toContain("results");
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, ench 3) damage 500 -> payout 400, remainingCap 1600", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword", material: "steel", enchantment: 3 }]),
        claimStep(0, [{ itemType: "sword", amount: 500 }]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune damage 200 -> payout 100 (no special clause), remainingCap 400", () => {
    const result = runCli(
      scenario(0, [quoteStep([{ type: "rune" }]), claimStep(0, [{ itemType: "rune", amount: 200 }])]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("sword 500 + amulet 300 -> payout 600 (deductible per damaged item), remainingCap 2600", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword" }, { type: "amulet" }]),
        claimStep(0, [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: enchantment threshold vs dragon material ---
  it("dragon sword ench exactly 8, damage 1000 -> 50% rule, then deductible -> 400", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword", material: "dragon", enchantment: 8 }]),
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon sword ench 9, damage 1000 -> 50% rule wins -> payout 400", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword", material: "dragon", enchantment: 9 }]),
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon sword ench 5, damage 800 -> full reimbursement -> payout 700, remainingCap 1300", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword", material: "dragon", enchantment: 5 }]),
        claimStep(0, [{ itemType: "sword", amount: 800 }]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword ench 9, damage 1000 -> only high-ench clause -> payout 400", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword", material: "steel", enchantment: 9 }]),
        claimStep(0, [{ itemType: "sword", amount: 1000 }]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: rounding ---
  it("steel sword ench 8, damage 901 -> 350.5 rounded down -> payout 350", () => {
    const result = runCli(
      scenario(0, [
        quoteStep([{ type: "sword", material: "steel", enchantment: 8 }]),
        claimStep(0, [{ itemType: "sword", amount: 901 }]),
      ]),
    );
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Claim: multiple items of the same type ---
  it.todo("two swords, two sword damage entries -> separate deductibles -> 600, cap 4000 -> remaining 3400");

  // --- Claim: cap based on unmodified insurance sum ---
  it.todo("cursed sword (premium 165) damage 1500 -> payout 1400, cap 2000 -> remaining 600");
  it.todo("sword + 3 runes (block) -> insurance sum 1750, cap 3500; sword damage 1500 -> 1400, remaining 2100");

  // --- Claim: cap exhaustion across successive claims ---
  it.todo("sword, two successive claims of 1500 each -> 1400/600 then 600/0");

  // --- Claim: errors ---
  it.todo("claim damages item not part of policy (amulet, only sword insured) -> non-zero exit + stderr");
  it.todo("claim damages unknown item type -> non-zero exit + stderr");
  it.todo("more damage entries of a type than policy covers -> non-zero exit, claim rejected");
  it.todo("damage entry with amount -200 -> non-zero exit + stderr");
});
