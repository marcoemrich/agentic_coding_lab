import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateBasePremium, processScenario, roundPremium, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0, priorQuotes = 0) => {
  const steps: Scenario["steps"] = [...Array.from({ length: priorQuotes }, () => ({ op: "quote" as const, items: [] })), { op: "quote" as const, items }];
  return processScenario({ customer: { yearsWithMHPCO }, steps }).results.at(-1);
};

describe("MHPCO claim office", () => {
  it("empty quote costs 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("main-item base premiums are sword 105, amulet 65, staff 85, potion 45 G including fee", () => {
    expect(calculateBasePremium([{ type: "sword" }])).toBe(100);
    expect(calculateBasePremium([{ type: "amulet" }])).toBe(60);
    expect(calculateBasePremium([{ type: "staff" }])).toBe(80);
    expect(calculateBasePremium([{ type: "potion" }])).toBe(40);
  });
  it("component counts 2/3/4/7 quote at 55/65/105/180 G", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    expect(calculateBasePremium(runes(2))).toBe(50);
    expect(calculateBasePremium(runes(3))).toBe(60);
    expect(calculateBasePremium(runes(4))).toBe(100);
    expect(calculateBasePremium(runes(7))).toBe(175);
  });
  it("mixed 2 runes + 1 moonstone quote at 80 G", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("separate rune and moonstone blocks quote at 125 G", () => {
    expect(calculateBasePremium([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toBe(120);
  });
  it("cursed surcharge adds 50 G only for the cursed sword in a sword-and-amulet policy", () => {
    const plain = quote([{ type: "sword" }, { type: "amulet" }]);
    const cursed = quote([{ type: "sword", cursed: true }, { type: "amulet" }]);
    expect((cursed as { premium: number }).premium - (plain as { premium: number }).premium).toBe(50);
  });
  it("exactly 2 years receives loyalty discount: plain sword quotes at 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("enchantment boundary 5 adds 30 G while 4 does not; curse still applies", () => {
    const atFour = quote([{ type: "sword", cursed: true, enchantment: 4 }]) as { premium: number };
    const atFive = quote([{ type: "sword", cursed: true, enchantment: 5 }]) as { premium: number };
    expect(atFive.premium - atFour.premium).toBe(30);
  });
  it("newcomer cursed sword quote is 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("long-standing customer's second contract quote is 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1)).toEqual({ premium: 160 });
  });
  it("regular sword damage pays 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage pays 100 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at enchantment 8 and 1000 damage pays 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword at enchantment 9 pays 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword at enchantment 5 and 800 damage pays 700 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toMatchObject({ payout: 700 });
  });
  it("steel sword at enchantment 9 pays 400 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toMatchObject({ payout: 400 });
  });
  it("two damaged items each incur a deductible: payout 600 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toMatchObject({ payout: 600 });
  });
  it("two swords produce insurance sum 2000 G and cap 4000 G", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two insured swords can each be damaged independently", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("excess same-type damages reject the whole CLI request with non-zero status", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("insured");
  });
  it("cursed premium modifiers do not increase the 2000 G cap", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("component block discount does not reduce the 3500 G cap", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive claims exhaust cap with payouts 1400 then 600 G", () => {
    const damage = { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, damage, damage] };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("premium 197.5 rounds up to 198 G", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("payout 350.5 rounds down to 350 G, only at the end", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("unknown quote item rejects via stderr/non-zero status/no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Unknown item type");
  });
  it("damage for an uninsured item rejects via stderr/non-zero status", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("insured");
  });
  it("unknown damaged item and negative damage each reject via stderr/non-zero status", () => {
    for (const damage of [{ itemType: "broomstick", amount: 200 }, { itemType: "sword", amount: -200 }]) {
      const input = { customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
      ] };
      const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
      expect(result.status).not.toBe(0);
      expect(result.stdout).toBe("");
      expect(result.stderr.length).toBeGreaterThan(0);
    }
  });
  it("CLI preserves sequential result shape and policy step references", () => {
    const input = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
