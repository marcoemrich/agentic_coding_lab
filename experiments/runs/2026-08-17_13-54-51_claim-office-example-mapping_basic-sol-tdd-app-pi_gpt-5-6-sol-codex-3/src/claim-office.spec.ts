import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function quote(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0): number {
  const scenario = { customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] };
  const result = runScenario(scenario).results[0] as { premium: number };
  return result.premium;
}

function claim(items: Array<Record<string, unknown>>, damages: Array<{ itemType: string; amount: number }>) {
  const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "incident", damages } },
  ] });
  return output.results[1] as { payout: number; remainingCap: number };
}

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one sword from its 100 G base premium at 115 G final premium", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes one amulet from its 60 G base premium at 71 G final premium", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes one staff from its 80 G base premium at 93 G final premium", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes one potion from its 40 G base premium at 49 G final premium", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes 2 runes from a 50 G base premium at 60 G final premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes using the 60 G block at 71 G final premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes without a block from a 100 G base premium at 115 G final premium", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes without blocks from a 175 G base premium at 198 G final premium, rounding 197.5 up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes and 1 moonstone without a mixed-type block at 88 G final premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones as two separate blocks at 137 G final premium", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items)).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy, producing 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies loyalty at exactly 2 years, producing 95 G for a plain sword", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at exactly enchantment 5, producing 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment at enchantment 4 but applies curse, producing 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes a newcomer cursed steel sword at the integration premium of 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a new cursed enchantment-7 sword at 160 G", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible per damaged item, paying 600 G for sword 500 G plus amulet 300 G", () => {
    const result = claim([{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]);
    expect(result.payout).toBe(600);
  });
  it("pays standard reimbursement of 400 G for regular sword damage of 500 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
  });
  it("pays standard reimbursement of 100 G for rune damage of 200 G", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
  });
  it("lets the 50% enchantment rule win for dragon enchantment-9 sword damage, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("fully reimburses dragon enchantment-5 sword damage before deductible, paying 700 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("halves steel enchantment-9 sword damage before deductible, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("insures two swords independently with a 4000 G cap", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], []).remainingCap).toBe(4000);
  });
  it("treats two sword damage entries as separate damages and deductibles, paying 800 G", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]).payout).toBe(800);
  });
  it("rejects the whole claim via non-zero CLI status when damages outnumber insured items", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("damage entries exceed insured items");
    expect(result.stdout).toBe("");
  });
  it("sets sword-and-amulet cap from the 1600 G insurance sum, leaving 3200 G initially", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], []).remainingCap).toBe(3200);
  });
  it("sets cursed-sword cap from unmodified 1000 G value, leaving 2000 G initially", () => {
    expect(claim([{ type: "sword", cursed: true }], []).remainingCap).toBe(2000);
  });
  it("sets sword-and-3-runes cap from the 1750 G insurance sum, leaving 3500 G initially", () => {
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], [])
      .remainingCap).toBe(3500);
  });
  it("exhausts a sword policy cap across claims: 1400 G then 600 G with zero remaining", () => {
    const output = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G", () => {
    expect(claim([{ type: "sword", enchantment: 9 }],
      [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });
  it("rejects an unknown quote item via non-zero CLI status, stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("unknown item type");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured known item via non-zero CLI status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects damage with an unknown item type via non-zero CLI status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "wand", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects negative damage via non-zero CLI status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("applies a three-rune premium block within a sword policy, producing 181 G", () => {
    expect(quote([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(181);
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
