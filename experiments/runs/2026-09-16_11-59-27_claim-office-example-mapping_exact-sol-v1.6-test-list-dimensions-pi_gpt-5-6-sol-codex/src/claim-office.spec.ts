import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { basePremium, processScenario } from "./claim-office.js";

const runCli = (scenario: Record<string, unknown>) => spawnSync(
  "pnpm",
  ["exec", "tsx", "src/cli.ts"],
  { input: JSON.stringify(scenario), encoding: "utf8" },
);

const quote = (items: Array<Record<string, unknown>>, yearsWithMHPCO = 0, priorQuotes = 0) =>
  processScenario({
    customer: { yearsWithMHPCO },
    steps: [
      ...Array.from({ length: priorQuotes }, () => ({ op: "quote" as const, items: [] })),
      { op: "quote" as const, items },
    ],
  }).results.at(-1) as { premium: number };

const claimScenario = (
  items: Array<Record<string, unknown>>,
  damages: Array<{ itemType: string; amount: number }>,
) => processScenario({
  customer: { yearsWithMHPCO: 0 },
  steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ],
}).results[1] as { payout: number; remainingCap: number };

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(quote([]).premium).toBe(5);
  });
  it("quotes one plain sword from its 100 G base premium at 115 G", () => {
    expect(quote([{ type: "sword" }]).premium).toBe(115);
  });
  it("quotes one plain amulet from its 60 G base premium at 71 G", () => {
    expect(quote([{ type: "amulet" }]).premium).toBe(71);
  });
  it("quotes one plain staff from its 80 G base premium at 93 G", () => {
    expect(quote([{ type: "staff" }]).premium).toBe(93);
  });
  it("quotes one plain potion from its 40 G base premium at 49 G", () => {
    expect(quote([{ type: "potion" }]).premium).toBe(49);
  });
  it("quotes one rune from its 25 G component base premium at 33 G", () => {
    expect(quote([{ type: "rune" }]).premium).toBe(33);
  });
  it("quotes one moonstone from its 25 G component base premium at 33 G", () => {
    expect(quote([{ type: "moonstone" }]).premium).toBe(33);
  });
  it("calculates 2 runes at 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("calculates exactly 3 runes at the 60 G block base premium", () => {
    expect(basePremium(Array.from({ length: 3 }, () => ({ type: "rune" })))).toBe(60);
  });
  it("calculates 4 runes at 100 G base premium because blocks require exactly 3", () => {
    expect(basePremium(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(100);
  });
  it("calculates 7 runes at 175 G base premium without partitioning into blocks", () => {
    expect(basePremium(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(175);
  });
  it("calculates 2 runes plus 1 moonstone at 75 G because unlike types do not form a block", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("calculates 3 runes plus 3 moonstones as two separate blocks at 120 G", () => {
    const items = [
      ...Array.from({ length: 3 }, () => ({ type: "rune" })),
      ...Array.from({ length: 3 }, () => ({ type: "moonstone" })),
    ];
    expect(basePremium(items)).toBe(120);
  });
  it("scopes a cursed surcharge to the cursed sword in a sword-and-amulet policy, yielding 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }]).premium).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years, quoting a plain sword at 95 G", () => {
    expect(quote([{ type: "sword" }], 2).premium).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, quoting a cursed sword at 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }]).premium).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4, quoting a plain sword at 115 G", () => {
    expect(quote([{ type: "sword", enchantment: 4 }]).premium).toBe(115);
  });
  it("at enchantment 4 applies only curse when cursed, quoting the sword at 165 G", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }]).premium).toBe(165);
  });
  it("quotes a newcomer first contract containing a cursed steel sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }]).premium).toBe(165);
  });
  it("quotes a long-standing customer's second contract with a new cursed enchantment-7 sword at 160 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 7, cursed: true }], 3, 1).premium).toBe(160);
  });
  it("applies the 15 percent follow-up discount to policy base while retaining first-insurance assessment, quoting a second plain sword at 100 G", () => {
    expect(quote([{ type: "sword" }], 0, 1).premium).toBe(100);
  });
  it("uses the sword's 1000 G insurance value to cap a large claim at 2000 G", () => {
    expect(claimScenario([{ type: "sword" }], [{ itemType: "sword", amount: 3000 }]))
      .toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("uses the amulet's 600 G insurance value to cap a large claim at 1200 G", () => {
    expect(claimScenario([{ type: "amulet" }], [{ itemType: "amulet", amount: 2000 }]))
      .toEqual({ payout: 1200, remainingCap: 0 });
  });
  it("uses the staff's 800 G insurance value to cap a large claim at 1600 G", () => {
    expect(claimScenario([{ type: "staff" }], [{ itemType: "staff", amount: 2000 }]))
      .toEqual({ payout: 1600, remainingCap: 0 });
  });
  it("uses the potion's 400 G insurance value to cap a large claim at 800 G", () => {
    expect(claimScenario([{ type: "potion" }], [{ itemType: "potion", amount: 1000 }]))
      .toEqual({ payout: 800, remainingCap: 0 });
  });
  it("uses a rune's 250 G insurance value to cap a large claim at 500 G", () => {
    expect(claimScenario([{ type: "rune" }], [{ itemType: "rune", amount: 1000 }]))
      .toEqual({ payout: 500, remainingCap: 0 });
  });
  it("uses a moonstone's 250 G insurance value to cap a large claim at 500 G", () => {
    expect(claimScenario([{ type: "moonstone" }], [{ itemType: "moonstone", amount: 1000 }]))
      .toEqual({ payout: 500, remainingCap: 0 });
  });
  it("pays 400 G for exactly enchantment 8 dragon sword damage of 1000 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 8 };
    expect(claimScenario([item], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("deducts 100 G once per damaged item, paying 600 G for sword 500 G plus amulet 300 G", () => {
    const result = claimScenario([{ type: "sword" }, { type: "amulet" }], [
      { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
    ]);
    expect(result.payout).toBe(600);
  });
  it("fully reimburses regular steel enchantment-3 sword damage before deductible, paying 400 G from 500 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 3 };
    expect(claimScenario([item], [{ itemType: "sword", amount: 500 }]).payout).toBe(400);
  });
  it("treats rune damage as standard reimbursement, paying 100 G from 200 G", () => {
    expect(claimScenario([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]).payout).toBe(100);
  });
  it("lets the 50 percent enchantment clause win for dragon enchantment-9 sword damage, paying 400 G from 1000 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 9 };
    expect(claimScenario([item], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("fully reimburses dragon enchantment-5 sword damage before deductible, paying 700 G from 800 G", () => {
    const item = { type: "sword", material: "dragon", enchantment: 5 };
    expect(claimScenario([item], [{ itemType: "sword", amount: 800 }]).payout).toBe(700);
  });
  it("half-reimburses steel enchantment-9 sword damage before deductible, paying 400 G from 1000 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimScenario([item], [{ itemType: "sword", amount: 1000 }]).payout).toBe(400);
  });
  it("counts two insured swords separately for a 2000 G insurance sum and 4000 G cap", () => {
    const result = claimScenario([{ type: "sword" }, { type: "sword" }], [
      { itemType: "sword", amount: 5000 },
    ]);
    expect(result).toEqual({ payout: 4000, remainingCap: 0 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles, paying 800 G from two 500 G damages", () => {
    const result = claimScenario([{ type: "sword" }, { type: "sword" }], [
      { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
    ]);
    expect(result.payout).toBe(800);
  });
  it("rejects the whole claim with non-zero CLI status and stderr when sword damages outnumber insured swords", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/insured/i);
    expect(result.stdout).toBe("");
  });
  it("caps a sword-and-amulet policy at 3200 G from its 1600 G insurance sum", () => {
    const result = claimScenario([{ type: "sword" }, { type: "amulet" }], [
      { itemType: "sword", amount: 5000 }, { itemType: "amulet", amount: 5000 },
    ]);
    expect(result).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("caps a cursed sword policy at 2000 G based on unmodified insurance value", () => {
    const result = claimScenario([{ type: "sword", cursed: true }], [
      { itemType: "sword", amount: 3000 },
    ]);
    expect(result).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("values a sword and 3-rune block at 1750 G insurance sum and 3500 G cap despite block pricing", () => {
    const items = [{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))];
    const result = claimScenario(items, [{ itemType: "sword", amount: 5000 }]);
    expect(result).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("tracks cap exhaustion across two 1500 G sword claims: payouts 1400 then 600, remaining cap 600 then 0", () => {
    const claim = { op: "claim", policy: 0, incident: {
      cause: "attack", damages: [{ itemType: "sword", amount: 1500 }],
    } };
    const results = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, claim, claim,
    ] }).results;
    expect(results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 197.5 G premium for 7 runes up to 198 G", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quote(runes).premium).toBe(198);
  });
  it("keeps payout fractions intermediate and rounds a 350.5 G payout down to 350 G", () => {
    const item = { type: "sword", material: "steel", enchantment: 9 };
    expect(claimScenario([item], [{ itemType: "sword", amount: 901 }]))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects an unknown quote item with non-zero CLI status, stderr description, and no stdout results", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toMatch(/unknown/i);
    expect(result.stdout).toBe("");
  });
  it("rejects an amulet damage not covered by a sword-only policy with non-zero CLI status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "amulet", amount: 200 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damage item type with non-zero CLI status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "broomstick", amount: 200 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("rejects negative damage amount -200 with non-zero CLI status and stderr", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "sword", amount: -200 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stderr).not.toBe("");
    expect(result.stdout).toBe("");
  });
  it("processes the normative sequential quote/claim schema and emits ordered results: premium 59, payout 100, remainingCap 1100", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [
        { itemType: "amulet", amount: 200 },
      ] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
