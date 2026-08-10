import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const quote = (items: unknown[], yearsWithMHPCO = 0, previousQuotes = 0) => runScenario({
  customer: { yearsWithMHPCO },
  steps: [
    ...Array.from({ length: previousQuotes }, () => ({ op: "quote", items: [] })),
    { op: "quote", items },
  ],
}).results.at(-1);

const item = (type: string, extras: Record<string, unknown> = {}) => ({ type, ...extras });

const claimScenario = (items: unknown[], damages: unknown[], extraClaims: unknown[] = []) => runScenario({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items },
    ...extraClaims,
    { op: "claim", policy: 0, incident: { cause: "incident", damages } },
  ],
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at the 5 G processing fee", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("uses the price list for sword 100 G, amulet 60 G, staff 80 G, and potion 40 G base premiums", () => {
    expect(quote([item("sword"), item("amulet"), item("staff"), item("potion")])).toEqual({ premium: 313 });
  });
  it("prices ordinary components at 25 G each: 2 runes cost 50 G and 7 runes cost 175 G before fee", () => {
    expect(quote([item("rune"), item("rune")])).toEqual({ premium: 60 });
    expect(quote(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("uses a 60 G block only for exactly 3 alike components, while 4 runes cost 100 G before fee", () => {
    expect(quote(Array.from({ length: 3 }, () => item("rune")))).toEqual({ premium: 71 });
    expect(quote(Array.from({ length: 4 }, () => item("rune")))).toEqual({ premium: 115 });
    expect(quote(Array.from({ length: 3 }, () => item("sword")))).toEqual({ premium: 335 });
  });
  it("groups components by exact type: 2 runes plus moonstone cost 75 G, while 3 of each cost 120 G before fee", () => {
    expect(quote([item("rune"), item("rune"), item("moonstone")])).toEqual({ premium: 88 });
    expect(quote([...Array.from({ length: 3 }, () => item("rune")), ...Array.from({ length: 3 }, () => item("moonstone"))])).toEqual({ premium: 137 });
  });
  it("adds curse surcharge only to affected item: cursed sword plus plain amulet costs 215 G with fee", () => {
    expect(quote([item("sword", { cursed: true }), item("amulet")])).toEqual({ premium: 231 });
  });
  it("adds 30% high-enchantment surcharge at level 5 but not level 4", () => {
    expect(quote([item("sword", { enchantment: 5 })])).toEqual({ premium: 145 });
    expect(quote([item("sword", { enchantment: 4 })])).toEqual({ premium: 115 });
  });
  it("stacks curse and high-enchantment item surcharges at the threshold", () => {
    expect(quote([item("sword", { cursed: true, enchantment: 5 })])).toEqual({ premium: 195 });
  });
  it("applies 20% loyalty discount at exactly 2 years to policy base premium", () => {
    expect(quote([item("sword")], 2)).toEqual({ premium: 95 });
  });
  it("applies 10% first-insurance surcharge to every quoted item", () => {
    expect(quote([item("sword"), item("amulet")])).toEqual({ premium: 181 });
  });
  it("applies 15% follow-up contract discount after the first quote", () => {
    expect(quote([item("sword")], 0, 1)).toEqual({ premium: 100 });
  });
  it("rounds a 197.5 G premium up to 198 G only after all modifiers and fee", () => {
    expect(quote(Array.from({ length: 7 }, () => item("rune")))).toEqual({ premium: 198 });
  });
  it("integrates newcomer cursed sword modifiers into a 165 G premium", () => {
    expect(quote([item("sword", { cursed: true, material: "steel", enchantment: 3 })])).toEqual({ premium: 165 });
  });
  it("integrates a long-standing customer's second cursed enchanted sword quote into 160 G", () => {
    expect(quote([item("sword", { cursed: true, enchantment: 7 })], 3, 1)).toEqual({ premium: 160 });
  });
  it("reimburses regular sword damage 500 G as 400 G after one deductible", () => {
    expect(claimScenario([item("sword", { material: "steel", enchantment: 3 })], [{ itemType: "sword", amount: 500 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("reimburses rune damage 200 G as 100 G without item clauses", () => {
    expect(claimScenario([item("rune")], [{ itemType: "rune", amount: 200 }]).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("halves reimbursement at enchantment 8 before deductible: dragon sword damage 1000 G pays 400 G", () => {
    expect(claimScenario([item("sword", { material: "dragon", enchantment: 8 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below enchantment 8: damage 800 G pays 700 G", () => {
    expect(claimScenario([item("sword", { material: "dragon", enchantment: 5 })], [{ itemType: "sword", amount: 800 }]).results[1]).toMatchObject({ payout: 700 });
  });
  it("lets enchantment 9 half-payment win over dragon material: damage 1000 G pays 400 G", () => {
    expect(claimScenario([item("sword", { material: "dragon", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toMatchObject({ payout: 400 });
  });
  it("halves a steel enchantment 9 sword claim: damage 1000 G pays 400 G", () => {
    expect(claimScenario([item("sword", { material: "steel", enchantment: 9 })], [{ itemType: "sword", amount: 1000 }]).results[1]).toMatchObject({ payout: 400 });
  });
  it("applies a separate 100 G deductible to sword 500 G and amulet 300 G damages for 600 G total", () => {
    expect(claimScenario([item("sword"), item("amulet")], [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]).results[1]).toMatchObject({ payout: 600 });
  });
  it("supports duplicate insured types with separate damages and deductibles", () => {
    expect(claimScenario([item("sword"), item("sword")], [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers", () => {
    expect(() => claimScenario([item("sword")], [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }])).toThrow(/not covered/i);
  });
  it("calculates cap from unmodified item values, including components and duplicate items", () => {
    const result = claimScenario([item("sword", { cursed: true }), item("rune"), item("rune"), item("rune")], []).results[1];
    expect(result).toEqual({ payout: 0, remainingCap: 3500 });
    expect(claimScenario([item("sword"), item("sword")], []).results[1]).toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 G then 600 G with zero remaining", () => {
    const scenario = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [item("sword")] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(scenario.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a fractional payout down in MHPCO's favor", () => {
    expect(claimScenario([item("sword", { enchantment: 8 })], [{ itemType: "sword", amount: 901 }]).results[1]).toMatchObject({ payout: 350 });
  });
  it("rejects unknown item types in quotes", () => {
    expect(() => quote([item("broomstick")])).toThrow(/unknown item type/i);
  });
  it("rejects claim damage for an unknown or uninsured item type", () => {
    expect(() => claimScenario([item("sword")], [{ itemType: "amulet", amount: 200 }])).toThrow(/not covered/i);
    expect(() => claimScenario([item("sword")], [{ itemType: "broomstick", amount: 200 }])).toThrow(/not covered/i);
  });
  it("rejects negative damage amounts", () => {
    expect(() => claimScenario([item("sword")], [{ itemType: "sword", amount: -200 }])).toThrow(/negative damage/i);
  });
  it("rejects a claim policy reference that is not an earlier quote", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "claim", policy: 0, incident: { cause: "x", damages: [] } }] })).toThrow(/earlier quote/i);
  });
  it("exposes a CLI that reads JSON stdin and writes only normative JSON stdout", () => {
    const execution = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
      input: JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }),
      encoding: "utf8",
    });
    expect(execution.status).toBe(0);
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 5 }] });
    expect(execution.stderr).toBe("");
  });
});
