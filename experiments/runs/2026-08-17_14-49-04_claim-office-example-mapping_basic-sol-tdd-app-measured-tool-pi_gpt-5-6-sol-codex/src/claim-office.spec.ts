import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Scenario } from "./claim-office.js";

function runCli(scenario: Scenario) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(output.results).toEqual([{ premium: 5 }]);
  });
  it("uses the main-item base price list: sword 115 G, amulet 71 G, staff 93 G, potion 49 G after first-insurance surcharge and fee", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes 2 runes from a 50 G base at 60 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] });
    expect(output.results).toEqual([{ premium: 60 }]);
  });
  it("quotes exactly 3 runes from the 60 G block base at 71 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] });
    expect(output.results).toEqual([{ premium: 71 }]);
  });
  it("quotes 4 runes without a block from a 100 G base at 115 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] }).results).toEqual([{ premium: 115 }]);
  });
  it("quotes 7 runes without a block from a 175 G base at 198 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] }).results).toEqual([{ premium: 198 }]);
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base and 88 G quote", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results).toEqual([{ premium: 88 }]);
  });
  it("prices 3 runes and 3 moonstones as two blocks: 120 G base and 137 G quote", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results).toEqual([{ premium: 137 }]);
  });
  it("applies a curse only to the cursed sword in a sword-and-amulet policy: 210 G before policy modifier and 231 G quote", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results).toEqual([{ premium: 231 }]);
  });
  it("applies loyalty at exactly 2 years: a plain sword quote is 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results).toEqual([{ premium: 95 }]);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: 195 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }).results).toEqual([{ premium: 195 }]);
  });
  it("does not apply high-enchantment at level 4 but applies curse: 165 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }).results).toEqual([{ premium: 165 }]);
  });
  it("rounds a 197.5 G premium upward to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results).toEqual([{ premium: 198 }]);
  });
  it("quotes a newcomer cursed steel sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }).results).toEqual([{ premium: 165 }]);
  });
  it("quotes a long-standing customer's second cursed level-7 sword contract at 160 G while retaining first-insurance surcharge", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet" }] },
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for regular sword damage of 500 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when sword damage is 500 G and amulet damage is 300 G, deducting per item", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for an enchantment-8 dragon sword damaged for 1000 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for an enchantment-9 dragon sword damaged for 1000 G because the 50 percent clause wins", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for an enchantment-5 dragon sword damaged for 800 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for an enchantment-9 steel sword damaged for 1000 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives two insured swords a 4000 G cap", () => {
    const damages = [{ itemType: "sword", amount: 3000 }, { itemType: "sword", amount: 3000 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("treats two sword damages as separate events with separate deductibles", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when sword damages outnumber insured swords", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow();
  });
  it("caps a sword-and-amulet policy at 3200 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 3000 }, { itemType: "amulet", amount: 3000 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("bases a cursed sword cap on unmodified value: 2000 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 3000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the premium block", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 5000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("pays 1400 G then 600 G for successive 1500 G sword claims, exhausting the cap", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G raw payout downward to 350 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects an unknown quote item with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("CLI rejects damage to an uninsured item with non-zero status and stderr", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects an unknown damage item type with non-zero status and stderr", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI rejects negative damage with non-zero status and stderr", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("CLI emits ordered normative quote and claim result shapes and resolves policy by zero-based quote-step index", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
  it("uses staff, potion, and moonstone insurance values for caps: 1600 G, 800 G, and 500 G", () => {
    const caps = ["staff", "potion", "moonstone"].map((type) => {
      const steps = [{ op: "quote" as const, items: [{ type }] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: type, amount: 5000 }] } }];
      return processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1];
    });
    expect(caps).toEqual([{ payout: 1600, remainingCap: 0 }, { payout: 800, remainingCap: 0 }, { payout: 500, remainingCap: 0 }]);
  });
  it("exposes a named claim-office executable", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    const result = spawnSync("./claim-office", { input, encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toBe('{"results":[{"premium":5}]}');
    expect(result.stderr).toBe("");
  });
});
