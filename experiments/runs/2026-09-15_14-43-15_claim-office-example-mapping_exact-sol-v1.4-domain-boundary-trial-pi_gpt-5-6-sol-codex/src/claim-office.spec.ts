import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("empty item list costs only the 5 G processing fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("main item newcomer premiums are sword 115, amulet 71, staff 93, potion 49 G", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0]?.premium,
    );
    expect(premiums).toEqual([115, 71, 93, 49]);
  });
  it("2 runes have 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("exactly 3 runes use the 60 G component block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes cost 100 G base premium because the block requires exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("7 runes cost 175 G base premium", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("2 runes plus 1 moonstone cost 75 G because unlike types do not form a block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes plus 3 moonstones cost 120 G as two separate blocks", () => {
    expect(basePremium([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toBe(120);
  });
  it("cursed sword plus plain amulet adds a 50 G item-scoped curse surcharge", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true }, { type: "amulet", cursed: false },
    ] }] };
    expect(processScenario(scenario).results[0]?.premium).toBe(231);
  });
  it("exactly 2 customer years activates the 20 percent loyalty discount", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] });
    expect(result.results[0]?.premium).toBe(95);
  });
  it("enchantment 5 and curse both add their item-specific surcharges", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true, enchantment: 5 },
    ] }] });
    expect(result.results[0]?.premium).toBe(195);
  });
  it("enchantment 4 does not activate enchantment surcharge", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true, enchantment: 4 },
    ] }] });
    expect(result.results[0]?.premium).toBe(165);
  });
  it("newcomer cursed sword premium is 165 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", material: "steel", enchantment: 3, cursed: true },
    ] }] });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second quote for cursed enchantment-7 sword is 160 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]?.premium).toBe(160);
  });
  it("fractional premium rounds upward only at the end", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }] }] });
    expect(result.results[0]?.premium).toBe(33);
  });
  it("regular sword damage 500 G pays 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(400);
  });
  it("rune damage 200 G pays 100 G without special clauses", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(100);
  });
  it("dragon sword enchantment 8 damage 1000 G pays 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(400);
  });
  it("dragon sword enchantment 9 damage 1000 G pays 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(400);
  });
  it("dragon sword enchantment 5 damage 800 G pays 700 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(700);
  });
  it("steel sword enchantment 9 damage 1000 G pays 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(400);
  });
  it("sword and amulet damages pay 600 G with one deductible per item", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1]?.payout).toBe(600);
  });
  it("two insured swords produce insurance sum 2000 G and cap 4000 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]?.remainingCap).toBe(4000);
  });
  it("two sword damage entries are separate damages with separate deductibles", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]?.payout).toBe(800);
  });
  it("more damage entries of a type than insured rejects the whole claim", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    expect(() => processScenario(scenario)).toThrow(Error);
  });
  it("sword plus amulet insurance sum produces a 3200 G cap", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]?.remainingCap).toBe(3200);
  });
  it("cursed sword cap remains 2000 G based on unmodified insurance value", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword plus a 3-rune block has insurance sum 1750 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]?.remainingCap).toBe(3500);
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G and exhaust cap", () => {
    const damage = { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, damage, damage,
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("fractional payout rounds downward only at the end", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]?.payout).toBe(350);
  });
  it("CLI invalid quote item, absent or unknown damage, and negative damage fail with stderr and no stdout results", () => {
    const invalidScenarios: Array<[Record<string, unknown>, string]> = [
      [{ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }, "Unknown item type"],
      [{ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ] }, "not covered"],
      [{ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ] }, "not covered"],
      [{ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ] }, "Damage amount"],
    ];
    for (const [scenario, message] of invalidScenarios) {
      const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
      expect(run.status).toBe(1);
      expect(run.stdout).toBe("");
      expect(run.stderr).toContain(message);
    }
  });
});
