import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Item, type Scenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("empty item list returns premium 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it.each([
    ["sword", 115], ["amulet", 71], ["staff", 93], ["potion", 49],
  ])("main-item %s first quote yields premium %i G", (type, premium) => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }))
      .toEqual({ results: [{ premium }] });
  });
  it("2 runes yield premium 60 G including first-insurance surcharge and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("exactly 3 runes use block and yield premium 71 G", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it.each([[4, 115], [7, 198]])("block requires exactly 3: %i runes yield premium %i G", (count, premium) => {
    const items = Array.from({ length: count }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium }] });
  });
  it("alike means exact type: 2 runes plus 1 moonstone yield 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes plus 3 moonstones form separate blocks and yield 137 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("cursed surcharge affects only cursed sword in sword plus amulet policy, yielding 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("exactly 2 years earns loyalty discount: sword premium 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it.each([[5, 195], [4, 165]])("cursed sword enchantment %i yields premium %i G", (enchantment, premium) => {
    const item = { type: "sword", cursed: true, enchantment };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium }] });
  });
  it("newcomer cursed sword integration example yields premium 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second quote for cursed enchantment-7 sword yields premium 160 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });
  it("regular sword damage 500 G pays 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }))
      .toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("rune damage 200 G pays 100 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }))
      .toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("dragon sword enchantment 8 damage 1000 G pays 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.each([
    ["dragon", 5, 800, 700, 1300], ["steel", 9, 1000, 400, 1600],
  ])("%s sword enchantment %i damage %i has payout %i", (material, enchantment, amount, payout, remainingCap) => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material, enchantment }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout, remainingCap });
  });
  it("sword damage 500 plus amulet damage 300 applies two deductibles and pays 600 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords produce cap 4000 G and two 1000 G damages pay 1800 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 1800, remainingCap: 2200 });
  });
  it("more same-type damages than insured items rejects the whole claim through CLI", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    expect(cli.stderr).toMatch(/more damage entries|not insured/i);
  });
  it("caps use unmodified values: cursed sword 2000, sword plus amulet 3200, sword plus 3 runes 3500 G", () => {
    const capFor = (items: Item[]) => {
      const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "check", damages: [] } }] satisfies Scenario["steps"];
      return runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1];
    };
    expect(capFor([{ type: "sword", cursed: true }])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(capFor([{ type: "sword" }, { type: "amulet" }])).toEqual({ payout: 0, remainingCap: 3200 });
    expect(capFor([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive 1500 G sword claims pay 1400 then 600 and exhaust cap", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results)
      .toEqual([{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("premium 197.5 rounds to 198 and payout 350.5 rounds to 350 G", () => {
    const components = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: components }] }).results[0])
      .toEqual({ premium: 198 });
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] satisfies Scenario["steps"];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("unknown quote item makes CLI fail with stderr and no stdout", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stdout).toBe("");
    expect(cli.stderr).toMatch(/unknown item type.*broomstick/i);
  });
  it("uninsured or unknown claim item and negative damage make CLI fail with stderr", () => {
    const invalidDamages = [
      { itemType: "amulet", amount: 200 },
      { itemType: "broomstick", amount: 200 },
      { itemType: "sword", amount: -200 },
    ];
    invalidDamages.forEach((damage) => {
      const input = { customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [damage] } },
      ] };
      const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
      expect(cli.status).not.toBe(0);
      expect(cli.stdout).toBe("");
      expect(cli.stderr).toMatch(/not insured|negative/i);
    });
  });
});
