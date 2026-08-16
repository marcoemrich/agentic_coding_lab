import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function quote(items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0): number {
  const output = processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] });
  const result = output.results[0]!;
  if (!("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
}

function claim(items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, damages: Array<{ itemType: string; amount: number }>) {
  const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items },
    { op: "claim", policy: 0, incident: { cause: "test", damages } },
  ] });
  return output.results[1];
}

function runCli(input: unknown) {
  return spawnSync(process.execPath, ["--import", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a sword from its 100 G base premium", () => {
    expect(quote([{ type: "sword" }])).toBe(115);
  });
  it("quotes an amulet from its 60 G base premium", () => {
    expect(quote([{ type: "amulet" }])).toBe(71);
  });
  it("quotes a staff from its 80 G base premium", () => {
    expect(quote([{ type: "staff" }])).toBe(93);
  });
  it("quotes a potion from its 40 G base premium", () => {
    expect(quote([{ type: "potion" }])).toBe(49);
  });
  it("quotes 2 runes at 50 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes at the 60 G block premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes at 100 G because blocks require exactly 3", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes at 175 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes and 1 moonstone at 75 G because alike means exact type", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes and 3 moonstones as two 60 G blocks", () => {
    const items = [...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))];
    expect(quote(items)).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies loyalty at exactly 2 years", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharge at exactly enchantment 5", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment surcharge at enchantment 4", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("pays 400 G for 500 G standard sword damage", () => {
    const output = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 100 G for 200 G rune damage", () => {
    expect(claim([{ type: "rune" }], [{ itemType: "rune", amount: 200 }]))
      .toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when sword and amulet damages each receive a deductible", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [
      { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for dragon material at exactly enchantment 8 and 1000 G damage", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 8 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 400 G for dragon material at enchantment 9 and 1000 G damage", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 700 G for dragon material at enchantment 5 and 800 G damage", () => {
    expect(claim([{ type: "sword", material: "dragon", enchantment: 5 }], [{ itemType: "sword", amount: 800 }]))
      .toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("pays 400 G for steel at enchantment 9 and 1000 G damage", () => {
    expect(claim([{ type: "sword", material: "steel", enchantment: 9 }], [{ itemType: "sword", amount: 1000 }]))
      .toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("insures and damages two swords separately with insurance sum 2000 G and cap 4000 G", () => {
    expect(claim([{ type: "sword" }, { type: "sword" }], [
      { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
    ])).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects with Error when sword damage entries outnumber insured swords", () => {
    expect(() => claim([{ type: "sword" }], [
      { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
    ])).toThrow(Error);
  });
  it("CLI rejects excess same-type damage entries with no stdout", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "test", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Damaged item is not insured: sword");
  });

  it("sets sword-and-amulet cap to 3200 G", () => {
    expect(claim([{ type: "sword" }, { type: "amulet" }], [])).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("sets a cursed sword cap to 2000 G independent of premium modifiers", () => {
    expect(claim([{ type: "sword", cursed: true }], [])).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sets sword-and-3-runes insurance sum to 1750 G and cap to 3500 G", () => {
    expect(claim([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }], []))
      .toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("limits successive 1500 G sword claims to payouts 1400 G then 600 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "one", damages: [{ itemType: "sword", amount: 1500 }] } },
      { op: "claim", policy: 0, incident: { cause: "two", damages: [{ itemType: "sword", amount: 1500 }] } },
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional premium of 197.5 G up to 198 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("rounds a fractional payout of 350.5 G down to 350 G", () => {
    expect(claim([{ type: "sword", enchantment: 8 }], [{ itemType: "sword", amount: 901 }]))
      .toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("CLI rejects a quote with unknown item type broomstick via stderr only", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Unknown item type: broomstick");
  });
  it("CLI rejects a claim for an uninsured or unknown item type via stderr only", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Damaged item is not insured: amulet");
  });
  it("CLI rejects an unknown damaged item type via stderr only", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Damaged item is not insured: broomstick");
  });

  it("CLI rejects negative damage amount -200 via stderr only", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "test", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(result.status).not.toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Damage amount must not be negative");
  });
  it("quotes a newcomer cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second-contract cursed enchanted sword at 160 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [{ type: "amulet" }] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(output.results[1]).toEqual({ premium: 160 });
  });
  it("uses staff 800 G and potion 400 G insurance values for policy caps", () => {
    expect(claim([{ type: "staff" }], [])).toEqual({ payout: 0, remainingCap: 1600 });
    expect(claim([{ type: "potion" }], [])).toEqual({ payout: 0, remainingCap: 800 });
  });

  it("CLI processes sequential quote and claim results in normative output shape", () => {
    const result = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(result.status).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({ results: [
      { premium: 59 }, { payout: 100, remainingCap: 1100 },
    ] });
  });
});
