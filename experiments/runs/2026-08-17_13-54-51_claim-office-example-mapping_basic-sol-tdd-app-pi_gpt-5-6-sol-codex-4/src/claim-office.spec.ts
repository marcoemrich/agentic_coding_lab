import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("uses the price list for sword, amulet, staff, and potion premiums: 115, 71, 93, and 49 G for a new customer", () => {
    const premium = (type: string) => {
      const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }).results[0];
      return result && "premium" in result ? result.premium : undefined;
    };
    expect([premium("sword"), premium("amulet"), premium("staff"), premium("potion")])
      .toEqual([115, 71, 93, 49]);
  });
  it("quotes 2 runes at 60 G including first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] }))
      .toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes as a 60 G block, yielding 71 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }] }))
      .toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block, yielding 115 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }] }))
      .toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block, yielding 198 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine 2 runes and 1 moonstone into a block, yielding 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes and 3 moonstones as two blocks, yielding 137 G", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse only to the cursed sword in a sword-and-amulet policy, yielding 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 231 }] });
  });
  it("applies loyalty at exactly 2 years, yielding 95 G for a sword", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] }))
      .toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharge at enchantment 5, yielding 195 G", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, yielding 165 G when cursed", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] }))
      .toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer’s second-contract cursed enchanted sword at 160 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const steps = [{ op: "quote" as const, items: [] }, { op: "quote" as const, items: [item] }];
    expect(processScenario({ customer: { yearsWithMHPCO: 3 }, steps }))
      .toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("pays 400 G for 500 G damage to a regular steel sword and leaves 1600 G cap", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage and leaves 400 G cap", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to an enchantment-8 dragon sword", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for 1000 G damage to an enchantment-9 dragon sword because the 50% clause wins", () => {
    const item = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("pays 700 G for 800 G damage to an enchantment-5 dragon sword", () => {
    const item = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 700 });
  });
  it("pays 400 G for 1000 G damage to an enchantment-9 steel sword", () => {
    const item = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [{ op: "quote" as const, items: [item] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("applies a deductible per damaged item, paying 600 G for sword 500 G plus amulet 300 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 600 });
  });
  it("insures two swords for a 4000 G cap", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1])
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two same-type damage entries as separate damages with separate deductibles", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 800 });
  });
  it("rejects the whole claim when same-type damage entries outnumber insured items", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident: { cause: "dragon", damages } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow();
  });
  it("sets sword-and-amulet cap to 3200 G from their 1600 G insurance sum", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ remainingCap: 3200 });
  });
  it("sets a cursed sword cap to 2000 G from unmodified insurance value", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", cursed: true }] }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ remainingCap: 2000 });
  });
  it("sets sword-and-3-rune cap to 3500 G despite the premium block discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts 1400 G then 600 G, exhausting the cap", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, { op: "claim" as const, policy: 0, incident }, { op: "claim" as const, policy: 0, incident }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1))
      .toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 197.5 G premium up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] }))
      .toEqual({ results: [{ premium: 198 }] });
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    const steps = [{ op: "quote" as const, items: [{ type: "sword", enchantment: 9 }] }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 350 });
  });
  it("rejects an unknown quote item type without producing results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toContain("Unknown item type");
    expect(cli.stdout).toBe("");
  });
  it("rejects damage to an uninsured or unknown item and produces no results", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType, amount: 200 }] } }] };
      const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
      expect(cli.status).not.toBe(0);
      expect(cli.stderr.length).toBeGreaterThan(0);
      expect(cli.stdout).toBe("");
    }
  });
  it("rejects a negative damage amount and produces no results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(scenario), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr.length).toBeGreaterThan(0);
    expect(cli.stdout).toBe("");
  });
  it("returns quote and claim results in step order using the normative field names", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ];
    expect(processScenario({ customer: { yearsWithMHPCO: 5 }, steps }))
      .toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
