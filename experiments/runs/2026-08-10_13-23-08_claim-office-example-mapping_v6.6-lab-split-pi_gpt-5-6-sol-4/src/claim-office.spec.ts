import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const quote = (items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at the 5 G processing fee", () => {
    expect(quote([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion premiums", () => {
    expect(["sword", "amulet", "staff", "potion"].map(type => quote([{ type }]))).toEqual([
      { results: [{ premium: 115 }] }, { results: [{ premium: 71 }] },
      { results: [{ premium: 93 }] }, { results: [{ premium: 49 }] },
    ]);
  });
  it("prices ordinary components at 25 G each, including 2 and 7 runes", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 60 }] });
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 198 }] });
  });
  it("prices exactly 3 alike runes as a 60 G block but 4 runes ordinarily", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 71 }] });
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 115 }] });
  });
  it("does not combine 2 runes and 1 moonstone into an alike block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as two 60 G blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items)).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse surcharge only to the affected item in a multi-item policy", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies high-enchantment surcharge at level 5 but not level 4 and stacks curse", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ results: [{ premium: 195 }] });
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ results: [{ premium: 165 }] });
    expect(quote([{ type: "sword", enchantment: 4 }])).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ results: [{ premium: 95 }] });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const result = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] }, { op: "quote", items: [item] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("uses unmodified item values for policy insurance sums, including duplicate swords and component blocks", () => {
    const run = (items: Array<{ type: string }>) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(run([{ type: "sword" }, { type: "sword" }]).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
    expect(run([{ type: "sword" }, { type: "amulet" }]).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
    expect(run([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }]).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("reimburses standard sword and rune damage in full before the 100 G per-item deductible", () => {
    const claim = (item: { type: string; material?: string; enchantment?: number }, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [item] },
        { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: item.type, amount }] } },
      ],
    }).results[1];
    expect(claim({ type: "sword", material: "steel", enchantment: 3 }, 500)).toMatchObject({ payout: 400 });
    expect(claim({ type: "rune" }, 200)).toMatchObject({ payout: 100 });
  });
  it("applies one deductible to each damaged item in a multi-item incident", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 600 });
  });
  it("reimburses enchantment 8+ damage at 50 percent before deductible", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 400 });
  });
  it("fully reimburses dragon material below enchantment 8 before deductible", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 700 });
  });
  it("lets the 50 percent enchantment rule win over dragon material at enchantment 8+", () => {
    for (const enchantment of [8, 9]) {
      const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
      ] });
      expect(result.results[1]).toMatchObject({ payout: 400 });
    }
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]).toMatchObject({ payout: 350 });
  });
  it("caps cumulative payouts at twice insurance sum across successive claims", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("treats duplicate damage entries as separate insured items with separate deductibles", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] })).toThrow("not covered");
  });
  it("rejects unknown quote item types without producing results", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow("Unknown item type");
  });
  it("rejects damage for an item type absent from the policy or unknown", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] })).toThrow("not covered");
    }
  });
  it("rejects a negative damage amount", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] })).toThrow("negative");
  });
  it("the CLI reads the normative JSON shape and writes ordered quote and claim results", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(run.stderr).toBe("");
  });
});
