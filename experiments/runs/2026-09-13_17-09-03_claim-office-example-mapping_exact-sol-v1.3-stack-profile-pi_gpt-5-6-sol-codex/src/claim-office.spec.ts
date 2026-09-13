import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes sword, amulet, staff, and potion base price-list premiums with fee", () => {
    const premium = (type: string): number => {
      const result = processScenario({
        customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }],
      }).results[0];
      if (!("premium" in result)) throw new Error("Expected quote result");
      return result.premium;
    };
    expect([premium("sword"), premium("amulet"), premium("staff"), premium("potion")])
      .toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{
      op: "quote", items: [{ type: "rune" }, { type: "rune" }],
    }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the 60 G block premium", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{
      op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
    }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G because only an exact group of 3 is a block", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone at 75 G base because unlike types do not form a block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones at 120 G base as two separate blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"]
      .map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy: 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years: plain sword premium 95 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{
      op: "quote" as const, items: [{ type: "sword" }],
    }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at exactly enchantment 5: premium 195 G", () => {
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment at level 4 while applying curse: premium 165 G", () => {
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract with a new cursed level-7 sword at 160 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("keeps fractional intermediates and rounds a 52.5 G premium up to 53 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ premium: 53 });
  });
  it("pays 400 G for regular steel level-3 sword damage of 500 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for dragon-material level-8 sword damage of 1000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible to each sword and amulet damage entry: total payout 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("lets the 50% clause win for dragon-material level-9 sword damage: payout 400 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon-material level-5 sword damage before deductible: payout 700 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves steel level-9 sword damage before deductible: payout 400 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("insures two swords for a 4000 G cap and treats two sword damages separately", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "attack", damages } },
    ] };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("rejects the whole claim through the CLI when sword damages outnumber insured swords", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("bases sword-and-amulet cap on their 1600 G insurance sum: cap 3200 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases cursed-sword cap on unmodified 1000 G value: cap 2000 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario)).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("bases sword-and-3-rune cap on 1750 G value despite the premium block: cap 3500 G", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword's 2000 G cap across payouts of 1400 G then 600 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: {
      cause: "damage", damages: [{ itemType: "sword", amount: 1500 }],
    } };
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword" }] }, claim, claim,
    ] };
    expect(processScenario(scenario).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("keeps fractional payout intermediates and rounds 350.5 G down to 350 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] };
    expect(processScenario(scenario).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr, and no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("rejects uninsured and unknown damage items through the CLI with non-zero status and stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const input = { customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] };
      const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr).not.toBe("");
      expect(cli.stdout).toBe("");
    }
  });
  it("rejects negative damage through the CLI with non-zero status and stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("emits results in step order with the normative quote and claim output shape", () => {
    const input = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
