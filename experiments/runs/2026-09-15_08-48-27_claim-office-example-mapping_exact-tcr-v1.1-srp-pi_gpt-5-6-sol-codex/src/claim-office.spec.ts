import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const quote = (items: object[], yearsWithMHPCO = 0, earlierSteps: object[] = []) =>
  processScenario({
    customer: { yearsWithMHPCO },
    steps: [...earlierSteps, { op: "quote", items }],
  }).results.at(-1);

const runCli = (scenario: object) => spawnSync("./claim-office", [], {
  input: JSON.stringify(scenario),
  encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes one plain sword from its 100 G base premium at 115 G", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes one plain amulet from its 60 G base premium at 71 G", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes one plain staff from its 80 G base premium at 93 G", () => {
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes one plain potion from its 40 G base premium at 49 G", () => {
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes 2 runes from a 50 G base premium at 60 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes using the 60 G block base premium at 71 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({ premium: 71 });
  });
  it("quotes 4 runes without a block from a 100 G base premium at 115 G", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes 7 runes without a block at 198 G, rounding 197.5 G up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("does not combine 2 runes and 1 moonstone into an alike block; base 75 G gives premium 88 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("prices 3 runes and 3 moonstones as two separate blocks; base 120 G gives premium 137 G", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items)).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword beside a plain amulet; 210 G before policy modifiers and 231 G final", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({ premium: 231 });
  });
  it("applies the loyalty discount at exactly 2 years; a plain sword costs 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5; sword costs 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment surcharge at enchantment 4; cursed sword costs 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
  });
  it("quotes a newcomer their first cursed steel sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second contract for a new cursed enchantment-7 sword at 160 G", () => {
    const firstQuote = { op: "quote", items: [] };
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, [firstQuote])).toEqual({ premium: 160 });
  });
  it("reimburses an enchantment-8 dragon sword damaged by 1000 G at 400 G, leaving 1600 G cap", () => {
    const scenario = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(scenario.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible to each of sword and amulet damages; pays 600 G and leaves 2600 G cap", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("reimburses regular steel enchantment-3 sword damage of 500 G at 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } }] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage of 200 G at 100 G without item special clauses", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } }] });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50% clause win for an enchantment-9 dragon sword damaged by 1000 G; payout 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses an enchantment-5 dragon sword damaged by 800 G before deductible; payout 700 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } }] });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("halves enchantment-9 steel sword damage of 1000 G before deductible; payout 400 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } }] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives a two-sword policy an insurance sum of 2000 G and remaining cap of 4000 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two insured sword damage entries separately with their own deductibles; two 500 G damages pay 800 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole CLI claim with non-zero status when two sword damages exceed one insured sword, writing stderr and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/damage|insured|policy/i);
    expect(result.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "amulet" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword cap on unmodified insurance value, leaving 2000 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("bases a sword-and-3-rune block cap on 1750 G insurance sum, leaving 3500 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }, { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } }] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap over successive 1500 G claims: payouts 1400 then 600, remaining cap 600 then 0", () => {
    const claim = { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } };
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, claim, claim] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword", enchantment: 8 }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } }] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item in the CLI with non-zero status, an error on stderr, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|broomstick/i);
    expect(result.stdout).toBe("");
  });
  it("rejects a CLI claim for a known item type absent from the policy with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/amulet|insured|policy/i);
  });
  it("rejects a CLI claim for an unknown damaged item type with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/broomstick|insured|policy/i);
  });
  it("rejects a CLI claim with negative damage with non-zero status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "sword" }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } }] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|amount|damage/i);
  });
  it("reads sequential quote and claim JSON from stdin and writes ordered premium, payout, and remainingCap results to stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }, { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } }] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
