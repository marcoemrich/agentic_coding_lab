import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { calculateBasePremium, processScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses price-list base premiums of sword 100 G, amulet 60 G, staff 80 G, and potion 40 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => calculateBasePremium([{ type }])))
      .toEqual([100, 60, 80, 40]);
  });
  it("prices 2 runes at 50 G base premium", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes as a 60 G base-premium block", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("prices 4 runes without a block at 100 G base premium", () => {
    expect(calculateBasePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes without a block at 175 G base premium", () => {
    expect(calculateBasePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes plus 1 moonstone without a mixed block at 75 G", () => {
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes plus 3 moonstones as two blocks at 120 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(calculateBasePremium(items)).toBe(120);
  });
  it("scopes curse to the sword in a first sword-and-amulet quote, totaling 231 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword", cursed: true }, { type: "amulet" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years: a plain first sword quote is 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("stacks curse and high enchantment at exactly level 5 for a 195 G first quote", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not surcharge enchantment 4: a cursed newcomer sword remains 165 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer’s first cursed sword contract at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a 3-year customer’s second contract for a new cursed enchantment-7 sword at 160 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [sword] }];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a final premium of 197.5 G up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });

  it("pays 400 G for 500 G damage to a regular steel enchantment-3 sword", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to an insured rune", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at exactly enchantment 8", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 8 };
    const steps = [{ op: "quote" as const, items: [sword] },
      { op: "claim" as const, policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50% clause win for a dragon enchantment-9 sword: 400 G from 1000 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [sword] }, { op: "claim" as const, policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses a dragon enchantment-5 sword before deductible: 700 G from 800 G", () => {
    const sword = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [{ op: "quote" as const, items: [sword] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel enchantment-9 sword", () => {
    const sword = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [sword] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible to each damaged item: 600 G from sword 500 plus amulet 300", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords separately with a 4000 G policy cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two insured sword damages as separate events with separate deductibles", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("CLI rejects more sword damages than insured swords, with stderr and no stdout", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("sets sword-and-amulet cap from 1600 G insurance sum to 3200 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap from unmodified 1000 G value to 2000 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword-plus-3-runes cap from undiscounted 1750 G sum to 3500 G", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword cap across claims: 1400 G then 600 G, leaving 0 G", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a raw payout of 350.5 G down to 350 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  it("CLI rejects unknown quote item type with stderr and no stdout results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage to a known type absent from policy and writes stderr only", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage with an unknown item type and writes stderr only", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects a negative damage amount and writes stderr only", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("processes quote and later claim sequentially with schema-shaped results in order", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps }))
      .toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
