import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes each main item at its listed base premium plus first-insurance surcharge and 5 G fee", () => {
    const expected = { sword: 115, amulet: 71, staff: 93, potion: 49 };
    for (const [type, premium] of Object.entries(expected)) {
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] })).toEqual({
        results: [{ premium }],
      });
    }
  });
  it("quotes two runes at 60 G including first-insurance surcharge and fee", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly three runes as a 60 G block, totaling 71 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes four runes without a block at 115 G", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes seven runes without a block at 198 G after rounding up", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not combine two runes and one moonstone into a block, totaling 88 G", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes three runes and three moonstones as two blocks, totaling 137 G", () => {
    const items = ["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"].map((type) => ({ type }));
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy, totaling 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years, totaling 59 G for an amulet", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "amulet" }] }] })).toEqual({ results: [{ premium: 59 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, totaling 195 G for a sword", () => {
    const item = { type: "sword", cursed: true, enchantment: 5 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, totaling 165 G for a cursed sword", () => {
    const item = { type: "sword", cursed: true, enchantment: 4 };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "potion" }] },
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps })).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });
  it("reimburses a regular sword damaged by 500 G with a 400 G payout", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim" as const, policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("reimburses a rune damaged by 200 G with a 100 G payout", () => {
    const steps = [
      { op: "quote" as const, items: [{ type: "rune" }] },
      { op: "claim" as const, policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
    ];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("applies one deductible per damaged item, paying 600 G for sword 500 G plus amulet 300 G", () => {
    const items = [{ type: "sword" }, { type: "amulet" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("applies the 50 percent enchantment clause at exactly 8 even for dragon material, paying 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 8 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "curse", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50 percent rule win for a dragon sword at enchantment 9, paying 400 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "curse", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("fully reimburses a dragon sword at enchantment 5 less deductible, paying 700 G", () => {
    const items = [{ type: "sword", material: "dragon", enchantment: 5 }];
    const damages = [{ itemType: "sword", amount: 800 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 700 });
  });
  it("pays 400 G for a steel sword at enchantment 9 after halving and deductible", () => {
    const items = [{ type: "sword", material: "steel", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 1000 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "fire", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 400 });
  });
  it("covers duplicate item types and treats two sword damages separately, paying 800 G with cap 3200 G", () => {
    const items = [{ type: "sword" }, { type: "sword" }];
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when damage entries outnumber insured items of that type", () => {
    const items = [{ type: "sword" }];
    const damages = [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "attack", damages } }];
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow("uninsured item");
  });
  it("computes cap from unmodified insurance values and component counts, not premium discounts or modifiers", () => {
    const policies = [
      [{ type: "sword" }, { type: "amulet" }],
      [{ type: "sword", cursed: true }],
      [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
    ];
    const expectedCaps = [3200, 2000, 3500];
    policies.forEach((items, index) => {
      const damages = items.map((item) => ({ itemType: item.type, amount: 0 }));
      const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "inspection", damages } }];
      expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ remainingCap: expectedCaps[index] });
    });
  });
  it("exhausts a sword policy cap across claims: 1400 G then 600 G, leaving zero", () => {
    const claim = { op: "claim" as const, policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote" as const, items: [{ type: "sword" }] }, claim, claim];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional payout down: 350.5 G becomes 350 G", () => {
    const items = [{ type: "sword", enchantment: 9 }];
    const damages = [{ itemType: "sword", amount: 901 }];
    const steps = [{ op: "quote" as const, items }, { op: "claim" as const, policy: 0, incident: { cause: "curse", damages } }];
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toMatchObject({ payout: 350 });
  });
  it("CLI rejects an unknown quote item with non-zero status, stderr description, and no stdout results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/unknown item/i);
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects damage to an uninsured or unknown item with non-zero status and stderr description", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/uninsured item/i);
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects a negative damage amount with non-zero status and stderr description", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    };
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/negative damage/i);
    expect(cli.stdout).toBe("");
  });
  it("emits quote and claim results in step order with exactly the normative field names", () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    };
    const cli = spawnSync("./src/cli.ts", [], { input: JSON.stringify(input), encoding: "utf8" });
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
