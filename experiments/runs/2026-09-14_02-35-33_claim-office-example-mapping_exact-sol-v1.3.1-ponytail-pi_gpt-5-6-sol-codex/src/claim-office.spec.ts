import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

function quote(items: Item[], yearsWithMHPCO = 0): number {
  const output = processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  return (output.results[0] as { premium: number }).premium;
}

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("empty quote costs only the 5 G processing fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("main items have base premiums sword 100, amulet 60, staff 80, potion 40 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }]))).toEqual([115, 71, 93, 49]);
  });
  it("runes and moonstones have a 25 G base premium each", () => {
    expect([quote([{ type: "rune" }]), quote([{ type: "moonstone" }])]).toEqual([33, 33]);
  });
  it("2, 3, 4, and 7 runes have base premiums 50, 60, 100, and 175 G", () => {
    expect([2, 3, 4, 7].map((count) => quote(Array.from({ length: count }, () => ({ type: "rune" }))))).toEqual([60, 71, 115, 198]);
  });
  it("2 runes plus 1 moonstone have a 75 G base premium with no block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("3 runes plus 3 moonstones have a 120 G base premium from two blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(quote(items)).toBe(137);
  });
  it("cursed surcharge applies to the cursed sword only: sword plus amulet is 210 G before policy modifiers and fee", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("exactly 2 years with MHPCO earns the 20 percent loyalty discount", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("enchantment 5 adds 30 percent and combines with a curse surcharge", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("enchantment 4 adds no enchantment surcharge while curse still applies", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("a newcomer's first cursed sword quote costs 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("a 3-year customer's second quote for a cursed enchantment-7 sword costs 160 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", enchantment: 7, cursed: true }] },
    ] });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("a premium calculation of 197.5 G rounds up to 198 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }, { type: "rune" }, { type: "rune" }] },
    ] });
    expect(output.results[1]).toEqual({ premium: 198 });
  });
  it("regular sword damage of 500 G pays 400 G and leaves 1600 G cap", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage of 200 G pays 100 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at enchantment 8 with 1000 G damage pays 400 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 9 with 1000 G damage pays 400 G because the 50 percent clause wins", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 5 with 800 G damage pays 700 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword at enchantment 9 with 1000 G damage pays 400 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("500 G sword and 300 G amulet damages pay 600 G after two deductibles", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two insured swords establish a 4000 G cap", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two covered sword damages are separate events and each has a deductible", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("the CLI rejects more damage entries of a type than the policy covers", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("damage");
    expect(run.stdout).toBe("");
  });
  it("the CLI rejects damage to an absent or unknown item", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(run.status).not.toBe(0);
      expect(run.stderr).toContain("damage");
      expect(run.stdout).toBe("");
    }
  });
  it("the CLI rejects a negative damage amount", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("damage");
    expect(run.stdout).toBe("");
  });
  it("successive 1500 G sword claims pay 1400 then 600 and exhaust the cap", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident },
      { op: "claim", policy: 0, incident },
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("a sword and amulet establish a 3200 G cap", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("a cursed sword's cap remains 2000 G despite premium modifiers", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("a sword and 3-rune block establish a 3500 G cap from a 1750 G insurance sum", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("a raw payout of 350.5 G rounds down to 350 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("the CLI rejects a quote containing an unknown item type without stdout results", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("item type");
    expect(run.stdout).toBe("");
  });
  it("the claim-office executable writes ordered JSON results", () => {
    const run = spawnSync("./claim-office", [], { input: JSON.stringify({
      customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }],
    }), encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(run.stderr).toBe("");
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 5 }] });
  });
});
