import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const quote = (items: object[], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const claim = (items: object[], damages: Array<{ itemType: string; amount: number }>) =>
  processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "damage", damages } },
    ],
  }).results[1];

const runCli = (scenario: object) => spawnSync(
  process.execPath,
  ["--import", "tsx", "src/cli.ts"],
  { input: JSON.stringify(scenario), encoding: "utf8" },
);

describe("MHPCO claim-office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes one plain sword from its 100 G base premium at 115 G", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes one plain amulet from its 60 G base premium at 71 G", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes one plain staff from its 80 G base premium at 93 G", () => {
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes one plain potion from its 40 G base premium at 49 G", () => {
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes 2 runes from a 50 G component base premium at 60 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes using the 60 G block premium at 71 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("quotes 4 runes without a block from a 100 G base premium at 115 G", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes 7 runes without a block at 198 G, rounding 197.5 G up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("quotes 2 runes and 1 moonstone without a mixed-type block at 88 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("quotes 3 runes and 3 moonstones as two blocks at 137 G", () => {
    expect(quote([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, yielding 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly 2 years, yielding 95 G for a plain sword", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at exactly enchantment 5, yielding 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment at enchantment 4 but applies curse, yielding 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
  });
  it("quotes the newcomer integration example with a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract at 160 G while retaining per-item initial assessment", () => {
    const scenario = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for a dragon sword at exactly enchantment 8 damaged for 1000 G, then leaves 1600 G cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    }).results[1];
    expect(result).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("deducts 100 G per damaged item in one incident, paying 600 G for sword 500 G plus amulet 300 G", () => {
    expect(claim(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    )).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("fully reimburses ordinary sword damage before deductible, paying 400 G for 500 G damage", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("treats a rune as having no special clauses, paying 100 G for 200 G damage", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent enchantment rule win for a dragon sword at enchantment 9, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses a dragon sword at enchantment 5 before deductible, paying 700 G for 800 G damage", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]))
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses a steel sword at enchantment 9 by 50 percent before deductible, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sets the cap for two insured swords to 4000 G", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], []))
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two same-type sword damages separately, paying 800 G with two deductibles", () => {
    expect(claim(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero status and stderr when same-type damages outnumber insured items", () => {
    const execution = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stderr).not.toContain("ERR_MODULE_NOT_FOUND");
    expect(execution.stdout).toBe("");
  });
  it("sets a sword-and-amulet cap from their 1600 G insurance sum to 3200 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], []))
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap from unmodified value to 2000 G", () => {
    expect(claim([{ type: "sword", cursed: true }], []))
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets a sword-and-3-rune cap from 1750 G value to 3500 G despite the premium block", () => {
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], []))
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 G then 600 G, ending at zero", () => {
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quoted type with non-zero status, stderr, and no stdout results", () => {
    const execution = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects damage to a known item type absent from the policy with non-zero status and stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects damage to an unknown item type with non-zero status and stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects negative damage with non-zero status and stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
});
