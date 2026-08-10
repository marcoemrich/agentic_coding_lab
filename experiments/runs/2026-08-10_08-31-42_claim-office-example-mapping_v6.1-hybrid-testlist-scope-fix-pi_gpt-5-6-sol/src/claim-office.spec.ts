import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion premiums", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the 60 G block premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes and 1 moonstone at 75 G because unlike types do not form a block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones at 120 G as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed item: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both high-enchantment and curse surcharges at enchantment 5", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("rejects an unknown quote item via CLI with stderr, non-zero status, and no stdout result", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type");
    expect(result.stdout).toBe("");
  });
  it("quotes a newcomer's first cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchantment-7 sword at 160 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet" }] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for 500 G damage to a regular sword", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at exactly enchantment 8", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 9 because the 50% clause wins", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to a dragon sword at enchantment 5", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel sword at enchantment 9", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 100 G deductible once per damaged item, paying 600 G for sword 500 plus amulet 300", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for 2000 G with a 4000 G payout cap", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("more damaged items than insured");
    expect(result.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value, not premium", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("insures a sword and 3-rune block for 1750 G despite the premium block discount", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword cap across successive 1500 G claims: 1400 G then 600 G then zero remaining", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim] };
    expect(runScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects damage to a type not present in the policy", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("amulet");
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damage item type", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("negative damage");
    expect(result.stdout).toBe("");
  });
  it("returns one ordered result per quote and claim using the normative JSON field names", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(Object.keys(result.results[0])).toEqual(["premium"]);
    expect(Object.keys(result.results[1])).toEqual(["payout", "remainingCap"]);
  });
});
