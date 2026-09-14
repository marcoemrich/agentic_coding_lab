import { describe, expect, it } from "vitest";
import { processScenario, type Scenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Item[]) => ({ op: "quote" as const, items });
const claim = (policy: number, damages: Damage[]) => ({
  op: "claim" as const,
  policy,
  incident: { cause: "test incident", damages },
});
type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
const run = (steps: Scenario["steps"], years = 0) => processScenario({ customer: customer(years), steps });

async function runCli(input: Scenario): Promise<{ code: number | null; stdout: string; stderr: string }> {
  const { spawn } = await import("node:child_process");
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--import", "tsx", "src/cli.ts"]);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => { stdout += chunk.toString(); });
    child.stderr.on("data", (chunk: Buffer) => { stderr += chunk.toString(); });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
    child.stdin.end(JSON.stringify(input));
  });
}

function expectRejected(result: { code: number | null; stdout: string; stderr: string }): void {
  expect(result.code).not.toBe(0);
  expect(result.stdout).toBe("");
  expect(result.stderr.length).toBeGreaterThan(0);
}

describe("MHPCO claim office", () => {
  it("empty quote returns premium 5 G (processing fee only)", () => {
    expect(run([quote([])])).toEqual({ results: [{ premium: 5 }] });
  });
  it("main item price list uses bases sword 100, amulet 60, staff 80, potion 40 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => run([quote([{ type }])]).results[0])).toEqual([
      { premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 },
    ]);
  });
  it("2 runes have 50 G base premium", () => {
    expect(run([quote([{ type: "rune" }, { type: "rune" }])])).toEqual({ results: [{ premium: 60 }] });
  });
  it("exactly 3 runes have 60 G block base premium", () => {
    expect(run([quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])])).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes have 100 G base premium because a block requires exactly 3", () => {
    expect(run([quote(Array.from({ length: 4 }, () => ({ type: "rune" })))]).results[0]).toEqual({ premium: 115 });
  });
  it("7 runes have 175 G base premium", () => {
    expect(run([quote(Array.from({ length: 7 }, () => ({ type: "rune" })))]).results[0]).toEqual({ premium: 198 });
  });
  it("2 runes plus 1 moonstone have 75 G base premium because unlike types do not block", () => {
    expect(run([quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])]).results[0]).toEqual({ premium: 88 });
  });
  it("3 runes plus 3 moonstones have two blocks and 120 G base premium", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(run([quote(items)]).results[0]).toEqual({ premium: 137 });
  });
  it("cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(run([quote(items)]).results[0]).toEqual({ premium: 231 });
  });
  it("exactly 2 customer years activates the 20 percent loyalty discount", () => {
    expect(run([quote([{ type: "sword" }])], 2).results[0]).toEqual({ premium: 95 });
  });
  it("enchantment 5 activates 30 percent surcharge and stacks with curse", () => {
    expect(run([quote([{ type: "sword", enchantment: 5, cursed: true }])]).results[0]).toEqual({ premium: 195 });
  });
  it("enchantment 4 has no enchantment surcharge but may have curse surcharge", () => {
    expect(run([quote([{ type: "sword", enchantment: 4, cursed: true }])]).results[0]).toEqual({ premium: 165 });
  });
  it("newcomer first quote for cursed sword has premium 165 G", () => {
    expect(run([quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])]).results[0]).toEqual({ premium: 165 });
  });
  it("3-year customer's second quote for cursed enchantment-7 sword has premium 160 G", () => {
    const steps = [quote([]), quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }])];
    expect(run(steps, 3).results[1]).toEqual({ premium: 160 });
  });
  it("regular steel enchantment-3 sword damage 500 G pays 400 G", () => {
    const steps = [quote([{ type: "sword", material: "steel", enchantment: 3 }]), claim(0, [{ itemType: "sword", amount: 500 }])];
    expect(run(steps).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G pays 100 G without item special clauses", () => {
    const steps = [quote([{ type: "rune" }]), claim(0, [{ itemType: "rune", amount: 200 }])];
    expect(run(steps).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword enchantment 8 damage 1000 G pays 400 G", () => {
    const steps = [quote([{ type: "sword", material: "dragon", enchantment: 8 }]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(run(steps).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 plus amulet damage 300 pays 600 G with two deductibles", () => {
    const steps = [quote([{ type: "sword" }, { type: "amulet" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])];
    expect(run(steps).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("dragon sword enchantment 9 damage 1000 G pays 400 G because 50 percent wins", () => {
    const steps = [quote([{ type: "sword", material: "dragon", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(run(steps).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5 damage 800 G pays 700 G", () => {
    const steps = [quote([{ type: "sword", material: "dragon", enchantment: 5 }]), claim(0, [{ itemType: "sword", amount: 800 }])];
    expect(run(steps).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9 damage 1000 G pays 400 G", () => {
    const steps = [quote([{ type: "sword", material: "steel", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 1000 }])];
    expect(run(steps).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("two insured swords establish insurance sum 2000 G and cap 4000 G", () => {
    const steps = [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [])];
    expect(run(steps).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two sword damages against two insured swords are separate, each with a deductible", () => {
    const steps = [quote([{ type: "sword" }, { type: "sword" }]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])];
    expect(run(steps).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damage entries than insured items rejects whole claim with nonzero CLI status, stderr, no stdout", async () => {
    const input: Scenario = { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])] };
    expectRejected(await runCli(input));
  });
  it("caps use unmodified values: sword+amulet 3200, cursed sword 2000, sword+3 runes 3500 G", () => {
    const capFor = (items: Item[]) => run([quote(items), claim(0, [])]).results[1];
    expect(capFor([{ type: "sword" }, { type: "amulet" }])).toEqual({ payout: 0, remainingCap: 3200 });
    expect(capFor([{ type: "sword", cursed: true }])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(capFor([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive sword claims of 1500 G pay 1400 then 600 and leave cap 600 then 0 G", () => {
    const damage = [{ itemType: "sword", amount: 1500 }];
    const results = run([quote([{ type: "sword" }]), claim(0, damage), claim(0, damage)]).results;
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("fractional premium rounds up and fractional payout rounds down only at the end", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(run([quote(sevenRunes)]).results[0]).toEqual({ premium: 198 });
    const steps = [quote([{ type: "sword", enchantment: 9 }]), claim(0, [{ itemType: "sword", amount: 901 }])];
    expect(run(steps).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("unknown quote item, uninsured or unknown damage item, and negative damage reject via CLI contract", async () => {
    const invalidScenarios: Scenario[] = [
      { customer: customer(), steps: [quote([{ type: "broomstick" }])] },
      { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "amulet", amount: 200 }])] },
      { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "broomstick", amount: 200 }])] },
      { customer: customer(), steps: [quote([{ type: "sword" }]), claim(0, [{ itemType: "sword", amount: -200 }])] },
    ];
    for (const scenario of invalidScenarios) expectRejected(await runCli(scenario));
  });
});
