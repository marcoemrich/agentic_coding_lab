import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    cwd: process.cwd(), input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for only the processing fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a sword from its 100 G base premium at 115 G after assessment and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes an amulet from its 60 G base premium at 71 G after assessment and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
    ] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a staff from its 80 G base premium at 93 G after assessment and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "staff" }] },
    ] })).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a potion from its 40 G base premium at 49 G after assessment and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "potion" }] },
    ] })).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes at a 50 G component base premium, producing 60 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
    ] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the special 60 G block premium, producing 71 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
    ] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at 100 G base premium, producing 115 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) },
    ] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without blocks at 175 G base premium, producing 198 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
    ] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("treats component types as unlike: 2 runes plus 1 moonstone cost 75 G base, 88 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
    ] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices separate alike blocks: 3 runes plus 3 moonstones cost 120 G base, 137 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ] }]})).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a curse surcharge to its item: cursed sword plus plain amulet is 231 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", cursed: true }, { type: "amulet", cursed: false },
    ] }]})).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years: a plain sword quote is 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies high enchantment at exactly 5 and stacks curse: a sword quote is 195 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", enchantment: 5, cursed: true },
    ] }]})).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high enchantment at level 4 but applies curse: a sword quote is 165 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [
      { type: "sword", enchantment: 4, cursed: true },
    ] }]})).toEqual({ results: [{ premium: 165 }] });
  });
  it("discounts a contract after the first while still assessing each newly quoted item: second plain sword is 80 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] }, { op: "quote", items: [{ type: "sword" }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 80 }] });
  });
  it("integrates a long-standing customer's second cursed level-7 sword contract at 160 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a fractional 197.5 G final premium upward to 198 G, keeping intermediates fractional", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [
      { op: "quote", items: [] }, { op: "quote", items: [
        { type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }, { type: "rune" },
      ] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 198 }] });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("pays 400 G for regular sword damage of 500 G and leaves 1600 G cap", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays 100 G for rune damage of 200 G with no item-specific clauses", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("applies level-8 reimbursement before deductible even for dragon material: 1000 G damage pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50 percent clause win for a level-9 dragon sword: 1000 G damage pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses a level-5 dragon sword before deductible: 800 G damage pays 700 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves level-9 steel sword damage before deductible: 1000 G damage pays 400 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible per damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords separately at a 4000 G cap and applies a deductible to each damage entry", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("rejects through the CLI more same-type damages than the policy covers", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("sword");
    expect(result.stdout).toBe("");
  });
  it("caps sword-plus-amulet policy payout capacity at their 3200 G combined-value cap", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's cap on 1000 G unmodified value, leaving a 2000 G cap", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("bases sword-plus-3-runes cap on 1750 G value despite the block premium, leaving 3500 G cap", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts are 1400 G then 600 G, ending at 0 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G final payout downward to 350 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fracture", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects through the CLI damage to a known item type absent from the policy", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("amulet");
    expect(result.stdout).toBe("");
  });
  it("rejects through the CLI damage with an unknown item type", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects through the CLI a negative damage amount", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("-200");
    expect(result.stdout).toBe("");
  });
});
