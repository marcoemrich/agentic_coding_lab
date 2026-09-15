import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, insuranceValue, processScenario, roundPayout, roundPremium } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion: base premiums 100, 60, 80, and 40 G and insurance values 1000, 600, 800, and 400 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => [basePremium([{ type }]), insuranceValue([{ type }])]))
      .toEqual([[100, 1000], [60, 600], [80, 800], [40, 400]]);
  });
  it("quotes 2 runes at a 50 G component base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("quotes exactly 3 runes at the special 60 G component base premium", () => {
    expect(basePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("quotes 4 runes at 100 G because the block requires exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("quotes 7 runes at 175 G because quantities other than exactly 3 receive no block price", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("quotes 2 runes and 1 moonstone at 75 G because alike means the exact component type", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("quotes 3 runes and 3 moonstones at 120 G as two separate blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(basePremium(items)).toBe(120);
  });
  it("applies a cursed sword's 50 G surcharge only to that sword, producing 210 G before policy modifiers beside a plain amulet", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [
      { type: "sword", cursed: true }, { type: "amulet", cursed: false },
    ] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both 50% curse and 30% high-enchantment surcharges to a sword at exactly enchantment 5", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 5 }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply the high-enchantment surcharge at enchantment 4, but still applies a curse surcharge", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 4 }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("pays 400 G for 1000 G damage to a dragon-material sword at exactly enchantment 8", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when 500 G sword damage and 300 G amulet damage each receive a 100 G deductible", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for 500 G damage to a regular steel sword at enchantment 3", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to an insured rune with no special clauses", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon-material sword at enchantment 9 because the 50% clause wins", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for 800 G damage to a dragon-material sword at enchantment 5", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel sword at enchantment 9", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives a two-sword policy an insurance sum of 2000 G and a cap of 4000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two insured swords damaged in one incident as separate damages with separate deductibles", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero status and descriptive stderr when sword damages outnumber insured swords, writing no stdout result", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/damage/i);
    expect(cli.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 3200 G cap from its 1600 G insurance sum", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("gives a cursed sword a 2000 G cap based on unmodified insurance value, not premium", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives a sword-and-3-runes policy a 3500 G cap from 1750 G insurance value despite the premium block", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts of 1400 then 600 G, leaving caps of 600 then 0 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim] };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a final premium of 197.5 G up to 198 G while retaining fractional intermediates", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("rounds a final payout of 350.5 G down to 350 G while retaining fractional intermediates", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
  it("rejects an unknown quote item with non-zero status and descriptive stderr, writing no stdout result", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/broomstick|unknown/i);
    expect(cli.stdout).toBe("");
  });
  it("rejects damage to an item type absent from the policy with non-zero status and descriptive stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/amulet|insured/i);
    expect(cli.stdout).toBe("");
  });
  it("rejects an unknown damage item type with non-zero status and descriptive stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/broomstick|insured/i);
    expect(cli.stdout).toBe("");
  });
  it("rejects a negative damage amount with non-zero status and descriptive stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/negative|amount/i);
    expect(cli.stdout).toBe("");
  });
  it("quotes a newcomer's cursed steel sword at 165 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchantment-7 sword at 160 G, retaining per-item first-insurance surcharge", () => {
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
});
