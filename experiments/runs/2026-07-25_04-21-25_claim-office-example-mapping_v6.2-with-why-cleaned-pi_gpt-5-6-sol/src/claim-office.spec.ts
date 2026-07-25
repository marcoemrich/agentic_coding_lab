import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, roundPayout, roundPremium } from "./claim-office.js";

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const claim = (items: Array<Record<string, unknown>>, damages: Array<{ itemType: string; amount: number }>) =>
  processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "test", damages } },
    ],
  }).results[1];

describe("MHPCO claim office", () => {
  it("quotes an empty item list at the 5 G processing fee", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("uses the price list for sword, amulet, staff, and potion premiums: 115, 71, 93, and 49 G for first insurance", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("prices component quantities and exact alike blocks", () => {
    const components = (type: string, count: number) => Array.from({ length: count }, () => ({ type }));
    expect(quote(components("rune", 2))).toEqual({ premium: 60 });
    expect(quote(components("rune", 3))).toEqual({ premium: 71 });
    expect(quote(components("rune", 4))).toEqual({ premium: 115 });
    expect(quote(components("rune", 7))).toEqual({ premium: 198 });
    expect(quote([...components("rune", 2), ...components("moonstone", 1)])).toEqual({ premium: 88 });
    expect(quote([...components("rune", 3), ...components("moonstone", 3)])).toEqual({ premium: 137 });
  });
  it("applies item and policy modifiers at their thresholds and rounds premiums up", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
    expect(quote([{ type: "sword", cursed: true, enchantment: 3 }])).toEqual({ premium: 165 });
    const scenario = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ] });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("bases policy caps on unmodified insurance values, including every block component", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 });
    expect(claim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("reimburses each damage under the item clauses, then applies its deductible and rounds payout down", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }])).toEqual({ payout: 100, remainingCap: 400 });
    expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }])).toEqual({ payout: 700, remainingCap: 1300 });
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }])).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])).toEqual({ payout: 600, remainingCap: 2600 });
    expect(claim([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 });
    expect(roundPayout(350.5)).toBe(350);
  });
  it("exhausts a sword policy cap across successive claims", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects a quote containing unknown item type broomstick", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(/unknown item type/i);
  });
  it("rejects absent item types and more damage entries than the policy covers", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "amulet", amount: 200 }])).toThrow(/not covered/i);
    expect(() => claim([{ type: "sword" }], [
      { itemType: "sword", amount: 200 },
      { itemType: "sword", amount: 200 },
    ])).toThrow(/not covered/i);
  });
  it("rejects a negative damage amount", () => {
    expect(() => claim([{ type: "sword" }], [{ itemType: "sword", amount: -200 }])).toThrow(/negative damage amount/i);
  });
  it("exposes the JSON stdin/stdout CLI and reports invalid scenarios only on stderr", () => {
    const valid = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }),
      encoding: "utf8",
    });
    expect(valid.status).toBe(0);
    expect(JSON.parse(valid.stdout)).toEqual({ results: [{ premium: 5 }] });

    const invalid = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }),
      encoding: "utf8",
    });
    expect(invalid.status).not.toBe(0);
    expect(invalid.stdout).toBe("");
    expect(invalid.stderr).toMatch(/unknown item type/i);
  });
});
