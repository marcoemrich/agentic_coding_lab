import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a sword, amulet, staff, and potion using base premiums 100 G, 60 G, 80 G, and 40 G", () => {
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes components at 25 G each: 2 runes have a 50 G base premium", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "rune" }, { type: "rune" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 60 }] });
  });
  it("applies the exact block: 3 runes have a 60 G base premium", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("does not apply a block to 4 runes: base premium is 100 G", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("does not form partial blocks from 7 runes: base premium is 175 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("requires exactly alike component types: 2 runes plus 1 moonstone have a 75 G base premium", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("forms separate alike blocks: 3 runes plus 3 moonstones have a 120 G base premium", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a cursed surcharge to its item: cursed sword plus plain amulet is 210 G before policy modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years, first-insurance surcharge per item, and the final 5 G fee", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("at enchantment 5 applies the 30% surcharge and combines it with a curse surcharge", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("at enchantment 4 applies no enchantment surcharge and applies a curse surcharge only when cursed", () => {
    const quote = (cursed: boolean) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote" as const, items: [{ type: "sword", enchantment: 4, cursed }] }] }).results[0];
    expect([quote(true), quote(false)]).toEqual([{ premium: 165 }, { premium: 115 }]);
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer’s cursed enchantment-7 sword on their second contract at 160 G", () => {
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] }];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("processes a regular steel enchantment-3 sword damage of 500 G with payout 400 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("processes rune damage of 200 G with payout 100 G without item special clauses", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies enchantment 8 reimbursement before deductible: dragon sword damage 1000 G pays 400 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "curse", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible per damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("lets the 50% enchantment rule win for dragon enchantment-9 sword damage 1000 G: payout 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("fully reimburses dragon enchantment-5 sword damage 800 G before deductible: payout 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 700 });
  });
  it("halves steel enchantment-9 sword damage 1000 G before deductible: payout 400 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("covers duplicate items independently: two 500 G sword damages pay 800 G and leave a 3200 G cap", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole CLI claim with non-zero status and stderr when damages outnumber insured items", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    const run = runCli(input);
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/insured/i);
    expect(run.stdout).toBe("");
  });
  it("bases caps on unmodified insurance values: sword plus amulet 3200 G, cursed sword 2000 G, sword plus 3 runes 3500 G", () => {
    const caps = [[{ type: "sword" }, { type: "amulet" }], [{ type: "sword", cursed: true }], [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))]].map((items) => {
      const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "audit", damages: [] } }];
      return processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1];
    });
    expect(caps).toEqual([{ payout: 0, remainingCap: 3200 }, { payout: 0, remainingCap: 2000 }, { payout: 0, remainingCap: 3500 }]);
  });
  it("exhausts a sword policy cap over successive 1500 G claims: payouts 1400 G then 600 G", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    const items = [{ type: "sword", enchantment: 8 }];
    const damages = [{ itemType: "sword", amount: 901 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "curse", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quoted type through the CLI with non-zero status, stderr, and no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const run = runCli(input);
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/unknown item type/i);
    expect(run.stdout).toBe("");
  });
  it("rejects an uninsured or unknown damaged item through the CLI with non-zero status and stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const input = { customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "loss", damages: [{ itemType, amount: 200 }] } },
      ] };
      const run = runCli(input);
      expect(run.status).not.toBe(0);
      expect(run.stderr).toMatch(/insured/i);
    }
  });
  it("rejects negative damage through the CLI with non-zero status and stderr", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const run = runCli(input);
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/negative damage/i);
  });
  it("processes sequential quote and claim steps and emits binding result field names in order", () => {
    const input = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const run = spawnSync("./claim-office", { input: JSON.stringify(input), encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(run.stderr).toBe("");
  });
});
