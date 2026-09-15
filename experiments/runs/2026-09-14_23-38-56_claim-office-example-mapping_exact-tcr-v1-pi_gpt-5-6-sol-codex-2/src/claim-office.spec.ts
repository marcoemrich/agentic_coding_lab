import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0, previousQuotes = 0): number => {
  const steps = [
    ...Array.from({ length: previousQuotes }, () => ({ op: "quote" as const, items: [] })),
    { op: "quote" as const, items },
  ];
  return processScenario({ customer: { yearsWithMHPCO }, steps }).results.at(-1)!.premium!;
};

const runCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario),
  encoding: "utf8",
});

const claim = (items: Array<Record<string, unknown>>, damages: Array<{ itemType: string; amount: number }>) =>
  processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "damage event", damages } },
    ],
  }).results[1];

describe("MHPCO Claim Office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes one plain sword at 115 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes one plain amulet at 71 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes one plain staff at 93 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes one plain potion at 49 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes two runes with a 50 G component base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly three runes with the special 60 G component-block base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes four runes with a 100 G base premium because blocks require exactly three", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes seven runes with a 175 G base premium", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes two runes and one moonstone with a 75 G base premium because unlike types do not form a block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes three runes and three moonstones with a 120 G base premium from two separate blocks", () => {
    expect(quote([
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ])).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, producing 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years, producing 95 G for a plain sword", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies high-enchantment surcharge at exactly level 5 and stacks it with curse, producing 195 G", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at level 4, producing 165 G for a cursed sword", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("rounds a fractional 197.5 G premium up to 198 G in MHPCO's favor", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "moonstone" })))).toBe(198);
  });
  it("quotes a newcomer with a cursed sword at the integration-example premium of 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G while still charging first insurance", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1)).toBe(160);
  });
  it("writes ordered JSON results for quote and claim CLI steps using the normative field names", () => {
    expect(processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
  it("rejects an unknown quote item through the CLI with non-zero status, stderr text, and no stdout results", () => {
    const execution = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/unknown/i);
    expect(execution.stdout).toBe("");
  });
  it("pays 400 G for a regular sword damaged by 500 G after one deductible", () => {
    expect(claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for a rune damaged by 200 G with no item-specific special clause", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when a dragon attack damages a sword by 500 G and amulet by 300 G, deducting per item", () => {
    expect(claim(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    )).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for a dragon sword at exactly enchantment 8 damaged by 1000 G because the 50% clause wins", () => {
    expect(claim(
      [{ type: "sword", material: "dragon", enchantment: 8 }],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for a dragon sword at enchantment 9 damaged by 1000 G because the 50% clause wins", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for a dragon sword at enchantment 5 damaged by 800 G through full reimbursement", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]))
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for a steel sword at enchantment 9 damaged by 1000 G through 50% reimbursement", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rounds a fractional 350.5 G payout down to 350 G in MHPCO's favor", () => {
    expect(claim([{ type: "sword", enchantment: 9 }], [{ itemType: "sword", amount: 901 }]))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("treats two same-type insured swords as distinct damages with distinct deductibles and a 4000 G cap", () => {
    expect(claim(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects through the CLI when same-type damage entries outnumber insured items", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 300 },
      ] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/insured|damage/i);
    expect(execution.stdout).toBe("");
  });
  it("uses unmodified item values for a cursed sword's 2000 G cap", () => {
    expect(claim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("uses per-component values despite a block premium, giving sword plus three runes a 3500 G cap", () => {
    expect(claim([{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))], []))
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits two successive 1500 G sword claims to payouts of 1400 G then 600 G with no cap remaining", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rejects through the CLI damage to an item type absent from the policy", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/insured|damage/i);
    expect(execution.stdout).toBe("");
  });
  it("rejects through the CLI a claim damage entry with an unknown item type", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/insured|damage|unknown/i);
    expect(execution.stdout).toBe("");
  });
  it("rejects through the CLI a negative damage amount", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/negative|amount|damage/i);
    expect(execution.stdout).toBe("");
  });
});
