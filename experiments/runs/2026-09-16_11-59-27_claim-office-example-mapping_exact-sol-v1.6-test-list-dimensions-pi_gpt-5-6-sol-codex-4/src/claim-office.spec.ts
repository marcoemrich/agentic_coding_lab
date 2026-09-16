import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";
import { runCli } from "./cli-adapter.js";

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0, priorQuotes = 0) => {
  const steps = [
    ...Array.from({ length: priorQuotes }, () => ({ op: "quote", items: [] })),
    { op: "quote", items },
  ];
  return processScenario({ customer: { yearsWithMHPCO }, steps }).results.at(-1);
};

const policyScenario = (
  items: Array<Record<string, unknown>>,
  damageLists: Array<Array<{ itemType: string; amount: number }>>,
) => processScenario({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items },
    ...damageLists.map((damages) => ({
      op: "claim",
      policy: 0,
      incident: { cause: "incident", damages },
    })),
  ],
}).results;

describe("MHPCO claim office CLI", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("quotes one plain sword from its 100 G base premium at 115 G including assessment and fee", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
  });
  it("quotes one plain amulet from its independent 60 G price-list entry at 71 G", () => {
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
  });
  it("quotes one plain staff from its independent 80 G price-list entry at 93 G", () => {
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
  });
  it("quotes one plain potion from its independent 40 G price-list entry at 49 G", () => {
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
  });
  it("quotes one rune from its 25 G component premium at 33 G", () => {
    expect(quote([{ type: "rune" }])).toEqual({ premium: 33 });
  });
  it("quotes one moonstone from its independent 25 G component entry at 33 G", () => {
    expect(quote([{ type: "moonstone" }])).toEqual({ premium: 33 });
  });
  it("quotes 2 runes with 50 G base premium at 60 G total", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ premium: 60 });
  });
  it("quotes exactly 3 runes as one 60 G block at 71 G total", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ premium: 71 });
  });
  it("quotes 4 runes without a block at 115 G total", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
  });
  it("quotes 7 runes without partial blocks at 198 G, rounding 197.5 G up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("quotes 2 runes and 1 moonstone without an alike block: 75 G base, 88 G total", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
  });
  it("quotes 3 runes and 3 moonstones as two separate blocks: 120 G base, 137 G total", () => {
    expect(quote([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toEqual({ premium: 137 });
  });
  it("scopes a cursed sword surcharge to that item beside a plain amulet: 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({ premium: 231 });
  });
  it("applies loyalty at exactly 2 years: a plain sword costs 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5: 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({ premium: 195 });
  });
  it("does not apply high-enchantment at level 4, but applies curse: 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({ premium: 165 });
  });
  it("rejects an unknown quote item via non-zero CLI status, stderr, and no stdout results", () => {
    const result = runCli(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    }));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's cursed level-7 sword on their second contract at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1)).toEqual({ premium: 160 });
  });

  it("claims 400 G for a regular sword damaged by 500 G and leaves 1600 G cap", () => {
    expect(policyScenario(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [[{ itemType: "sword", amount: 500 }]],
    ).at(-1)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims 100 G for a rune damaged by 200 G and leaves 400 G cap", () => {
    expect(policyScenario([{ type: "rune" }], [[{ itemType: "rune", amount: 200 }]]).at(-1))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("applies one deductible to each damaged sword and amulet: payout 600 G, cap 2600 G", () => {
    expect(policyScenario(
      [{ type: "sword" }, { type: "amulet" }],
      [[{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }]],
    ).at(-1)).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("at enchantment 8, the 50% clause wins over dragon material: 1000 G damage pays 400 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [[{ itemType: "sword", amount: 1000 }]],
    ).at(-1)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("at enchantment 9, the 50% clause wins over dragon material: 1000 G damage pays 400 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [[{ itemType: "sword", amount: 1000 }]],
    ).at(-1)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon material below level 8: 800 G damage pays 700 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [[{ itemType: "sword", amount: 800 }]],
    ).at(-1)).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("reimburses a steel level-9 sword at 50%: 1000 G damage pays 400 G", () => {
    expect(policyScenario(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [[{ itemType: "sword", amount: 1000 }]],
    ).at(-1)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a fractional payout down: level-9 damage of 901 G pays 350 G", () => {
    expect(policyScenario(
      [{ type: "sword", enchantment: 9 }],
      [[{ itemType: "sword", amount: 901 }]],
    ).at(-1)).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("gives two insured swords a 4000 G cap and separate damage slots", () => {
    expect(policyScenario(
      [{ type: "sword" }, { type: "sword" }],
      [[{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }]],
    ).at(-1)).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more damage entries of a type than the policy covers via non-zero status and stderr", () => {
    const result = runCli(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    }));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("bases sword-and-amulet cap on their 1600 G insurance sum: 3200 G remaining", () => {
    expect(policyScenario([{ type: "sword" }, { type: "amulet" }], [[]]).at(-1))
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("bases a cursed sword cap on unmodified 1000 G value: 2000 G remaining", () => {
    expect(policyScenario([{ type: "sword", cursed: true }], [[]]).at(-1))
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("bases sword-and-3-rune cap on 1750 G value despite block premium: 3500 G remaining", () => {
    expect(policyScenario([
      { type: "sword" },
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
    ], [[]]).at(-1)).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("tracks cap exhaustion across claims: payouts 1400 G then 600 G, ending at zero", () => {
    expect(policyScenario(
      [{ type: "sword" }],
      [[{ itemType: "sword", amount: 1500 }], [{ itemType: "sword", amount: 1500 }]],
    ).slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects damage to a known item type absent from the policy via non-zero status and stderr", () => {
    const result = runCli(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    }));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects damage with an unknown item type via non-zero status and stderr", () => {
    const result = runCli(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    }));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("bases a staff cap on its independent 800 G insurance value: 1600 G remaining", () => {
    expect(policyScenario([{ type: "staff" }], [[]]).at(-1))
      .toEqual({ payout: 0, remainingCap: 1600 });
  });
  it("bases a potion cap on its independent 400 G insurance value: 800 G remaining", () => {
    expect(policyScenario([{ type: "potion" }], [[]]).at(-1))
      .toEqual({ payout: 0, remainingCap: 800 });
  });

  it("rejects a negative damage amount via non-zero status and stderr", () => {
    const result = runCli(JSON.stringify({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    }));
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
});
