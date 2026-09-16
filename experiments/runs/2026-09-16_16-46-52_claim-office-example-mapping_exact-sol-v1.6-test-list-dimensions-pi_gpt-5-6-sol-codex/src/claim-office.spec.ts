import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario, type Item } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

function singleItemClaim(item: Item, amount: number) {
  const steps = [
    { op: "quote", items: [item] },
    { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: item.type, amount }] } },
  ];
  return processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1];
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });

  it("quotes a plain sword from its 100 G base at 115 G after first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a plain amulet from its independent 60 G base at 71 G after first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a plain staff from its independent 80 G base at 93 G after first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] })).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion from its independent 40 G base at 49 G after first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] })).toEqual({ results: [{ premium: 49 }] });
  });

  it("quotes 2 runes at 60 G total (50 G base, 10% first-insurance surcharge, 5 G fee)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes as one block at 71 G total (60 G base)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at 115 G total (100 G base)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at 198 G total (175 G base rounded up after surcharge and fee)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block: 88 G total from 75 G base", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes and 3 moonstones as two separate blocks: 137 G total from 120 G base", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });

  it("scopes a curse surcharge to the cursed sword in a sword-and-amulet policy: 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years: a plain sword costs 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at exactly enchantment 5: 195 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment at enchantment 4; a cursed newcomer sword costs 165 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("does not apply curse or high-enchantment to a plain enchantment-4 sword: 115 G", () => {
    const item = { type: "sword", cursed: false, enchantment: 4 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies the 15% follow-up discount after the first quote while still charging 10% first insurance per item", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "quote", items: [{ type: "sword" }] },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  it("pays 400 G for dragon material at exactly enchantment 8 with 1000 G damage, then leaves 1600 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a 100 G deductible to each of sword and amulet damages: 600 G payout and 2600 G remaining cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("normally reimburses 500 G sword damage as 400 G and leaves 1600 G cap", () => {
    expect(singleItemClaim({ type: "sword", material: "steel", enchantment: 3 }, 500)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("normally reimburses 200 G rune damage as 100 G and leaves 400 G cap", () => {
    expect(singleItemClaim({ type: "rune" }, 200)).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% rule win for a dragon sword at enchantment 9: 400 G payout", () => {
    expect(singleItemClaim({ type: "sword", material: "dragon", enchantment: 9 }, 1000)?.payout).toBe(400);
  });
  it("fully reimburses a dragon sword at enchantment 5: 700 G payout", () => {
    expect(singleItemClaim({ type: "sword", material: "dragon", enchantment: 5 }, 800)?.payout).toBe(700);
  });
  it("half reimburses a steel sword at enchantment 9: 400 G payout", () => {
    expect(singleItemClaim({ type: "sword", material: "steel", enchantment: 9 }, 1000)?.payout).toBe(400);
  });

  it("gives two insured swords a 4000 G cap", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [{ itemType: "sword", amount: 0 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(4000);
  });
  it("treats two sword damage entries as separate insured items with separate deductibles", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim at the CLI when sword damages outnumber insured swords", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("bases a sword-and-amulet cap on their 1600 G insurance sum: 3200 G", () => {
    const steps = [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [{ itemType: "sword", amount: 0 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(3200);
  });
  it("bases a cursed sword cap on unmodified 1000 G value: 2000 G", () => {
    expect(singleItemClaim({ type: "sword", cursed: true }, 0)?.remainingCap).toBe(2000);
  });
  it("bases a sword-and-3-rune cap on 1750 G value despite the premium block: 3500 G", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [{ itemType: "rune", amount: 0 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]?.remainingCap).toBe(3500);
  });
  it("exhausts a sword policy cap across two 1500 G claims: payouts 1400 then 600, remaining 600 then 0", () => {
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident }, { op: "claim", policy: 0, incident }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });

  it("rounds a 197.5 G premium up to 198 G only at the end", () => {
    const items = [{ type: "sword", cursed: true }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote", items: [] }, { op: "quote", items }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ premium: 198 });
  });
  it("rounds a 350.5 G raw payout down to 350 G only at the end", () => {
    expect(singleItemClaim({ type: "sword", enchantment: 8 }, 901)?.payout).toBe(350);
  });

  it("rejects an unknown quote item at the CLI with non-zero status, stderr, and no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects a known but uninsured claim item at the CLI with non-zero status and stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown claim item at the CLI with non-zero status and stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount at the CLI with non-zero status and stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const result = runCli(input);
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });

  it("quotes the long-standing customer's second cursed enchantment-7 sword contract at 160 G", () => {
    const steps = [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("processes the normative quote-then-claim schema in order with exact result field names", () => {
    const steps = [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps })).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
