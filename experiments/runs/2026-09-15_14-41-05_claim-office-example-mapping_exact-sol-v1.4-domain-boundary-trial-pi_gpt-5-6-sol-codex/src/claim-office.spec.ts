import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";
import { executeCli } from "./cli-adapter.js";

describe("MHPCO claim office", () => {
  it("empty quote returns premium 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("plain sword, amulet, staff, and potion premiums are 115, 71, 93, and 49 G", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("2, 3, 4, and 7 runes produce premiums 60, 71, 115, and 198 G", () => {
    const premiums = [2, 3, 4, 7].map((count) => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: count }, () => ({ type: "rune" })) }],
    }).results[0]);
    expect(premiums).toEqual([{ premium: 60 }, { premium: 71 }, { premium: 115 }, { premium: 198 }]);
  });
  it("mixed component types produce 88 G while two separate triples produce 137 G", () => {
    const quote = (types: string[]) => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: types.map((type) => ({ type })) }],
    }).results[0];
    expect(quote(["rune", "rune", "moonstone"])).toEqual({ premium: 88 });
    expect(quote(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"])).toEqual({ premium: 137 });
  });
  it("cursed sword plus plain amulet produces premium 231 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true }, { type: "amulet", cursed: false },
    ] }] });
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("exactly two years gives a plain sword premium of 95 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] });
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("enchantment 5 cursed sword produces premium 195 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true, enchantment: 5 },
    ] }] });
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("enchantment 4 cursed sword produces premium 165 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true, enchantment: 4 },
    ] }] });
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second quote for cursed enchanted sword is 160 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("regular sword damage 500 pays 400 and leaves cap 1600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 pays 100 and leaves cap 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword enchantment 8 damage 1000 pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword enchantment 9 damage 1000 pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword enchantment 5 damage 800 pays 700 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 700 });
  });
  it("steel sword enchantment 9 damage 1000 pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("sword and amulet damages 500 and 300 pay 600 G with per-item deductibles", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords have cap 4000 and two damages each receive a deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more damages of a type than insured items rejects the scenario", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] })).toThrow();
  });
  it("sword plus amulet has cap 3200 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword still has cap 2000 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword plus three runes has cap 3500 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive sword claims pay 1400 then 600 and exhaust cap", () => {
    const damage = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: damage },
      { op: "claim", policy: 0, incident: damage },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("fractional payout 350.5 rounds down to 350 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("unknown quote item makes CLI fail with stderr and no stdout", () => {
    const execution = executeCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] }));
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
  it("uninsured or unknown claim item makes CLI fail with stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const execution = executeCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } },
      ] }));
      expect(execution.status).not.toBe(0);
      expect(execution.stderr.length).toBeGreaterThan(0);
      expect(execution.stdout).toBe("");
    }
  });
  it("negative damage makes CLI fail with stderr", () => {
    const execution = executeCli(JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] }));
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
});
