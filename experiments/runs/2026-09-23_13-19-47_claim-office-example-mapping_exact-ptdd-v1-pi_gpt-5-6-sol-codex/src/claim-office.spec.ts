import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";
import type { Damage, Item } from "./claim-office.js";

const customer = (yearsWithMHPCO = 0) => ({ yearsWithMHPCO });
const quote = (items: Item[]) => ({ op: "quote" as const, items });
const item = (type: string, overrides: Partial<Item> = {}): Item => ({ type, material: "steel", enchantment: 0, cursed: false, ...overrides });
const claim = (policy: number, damages: Damage[]) => ({ op: "claim" as const, policy, incident: { cause: "test", damages } });
const premium = (items: Item[], years = 0) => runScenario({ customer: customer(years), steps: [quote(items)] }).results[0];
const executeCli = (scenario: object) => spawnSync("./claim-office", {
  input: JSON.stringify(scenario), encoding: "utf8"
});

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G for the processing fee only", () => {
    expect(premium([])).toEqual({ premium: 5 });
  });
  it("quotes one plain sword at 115 G: 100 base + 10 first-insurance surcharge + 5 fee", () => {
    expect(premium([item("sword")])).toEqual({ premium: 115 });
  });
  it("quotes one plain amulet at 71 G: 60 base + 6 first-insurance surcharge + 5 fee", () => {
    expect(premium([item("amulet")])).toEqual({ premium: 71 });
  });
  it("quotes one plain staff at 93 G: 80 base + 8 first-insurance surcharge + 5 fee", () => {
    expect(premium([item("staff")])).toEqual({ premium: 93 });
  });
  it("quotes one plain potion at 49 G: 40 base + 4 first-insurance surcharge + 5 fee", () => {
    expect(premium([item("potion")])).toEqual({ premium: 49 });
  });
  it("quotes one rune at 33 G: 25 base + 2.5 first-insurance surcharge + 5 fee, rounded up", () => {
    expect(premium([item("rune")])).toEqual({ premium: 33 });
  });
  it("quotes one moonstone at 33 G: 25 base + 2.5 first-insurance surcharge + 5 fee, rounded up", () => {
    expect(premium([item("moonstone")])).toEqual({ premium: 33 });
  });
  it("uses 50 G as the base premium for 2 runes", () => {
    expect(premium([item("rune"), item("rune")])).toEqual({ premium: 60 });
  });
  it("uses the special 60 G base premium for exactly 3 runes", () => {
    expect(premium([item("rune"), item("rune"), item("rune")])).toEqual({ premium: 71 });
  });
  it("uses 100 G as the base premium for 4 runes because a block requires exactly 3", () => {
    expect(premium(Array.from({ length: 4 }, () => item("rune")))).toEqual({ premium: 115 });
  });
  it("uses 175 G as the base premium for 7 runes with no block", () => {
    expect(premium(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("uses 75 G as the base premium for 2 runes and 1 moonstone because unlike types do not form a block", () => {
    expect(premium([item("rune"), item("rune"), item("moonstone")])).toEqual({ premium: 88 });
  });
  it("uses 120 G as the base premium for 3 runes and 3 moonstones as two separate blocks", () => {
    const items = [...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))];
    expect(premium(items)).toEqual({ premium: 137 });
  });
  it("adds a curse surcharge only to the cursed sword in a cursed sword and plain amulet policy: 231 G total", () => {
    expect(premium([item("sword", { cursed: true }), item("amulet")])).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword quote is 95 G", () => {
    expect(premium([item("sword")], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at exactly enchantment 5: a cursed sword is 195 G", () => {
    expect(premium([item("sword", { cursed: true, enchantment: 5 })])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but applies curse: a cursed sword is 165 G", () => {
    expect(premium([item("sword", { cursed: true, enchantment: 4 })])).toEqual({ premium: 165 });
  });
  it("rounds a final premium of 197.5 G upward to 198 G", () => {
    expect(premium(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("quotes a newcomer cursed steel sword at 165 G", () => {
    expect(premium([item("sword", { cursed: true, enchantment: 3 })])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract cursed enchantment-7 sword at 160 G, retaining per-item first-insurance surcharge and adding follow-up discount", () => {
    const result = runScenario({ customer: customer(3), steps: [quote([]), quote([item("sword", { cursed: true, enchantment: 7 })])] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("rejects an unknown quote item type with non-zero status, stderr description, and no stdout results", () => {
    const result = executeCli({ customer: customer(), steps: [quote([item("broomstick")])] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type");
    expect(result.stdout).toBe("");
  });

  it("pays 400 G for regular steel enchantment-3 sword damage of 500 G and leaves 1600 G cap", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword", { enchantment: 3 })]), claim(0, [{ itemType: "sword", amount: 500 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for rune damage of 200 G and leaves 400 G cap", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("rune")]), claim(0, [{ itemType: "rune", amount: 200 }])] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for dragon-material enchantment-8 sword damage of 1000 G because the 50% rule wins before deductible", () => {
    const sword = item("sword", { material: "dragon", enchantment: 8 });
    const result = runScenario({ customer: customer(), steps: [quote([sword]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon-material enchantment-9 sword damage of 1000 G because the 50% rule wins before deductible", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword", { material: "dragon", enchantment: 9 })]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon-material enchantment-5 sword damage of 800 G through full reimbursement before deductible", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword", { material: "dragon", enchantment: 5 })]), claim(0, [{ itemType: "sword", amount: 800 }])] });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel enchantment-9 sword damage of 1000 G through 50% reimbursement before deductible", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword", { enchantment: 9 })]), claim(0, [{ itemType: "sword", amount: 1000 }])] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies a separate 100 G deductible to sword damage 500 G and amulet damage 300 G, paying 600 G", () => {
    const steps = [quote([item("sword"), item("amulet")]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])];
    expect(runScenario({ customer: customer(), steps }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("rounds a final payout of 350.5 G downward to 350 G", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword", { enchantment: 8 })]), claim(0, [{ itemType: "sword", amount: 901 }])] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("creates a 4000 G cap for two insured swords and treats two sword damages as separate events", () => {
    const damages = [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }];
    const result = runScenario({ customer: customer(), steps: [quote([item("sword"), item("sword")]), claim(0, damages)] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim when two sword damage entries exceed the one sword covered, with non-zero status and stderr description", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])] };
    const result = executeCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("exceeds policy coverage");
    expect(result.stdout).toBe("");
  });
  it("creates a 3200 G cap from sword and amulet insurance values", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword"), item("amulet")]), claim(0, [])] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("creates a 2000 G cap for a cursed sword from unmodified insurance value despite its 165 G premium", () => {
    const result = runScenario({ customer: customer(), steps: [quote([item("sword", { cursed: true })]), claim(0, [])] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("creates a 3500 G cap for a sword and 3-rune block from the 1750 G insurance sum", () => {
    const items = [item("sword"), item("rune"), item("rune"), item("rune")];
    const result = runScenario({ customer: customer(), steps: [quote(items), claim(0, [])] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits two successive 1500 G sword claims to payouts of 1400 G then 600 G, leaving caps of 600 G then 0 G", () => {
    const damage = [{ itemType: "sword", amount: 1500 }];
    const results = runScenario({ customer: customer(), steps: [quote([item("sword")]), claim(0, damage), claim(0, damage)] }).results;
    expect(results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects damage to an item type absent from the policy with non-zero status and stderr description", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "amulet", amount: 200 }])] };
    const result = executeCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("policy coverage");
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damage item type with non-zero status and stderr description", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "broomstick", amount: 200 }])] };
    const result = executeCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects a negative damage amount with non-zero status and stderr description", () => {
    const scenario = { customer: customer(), steps: [quote([item("sword")]), claim(0, [{ itemType: "sword", amount: -200 }])] };
    const result = executeCli(scenario);
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Negative damage amount");
    expect(result.stdout).toBe("");
  });
  it("emits one ordered result per sequential quote and claim using the normative JSON field names", () => {
    const scenario = { customer: customer(5), steps: [quote([item("amulet", { material: "silver", enchantment: 2 })]), claim(0, [{ itemType: "amulet", amount: 200 }])] };
    const result = executeCli(scenario);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
    expect(result.stderr).toBe("");
  });
});
