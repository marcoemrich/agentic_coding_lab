import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

type TestItem = { type: string; material?: string; enchantment?: number; cursed?: boolean };

function quotePremium(items: TestItem[], yearsWithMHPCO = 0): number {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0].premium as number;
}

function claimResult(items: TestItem[], damages: Array<{ itemType: string; amount: number }>) {
  return runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ] }).results[1];
}

function runCli(scenario: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the four main-item price-list entries at 115 G, 71 G, 93 G, and 49 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quotePremium([{ type }])))
      .toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes from their 50 G base premium at 60 G total", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes using the 60 G block base premium at 71 G total", () => {
    expect(quotePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(71);
  });
  it("quotes 4 runes without a block from their 100 G base premium at 115 G total", () => {
    expect(quotePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes without blocks from their 175 G base premium at 198 G total", () => {
    expect(quotePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base, 88 G total", () => {
    expect(quotePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("prices 3 runes and 3 moonstones as two blocks: 120 G base, 137 G total", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quotePremium(items)).toBe(137);
  });
  it("scopes a cursed surcharge to the cursed sword: 210 G before policy modifier and fee, 231 G total", () => {
    expect(quotePremium([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies loyalty at exactly 2 years: plain sword premium 95 G", () => {
    expect(quotePremium([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and enchantment surcharge at enchantment 5: sword premium 195 G", () => {
    expect(quotePremium([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply enchantment surcharge at level 4: cursed sword premium 165 G", () => {
    expect(quotePremium([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes a newcomer's first cursed sword contract at 165 G", () => {
    expect(quotePremium([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const scenario = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G premium upward to 198 G", () => {
    expect(quotePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G", () => {
    expect(claimResult([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    expect(claimResult([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]))
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for regular steel enchantment-3 sword damage of 500 G", () => {
    expect(claimResult([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
  });
  it("pays 100 G for rune damage of 200 G", () => {
    expect(claimResult([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
  });
  it("lets enchantment 9 override dragon material: 1000 G damage pays 400 G", () => {
    expect(claimResult([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("fully reimburses dragon material below enchantment 8: 800 G damage pays 700 G", () => {
    expect(claimResult([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("halves steel enchantment-9 damage before deductible: 1000 G pays 400 G", () => {
    expect(claimResult([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("gives a two-sword policy a 4000 G cap", () => {
    expect(claimResult([{ type: "sword" }, { type: "sword" }], [])).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries separately, each with its own deductible", () => {
    const swords = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    expect(claimResult(swords, damages)).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero CLI status when sword damages outnumber insured swords", () => {
    const process = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Damage entries exceed insured quantity");
    expect(process.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 3200 G cap", () => {
    expect(claimResult([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword cap on unmodified 1000 G insurance value", () => {
    expect(claimResult([{ type: "sword", cursed: true }], [{ itemType: "sword", amount: 1500 }]))
      .toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the premium block", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(claimResult(items, [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("caps successive 1500 G sword claims at payouts 1400 G then 600 G, leaving 0 G", () => {
    const incident = { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident },
      { op: "claim", policy: 0, incident },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G payout downward to 350 G", () => {
    expect(claimResult([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]).payout).toBe(350);
  });
  it("rejects an unknown quote item via CLI with non-zero status, stderr, and no stdout results", () => {
    const process = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Unknown item type: broomstick");
    expect(process.stdout).toBe("");
  });
  it("rejects a claim for an uninsured item via CLI with non-zero status and stderr", () => {
    const process = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Item type not insured: amulet");
  });
  it("rejects a claim for an unknown item type via CLI with non-zero status and stderr", () => {
    const process = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Unknown item type: broomstick");
  });
  it("rejects negative damage via CLI with non-zero status and stderr", () => {
    const process = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(process.status).not.toBe(0);
    expect(process.stderr).toContain("Damage amount must be non-negative");
  });
  it("emits one ordered result per quote and claim using the normative JSON field names", () => {
    const process = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(process.status).toBe(0);
    expect(JSON.parse(process.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
