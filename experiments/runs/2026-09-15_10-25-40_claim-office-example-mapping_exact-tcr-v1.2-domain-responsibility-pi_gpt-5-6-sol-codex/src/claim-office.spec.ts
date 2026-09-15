import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the sword, amulet, staff, and potion price list: one newcomer quote costs 313 G", () => {
    const items = ["sword", "amulet", "staff", "potion"].map((type) => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 313 }] });
  });
  it("quotes 2 runes from a 50 G component base premium at 60 G total", () => {
    const items = [{ type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes from the special 60 G block premium at 71 G total", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block from a 100 G base premium at 115 G total", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without blocks at 198 G, rounding 197.5 G up", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone: 75 G base and 88 G total", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as two blocks: 120 G base and 137 G total", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse only to its item: cursed sword plus plain amulet costs 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword costs 95 G", () => {
    const scenario = { customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote" as const, items: [{ type: "sword" }] }] };
    expect(runScenario(scenario)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both surcharges at enchantment 5 when cursed: a sword costs 195 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 5 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment below 5: a cursed enchantment-4 sword costs 165 G", () => {
    const items = [{ type: "sword", cursed: true, enchantment: 4 }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer cursed sword at the integration-example premium of 165 G", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 3, cursed: true }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract cursed enchantment-7 sword at 160 G", () => {
    const steps = [{ op: "quote" as const, items: [] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] }];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps }).results[1])
      .toEqual({ premium: 160 });
  });
  it("reimburses ordinary sword damage of 500 G at 400 G and leaves 1600 G cap", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G and leaves 400 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies the 50% clause at exactly enchantment 8 even for dragon material: payout 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50% clause win for dragon material at enchantment 9: payout 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material at enchantment 5: payout 700 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("half reimburses steel at enchantment 9: payout 400 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a separate 100 G deductible to sword 500 G and amulet 300 G: payout 600 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("sets a two-sword policy cap to 4000 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with payout 800 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when sword damages outnumber insured swords by throwing an Error", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("sets sword-plus-amulet cap from the 1600 G insurance sum to 3200 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword cap at 2000 G despite its modified premium", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results)
      .toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sets sword-plus-3-runes cap to 3500 G despite the component block discount", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const steps = [{ op: "quote" as const, items },
      { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword cap over two 1500 G claims: payouts 1400 G then 600 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a raw payout of 350.5 G down to 350 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI emits ordered quote and claim result objects using the normative field names", () => {
    const scenario = { customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).toBe(0);
    expect(JSON.parse(cli.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI rejects an unknown quote type with nonzero status, stderr, and no stdout results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects damage to an item absent from the policy with nonzero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] };
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects an unknown damaged item type with nonzero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] };
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
  });
  it("CLI rejects a negative damage amount with nonzero status and stderr", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] };
    const cli = spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).not.toBe("");
    expect(cli.stdout).toBe("");
  });
});
