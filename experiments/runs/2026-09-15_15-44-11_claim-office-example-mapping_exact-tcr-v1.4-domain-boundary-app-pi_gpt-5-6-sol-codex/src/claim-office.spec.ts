import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario, type Item } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Item[], yearsWithMHPCO = 0) =>
  runScenario({ customer: customer(yearsWithMHPCO), steps: [{ op: "quote", items }] });
const invokeCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G for only the processing fee", () => {
    expect(quote([])).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes one plain sword at 115 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "sword" }])).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("quotes one plain amulet at 71 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "amulet" }])).toEqual({
      results: [{ premium: 71 }],
    });
  });
  it("quotes one plain staff at 93 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "staff" }])).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes one plain potion at 49 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "potion" }])).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes two runes with a 50 G component base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly three runes with the special 60 G block base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes four runes with a 100 G base premium because blocks require exactly three", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes seven runes with a 175 G base premium", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes two runes and one moonstone with a 75 G base premium because alike means the same type", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes three runes and three moonstones as two 60 G blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(quote(items)).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, producing 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, producing 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, producing 165 G when cursed", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ results: [{ premium: 165 }] });
  });
  it("applies the loyalty discount at exactly 2 years, producing 95 G for a sword", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ results: [{ premium: 95 }] });
  });
  it("rounds a 197.5 G premium up to 198 G in MHPCO's favor", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes a newcomer cursed sword at the integration-example premium of 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({
      results: [{ premium: 165 }],
    });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    expect(runScenario({ customer: customer(3), steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const result = invokeCli({ customer: customer(), steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown/i);
    expect(result.stdout).toBe("");
  });
  it("pays 400 G for a regular sword damaged by 500 G and leaves 1600 G cap", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 100 G for a rune damaged by 200 G and leaves 400 G cap", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G for separate 500 G sword and 300 G amulet damages with two deductibles", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for a dragon sword at enchantment 8 damaged by 1000 G because the 50% clause wins", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for a dragon sword at enchantment 9 damaged by 1000 G because the 50% clause wins", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for a dragon sword at enchantment 5 damaged by 800 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for a steel sword at enchantment 9 damaged by 1000 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("treats two same-type insured swords and damage entries separately, with insurance sum 2000 G and cap 4000 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects a claim with more same-type damage entries than insured items using non-zero status and stderr", () => {
    const result = invokeCli({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured|covered/i);
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an item absent from the policy using non-zero status and stderr", () => {
    const result = invokeCli({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/covered/i);
  });
  it("rejects an unknown damaged item type using non-zero status and stderr", () => {
    const result = invokeCli({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "wind", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/covered/i);
  });
  it("rejects a negative damage amount using non-zero status and stderr", () => {
    const result = invokeCli({ customer: customer(), steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative/i);
  });
  it("caps a sword's first 1500 G claim payout at 1400 G with 600 G remaining", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "loss", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("caps a sword's second 1500 G claim payout at 600 G with 0 G remaining", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "loss", damages: [{ itemType: "sword", amount: 1500 }] } };
    const scenario = { customer: customer(), steps: [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim] };
    expect(runScenario(scenario).results).toEqual([
      { premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("bases a cursed sword cap on unmodified 1000 G insurance value, yielding a 2000 G cap", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("bases sword-plus-three-runes cap on 1750 G insurance sum despite the component block discount", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("bases sword-and-amulet cap on their 1600 G insurance sum, yielding 3200 G", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("rounds a fractional 350.5 G raw payout down to 350 G only after calculation", () => {
    const scenario = { customer: customer(), steps: [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "magic", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
