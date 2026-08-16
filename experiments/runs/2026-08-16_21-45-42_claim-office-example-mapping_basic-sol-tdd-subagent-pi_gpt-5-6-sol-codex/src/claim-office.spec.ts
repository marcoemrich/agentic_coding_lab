import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, premiumBeforePolicyModifiers, roundPremium, runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("prices sword, amulet, staff, and potion bases at 100, 60, 80, and 40 G", () => {
    expect(basePremium([
      { type: "sword" }, { type: "amulet" }, { type: "staff" }, { type: "potion" },
    ])).toBe(280);
  });
  it("prices 2 runes at 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("prices exactly 3 runes at the 60 G block premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("prices 4 runes at 100 G with no block", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("prices 7 runes at 175 G with no partial block", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("prices 2 runes plus 1 moonstone at 75 G because unlike types do not form a block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("prices 3 runes plus 3 moonstones at 120 G as two separate blocks", () => {
    expect(basePremium([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(120);
  });
  it("applies a cursed surcharge only to the affected sword: sword plus amulet is 210 G before policy modifiers", () => {
    expect(premiumBeforePolicyModifiers([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });
  it("applies loyalty at exactly 2 years", () => {
    expect(runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both high-enchantment and curse surcharges at enchantment 5", () => {
    expect(premiumBeforePolicyModifiers([{ type: "sword", enchantment: 5, cursed: true }])).toBe(180);
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(premiumBeforePolicyModifiers([{ type: "sword", enchantment: 4, cursed: true }])).toBe(150);
  });
  it("pays 400 G for dragon material at exactly enchantment 8 with 1000 G damage", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] })).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("applies one 100 G deductible to each of two damaged items for a 600 G payout", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for 500 G damage to a regular steel sword at enchantment 3", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune without special clauses", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent enchantment rule win for dragon material at enchantment 9: payout 400 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toMatchObject({ payout: 400 });
  });
  it("fully reimburses dragon material at enchantment 5: payout 700 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ] }).results[1]).toMatchObject({ payout: 700 });
  });
  it("half reimburses steel at enchantment 9: payout 400 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] }).results[1]).toMatchObject({ payout: 400 });
  });
  it("counts two insured swords separately for insurance sum 2000 G and cap 4000 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate events with separate deductibles", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when sword damage entries outnumber insured swords", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] })).toThrow(Error);
  });
  it("sets sword plus amulet insurance sum to 1600 G and cap to 3200 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword cap at 2000 G, unaffected by its 165 G premium", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] })).toEqual({ results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }] });
  });
  it("sets sword plus 3 runes insurance sum to 1750 G despite the premium block discount", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap over successive 1500 G claims with payouts 1400 then 600 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "flood", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    expect(roundPremium(197.5)).toBe(198);
  });
  it("rounds a 350.5 G payout down to 350 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
    ] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("quotes an empty item list at the 5 G processing fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("rejects a quote with unknown type broomstick without producing results", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] })).toThrow(Error);
  });
  it("rejects damage to an uninsured or unknown item", () => {
    const scenario = (itemType: string) => ({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } },
    ] });
    expect(() => runScenario(scenario("amulet"))).toThrow(Error);
    expect(() => runScenario(scenario("broomstick"))).toThrow(Error);
  });
  it("rejects a negative damage amount", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] })).toThrow(Error);
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract cursed enchantment-7 sword at 160 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("returns quote and claim results in step order with premium, payout, and remainingCap fields", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
