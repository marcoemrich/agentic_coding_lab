import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("uses main-item base premiums: sword 100, amulet 60, staff 80, potion 40 G", () => {
    const items = ["sword", "amulet", "staff", "potion"].map((type) => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 313 }] });
  });
  it("quotes two runes at 50 G base", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 60 });
  });
  it("quotes exactly three runes at the 60 G block base", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 71 });
  });
  it("quotes four runes at 100 G base with no block", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 115 });
  });
  it("quotes seven runes at 175 G base with no block", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("quotes two runes and one moonstone at 75 G base because types differ", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 88 });
  });
  it("quotes three runes and three moonstones as two 60 G blocks", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 137 });
  });
  it("scopes a cursed surcharge to the cursed sword, producing 210 G before other modifiers and fee", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly two years", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }).results[0]).toEqual({ premium: 95 });
  });
  it("applies high enchantment at exactly level 5 and stacks it with curse", () => {
    const item = { type: "sword", enchantment: 5, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }).results[0]).toEqual({ premium: 195 });
  });
  it("does not apply high enchantment at level 4", () => {
    const item = { type: "sword", enchantment: 4, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }).results[0]).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second-contract cursed level-7 sword at 160 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [item] }] };
    expect(runScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G final premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }).results[0]).toEqual({ premium: 198 });
  });
  it("pays 400 G for 500 G damage to a regular sword", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G damage to a rune", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 8", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50 percent clause win for a dragon sword at enchantment 9, paying 400 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses a dragon sword at enchantment 5, paying 700 G on 800 G damage", () => {
    const item = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for 1000 G damage to a steel sword at enchantment 9", () => {
    const item = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a deductible to each damaged sword and amulet, paying 600 G total", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("gives two swords a 4000 G cap and treats their damages separately", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("rejects through the CLI when sword damages outnumber insured swords", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toContain("insured");
    expect(cli.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 3200 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword cap at 2000 G despite premium modifiers", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives sword plus three runes a 3500 G cap despite the premium block", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("caps successive 1500 G sword claims at payouts 1400 then 600 G", () => {
    const incident = { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    const results = runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results;
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    const item = { type: "sword", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item through the CLI with stderr and no stdout", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toContain("Unknown item type");
    expect(cli.stdout).toBe("");
  });
  it("rejects damage to an item absent from the policy through the CLI", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const input = { customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] };
      const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr).toContain("insured");
      expect(cli.stdout).toBe("");
    }
  });
  it("rejects negative damage through the CLI with stderr and no stdout", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toContain("negative");
    expect(cli.stdout).toBe("");
  });
});
