import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Scenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("empty item list -> premium 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("plain sword -> premium 115 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("plain amulet -> premium 71 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("plain staff -> premium 93 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] })).toEqual({ results: [{ premium: 93 }] });
  });
  it("plain potion -> premium 49 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] })).toEqual({ results: [{ premium: 49 }] });
  });
  it("2 runes -> premium 60 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> premium 71 G with exact block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> premium 115 G with no block", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> premium 198 G, rounded up from 197.5 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone -> premium 88 G with no mixed block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> premium 137 G with two blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("cursed sword + plain amulet -> premium 231 G with item-scoped curse", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("exactly 2 customer years -> loyalty applies and premium is 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("enchantment 5 cursed sword -> both surcharges and premium 195 G", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("enchantment 4 cursed sword -> only curse and premium 165 G", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing second quote cursed enchanted sword -> second premium 160 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("regular sword damage 500 -> payout 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rune damage 200 -> payout 100 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword enchantment 8 damage 1000 -> payout 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5 damage 800 -> payout 700 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9 damage 1000 -> payout 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 + amulet damage 300 -> payout 600 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords establish 4000 G cap and two damages get separate deductibles", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more same-type damages than insured throws Error", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    expect(() => processScenario(scenario)).toThrow(Error);
  });
  it("sword + amulet establish 3200 G cap", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword cap is based on 1000 G value and remains 2000 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sword + exact 3-rune block has insurance sum 1750 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G and exhaust cap", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "flood", damages: [damage] } },
    ] };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("raw payout 350.5 G rounds down to 350 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects unknown quote items, uninsured or unknown damages, and negative damage", () => {
    const customer = { yearsWithMHPCO: 0 };
    const valid = runCli({ customer, steps: [{ op: "quote", items: [] }] });
    expect(valid.status).toBe(0);
    expect(JSON.parse(valid.stdout)).toEqual({ results: [{ premium: 5 }] });

    const invalidScenarios = [
      { customer, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] },
      { customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] },
      { customer, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] },
    ];
    for (const scenario of invalidScenarios) {
      const result = runCli(scenario);
      expect(result.status).not.toBe(0);
      expect(result.stderr.length).toBeGreaterThan(0);
      expect(result.stdout).not.toContain("results");
    }
  });
});

