import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function runCli(scenario: unknown) {
  return spawnSync("./claim-office", { input: JSON.stringify(scenario), encoding: "utf8" });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes the main-item price list: sword 115 G, amulet 71 G, staff 93 G, and potion 49 G for separate newcomer policies", () => {
    const quote = (type: string) => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] });
    expect([quote("sword"), quote("amulet"), quote("staff"), quote("potion")]).toEqual([
      { results: [{ premium: 115 }] }, { results: [{ premium: 71 }] },
      { results: [{ premium: 93 }] }, { results: [{ premium: 49 }] },
    ]);
  });
  it("quotes 2 runes at 60 G total: 50 G base plus first-insurance surcharge and fee", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }] })).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes as a 60 G building block, producing 71 G total", () => {
    const items = Array.from({ length: 3 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 runes without a block at 115 G total", () => {
    const items = Array.from({ length: 4 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes 7 runes without a block at 198 G total", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("does not group 2 runes and 1 moonstone: 75 G base and 88 G total", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 88 }] });
  });
  it("groups 3 runes and 3 moonstones as two blocks: 120 G base and 137 G total", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a cursed surcharge to its sword in a sword-and-amulet policy: 210 G before policy modifiers, 231 G total", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet", cursed: false }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 231 }] });
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword costs 95 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 2 }, steps: [{ op: "quote", items: [{ type: "sword" }] }] })).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: a newcomer sword costs 195 G", () => {
    const item = { type: "sword", enchantment: 5, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge at enchantment 4, but applies curse: 165 G", () => {
    const item = { type: "sword", enchantment: 4, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("rounds a final premium of 197.5 G up to 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] })).toEqual({ results: [{ premium: 198 }] });
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3, cursed: true };
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }] })).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G, including per-item first-insurance surcharge", () => {
    const sword = { type: "sword", material: "steel", enchantment: 7, cursed: true };
    const scenario = { customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote", items: [] }, { op: "quote", items: [sword] }] };
    expect(processScenario(scenario)).toEqual({ results: [{ premium: 5 }, { premium: 160 }] });
  });
  it("claims 400 G for a dragon sword at enchantment 8 damaged for 1000 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } };
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item] }, claim] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one 100 G deductible to each damaged item: sword 500 G plus amulet 300 G pays 600 G", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }];
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claims the standard 400 G for a steel enchantment-3 sword damaged for 500 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims the standard 100 G for a rune damaged for 200 G", () => {
    const steps = [{ op: "quote", items: [{ type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% rule win for a dragon enchantment-9 sword damaged for 1000 G: payout 400 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 9 };
    const steps = [{ op: "quote", items: [item] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses a dragon enchantment-5 sword damaged for 800 G before deductible: payout 700 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 5 };
    const steps = [{ op: "quote", items: [item] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves reimbursement for a steel enchantment-9 sword damaged for 1000 G: payout 400 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 9 };
    const steps = [{ op: "quote", items: [item] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives two insured swords an insurance sum of 2000 G and remaining cap of 4000 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles: two 500 G damages pay 800 G", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when sword damage entries outnumber insured swords", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("caps a sword-and-amulet policy at 3200 G", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword's 2000 G cap on unmodified insurance value", () => {
    const steps = [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("bases a sword-and-3-rune policy's 3500 G cap on component values, unaffected by block pricing", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const steps = [{ op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 G then 600 G, leaving 0 G", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] } };
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, claim, claim];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a raw payout of 350.5 G down to 350 G", () => {
    const item = { type: "sword", enchantment: 8 };
    const steps = [{ op: "quote", items: [item] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }];
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item with an error and no stdout results", () => {
    const scenario = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const run = runCli(scenario);
    expect(run.status).not.toBe(0);
    expect(run.stderr).toMatch(/Unknown item type/);
    expect(run.stdout).toBe("");
  });
  it("rejects damage to a known item type not covered by the policy with an error", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("rejects damage to an unknown item type with an error", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("rejects a negative damage amount with an error", () => {
    const steps = [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }];
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps })).toThrow(Error);
  });
  it("exposes the binding CLI JSON result shape for sequential quote and claim steps", () => {
    const steps = [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }];
    const run = runCli({ customer: { yearsWithMHPCO: 5 }, steps });
    expect(run.status).toBe(0);
    expect(run.stderr).toBe("");
    expect(JSON.parse(run.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
