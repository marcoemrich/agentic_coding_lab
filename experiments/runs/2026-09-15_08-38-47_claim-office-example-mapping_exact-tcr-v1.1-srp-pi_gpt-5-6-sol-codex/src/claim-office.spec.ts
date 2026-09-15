import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function runCli(input: string) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes sword, amulet, staff, and potion price-list base premiums totaling 313 G after 10% initial assessment and 5 G fee", () => {
    const items = ["sword", "amulet", "staff", "potion"].map((type) => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({
      results: [{ premium: 313 }],
    });
  });
  it("quotes 2 runes at 50 G base premium (60 G including initial assessment and fee)", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({
      results: [{ premium: 60 }],
    });
  });
  it("quotes exactly 3 runes as one 60 G block (71 G including initial assessment and fee)", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G base premium with no block (115 G including initial assessment and fee)", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G base premium (198 G including initial assessment and fee)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone at 75 G base premium because unlike types do not form a block (88 G final)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones as two blocks at 120 G base premium (137 G final)", () => {
    const items = ["rune", "moonstone"].flatMap((type) => Array.from({ length: 3 }, () => ({ type })));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse only to its item: cursed sword plus plain amulet is 231 G final", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the 20% loyalty discount at exactly 2 years: plain sword is 95 G final", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({
      results: [{ premium: 95 }],
    });
  });
  it("applies both 50% curse and 30% high-enchantment surcharges at enchantment 5: sword is 195 G final", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, but applies curse: sword is 165 G final", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer's cursed sword at 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract with a new cursed enchantment-7 sword at 160 G", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 7 }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("keeps fractional intermediates and rounds a 197.5 G premium up to 198 G", () => {
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", cursed: true, enchantment: 5 }, { type: "rune" }, { type: "rune" }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps }).results[1]).toEqual({ premium: 198 });
  });
  it("reports sword and amulet insurance sum through an empty claim as a 3200 G remaining cap", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    };
    expect(runScenario(scenario).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's cap on unmodified 1000 G insurance value, leaving 2000 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("bases sword plus 3-rune block cap on 1750 G insurance sum, leaving 3500 G", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [
      { op: "quote" as const, items },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("reimburses a regular steel enchantment-3 sword damaged for 500 G at 400 G after deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses a rune damaged for 200 G at 100 G after deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("reimburses dragon-material enchantment-8 sword damage of 1000 G at 400 G because the 50% clause wins", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses dragon-material enchantment-9 sword damage of 1000 G at 400 G because the 50% clause wins", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses dragon-material enchantment-5 sword damage of 800 G at 700 G in full before deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses steel enchantment-9 sword damage of 1000 G at 400 G after 50% then deductible", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a separate 100 G deductible to sword 500 G and amulet 300 G damages, paying 600 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("supports two insured swords with 4000 G cap and treats two sword damages separately", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("limits two successive 1500 G sword claims to payouts 1400 G then 600 G, exhausting the cap", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("keeps fractional payout intermediates and rounds 350.5 G down to 350 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 901 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI emits ordered quote and claim result objects using the normative field names", () => {
    const input = JSON.stringify({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    const cli = runCli(input);
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI rejects an unknown quote item with non-zero status, stderr description, and no stdout results", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    const cli = runCli(input);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects damage to an unowned known item with non-zero status and stderr description", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    const cli = runCli(input);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
  });
  it("CLI rejects damage with an unknown item type with non-zero status and stderr description", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    const cli = runCli(input);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
  });
  it("CLI rejects more same-type damages than insured items with non-zero status", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    const cli = runCli(input);
    expect(cli.status).not.toBe(0);
  });
  it("CLI rejects a negative damage amount with non-zero status and stderr description", () => {
    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    const cli = runCli(input);
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.trim().length).toBeGreaterThan(0);
  });
});
