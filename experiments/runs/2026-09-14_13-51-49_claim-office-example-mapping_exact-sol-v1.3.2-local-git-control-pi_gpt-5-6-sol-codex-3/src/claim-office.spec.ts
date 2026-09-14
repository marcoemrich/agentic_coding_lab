import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword from its 100 G base premium at 115 G including assessment and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet from its 60 G base premium at 71 G including assessment and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff from its 80 G base premium at 93 G including assessment and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] }))
      .toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion from its 40 G base premium at 49 G including assessment and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] }))
      .toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes from their 50 G base premium at 60 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes from the 60 G block premium at 71 G", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block from their 100 G base premium at 115 G", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block from their 175 G base premium at 198 G after rounding up", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base, 88 G final", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones as two blocks: 120 G base, 137 G final", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a curse to the cursed sword beside a plain amulet: 210 G before policy modifiers, 231 G final", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years: a plain sword costs 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharge at exactly level 5: sword costs 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment at level 4 but applies curse: sword costs 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second-contract cursed level-7 sword at 160 G", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rejects an unknown quote item by throwing Error (CLI maps this to stderr and non-zero exit)", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    expect(() => runScenario(scenario)).toThrow(Error);
  });
  it("claims 400 G for dragon sword enchantment 8 damaged by 1000 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible to each damaged item: sword 500 + amulet 300 pays 600 G", () => {
    const items = [{ type: "sword", material: "dragon" }, { type: "amulet", material: "dragon" }];
    const incident = { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] };
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claims 400 G for a regular steel level-3 sword damaged by 500 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3 }];
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 500 }] };
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims 100 G for a rune damaged by 200 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% enchantment rule win for dragon level-9 sword damage 1000: payout 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] };
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon level-5 sword damage 800 less deductible: payout 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] };
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves steel level-9 sword damage 1000 before deductible: payout 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] };
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("insures duplicate swords separately and deducts each damage: payout 1800 G, remaining cap 2200 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 1800, remainingCap: 2200 });
  });
  it("rejects more damage entries of a type than the policy covers by throwing Error", () => {
    const damages = [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }];
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("bases sword-plus-amulet cap on 1600 G insurance sum: empty claim leaves 3200 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases cursed sword cap on unmodified 1000 G value: empty claim leaves 2000 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "none", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("bases sword-plus-3-rune cap on 1750 G value despite block premium: leaves 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "none", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap across two 1500 G sword claims: payouts 1400 then 600, remaining cap 0", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects damage to an unowned known item by throwing Error", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("rejects damage with an unknown item type by throwing Error", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("rejects a negative damage amount by throwing Error", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("CLI reads sequential JSON steps and emits results in matching quote/claim order", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const execution = spawnSync("./claim-office", [], { input, encoding: "utf8" });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI writes an unknown-item error only to stderr and exits non-zero", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    const execution = spawnSync("./claim-office", [], { input, encoding: "utf8" });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
});
