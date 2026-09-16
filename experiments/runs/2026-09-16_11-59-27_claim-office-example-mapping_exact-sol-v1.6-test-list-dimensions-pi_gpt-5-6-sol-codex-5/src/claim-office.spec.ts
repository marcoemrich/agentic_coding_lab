import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario, type Item, type Scenario } from "./claim-office.js";

const q = (items: Item[], yearsWithMHPCO = 0) => executeScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];
const claimScenario = (items: Item[], damages: Array<{ itemType: string; amount: number }>) =>
  executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "incident", damages } },
  ] }).results[1];
const item = (type: string, extra: Partial<Item> = {}): Item => ({ type, ...extra });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => expect(q([])).toEqual({ premium: 5 }));
  it("prices one plain sword from its independent 100 G catalogue base at 115 G", () => expect(q([item("sword")])).toEqual({ premium: 115 }));
  it("prices one plain amulet from its independent 60 G catalogue base at 71 G", () => expect(q([item("amulet")])).toEqual({ premium: 71 }));
  it("prices one plain staff from its independent 80 G catalogue base at 93 G", () => expect(q([item("staff")])).toEqual({ premium: 93 }));
  it("prices one plain potion from its independent 40 G catalogue base at 49 G", () => expect(q([item("potion")])).toEqual({ premium: 49 }));
  it("prices one rune from its independent 25 G catalogue base at 33 G", () => expect(q([item("rune")])).toEqual({ premium: 33 }));
  it("prices one moonstone from its independent 25 G catalogue base at 33 G", () => expect(q([item("moonstone")])).toEqual({ premium: 33 }));
  it("prices 2 runes with a 50 G base at a 60 G final premium", () => expect(q([item("rune"), item("rune")])).toEqual({ premium: 60 }));
  it("prices exactly 3 runes as one 60 G block at a 71 G final premium", () => expect(q(Array.from({ length: 3 }, () => item("rune")))).toEqual({ premium: 71 }));
  it("prices 4 runes without a block from a 100 G base at 115 G", () => expect(q(Array.from({ length: 4 }, () => item("rune")))).toEqual({ premium: 115 }));
  it("prices 7 runes without blocks from a 175 G base at 198 G", () => expect(q(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 }));
  it("does not combine 2 runes and 1 moonstone into a block: 75 G base, 88 G premium", () => expect(q([item("rune"), item("rune"), item("moonstone")])).toEqual({ premium: 88 }));
  it("prices 3 runes and 3 moonstones as two blocks: 120 G base, 137 G premium", () => expect(q([...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))])).toEqual({ premium: 137 }));
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 231 G", () => expect(q([item("sword", { cursed: true }), item("amulet")])).toEqual({ premium: 231 }));
  it("applies loyalty at exactly 2 years to policy base: plain sword premium is 95 G", () => expect(q([item("sword")], 2)).toEqual({ premium: 95 }));
  it("applies high enchantment at exactly level 5 and combines it with curse: sword premium is 195 G", () => expect(q([item("sword", { enchantment: 5, cursed: true })])).toEqual({ premium: 195 }));
  it("does not apply high enchantment at level 4 but does apply curse: sword premium is 165 G", () => expect(q([item("sword", { enchantment: 4, cursed: true })])).toEqual({ premium: 165 }));
  it("rounds a 197.5 G premium up to 198 G only after all modifiers", () => expect(q(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 }));
  it("quotes the newcomer cursed-sword integration example at 165 G", () => expect(q([item("sword", { material: "steel", enchantment: 3, cursed: true })])).toEqual({ premium: 165 }));
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const result = executeScenario({ customer: { yearsWithMHPCO: 3 }, steps: [{ op: "quote", items: [] }, { op: "quote", items: [item("sword", { material: "steel", enchantment: 7, cursed: true })] }] });
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("processes a regular steel level-3 sword damage of 500 G at 400 G payout", () => expect(claimScenario([item("sword", { material: "steel", enchantment: 3 })], [{ itemType: "sword", amount: 500 }])).toMatchObject({ payout: 400 }));
  it("processes rune damage of 200 G at 100 G payout without item-only clauses", () => expect(claimScenario([item("rune")], [{ itemType: "rune", amount: 200 }])).toMatchObject({ payout: 100 }));
  it("applies the level-8 threshold before deductible to dragon sword damage of 1000 G: 400 G", () => expect(claimScenario([item("sword", { material: "dragon", enchantment: 8 })], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 }));
  it("lets the 50% level-9 clause win for dragon sword damage of 1000 G: 400 G", () => expect(claimScenario([item("sword", { material: "dragon", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 }));
  it("fully reimburses level-5 dragon sword damage of 800 G before deductible: 700 G", () => expect(claimScenario([item("sword", { material: "dragon", enchantment: 5 })], [{ itemType: "sword", amount: 800 }])).toMatchObject({ payout: 700 }));
  it("halves level-9 steel sword damage of 1000 G before deductible: 400 G", () => expect(claimScenario([item("sword", { material: "steel", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }])).toMatchObject({ payout: 400 }));
  it("applies a separate 100 G deductible to sword 500 G and amulet 300 G damage: 600 G", () => expect(claimScenario([item("sword"), item("amulet")], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }])).toMatchObject({ payout: 600 }));
  it("rounds a fractional raw payout of 350.5 G down to 350 G only at the end", () => expect(claimScenario([item("sword", { enchantment: 8 })], [{ itemType: "sword", amount: 901 }])).toMatchObject({ payout: 350 }));
  it("insures two swords for a 4000 G cap and treats their damages separately", () => expect(claimScenario([item("sword"), item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toEqual({ payout: 800, remainingCap: 3200 }));
  it("rejects the whole claim with an error when damage count exceeds insured type count", () => expect(() => claimScenario([item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }])).toThrow());
  it("bases sword-and-amulet cap on their 1600 G insurance sum: 3200 G", () => expect(claimScenario([item("sword"), item("amulet")], [])).toEqual({ payout: 0, remainingCap: 3200 }));
  it("bases cursed-sword cap on unmodified 1000 G value: 2000 G", () => expect(claimScenario([item("sword", { cursed: true })], [])).toEqual({ payout: 0, remainingCap: 2000 }));
  it("bases sword-and-3-rune cap on 1750 G value despite block pricing: 3500 G", () => expect(claimScenario([item("sword"), item("rune"), item("rune"), item("rune")], [])).toEqual({ payout: 0, remainingCap: 3500 }));
  it("pays 1400 G then 600 G for two 1500 G sword claims and leaves cap 0 G", () => {
    const result = executeScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [item("sword")] }, { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } }, { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } }] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rejects an unknown quote item with an error rather than results", () => expect(() => q([item("broomstick")])).toThrow());
  it("rejects damage to a type absent from the policy with an error", () => expect(() => claimScenario([item("sword")], [{ itemType: "amulet", amount: 200 }])).toThrow());
  it("rejects an unknown damage item type with an error", () => expect(() => claimScenario([item("sword")], [{ itemType: "broomstick", amount: 200 }])).toThrow());
  it("rejects a negative damage amount with an error", () => expect(() => claimScenario([item("sword")], [{ itemType: "sword", amount: -200 }])).toThrow());
  it("emits quote and claim results in step order with binding output field names", () => {
    const scenario: Scenario = { customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [item("amulet", { material: "silver", enchantment: 2, cursed: false })] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] };
    expect(executeScenario(scenario)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("CLI reads a scenario from stdin and writes only JSON results to stdout", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] };
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect({ status: run.status, stdout: run.stdout, stderr: run.stderr }).toEqual({ status: 0, stdout: '{"results":[{"premium":5}]}', stderr: "" });
  });
  it("CLI exits non-zero, writes an error to stderr, and writes no results for invalid input", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] };
    const run = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input: JSON.stringify(input), encoding: "utf8" });
    expect(run.status).not.toBe(0);
    expect(run.stderr).toContain("Unknown item type");
    expect(run.stdout).toBe("");
  });
});
