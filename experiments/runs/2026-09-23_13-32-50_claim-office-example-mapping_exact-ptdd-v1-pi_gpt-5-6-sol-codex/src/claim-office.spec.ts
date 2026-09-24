import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { executeScenario } from "./claim-office.js";

type TestItem = { type: string; material?: string; enchantment?: number; cursed?: boolean };

const quote = (items: TestItem[], yearsWithMHPCO = 0) =>
  executeScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });

const policyWithNoDamage = (items: TestItem[]) =>
  executeScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ],
  });

const runCli = (scenario: unknown) => spawnSync(
  "./claim-office",
  [],
  { input: JSON.stringify(scenario), encoding: "utf8" },
);

const claimOne = (item: TestItem, amount: number) =>
  executeScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items: [item] },
      {
        op: "claim",
        policy: 0,
        incident: { cause: "damage", damages: [{ itemType: item.type, amount }] },
      },
    ],
  }).results[1];

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([])).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes one plain sword at 115 G and gives its policy a 2000 G cap", () => {
    expect(policyWithNoDamage([{ type: "sword" }])).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("quotes one plain amulet at 71 G and gives its policy a 1200 G cap", () => {
    expect(policyWithNoDamage([{ type: "amulet" }])).toEqual({
      results: [{ premium: 71 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("quotes one plain staff at 93 G and gives its policy a 1600 G cap", () => {
    expect(policyWithNoDamage([{ type: "staff" }])).toEqual({
      results: [{ premium: 93 }, { payout: 0, remainingCap: 1600 }],
    });
  });
  it("quotes one plain potion at 49 G and gives its policy an 800 G cap", () => {
    expect(policyWithNoDamage([{ type: "potion" }])).toEqual({
      results: [{ premium: 49 }, { payout: 0, remainingCap: 800 }],
    });
  });
  it("quotes one rune at 33 G and gives its policy a 500 G cap", () => {
    expect(policyWithNoDamage([{ type: "rune" }])).toEqual({
      results: [{ premium: 33 }, { payout: 0, remainingCap: 500 }],
    });
  });
  it("quotes one moonstone at 33 G and gives its policy a 500 G cap", () => {
    expect(policyWithNoDamage([{ type: "moonstone" }])).toEqual({
      results: [{ premium: 33 }, { payout: 0, remainingCap: 500 }],
    });
  });
  it("quotes 2 runes from their 50 G base premium at 60 G total", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes exactly 3 runes using the 60 G block base premium at 71 G total", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toEqual({
      results: [{ premium: 71 }],
    });
  });
  it("quotes 4 runes without a block from their 100 G base premium at 115 G total", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({
      results: [{ premium: 115 }],
    });
  });
  it("quotes 7 runes without blocks at 198 G, rounding 197.5 G up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({
      results: [{ premium: 198 }],
    });
  });
  it("does not combine 2 runes and 1 moonstone into a block, quoting 88 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({
      results: [{ premium: 88 }],
    });
  });
  it("applies separate blocks to 3 runes and 3 moonstones, quoting 137 G", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(quote(items)).toEqual({ results: [{ premium: 137 }] });
  });
  it("scopes a cursed surcharge to the cursed sword in a sword-and-amulet policy, quoting 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toEqual({
      results: [{ premium: 231 }],
    });
  });
  it("applies the loyalty discount at exactly 2 years, quoting a plain sword at 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, quoting 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toEqual({
      results: [{ premium: 195 }],
    });
  });
  it("does not apply high-enchantment surcharge at enchantment 4 but applies curse, quoting 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toEqual({
      results: [{ premium: 165 }],
    });
  });
  it("quotes a newcomer's first cursed steel sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({
      results: [{ premium: 165 }],
    });
  });
  it("quotes a long-standing customer's cursed enchantment-7 sword on their second contract at 160 G", () => {
    const actual = executeScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(actual).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 8, then leaves 1600 G cap", () => {
    const actual = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(actual.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one 100 G deductible per damaged item, paying 600 G for 500 G sword and 300 G amulet damage", () => {
    const actual = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });
    expect(actual.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("fully reimburses a regular steel enchantment-3 sword before deductible, paying 400 G on 500 G damage", () => {
    expect(claimOne({ type: "sword", material: "steel", enchantment: 3 }, 500)).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("fully reimburses a rune before deductible, paying 100 G on 200 G damage", () => {
    expect(claimOne({ type: "rune" }, 200)).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent clause win for a dragon enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    expect(claimOne({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("fully reimburses a dragon enchantment-5 sword, paying 700 G on 800 G damage", () => {
    expect(claimOne({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toEqual({
      payout: 700,
      remainingCap: 1300,
    });
  });
  it("half reimburses a steel enchantment-9 sword, paying 400 G on 1000 G damage", () => {
    expect(claimOne({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toEqual({
      payout: 400,
      remainingCap: 1600,
    });
  });
  it("gives a two-sword policy a 4000 G cap", () => {
    expect(policyWithNoDamage([{ type: "sword" }, { type: "sword" }]).results[1]).toEqual({
      payout: 0,
      remainingCap: 4000,
    });
  });
  it("treats two sword damage entries as separate events with separate deductibles, paying 800 G total", () => {
    const actual = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(actual.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim at the CLI with stderr and no stdout when sword damages outnumber insured swords", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured/i);
    expect(result.stdout).toBe("");
  });
  it("bases a sword-and-amulet policy cap on their 1600 G insurance sum, yielding 3200 G", () => {
    expect(policyWithNoDamage([{ type: "sword" }, { type: "amulet" }]).results[1]).toEqual({
      payout: 0,
      remainingCap: 3200,
    });
  });
  it("keeps a cursed sword's cap at 2000 G despite its 165 G modified premium", () => {
    expect(policyWithNoDamage([{ type: "sword", cursed: true }])).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("values a sword and 3-rune block at 1750 G for a 3500 G cap despite the block premium", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    expect(policyWithNoDamage(items).results[1]).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("exhausts a sword policy cap across successive 1500 G claims with payouts 1400 G then 600 G", () => {
    const incident = { cause: "battle", damages: [{ itemType: "sword", amount: 1500 }] };
    const actual = executeScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident },
        { op: "claim", policy: 0, incident },
      ],
    });
    expect(actual.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 350.5 G raw payout down to 350 G only at the final result", () => {
    expect(claimOne({ type: "sword", enchantment: 8 }, 901)).toEqual({
      payout: 350,
      remainingCap: 1650,
    });
  });
  it("rejects an unknown quote item at the CLI with non-zero status, stderr, and no stdout results", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown|unsupported/i);
    expect(result.stdout).toBe("");
  });
  it("rejects at the CLI a claim for a known item type absent from the policy, with stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured/i);
    expect(result.stdout).toBe("");
  });
  it("rejects at the CLI a claim for an unknown item type, with stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr.length).toBeGreaterThan(0);
    expect(result.stdout).toBe("");
  });
  it("rejects at the CLI a negative damage amount, with stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/negative|amount/i);
    expect(result.stdout).toBe("");
  });
  it("processes quote then claim sequentially using binding schema names and ordered result objects", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
