import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, executeScenario, insuranceValue, itemAdjustedPremium, roundPayout, roundPremium } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("./claim-office", [], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("prices a sword at 100 G base premium and 1000 G insurance value", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
    expect(insuranceValue([{ type: "sword" }])).toBe(1000);
  });
  it("prices an amulet at 60 G base premium and 600 G insurance value", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
    expect(insuranceValue([{ type: "amulet" }])).toBe(600);
  });
  it("prices a staff at 80 G base premium and 800 G insurance value", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
    expect(insuranceValue([{ type: "staff" }])).toBe(800);
  });
  it("prices a potion at 40 G base premium and 400 G insurance value", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
    expect(insuranceValue([{ type: "potion" }])).toBe(400);
  });
  it("prices each rune and moonstone independently at 25 G premium and 250 G value", () => {
    for (const type of ["rune", "moonstone"]) {
      expect(basePremium([{ type }])).toBe(25);
      expect(insuranceValue([{ type }])).toBe(250);
    }
  });
  it("prices 2 runes at 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes as one block at 60 G base premium", () => {
    expect(basePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("prices 4 runes at 100 G because blocks require exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G without partitioning into blocks", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes plus 1 moonstone at 75 G because alike means exact type", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes plus 3 moonstones as two blocks at 120 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(basePremium(items)).toBe(120);
  });
  it("adds a cursed surcharge only to the affected sword: 210 G before other modifiers and fee", () => {
    expect(itemAdjustedPremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(210);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    expect(itemAdjustedPremium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(180);
  });
  it("does not apply the high-enchantment surcharge at enchantment 4", () => {
    expect(itemAdjustedPremium([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(150);
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer’s cursed enchanted sword on their second contract at 160 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G final premium up to 198 G and keeps intermediates fractional", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout result", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type: broomstick");
    expect(result.stdout).toBe("");
  });
  it("pays 400 G for regular sword damage of 500 G after one deductible", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(executeScenario(scenario as never).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G without item special clauses", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when sword and amulet damage each incur a 100 G deductible", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for an enchantment-8 dragon sword damaged by 1000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G when enchantment 9 overrides dragon full reimbursement on 1000 G damage", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(executeScenario(scenario).results[1]).toMatchObject({ payout: 400 });
  });
  it("pays 700 G for an enchantment-5 dragon sword damaged by 800 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(executeScenario(scenario).results[1]).toMatchObject({ payout: 700 });
  });
  it("pays 400 G for an enchantment-9 steel sword damaged by 1000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(executeScenario(scenario).results[1]).toMatchObject({ payout: 400 });
  });
  it("treats two insured swords as distinct, with insurance sum 2000 G and cap 4000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("applies a separate deductible to each of two damage entries for two insured swords", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when damage multiplicity exceeds insured item multiplicity", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage item is not covered: sword");
    expect(result.stdout).toBe("");
  });
  it("caps sword plus amulet coverage at 3200 G from their 1600 G insurance sum", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(executeScenario(scenario).results[1]).toMatchObject({ remainingCap: 3200 });
  });
  it("bases a cursed sword’s 2000 G cap on unmodified value rather than its 165 G premium", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(executeScenario(scenario).results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("values sword plus a 3-rune block at 1750 G insurance sum despite the premium block discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(executeScenario(scenario).results[1]).toMatchObject({ remainingCap: 3500 });
  });
  it("pays 1400 G then 600 G for two successive 1500 G sword claims, exhausting the 2000 G cap", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim" as const, policy: 0, incident: { cause: "second", damages: [damage] } },
    ] };
    expect(executeScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 350.5 G final payout down to 350 G and keeps intermediates fractional", () => {
    expect(roundPayout(350.5)).toBe(350);
  });
  it("rejects damage to an uninsured or unknown item through the CLI with non-zero status and stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain(`Damage item is not covered: ${itemType}`);
      expect(result.stdout).toBe("");
    }
  });
  it("rejects a negative damage amount through the CLI with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Negative damage amount: -200");
    expect(result.stdout).toBe("");
  });
  it("reads sequential quote and claim steps from stdin and writes binding result field names to stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
