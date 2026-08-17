import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Scenario } from "./claim-office.js";

const scenario = (steps: Scenario["steps"], yearsWithMHPCO = 0): Scenario => ({ customer: { yearsWithMHPCO }, steps });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario(scenario([{ op: "quote", items: [] }]))).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword, amulet, staff, and potion at 115, 71, 93, and 49 G including assessment and fee", () => {
    const types = ["sword", "amulet", "staff", "potion"];
    expect(types.map((type) => runScenario(scenario([{ op: "quote", items: [{ type }] }])))).toEqual([
      { results: [{ premium: 115 }] }, { results: [{ premium: 71 }] },
      { results: [{ premium: 93 }] }, { results: [{ premium: 49 }] },
    ]);
  });
  it("quotes 2 runes at 60 G including fee", () => {
    expect(runScenario(scenario([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }]))).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes as a 60 G block, totaling 71 G with first-insurance surcharge and fee", () => {
    expect(runScenario(scenario([{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }]))).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at 115 G", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at 197.5 G rounded up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes and 1 moonstone without a mixed-type block at 87.5 G rounded up to 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes separate blocks of 3 runes and 3 moonstones at 137 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, yielding 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years, yielding 95 G for a sword", () => {
    expect(runScenario(scenario([{ op: "quote", items: [{ type: "sword" }] }], 2))).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, yielding 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, yielding 165 G when cursed", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario(scenario([{ op: "quote", items }]))).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed enchantment-7 sword at 160 G", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario(scenario(steps, 3))).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout", () => {
    const input = JSON.stringify(scenario([{ op: "quote", items: [{ type: "broomstick" }] }]));
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item type/i);
    expect(result.stdout).toBe("");
  });
  it("pays 400 G for dragon sword enchantment 8 damaged by 1000 G", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible to each damaged item, paying 600 G for sword 500 G and amulet 300 G", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", enchantment: 3 }, { type: "amulet", enchantment: 2 }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for a regular sword damaged by 500 G", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged by 200 G", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% enchantment rule win for dragon enchantment 9, paying 400 G on 1000 G damage", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon enchantment 5 then deducts, paying 700 G on 800 G damage", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves steel enchantment 9 then deducts, paying 400 G on 1000 G damage", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("insures two swords separately with a 4000 G cap and separate damage deductibles", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", enchantment: 3 }, { type: "sword", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ];
    expect(() => runScenario(scenario(steps))).toThrow();
  });
  it("bases caps on unmodified item values and component counts, not premiums or block discounts", () => {
    const exhaust = (items: Array<{ type: string; cursed?: boolean }>, itemTypes: string[]) => {
      const steps: Scenario["steps"] = [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "catastrophe", damages: itemTypes.map((itemType) => ({ itemType, amount: 5000 })) } },
      ];
      return runScenario(scenario(steps)).results[1];
    };
    expect(exhaust([{ type: "sword" }, { type: "amulet" }], ["sword", "amulet"])).toEqual({ payout: 3200, remainingCap: 0 });
    expect(exhaust([{ type: "sword", cursed: true }], ["sword"])).toEqual({ payout: 2000, remainingCap: 0 });
    expect(exhaust([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], ["sword", "rune", "rune", "rune"])).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("exhausts a sword policy cap across successive claims: 1400 G then 600 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps: Scenario["steps"] = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario(scenario(steps)).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(runScenario(scenario(steps)).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects damage to an item type absent from the policy", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const steps: Scenario["steps"] = [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } },
      ];
      expect(() => runScenario(scenario(steps))).toThrow();
    }
  });
  it("rejects a negative damage amount", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ];
    expect(() => runScenario(scenario(steps))).toThrow();
  });
  it("emits one ordered result per sequential quote and claim step using the normative field names", () => {
    const steps: Scenario["steps"] = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    const input = JSON.stringify(scenario(steps, 5));
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
});
