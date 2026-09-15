import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", async () => {
    const { runScenario } = await import("./claim-office.js");
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the price-list base premiums: sword 100 G, amulet 60 G, staff 80 G, potion 40 G, plus fee and initial assessment", async () => {
    const { runScenario } = await import("./claim-office.js");
    const premiums = ["sword", "amulet", "staff", "potion"].map((type) =>
      runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0],
    );
    expect(premiums).toEqual([{ premium: 115 }, { premium: 71 }, { premium: 93 }, { premium: 49 }]);
  });
  it("quotes 2 runes at 50 G base premium", async () => {
    const { runScenario } = await import("./claim-office.js");
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes at the 60 G block base premium", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes at 100 G base premium because a block requires exactly 3", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes at 175 G base premium, without applying a block among extras", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes 2 runes plus 1 moonstone at 75 G base premium because alike means exact type", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 3 runes plus 3 moonstones at 120 G base premium as two separate blocks", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a cursed surcharge only to the cursed sword: sword plus amulet is 231 G including policy modifiers and fee", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty discount at exactly 2 years: plain sword premium is 95 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies high-enchantment surcharge at exactly level 5 and stacks curse: sword premium is 195 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [{ type: "sword", enchantment: 5, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at level 4 while still applying curse: sword premium is 165 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [{ type: "sword", enchantment: 4, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer first contract cursed sword at 165 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract cursed level-7 sword at 160 G, retaining per-item initial assessment", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [
      { op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("rounds a 197.5 G premium up to 198 G only at the end", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("claims 400 G for regular sword damage of 500 G and leaves 1600 G cap", async () => {
    const { runScenario } = await import("./claim-office.js");
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
    ] };
    expect(runScenario(scenario as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims 100 G for rune damage of 200 G and leaves 400 G cap", async () => {
    const { runScenario } = await import("./claim-office.js");
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ] };
    expect(runScenario(scenario as any).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claims 400 G for dragon-material level-8 sword damage of 1000 G because the 50% clause wins before deductible", async () => {
    const { runScenario } = await import("./claim-office.js");
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] };
    expect(runScenario(scenario as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible per damaged item: sword 500 G plus amulet 300 G pays 600 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] };
    expect(runScenario(scenario as any).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claims 400 G for dragon-material level-9 sword damage of 1000 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims 700 G for dragon-material level-5 sword damage of 800 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("claims 400 G for steel level-9 sword damage of 1000 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("treats two same-type insured items and damage entries separately, with insurance sum 2000 G and cap 4000 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole CLI claim with non-zero status, stderr, and no stdout when damages outnumber insured same-type items", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/insured|outnumber/i);
    expect(cli.stdout).toBe("");
  });
  it("sets sword plus amulet insurance sum to 1600 G and cap to 3200 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword cap on unmodified 1000 G insurance value, yielding 2000 G cap", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword plus 3-rune insurance sum to 1750 G despite the premium block discount", async () => {
    const { runScenario } = await import("./claim-office.js");
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across claims: payouts 1400 G then 600 G, remaining cap 600 G then 0 G", async () => {
    const { runScenario } = await import("./claim-office.js");
    const damage = { itemType: "sword", amount: 1500 };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } }, { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G desired payout down to 350 G only at the end", async () => {
    const { runScenario } = await import("./claim-office.js");
    const steps = [{ op: "quote", items: [{ type: "sword", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps } as any).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item in the CLI with non-zero status, stderr description, and no stdout", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/unknown.*broomstick/i);
    expect(cli.stdout).toBe("");
  });
  it("rejects a CLI claim for an uninsured item with non-zero status and stderr description", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/insured.*amulet|amulet.*insured/i);
    expect(cli.stdout).toBe("");
  });
  it("rejects a CLI claim for an unknown item type with non-zero status and stderr description", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "broomstick", amount: 200 }] } }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/unknown.*broomstick/i);
    expect(cli.stdout).toBe("");
  });
  it("rejects a CLI claim with negative damage with non-zero status and stderr description", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/negative|amount/i);
    expect(cli.stdout).toBe("");
  });
  it("reads sequential steps from stdin and writes ordered quote and claim results as JSON to stdout", () => {
    const input = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(cli.stderr).toBe("");
  });
});
