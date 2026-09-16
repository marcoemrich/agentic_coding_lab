import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function quote(items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0): number {
  const output = processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  const result = output.results[0];
  if (!("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
}

function claim(
  items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>,
  damages: Array<{ itemType: string; amount: number }>,
): { payout: number; remainingCap: number } {
  const output = processScenario({
    customer: { yearsWithMHPCO: 0 },
    steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "incident", damages } },
    ],
  });
  const result = output.results[1];
  if (!("payout" in result)) throw new Error("Expected claim result");
  return result;
}

function runCli(input: unknown) {
  return spawnSync("./node_modules/.bin/tsx", ["src/cli.ts"], {
    input: JSON.stringify(input),
    encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G, the processing fee only", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword from its 100 G base premium at 115 G", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes a plain amulet from its 60 G base premium at 71 G", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a plain staff from its 80 G base premium at 93 G", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes a plain potion from its 40 G base premium at 49 G", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes one rune from its 25 G base premium and 250 G insurance value at 33 G", () => {
    expect(quote([{ type: "rune" }])).toBe(33);
  });
  it("quotes 2 runes with a 50 G base premium at 60 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes with the 60 G block base premium at 71 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes without a block with a 100 G base premium at 115 G", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes without a block at 198 G, rounding 197.5 G up", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes and 1 moonstone without a mixed-type block at 88 G", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones as two separate blocks at 137 G", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy, producing 231 G", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years, producing a 95 G sword quote", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment 5, producing 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4, producing 165 G for a cursed sword", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes the newcomer cursed-sword integration example at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }], 0)).toBe(165);
  });
  it("quotes a long-standing customer's cursed enchantment-7 sword on their second contract at 160 G", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("claims 400 G for a dragon-material enchantment-8 sword damaged by 1000 G, leaving 1600 G cap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("applies one deductible per damaged item in a 500 G sword and 300 G amulet incident, paying 600 G", () => {
    expect(claim(
      [{ type: "sword" }, { type: "amulet" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }],
    )).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("claims 400 G for 500 G damage to a regular steel enchantment-3 sword", () => {
    expect(claim(
      [{ type: "sword", material: "steel", enchantment: 3 }],
      [{ itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claims 100 G for 200 G damage to a rune with no material or enchantment", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("lets the 50 percent clause win for a dragon-material enchantment-9 sword, paying 400 G", () => {
    expect(claim(
      [{ type: "sword", material: "dragon", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("fully reimburses dragon-material enchantment-5 damage before deductible, paying 700 G", () => {
    expect(claim(
      [{ type: "sword", material: "dragon", enchantment: 5 }],
      [{ itemType: "sword", amount: 800 }],
    )).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("half reimburses steel enchantment-9 damage before deductible, paying 400 G", () => {
    expect(claim(
      [{ type: "sword", material: "steel", enchantment: 9 }],
      [{ itemType: "sword", amount: 1000 }],
    )).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("gives a two-sword policy a 4000 G cap", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], []))
      .toEqual({ payout: 0, remainingCap: 4000 });
  });
  it("treats two sword damage entries as separate damages with separate deductibles, paying 800 G", () => {
    expect(claim(
      [{ type: "sword" }, { type: "sword" }],
      [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
    )).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with non-zero CLI status and stderr when sword damages outnumber insured swords", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [
          { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage item is not insured: sword");
    expect(result.stdout).toBe("");
  });
  it("gives a sword-and-amulet policy a 3200 G cap from its 1600 G insurance sum", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], []))
      .toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("keeps a cursed sword's cap at 2000 G based on unmodified insurance value", () => {
    expect(claim([{ type: "sword", cursed: true }], []))
      .toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("gives a sword-and-3-rune policy a 3500 G cap despite the premium block discount", () => {
    expect(claim([
      { type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
    ], [])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("caps successive 1500 G sword claims at payouts 1400 G then 600 G, exhausting the cap", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "first", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "second", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a 350.5 G raw payout down to 350 G", () => {
    expect(claim(
      [{ type: "sword", enchantment: 8 }],
      [{ itemType: "sword", amount: 901 }],
    )).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("runs the CLI sequentially and writes quote then claim results in schema order", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("rejects an unknown quoted item with non-zero CLI status, stderr, and no stdout results", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Unknown item type: broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects damage to an uninsured item with non-zero CLI status and stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage item is not insured: amulet");
    expect(result.stdout).toBe("");
  });
  it("rejects an unknown damaged item type with non-zero CLI status and stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "wind", damages: [{ itemType: "broomstick", amount: 200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage item is not insured: broomstick");
    expect(result.stdout).toBe("");
  });
  it("rejects negative damage with non-zero CLI status and stderr", () => {
    const result = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "report", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    });
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain("Damage amount must not be negative: -200");
    expect(result.stdout).toBe("");
  });
});
