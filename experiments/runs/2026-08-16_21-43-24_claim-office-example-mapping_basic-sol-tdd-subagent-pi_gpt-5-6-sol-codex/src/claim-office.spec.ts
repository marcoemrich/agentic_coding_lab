import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const item = (type: string, extra: Record<string, unknown> = {}) => ({ type, ...extra });

const claim = (items: Array<Record<string, unknown>>, damages: Array<Record<string, unknown>>) =>
  runScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "damage", damages } },
    ],
  }).results[1];

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("uses the price list: sword 100 G, amulet 60 G, staff 80 G, and potion 40 G before policy modifiers and fee", () => {
    expect(quote([item("sword"), item("amulet"), item("staff"), item("potion")])).toEqual({ premium: 313 });
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(quote([item("rune"), item("rune")])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes at the 60 G building-block base premium", () => {
    expect(quote([item("rune"), item("rune"), item("rune")])).toEqual({ premium: 71 });
  });
  it("quotes 4 runes at 100 G base premium because blocks require exactly 3", () => {
    expect(quote([item("rune"), item("rune"), item("rune"), item("rune")])).toEqual({ premium: 115 });
  });
  it("quotes 7 runes at 175 G base premium", () => {
    expect(quote(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("quotes 2 runes and 1 moonstone at 75 G base premium because alike means the exact type", () => {
    expect(quote([item("rune"), item("rune"), item("moonstone")])).toEqual({ premium: 88 });
  });
  it("quotes 3 runes and 3 moonstones at 120 G base premium as two separate blocks", () => {
    expect(quote([
      item("rune"), item("rune"), item("rune"),
      item("moonstone"), item("moonstone"), item("moonstone"),
    ])).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy: 210 G before policy modifiers and fee", () => {
    expect(quote([item("sword", { cursed: true }), item("amulet")])).toEqual({ premium: 231 });
  });
  it("applies the 20% loyalty discount at exactly 2 years with MHPCO", () => {
    expect(quote([item("sword")], 2)).toEqual({ premium: 95 });
  });
  it("applies both 30% enchantment and 50% curse surcharges to a sword at exactly enchantment 5", () => {
    expect(quote([item("sword", { cursed: true, enchantment: 5 })])).toEqual({ premium: 195 });
  });
  it("does not apply the enchantment surcharge at enchantment 4 but still applies a curse surcharge", () => {
    expect(quote([item("sword", { cursed: true, enchantment: 4 })])).toEqual({ premium: 165 });
  });
  it("rounds a 197.5 G premium up to 198 G only at the end", () => {
    expect(quote(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    expect(quote([item("sword", { material: "steel", enchantment: 3, cursed: true })])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer’s second-contract cursed enchanted sword at 160 G while first-insurance still applies per item", () => {
    const sword = item("sword", { material: "steel", enchantment: 7, cursed: true });
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [{ op: "quote", items: [sword] }, { op: "quote", items: [sword] }],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rejects an unknown quoted item by throwing an Error (chosen internal contract for CLI failure)", () => {
    expect(() => quote([item("broomstick")])).toThrow(Error);
  });
  it("quotes two swords with insurance sum 2000 G and claim cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [item("sword"), item("sword")] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 225 }, { payout: 0, remainingCap: 4000 }]);
  });
  it("pays 400 G for a dragon sword at exactly enchantment 8 damaged for 1000 G because the 50% clause wins before deductible", () => {
    expect(claim(
      [item("sword", { material: "dragon", enchantment: 8 })],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when sword damage 500 G and amulet damage 300 G each receive a deductible", () => {
    expect(claim(
      [item("sword", { enchantment: 3 }), item("amulet", { enchantment: 2 })],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    )).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for a regular steel enchantment-3 sword damaged for 500 G", () => {
    expect(claim(
      [item("sword", { material: "steel", enchantment: 3 })],
      [{ itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged for 200 G with no item-specific clauses", () => {
    expect(claim([item("rune")], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for a dragon sword at enchantment 9 damaged for 1000 G because the 50% clause wins", () => {
    expect(claim(
      [item("sword", { material: "dragon", enchantment: 9 })],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for a dragon sword at enchantment 5 damaged for 800 G", () => {
    expect(claim(
      [item("sword", { material: "dragon", enchantment: 5 })],
      [{ itemType: "sword", amount: 800 }],
    )).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for a steel sword at enchantment 9 damaged for 1000 G", () => {
    expect(claim(
      [item("sword", { material: "steel", enchantment: 9 })],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("treats two same-type damage entries as separate insured items with separate deductibles", () => {
    expect(claim(
      [item("sword", { enchantment: 9 }), item("sword", { enchantment: 3 })],
      [{ itemType: "sword", amount: 1000 }, { itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it("rejects more damage entries of a type than the policy covers by throwing an Error (chosen internal contract for CLI failure)", () => {
    expect(() => claim(
      [item("sword")],
      [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }],
    )).toThrow(Error);
  });
  it("uses a 3200 G cap for a sword-and-amulet policy", () => {
    expect(claim([item("sword"), item("amulet")], [])).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("uses a 2000 G cap for a cursed sword based on unmodified insurance value", () => {
    expect(claim([item("sword", { cursed: true })], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("uses a 3500 G cap for a sword and 3-rune block because block pricing does not reduce insurance value", () => {
    expect(claim([item("sword"), item("rune"), item("rune"), item("rune")], []))
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits two successive 1500 G sword claims to payouts 1400 G then 600 G, leaving cap 600 G then 0 G", () => {
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [item("sword")] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a raw 350.5 G payout down to 350 G only at the end", () => {
    expect(claim(
      [item("sword", { enchantment: 9 })],
      [{ itemType: "sword", amount: 901 }],
    )).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects damage to an uninsured or unknown item by throwing an Error (chosen internal contract for CLI failure)", () => {
    expect(() => claim([item("sword")], [{ itemType: "amulet", amount: 200 }])).toThrow(Error);
    expect(() => claim([item("sword")], [{ itemType: "broomstick", amount: 200 }])).toThrow(Error);
  });
  it("rejects a negative damage amount by throwing an Error (chosen internal contract for CLI failure)", () => {
    expect(() => claim([item("sword")], [{ itemType: "sword", amount: -200 }])).toThrow(Error);
  });
  it("CLI reads JSON from stdin and writes ordered results JSON to stdout", () => {
    const execution = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 5 },
        steps: [{ op: "quote", items: [item("amulet", { enchantment: 2 })] }],
      }),
      encoding: "utf8",
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 59 }] });
  });
  it("CLI exits non-zero, writes stderr, and writes no stdout results for an invalid scenario", () => {
    const execution = spawnSync("./claim-office", [], {
      input: JSON.stringify({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [item("broomstick")] }],
      }),
      encoding: "utf8",
    });
    expect(execution.status).not.toBeNull();
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
});
