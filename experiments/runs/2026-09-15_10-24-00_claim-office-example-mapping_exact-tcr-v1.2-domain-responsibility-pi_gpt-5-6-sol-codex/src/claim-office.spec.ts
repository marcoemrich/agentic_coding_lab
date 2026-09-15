import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("./claim-office", [], { input: JSON.stringify(input), encoding: "utf8" });
}

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the price-list base premiums for sword, amulet, staff, and potion as 100 G, 60 G, 80 G, and 40 G before policy modifiers", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes 2 runes with a 50 G component base premium", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes with the special 60 G block base premium", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 3 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes with a 100 G base premium because blocks require exactly 3 alike components", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes with a 175 G base premium because only an exact group of 3 is a block", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes and 1 moonstone with a 75 G base premium because alike means the exact component type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones with two separate blocks totaling 120 G base premium", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword, producing 210 G before policy modifiers for a cursed sword and plain amulet", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years, producing a 95 G plain-sword premium", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, producing a 195 G sword premium", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, producing a 165 G cursed-sword premium", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("pays 400 G for 1000 G damage to a dragon-material sword at exactly enchantment 8", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("applies one 100 G deductible to each of two damaged items, paying 600 G for sword damage 500 G and amulet damage 300 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("pays standard reimbursement of 400 G for 500 G damage to a regular steel sword at enchantment 3", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("pays standard reimbursement of 100 G for 200 G damage to a rune with no material or enchantment", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("lets the 50 percent enchantment rule win for a dragon-material enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("fully reimburses dragon material below enchantment 8, paying 700 G on 800 G damage at enchantment 5", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("halves reimbursement for a steel enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("gives a two-sword policy a 4000 G cap and treats two sword damage entries separately", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("rejects the whole claim through non-zero CLI status and stderr when sword damages outnumber insured swords", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/damage.*insured/i);
    expect(result.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G from their 1600 G insurance sum", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }] });
  });
  it("caps a cursed-sword policy at 2000 G from unmodified insurance value, not its 165 G premium", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("values a sword and 3-rune block at a 1750 G insurance sum and 3500 G cap", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] });
  });
  it("exhausts a sword policy cap across claims: payouts 1400 G then 600 G, leaving 600 G then 0 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "flood", damages: [damage] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 198 }] });
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
  it("rejects an unknown quote item through non-zero CLI status and stderr, with no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured known item through non-zero CLI status and stderr", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/damage.*insured/i);
    expect(result.stdout).toBe("");
  });
  it("rejects damage with an unknown item type through non-zero CLI status and stderr", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown.*broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount through non-zero CLI status and stderr", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/damage amount.*negative/i);
    expect(result.stdout).toBe("");
  });
  it("quotes a newcomer first contract with a cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract cursed enchantment-7 sword at 160 G, retaining per-item initial assessment", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
