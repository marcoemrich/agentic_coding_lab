import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario), encoding: "utf8",
  });
}

function quote(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("prices a plain sword at 115 G and gives its policy a 2000 G cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 115 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("prices a plain amulet at 71 G and gives its policy a 1200 G cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    });
    expect(result.results).toEqual([{ premium: 71 }, { payout: 0, remainingCap: 1200 }]);
  });
  it("prices a plain staff at 93 G and gives its policy a 1600 G cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "staff" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 93 }, { payout: 0, remainingCap: 1600 }]);
  });
  it("prices a plain potion at 49 G and gives its policy an 800 G cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "potion" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 49 }, { payout: 0, remainingCap: 800 }]);
  });
  it("prices two runes at a 50 G base premium (60 G final)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("prices exactly three runes as one 60 G block (71 G final)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("prices four runes without a block at a 100 G base (115 G final)", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("prices seven runes at a 175 G base and rounds 197.5 G up to 198 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("does not combine two runes and one moonstone into a block: 75 G base (88 G final)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("prices three runes and three moonstones as two separate blocks: 120 G base (137 G final)", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(quote(items)).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy: 231 G final", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({ premium: 231 });
  });
  it("applies the 20% loyalty discount at exactly two years: plain sword costs 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: sword costs 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4: cursed sword costs 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
  });
  it("at enchantment 8, a dragon sword damage of 1000 G pays 400 G after the 50% rule and deductible", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the 100 G deductible once per damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("fully reimburses ordinary steel sword damage less deductible: 500 G damage pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses rune damage less deductible: 200 G damage pays 100 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% rule win for a dragon sword at enchantment 9: 1000 G damage pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses a dragon sword at enchantment 5: 800 G damage pays 700 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves steel sword damage at enchantment 9: 1000 G damage pays 400 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("covers two swords with a 4000 G cap and treats two sword damages separately", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole CLI claim with non-zero status when sword damages outnumber insured swords", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("bases a sword-and-amulet cap on their 1600 G insurance sum: cap 3200 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword cap at 2000 G despite its 165 G premium", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("values a sword and three-rune block at 1750 G for a 3500 G cap", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across two 1500 G claims: payouts 1400 G then 600 G, remaining 0 G", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "flood", damages: [damage] } },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("CLI rejects an unknown quoted item with non-zero status, stderr, and no stdout results", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects damage to an item absent from the policy with non-zero status and stderr", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects a negative damage amount with non-zero status and stderr", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("executes src/cli.ts directly and serializes ordered quote/claim results in the normative JSON shape", () => {
    const cli = spawnSync("./src/cli.ts", [], { input: JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    }), encoding: "utf8" });
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
