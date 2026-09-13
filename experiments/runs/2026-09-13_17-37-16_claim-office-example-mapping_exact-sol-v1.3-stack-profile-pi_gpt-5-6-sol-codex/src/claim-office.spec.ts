import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const claim = (items: Array<Record<string, unknown>>, damages: Array<Record<string, unknown>>) =>
  processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ] }).results[1];

const runCli = (scenario: Record<string, unknown>) => spawnSync("./claim-office", {
  input: JSON.stringify(scenario), encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes main item price-list premiums: sword 115, amulet 71, staff 93, potion 49 G including first-insurance surcharge and fee", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }] ).premium))
      .toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at 60 G including first-insurance surcharge and fee (50 G base)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes at 71 G including surcharge and fee (60 G block base)", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ premium: 71 });
  });
  it("quotes 4 runes at 115 G including surcharge and fee (100 G base, no block)", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes 7 runes at 198 G including surcharge and fee (175 G base)", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("does not combine 2 runes and 1 moonstone: 88 G including surcharge and fee (75 G base)", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("prices 3 runes and 3 moonstones as two blocks: 137 G including surcharge and fee (120 G base)", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items)).toEqual({ premium: 137 });
  });
  it("applies a curse only to the cursed sword in a sword-plus-amulet policy: 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("applies loyalty at exactly 2 years: plain sword quote is 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharge at enchantment 5: cursed sword is 195 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4: cursed sword is 165 G", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract cursed enchantment-7 sword at 160 G while retaining first-insurance surcharge", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G premium upward to 198 G in MHPCO's favor", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }], 2)).toEqual({ premium: 198 });
  });
  it("reimburses an enchantment-8 dragon sword damaged for 1000 G at 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible to each of sword 500 and amulet 300 damages, paying 600 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]))
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for regular steel enchantment-3 sword damage of 500 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 3 }], [{ itemType: "sword", amount: 500 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G without special clauses", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% enchantment rule win for enchantment-9 dragon sword damage of 1000 G, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses enchantment-5 dragon sword damage of 800 G less deductible, paying 700 G", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]))
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("half reimburses enchantment-9 steel sword damage of 1000 G less deductible, paying 400 G", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("insures two swords separately with 4000 G cap and separate damage deductibles", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]))
      .toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects an entire CLI claim when damage entries outnumber insured items of that type", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout ?? "").toBe("");
    expect(result.stderr ?? "").toMatch(/covered|insured/i);
  });
  it("sets sword-plus-amulet cap from 1600 G insurance sum to 3200 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets cursed sword cap from unmodified 1000 G value to 2000 G", () => {
    expect(claim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword-plus-3-runes cap from 1750 G value to 3500 G despite block discount", () => {
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], []))
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across two 1500 G sword claims: payouts 1400 then 600, remaining 600 then 0", () => {
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident },
      { op: "claim", policy: 0, incident },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects an unknown quote item with stderr, non-zero status, and no stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/unknown|broomstick/i);
  });
  it("CLI rejects damage to a known item absent from the policy", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/not covered/i);
  });
  it("CLI rejects an unknown damaged item", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/broomstick|not covered/i);
  });
  it("CLI rejects a negative damage amount", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatch(/negative|amount/i);
  });
  it("CLI emits results in step order with binding quote and claim field names", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
});
