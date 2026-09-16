import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

const quote = (items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0): number =>
  runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0].premium;

const runCli = (scenario: unknown) =>
  spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(scenario),
    encoding: "utf8",
  });

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a sword from its independently assigned 100 G base premium", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes an amulet from its independently assigned 60 G base premium", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a staff from its independently assigned 80 G base premium", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes a potion from its independently assigned 40 G base premium", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes a rune from its independently assigned 25 G component premium", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });
  it("quotes a moonstone from its independently assigned 25 G component premium", () => {
    expect(quote([{ type: "moonstone" }])).toBe(33);
  });
  it("prices 2 runes at 50 G, 3 at the exact block price 60 G, 4 at 100 G, and 7 at 175 G before modifiers", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    expect([2, 3, 4, 7].map((count) => quote(runes(count)))).toEqual([60, 71, 115, 198]);
  });
  it("keeps rune and moonstone blocks type-specific: mixed 2+1 is 75 G and 3+3 is 120 G before modifiers", () => {
    const components = (runes: number, moonstones: number) => [
      ...Array.from({ length: runes }, () => ({ type: "rune" })),
      ...Array.from({ length: moonstones }, () => ({ type: "moonstone" })),
    ];
    expect(quote(components(2, 1))).toBe(88);
    expect(quote(components(3, 3))).toBe(137);
  });
  it("applies a curse surcharge only to the cursed sword in a sword-and-amulet policy: 210 G before policy modifiers and fee", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5", () => {
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
  });
  it("quotes a newcomer’s cursed sword at 165 G including first-insurance surcharge and fee", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer’s cursed enchantment-7 sword on their second contract at 160 G", () => {
    const scenario = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(scenario.results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G premium for 7 runes up to 198 G only at the end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("rejects an unknown quoted broomstick through the CLI with non-zero status, stderr, and no stdout results", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
  it("pays 400 G for ordinary 500 G sword damage after one deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage with no item-special clauses", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "crack", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for dragon sword enchantment 8 damage of 1000 G because the half rule wins before deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon sword enchantment 9 damage of 1000 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1].payout).toBe(400);
  });
  it("pays 700 G for dragon sword enchantment 5 damage of 800 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 800 }] } },
    ] });
    expect(result.results[1].payout).toBe(700);
  });
  it("pays 400 G for steel sword enchantment 9 damage of 1000 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "impact", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1].payout).toBe(400);
  });
  it("applies a separate 100 G deductible to sword 500 G and amulet 300 G damage, paying 600 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for 2000 G with a 4000 G cap and treats two sword damages separately", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects through the CLI two sword damages when only one sword is insured", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
  it("sets sword-and-amulet cap from the 1600 G insurance sum to 3200 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword cap at 2000 G despite its 165 G premium", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results).toEqual([{ premium: 165 }, { payout: 0, remainingCap: 2000 }]);
  });
  it("sets sword-and-3-runes cap from the undiscounted 1750 G insurance sum to 3500 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1].remainingCap).toBe(3500);
  });
  it("tracks cap across two 1500 G sword claims: payouts 1400 then 600, leaving zero", () => {
    const damage = { itemType: "sword", amount: 1500 };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "first", damages: [damage] } },
      { op: "claim", policy: 0, incident: { cause: "second", damages: [damage] } },
    ] });
    expect(result.results.slice(1)).toEqual([{ payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }]);
  });
  it("rounds a 350.5 G payout down to 350 G only at the end", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1].payout).toBe(350);
  });
  it("rejects through the CLI damage to an unowned amulet or an unknown item type with non-zero status and stderr", () => {
    for (const itemType of ["amulet", "broomstick"]) {
      const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount: 200 }] } },
      ] });
      expect(execution.status).not.toBe(0);
      expect(execution.stderr.length).toBeGreaterThan(0);
      expect(execution.stdout).toBe("");
    }
  });
  it("rejects through the CLI a negative damage amount with non-zero status and stderr", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr.length).toBeGreaterThan(0);
    expect(execution.stdout).toBe("");
  });
  it("applies high-enchantment surcharge only to an enchanted sword, not a plain amulet", () => {
    expect(quote([{ type: "sword", enchantment: 5 }, { type: "amulet", enchantment: 2 }])).toBe(211);
  });
  it("applies loyalty discount to the full sword-and-amulet policy base", () => {
    expect(quote([{ type: "sword" }, { type: "amulet" }], 2)).toBe(149);
  });
  it("sets a staff policy cap from its independently assigned 800 G insurance value", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "staff" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1].remainingCap).toBe(1600);
  });
  it("sets a potion policy cap from its independently assigned 400 G insurance value", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "potion" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1].remainingCap).toBe(800);
  });
  it("sets a moonstone policy cap from its independently assigned 250 G insurance value", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "moonstone" }] },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] });
    expect(result.results[1].remainingCap).toBe(500);
  });
  it("reads the normative quote-then-claim schema from stdin and writes ordered JSON results to stdout", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(execution.status).toBe(0);
    expect(execution.stderr).toBe("");
    expect(JSON.parse(execution.stdout)).toEqual({ results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }] });
  });
});
