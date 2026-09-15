import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { processScenario } from "./claim-office.js";

function quote(items: Array<{ type: string; material?: string; enchantment?: number; cursed?: boolean }>, yearsWithMHPCO = 0): number {
  const result = processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];
  if (!("premium" in result)) throw new Error("Expected quote result");
  return result.premium;
}

function claimFor(item: { type: string; material?: string; enchantment?: number }, amount: number): number {
  const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
    { op: "quote", items: [item] },
    { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: item.type, amount }] } },
  ] }).results[1];
  if (!("payout" in result)) throw new Error("Expected claim result");
  return result.payout;
}

function runCli(input: unknown) {
  return spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
    input: JSON.stringify(input), encoding: "utf8",
  });
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] }))
      .toEqual({ results: [{ premium: 5 }] });
  });
  it.each([
    ["sword", 115], ["amulet", 71], ["staff", 93], ["potion", 49],
  ])("quotes %s using its price-list base premium at %i G", (type, premium) => {
    expect(processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type }] }] }))
      .toEqual({ results: [{ premium }] });
  });
  it("quotes 2 runes from a 50 G component base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("quotes exactly 3 runes from the special 60 G block base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(71);
  });
  it("quotes 4 runes from a 100 G base premium because a block requires exactly 3", () => {
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toBe(115);
  });
  it("quotes 7 runes from a 175 G base premium", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("quotes 2 runes plus 1 moonstone from a 75 G base premium because unlike types do not form a block", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(88);
  });
  it("quotes 3 runes plus 3 moonstones from two separate 60 G blocks", () => {
    expect(quote([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ])).toBe(137);
  });
  it("applies a cursed surcharge only to the cursed sword in a sword-and-amulet policy: 231 G total", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years: a plain sword costs 95 G", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies both curse and high-enchantment surcharges at enchantment exactly 5: a sword costs 195 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }])).toBe(195);
  });
  it("does not apply high-enchantment below 5 but still applies curse: enchantment-4 cursed sword costs 165 G", () => {
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }])).toBe(165);
  });
  it("quotes a newcomer’s cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a 3-year customer’s second-contract cursed enchantment-7 sword at 160 G, retaining first-insurance surcharge and adding follow-up discount", () => {
    const scenario = processScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(scenario.results).toEqual([{ premium: 5 }, { premium: 160 }]);
  });
  it("rounds a fractional 197.5 G premium up to 198 G only at the end", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("pays 400 G for 500 G damage to a regular steel enchantment-3 sword and leaves 1600 G cap", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
    ] });
    expect(output.results).toEqual([{ premium: 115 }, { payout: 400, remainingCap: 1600 }]);
  });
  it("pays 100 G for 200 G damage to an insured rune with no item special clause", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "rune" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400 G for 1000 G damage to a dragon-material enchantment-8 sword", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("lets the 50% enchantment rule win for a dragon-material enchantment-9 sword: 400 G payout", () => {
    expect(claimFor({ type: "sword", material: "dragon", enchantment: 9 }, 1000)).toBe(400);
  });
  it("fully reimburses dragon-material enchantment-5 sword damage before deductible: 700 G payout", () => {
    expect(claimFor({ type: "sword", material: "dragon", enchantment: 5 }, 800)).toBe(700);
  });
  it("halves steel enchantment-9 sword damage before deductible: 400 G payout", () => {
    expect(claimFor({ type: "sword", material: "steel", enchantment: 9 }, 1000)).toBe(400);
  });
  it("applies one 100 G deductible per damaged item: 500 G sword plus 300 G amulet pays 600 G", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("insures two swords for 2000 G, gives a 4000 G cap, and treats two sword damages separately", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects the whole claim with an Error when sword damage entries outnumber insured swords", () => {
    expect(() => processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] })).toThrow(Error);
  });
  it("caps a sword-and-amulet policy at 3200 G based on their 1600 G insurance sum", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "catastrophe", damages: [
        { itemType: "sword", amount: 2000 }, { itemType: "amulet", amount: 1500 },
      ] } },
    ] });
    expect(output.results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("caps a cursed sword policy at 2000 G based on unmodified value, not its 165 G premium", () => {
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] },
      { op: "claim", policy: 0, incident: { cause: "loss", damages: [{ itemType: "sword", amount: 3000 }] } },
    ] });
    expect(output.results).toEqual([{ premium: 165 }, { payout: 2000, remainingCap: 0 }]);
  });
  it("values a sword and 3-rune block at a 1750 G insurance sum despite the premium block discount", () => {
    const items = [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }];
    const damages = items.map((item) => ({ itemType: item.type, amount: 2000 }));
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items }, { op: "claim", policy: 0, incident: { cause: "loss", damages } },
    ] });
    expect(output.results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("exhausts a sword policy cap across claims: payouts 1400 G then 600 G, leaving 0 G", () => {
    const claim = { op: "claim" as const, policy: 0, incident: {
      cause: "loss", damages: [{ itemType: "sword", amount: 1500 }],
    } };
    const output = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, claim, claim,
    ] });
    expect(output.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a fractional 350.5 G payout down to 350 G only at the end", () => {
    expect(claimFor({ type: "sword", enchantment: 8 }, 901)).toBe(350);
  });
  it("CLI rejects an unknown quoted broomstick with non-zero status, stderr description, and no stdout results", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "broomstick" }] },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/broomstick/i);
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects damage to an amulet absent from a sword policy with non-zero status and stderr description", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/amulet/i);
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects damage with an unknown item type with non-zero status and stderr description", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 200 }] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/broomstick/i);
    expect(cli.stdout).toBe("");
  });
  it("CLI rejects negative damage with non-zero status and stderr description", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
    ] });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/negative|-200/i);
    expect(cli.stdout).toBe("");
  });
  it("CLI processes sequential quote/claim input and emits results in schema order", () => {
    const cli = runCli({ customer: { yearsWithMHPCO: 5 }, steps: [
      { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
      { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
    ] });
    expect(cli.status).toBe(0);
    expect(cli.stderr).toBe("");
    expect(JSON.parse(cli.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  });
});
