import { describe, it, expect } from "vitest";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { runScenario } from "./claim-office.js";

const CLI_PATH = fileURLToPath(new URL("./cli.ts", import.meta.url));

const runCli = (input: unknown): { status: number; stdout: string; stderr: string } => {
  try {
    const stdout = execFileSync("npx", ["tsx", CLI_PATH], {
      input: JSON.stringify(input),
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string };
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout?.toString() ?? "",
      stderr: failure.stderr?.toString() ?? "",
    };
  }
};

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums ---
  it("empty item list yields premium 5 (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("main item price list: sword -> 115, amulet -> 71, staff -> 93, potion -> 49 (base + 10% first insurance + 5 fee)", () => {
    const quote = (type: string) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [{ type }] }],
    });
    expect(runScenario(quote("sword")).results[0]).toEqual({ premium: 115 });
    expect(runScenario(quote("amulet")).results[0]).toEqual({ premium: 71 });
    expect(runScenario(quote("staff")).results[0]).toEqual({ premium: 93 });
    expect(runScenario(quote("potion")).results[0]).toEqual({ premium: 49 });
  });
  it("2 runes yield base premium 50 -> premium 60", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes yield block base premium 60 -> premium 71", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes yield no block (block requires exactly 3) -> base 100 -> premium 115", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes yield base 175 -> 197.5 rounds up (MHPCO's favor) to premium 198", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone: not alike, no block -> base 75 -> 87.5 rounds up to 88", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones yield two separate blocks -> base 120 -> premium 137", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Quote: item-specific modifiers ---
  it("newcomer with cursed sword -> 100 + 50 curse + 10 first insurance + 5 fee = 165", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("sword with enchantment exactly 5 gets 30% surcharge -> 100 + 30 + 10 + 5 = 145", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 gets no high-enchantment surcharge -> 115", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword with enchantment 5 gets both surcharges -> 100 + 50 + 30 + 10 + 5 = 195", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] }],
    });
    expect(result.results[0]).toEqual({ premium: 195 });
  });

  // --- Quote: policy-wide modifiers ---
  it("customer with exactly 2 years gets 20% loyalty discount -> 95; 1 year -> no discount -> 115", () => {
    const scenario = (yearsWithMHPCO: number) => ({
      customer: { yearsWithMHPCO },
      steps: [{ op: "quote" as const, items: [{ type: "sword" }] }],
    });
    expect(runScenario(scenario(2)).results[0]).toEqual({ premium: 95 });
    expect(runScenario(scenario(1)).results[0]).toEqual({ premium: 115 });
  });
  it("cursed surcharge applies only to the cursed item: cursed sword + plain amulet -> 160 + 50 + 16 + 5 = 231", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("second quote in scenario gets 15% follow-up contract discount -> sword: 100 + 10 - 15 + 5 = 100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
    expect(result.results[1]).toEqual({ premium: 100 });
  });
  it("long-standing customer's second contract: 3 years, cursed sword e7 -> 100+50+30-20+10-15+5 = 160 (first insurance still applies per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, e3), damage 500 -> payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 -> payout 100, remainingCap 400 (no enchantment/material clauses)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("deductible applies once per damaged item: sword 500 + amulet 300 -> payout 600, remainingCap 2600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses ---
  it("dragon sword with enchantment exactly 8, damage 1000 -> 50% then deductible -> payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword e9, damage 1000 -> both clauses, 50% wins -> payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword e5, damage 800 -> dragon clause only, full reimbursement -> payout 700", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword e9, damage 1000 -> high-enchantment clause only -> payout 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("payout rounds down in MHPCO's favor: steel sword e8, damage 701 -> floor(250.5) = 250", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 701 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 250, remainingCap: 1750 });
  });

  // --- Claim: insurance sum, cap, multiple items ---
  it("two swords: insurance sum 2000, cap 4000; two sword damages of 500 -> payout 800, remainingCap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("cap exhaustion: sword, two claims of 1500 -> 1400/600 remaining, then 600/0 remaining", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1500 }] },
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("cursed sword cap based on unmodified insurance value: damage 1500 -> payout 1400, remainingCap 600", () => {
    const quote = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(quote.results[0]).toEqual({ premium: 165 });
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("component block does not reduce insurance sum: sword + 3 runes -> cap 3500; sword damage 1500 -> 1400, remainingCap 2100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 181 });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 2100 });
  });

  // --- CLI error handling ---
  it("quote with unknown item type (broomstick) exits non-zero, writes stderr, no results on stdout", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr.length).toBeGreaterThan(0);
    if (outcome.stdout.trim() !== "") {
      const parsed = JSON.parse(outcome.stdout) as { results?: unknown };
      expect(parsed.results).toBeUndefined();
    }
  });
  it("claim damage for item not part of policy (amulet damaged, only sword insured; or unknown type) exits non-zero", () => {
    const scenario = (itemType: string) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType, amount: 300 }] },
        },
      ],
    });
    for (const itemType of ["amulet", "broomstick"]) {
      const outcome = runCli(scenario(itemType));
      expect(outcome.status).not.toBe(0);
      expect(outcome.stderr.length).toBeGreaterThan(0);
    }
  });
  it("claim with more damage entries of a type than the policy covers exits non-zero", () => {
    const outcome = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr.length).toBeGreaterThan(0);
  });
  it("claim with negative damage amount exits non-zero", () => {
    const outcome = runCli({
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
    expect(outcome.status).not.toBe(0);
    expect(outcome.stderr.length).toBeGreaterThan(0);
  });
});
