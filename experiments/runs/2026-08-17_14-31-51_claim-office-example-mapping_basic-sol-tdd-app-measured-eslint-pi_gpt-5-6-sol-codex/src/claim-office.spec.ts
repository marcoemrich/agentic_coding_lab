import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("./claim-office", [], { input: JSON.stringify(input), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword for a newcomer at 115 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet for a newcomer at 71 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff for a newcomer at 93 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] })).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion for a newcomer at 49 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] })).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes 2 runes at a 50 G base premium, totaling 60 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the 60 G block premium, totaling 71 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at a 100 G base premium, totaling 115 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at a 175 G base premium, totaling 198 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base, 88 G total", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as two blocks: 120 G base, 137 G total", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword: 210 G before policy modifiers, 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years: 95 G total for a plain sword", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: 195 G total", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment below level 5: cursed enchantment-4 sword costs 165 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer with a cursed enchantment-3 sword at 165 G", () => {
    const item = { type: "sword", material: "steel", cursed: true, enchantment: 3 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G", () => {
    const item = { type: "sword", material: "steel", cursed: true, enchantment: 7 };
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [item] }];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible to each of two damaged items: payout 600 G, remaining cap 2600 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for regular steel enchantment-3 sword damage of 500 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "rune" }] }, { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent clause win for dragon enchantment-9 damage: payout 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("fully reimburses dragon enchantment-5 damage before deductible: payout 700 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 700 });
  });
  it("halves steel enchantment-9 damage before deductible: payout 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("gives two insured swords a 4000 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "none", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim by throwing when sword damages outnumber insured swords", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow();
  });
  it("gives a sword-and-amulet policy a 3200 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim" as const, policy: 0, incident: { cause: "none", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "none", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the block premium", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "none", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts of 1400 G then 600 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [damage] } }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [damage] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items }];
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps }).results[1]).toEqual({ premium: 198 });
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 350 });
  });
  it("CLI rejects an unknown quoted item with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown item/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage to an uninsured item with non-zero status and stderr", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/not covered/i);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects an unknown damaged item with non-zero status and stderr", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects a negative damage amount with non-zero status and stderr", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative/i);
    expect(result.stdout).toBe("");
  });
  it("CLI emits ordered quote and claim result objects using the normative field names", () => {
    const steps = [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
  it("values staff, potion, and moonstone insurance at 800, 400, and 250 G for a 2900 G cap", () => {
    const items = [{ type: "staff" }, { type: "potion" }, { type: "moonstone" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "none", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2900 });
  });
});
