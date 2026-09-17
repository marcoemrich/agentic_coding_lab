import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain sword from the 100 G base premium at 115 G including first-insurance surcharge and fee", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes one plain amulet from its independently specified 60 G base premium", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] }).results[0]).toEqual({ premium: 71 });
  });
  it("quotes one plain staff from its independently specified 80 G base premium", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "staff" }] }] }).results[0]).toEqual({ premium: 93 });
  });
  it("quotes one plain potion from its independently specified 40 G base premium", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "potion" }] }] }).results[0]).toEqual({ premium: 49 });
  });
  it("quotes two runes at 50 G base premium before policy modifiers and fee", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 60 });
  });
  it("quotes exactly three runes at the special 60 G block base premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 71 });
  });
  it("quotes four runes at 100 G base premium because blocks require exactly three", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 115 });
  });
  it("quotes seven runes at 175 G base premium because no subset block applies", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("quotes two runes and one moonstone at 75 G base premium because alike means identical type", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 88 });
  });
  it("quotes three runes and three moonstones at 120 G base premium as two independent blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 137 });
  });
  it("applies a curse surcharge only to the cursed sword in a cursed sword plus plain amulet policy, producing 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 231 });
  });
  it("applies the 20% loyalty discount at exactly 2 years to the policy base premium", () => {
    expect(executeScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results[0]).toEqual({ premium: 95 });
  });
  it("applies the 30% high-enchantment surcharge at exactly level 5 and stacks it with curse", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at level 4 while still applying curse", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 165 });
  });
  it("rounds a final premium of 197.5 G up to 198 G while retaining fractional intermediates", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("quotes a newcomer cursed steel sword at enchantment 3 for 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second-contract cursed level-7 sword for 160 G, including per-item first-insurance and follow-up modifiers", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr description, and no stdout results", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("Unknown item type");
    expect(run.stdout).toBe("");
  });
  it("outputs one ordered result per step using the binding JSON field names", () => {
    const steps = [{ op: "quote", items: [] }, { op: "quote", items: [{ type: "potion" }] }];
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 5 }, { premium: 43 }] });
    expect(run.stderr).toBe("");
  });
  it("pays 400 G for standard 500 G sword damage after one 100 G deductible", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(executeScenario(scenario).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage after one deductible without item special clauses", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for dragon-material level-8 sword damage of 1000 G because the 50% enchantment clause wins, then deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon-material level-9 sword damage of 1000 G because the enchantment clause wins", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon-material level-5 sword damage of 800 G under full reimbursement, then deductible", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel level-9 sword damage of 1000 G under 50% reimbursement, then deductible", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies the deductible to each damaged item, paying 600 G for sword 500 G plus amulet 300 G damage", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats two same-type policy items and two same-type damage entries separately, with insurance sum 2000 G and cap 4000 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects through the CLI when damage entries of a type outnumber insured items", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("rejects through the CLI a damage item absent from the policy with non-zero status and stderr description", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("rejects through the CLI an unknown damage item with non-zero status and stderr description", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("rejects through the CLI a negative damage amount with non-zero status and stderr description", () => {
    const run = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] });
    expect(run.status).not.toBe(0);
    expect(run.stderr.length).toBeGreaterThan(0);
    expect(run.stdout).toBe("");
  });
  it("sets a sword plus amulet policy cap to 3200 G from their 1600 G insurance sum", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap to 2000 G from unmodified insurance value, independent of its 165 G premium", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sets sword plus three-rune policy insurance sum to 1750 G despite the component block premium discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: a 1500 G sword claim pays 1400 G leaving 600 G, then another pays 600 G leaving zero", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a raw payout of 350.5 G down to 350 G only at the final payout", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(executeScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
});
