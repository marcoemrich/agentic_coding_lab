import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes newcomer sword, amulet, staff, and potion at 115, 71, 93, and 49 G", () => {
    const quote = (type: string) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0]?.premium;
    expect([quote("sword"), quote("amulet"), quote("staff"), quote("potion")]).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at 60 G after first-assessment surcharge and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] }).results[0]?.premium).toBe(60);
  });
  it("quotes exactly 3 runes as a 60 G block, totaling 71 G after modifiers", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(71);
  });
  it("quotes 4 runes without a block at 115 G after modifiers", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(115);
  });
  it("quotes 7 runes without blocks at 198 G after modifiers and favorable rounding", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(198);
  });
  it("does not combine 2 runes and 1 moonstone into a block, totaling 88 G after modifiers", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(88);
  });
  it("quotes separate blocks of 3 runes and 3 moonstones at 137 G after modifiers", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy, totaling 231 G with policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(231);
  });
  it("applies the loyalty threshold at exactly 2 years, quoting a plain sword at 95 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results[0]?.premium).toBe(95);
  });
  it("applies both curse and enchantment surcharges at enchantment 5, quoting a sword at 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(195);
  });
  it("does not apply enchantment surcharge at level 4, quoting a cursed sword at 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(165);
  });
  it("rounds a fractional 197.5 G premium upward to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(198);
  });
  it("quotes a newcomer first cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]?.premium).toBe(165);
  });
  it("quotes a long-standing customer's second contract cursed enchanted sword at 160 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "potion" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]?.premium).toBe(160);
  });
  it("pays 400 G for 500 G damage to a regular steel sword and leaves 1600 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage and leaves 400 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 8", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(400);
  });
  it("deducts 100 G separately from sword and amulet damage, paying 600 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(600);
  });
  it("lets the 50 percent rule win for a dragon sword at enchantment 9, paying 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(400);
  });
  it("fully reimburses a dragon sword at enchantment 5 before deductible, paying 700 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(700);
  });
  it("half reimburses a steel sword at enchantment 9 before deductible, paying 400 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(400);
  });
  it("covers two swords with a 4000 G cap and treats duplicate sword damages separately", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim by throwing when sword damages outnumber insured swords", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("uses unmodified sword-and-amulet insurance value for a 3200 G cap", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(3200);
  });
  it("uses unmodified cursed sword insurance value for a 2000 G cap", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(2000);
  });
  it("uses each component's value despite a block premium, giving sword plus 3 runes a 3500 G cap", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(3500);
  });
  it("exhausts a sword cap over successive claims with payouts 1400 G then 600 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional 350.5 G payout downward to 350 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "blast", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.payout).toBe(350);
  });
  it("rejects an unknown quote item via non-zero CLI status, stderr, and no stdout results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).not.toBe("");
    expect(execution.stdout).toBe("");
  });
  it("rejects damage absent from the policy via non-zero CLI status, stderr, and no stdout", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect([execution.status !== 0, execution.stderr !== "", execution.stdout === ""]).toEqual([true, true, true]);
  });
  it("rejects an unknown damage item type via non-zero CLI status, stderr, and no stdout", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect([execution.status !== 0, execution.stderr !== "", execution.stdout === ""]).toEqual([true, true, true]);
  });
  it("rejects a negative damage amount via non-zero CLI status, stderr, and no stdout", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect([execution.status !== 0, execution.stderr !== "", execution.stdout === ""]).toEqual([true, true, true]);
  });
});

