import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("empty quote costs only the 5 G processing fee", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("main-item price list quotes sword/amulet/staff/potion at base plus 10% first-insurance surcharge and 5 G fee", () => {
    const quote = (type: string) => executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] });
    expect(quote("sword")).toEqual({ results: [{ premium: 115 }] });
    expect(quote("amulet")).toEqual({ results: [{ premium: 71 }] });
    expect(quote("staff")).toEqual({ results: [{ premium: 93 }] });
    expect(quote("potion")).toEqual({ results: [{ premium: 49 }] });
  });
  it("2 runes have 50 G base premium and quote to 60 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("exactly 3 runes use 60 G block base premium and quote to 71 G", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes do not use a block and quote to 115 G", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes do not use a block and quote to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes plus 1 moonstone have 75 G base with no mixed-type block and quote to 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes plus 3 moonstones use two 60 G blocks and quote to 137 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("cursed sword plus plain amulet applies 50 G surcharge only to sword and quotes to 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("exactly 2 customer years activates loyalty and a sword quotes to 95 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword at enchantment 5 and cursed applies both surcharges and quotes to 195 G", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("cursed sword at enchantment 4 has no enchantment surcharge and quotes to 165 G", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("newcomer cursed sword integration premium is 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second cursed enchanted sword quote is 160 G", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("dragon sword at enchantment 8 damaged for 1000 G pays 400 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "duel", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("500 G sword plus 300 G amulet damage pays 600 G with a deductible per item", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 3 }, { type: "amulet", enchantment: 2 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toMatchObject({ payout: 600 });
  });
  it("regular steel sword damaged for 500 G pays 400 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damaged for 200 G pays 100 G without special clauses", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon sword at enchantment 9 damaged for 1000 G pays 400 G because 50% wins", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("dragon sword at enchantment 5 damaged for 800 G pays 700 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 700 });
  });
  it("steel sword at enchantment 9 damaged for 1000 G pays 400 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "rust", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("two insured swords have a 4000 G cap", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("two damages to two insured swords each receive their own deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("CLI rejects more damage entries of a type than insured with non-zero status and stderr", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/more damage entries than insured/i);
  });
  it("sword plus amulet policy has 3200 G cap", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("cursed sword policy cap remains 2000 G despite premium modifiers", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    const result = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sword plus 3-rune block has insurance sum 1750 G and cap 3500 G", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("successive 1500 G sword claims pay 1400 G then 600 G and exhaust cap", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim" as const, policy: 0, incident: { cause: "second", damages: [damage] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("premium calculation of 197.5 G rounds up to 198 G", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }, { type: "rune" }] },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 198 });
  });
  it("payout calculation of 350.5 G rounds down to 350 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "odd damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects an unknown quote type with non-zero status, stderr, and no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/unknown item type.*broomstick/i);
  });
  it("CLI rejects damage to an uninsured or unknown item with non-zero status and stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const steps = [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "loss", damages: [{ itemType, amount: 200 }] } },
      ];
      const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toMatch(/insured/i);
    }
  });
  it("CLI rejects negative damage with non-zero status and stderr", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/negative damage/i);
  });
  it("claim-office executable reads stdin and writes JSON stdout", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] };
    const result = spawnSync("./claim-office", { input: JSON.stringify(input), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 5 }] });
  });

  it("schema example returns ordered quote and claim result shapes", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 5 }, steps }))
      .toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
