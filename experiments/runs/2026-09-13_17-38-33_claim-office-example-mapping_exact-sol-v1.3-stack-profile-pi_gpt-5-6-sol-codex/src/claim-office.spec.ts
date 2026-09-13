import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the four main price-list items at their base premiums plus assessment and fee", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      (executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0] as { premium: number }).premium,
    );
    expect(premiums).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes from a 50 G component base premium", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes from the special 60 G block premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes from a 100 G base premium because blocks require exactly 3", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes from a 175 G base premium and rounds 197.5 G up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone without an alike-component block", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones using two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract with a new cursed enchanted sword at 160 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [item] }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1]).toEqual({ premium: 160 });
  });
  it("pays 400 G for dragon sword enchantment 8 damaged by 1000 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } };
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }, claim] }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible per damaged item and pays 600 G for sword 500 plus amulet 300", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for a regular sword damaged by 500 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged by 200 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "rune" }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent rule win for dragon sword enchantment 9 and pays 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon sword enchantment 5 less deductible and pays 700 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("half reimburses steel sword enchantment 9 less deductible and pays 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("insures two swords for a 4000 G cap and treats two sword damages separately", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 1500 }, { itemType: "sword", amount: 1500 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 2800, remainingCap: 1200 });
  });
  it("rejects a whole claim when sword damage count exceeds insured sword count", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages } }];
    expect(() => executeScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("sets sword-and-amulet cap from their 1600 G insurance sum to 3200 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets cursed sword cap to 2000 G from unmodified insurance value", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword-and-3-runes cap to 3500 G despite the component premium block", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts 1400 G then 600 G and exhausts cap", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects a quote containing unknown broomstick with CLI nonzero, stderr, and no stdout", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect({ failed: result.status !== 0, stderr: result.stderr.length > 0, stdout: result.stdout }).toEqual({ failed: true, stderr: true, stdout: "" });
  });
  it("rejects claim damage for an item absent from policy with CLI nonzero and stderr", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect({ failed: result.status !== 0, stderr: result.stderr.length > 0, stdout: result.stdout }).toEqual({ failed: true, stderr: true, stdout: "" });
  });
  it("rejects a negative damage amount with CLI nonzero and stderr", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps });
    const result = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect({ failed: result.status !== 0, stderr: result.stderr.length > 0, stdout: result.stdout }).toEqual({ failed: true, stderr: true, stdout: "" });
  });
  it("writes ordered quote and claim results using the normative JSON field names", () => {
    const steps = [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 5 }, steps });
    const result = spawnSync("./claim-office", { input, encoding: "utf8" });
    expect({ status: result.status, output: result.stdout }).toEqual({ status: 0, output: JSON.stringify({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] }) });
  });
});
