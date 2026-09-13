import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
type ScenarioSteps = Parameters<typeof processScenario>[0]["steps"];

describe("MHPCO claim office", () => {
  it("empty quote returns 5 G processing fee", () => {
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("main-item price list yields sword 115, amulet 71, staff 93, potion 49 G on first insurance", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario({ customer: customer(), steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("2 runes have 50 G base premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 60 });
  });
  it("3 runes have 60 G block base premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 71 });
  });
  it("4 runes have 100 G base premium because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 115 });
  });
  it("7 runes have 175 G base premium", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("2 runes and 1 moonstone have 75 G base premium because alike means exact type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 88 });
  });
  it("3 runes and 3 moonstones form two blocks with 120 G base premium", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 137 });
  });
  it("cursed sword and plain amulet apply 50 G curse surcharge only to sword", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 231 });
  });
  it("exactly 2 customer years applies the 20% loyalty discount", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }];
    expect(processScenario({ customer: customer(2), steps }).results[0]).toEqual({ premium: 95 });
  });
  it("enchantment 5 cursed sword applies both 30% and 50% item surcharges", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 195 });
  });
  it("enchantment 4 sword has no enchantment surcharge but can have curse surcharge", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 165 });
  });
  it("newcomer first quote with cursed sword costs 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer's second quote with cursed enchantment-7 sword costs 160 G", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(processScenario({ customer: customer(3), steps }).results[1]).toEqual({ premium: 160 });
  });
  it("premium result 197.5 rounds up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: customer(), steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("regular steel enchantment-3 sword damage 500 pays 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 pays 100 G without material or enchantment clauses", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at exact enchantment 8 damage 1000 pays 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 9 damage 1000 pays 400 G because 50% wins", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5 damage 800 pays 700 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9 damage 1000 pays 400 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword damage 500 and amulet damage 300 pay 600 G with two deductibles", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords produce insurance sum 2000 G and cap 4000 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two insured swords accept two separate damage entries with separate deductibles", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("more same-type damages than insured items throws Error and rejects the whole claim", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(() => processScenario({ customer: customer(), steps })).toThrow(Error);
  });
  it("sword and amulet insurance sum 1600 G creates cap 3200 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword premium modifiers do not increase its 2000 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword and 3-rune block insurance sum is 1750 G despite premium discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive sword claims of 1500 pay 1400 then 600 and leave cap 0", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [damage] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("payout result 350.5 rounds down to 350 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(processScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI unknown quote type exits non-zero, writes stderr, and writes no stdout results", () => {
    const input = { customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("price-list insurance values create caps 2000, 1200, 1600, 800, and 500 G", () => {
    const caps = ["sword", "amulet", "staff", "potion", "moonstone"].map((type) => {
      const steps = [{ op: "quote", items: [{ type }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
      return processScenario({ customer: customer(), steps }).results[1]?.remainingCap;
    });
    expect(caps).toEqual([2000, 1200, 1600, 800, 500]);
  });
  it("CLI validates damages and emits ordered JSON results for valid schema input", () => {
    const invoke = (steps: ScenarioSteps) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: customer(5), steps }), encoding: "utf8",
    });
    const uninsured = invoke([{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }]);
    expect(uninsured.status).not.toBe(0);
    expect(uninsured.stderr.length).toBeGreaterThan(0);
    const unknown = invoke([{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }]);
    expect(unknown.status).not.toBe(0);
    expect(unknown.stderr.length).toBeGreaterThan(0);
    const negative = invoke([{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }]);
    expect(negative.status).not.toBe(0);
    expect(negative.stderr).toContain("-200");
    const valid = invoke([{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }]);
    expect(valid.status).toBe(0);
    expect(JSON.parse(valid.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
