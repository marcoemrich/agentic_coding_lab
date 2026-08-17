import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses main-item price-list premiums and insurance values: sword 100/1000, amulet 60/600, staff 80/800, potion 40/400", () => {
    const cases = [["sword", 115, 2000], ["amulet", 71, 1200], ["staff", 93, 1600], ["potion", 49, 800]] as const;
    for (const [type, premium, remainingCap] of cases) {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ] })).toEqual({ results: [{ premium }, { payout: 0, remainingCap }] });
    }
  });
  it("quotes 2 runes at 50 G base plus modifiers and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes using the 60 G component block", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at 100 G base", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at 175 G base", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones as two blocks: 120 G base", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword: 210 G before policy modifiers and fee, 231 G final", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("claims 400 G for 500 G damage to a regular sword", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 500 }] } },
    ] })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("claims 100 G for 200 G damage to a rune", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "cracked", damages: [{ itemType: "rune", amount: 200 }] } },
    ] })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("claims 400 G for a dragon sword at enchantment 8 damaged by 1000 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("applies a deductible per damaged item: 500 G sword plus 300 G amulet pays 600 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] })).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });
  it("high enchantment wins over dragon material: enchantment 9 and 1000 G damage pays 400 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }] })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("fully reimburses dragon material below threshold: enchantment 5 and 800 G damage pays 700 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } }] })).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("half reimburses a steel enchantment-9 sword: 1000 G damage pays 400 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }] })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("supports duplicate insured types and separate damages: two swords have a 4000 G cap", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }] })).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("caps sword-plus-amulet policy payout capacity at 3200 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] })).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }] });
  });
  it("bases a cursed sword cap on unmodified 1000 G insurance value: cap 2000 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("bases sword-plus-3-runes cap on 1750 G insurance sum, not block premium", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] })).toEqual({ results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }] });
  });
  it("exhausts a sword cap across claims: payouts 1400 then 600, remaining cap 0", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } }] })).toEqual({ results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }] });
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } }] })).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
  it("rejects a quote with unknown item type through the CLI with nonzero status, stderr, and no stdout result", () => {
    const process = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] }), encoding: "utf8" });
    expect(process.status).not.toBe(0);
    expect(process.stdout).toBe("");
    expect(process.stderr).toContain("Unknown item type: broomstick");
  });
  it("rejects damage to an uninsured or unknown item through the CLI with nonzero status and stderr", () => {
    const process = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] }), encoding: "utf8" });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Damage item is not insured: amulet");
  });
  it("rejects more damage entries of a type than insured through the CLI with nonzero status", () => {
    const process = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }] }), encoding: "utf8" });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("More sword damages than insured items");
  });
  it("rejects negative damage through the CLI with nonzero status and stderr", () => {
    const process = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } }] }), encoding: "utf8" });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Damage amount cannot be negative");
  });
  it("reads sequential quote/claim JSON through the claim-office executable and writes ordered result JSON", () => {
    const process = spawnSync("./claim-office", [], { input: JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] }), encoding: "utf8" });
    expect(process.status).toBe(0);
    expect(process.stderr).toBe("");
    expect(JSON.parse(process.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
