import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { runScenario } from "./claim-office.js";

function quote(items: Array<Record<string, unknown>>, yearsWithMHPCO = 0) {
  return runScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0]?.premium;
}

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G", () => {
    expect(runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [] }] })).toEqual({
      results: [{ premium: 5 }],
    });
  });
  it("quotes sword, amulet, staff, and potion from the price list at 115, 71, 93, and 49 G", () => {
    expect(["sword", "amulet", "staff", "potion"].map((type) => quote([{ type }]))).toEqual([115, 71, 93, 49]);
  });
  it("quotes 2, 3, 4, and 7 runes at 60, 71, 115, and 198 G, with a block only for exactly 3", () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: "rune" }));
    expect([2, 3, 4, 7].map((count) => quote(runes(count)))).toEqual([60, 71, 115, 198]);
  });
  it("quotes 2 runes plus 1 moonstone without a block and two unlike triples as two blocks", () => {
    const types = (values: string[]) => values.map((type) => ({ type }));
    expect(quote(types(["rune", "rune", "moonstone"]))).toBe(88);
    expect(quote(types(["rune", "rune", "rune", "moonstone", "moonstone", "moonstone"]))).toBe(137);
  });
  it("scopes a cursed surcharge to the cursed sword in a sword-and-amulet policy", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet", cursed: false }])).toBe(231);
  });
  it("applies the loyalty discount at exactly 2 years", () => {
    expect(quote([{ type: "sword" }], 2)).toBe(95);
  });
  it("applies high enchantment at 5, not 4, and stacks it with curse", () => {
    expect(quote([{ type: "sword", enchantment: 5 }])).toBe(145);
    expect(quote([{ type: "sword", enchantment: 4, cursed: true }])).toBe(165);
    expect(quote([{ type: "sword", enchantment: 5, cursed: true }])).toBe(195);
  });
  it("quotes a newcomer with a cursed sword at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toBe(165);
  });
  it("quotes a long-standing customer's second cursed enchanted sword contract at 160 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
      { op: "quote", items: [] },
      { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
    ] });
    expect(result.results[1]?.premium).toBe(160);
  });
  it("rounds a final premium of 197.5 G upward to 198 G", () => {
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toBe(198);
  });
  it("rejects an unknown quote item with an error description", () => {
    expect(() => quote([{ type: "broomstick" }])).toThrow(/unknown item.*broomstick/i);
  });
  it("pays 400 G for standard sword damage and 100 G for rune damage", () => {
    const settle = (item: Record<string, unknown>, amount: number) => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [item] },
        { op: "claim", policy: 0, incident: { cause: "accident", damages: [{ itemType: item.type, amount }] } },
      ],
    }).results[1];
    expect(settle({ type: "sword", material: "steel", enchantment: 3 }, 500)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(settle({ type: "rune" }, 200)).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 600 G when one incident damages a sword for 500 G and amulet for 300 G", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("pays 400 G for 1000 G damage to a dragon sword at enchantment 8", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1000 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("resolves enchantment versus dragon material examples to payouts 400, 700, and 400 G", () => {
    const payout = (material: string, enchantment: number, amount: number) => runScenario({
      customer: { yearsWithMHPCO: 0 }, steps: [
        { op: "quote", items: [{ type: "sword", material, enchantment }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
      ],
    }).results[1]?.payout;
    expect([payout("dragon", 9, 1000), payout("dragon", 5, 800), payout("steel", 9, 1000)]).toEqual([400, 700, 400]);
  });
  it("insures two swords with cap 4000 G and treats their damages separately", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [
        { itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 },
      ] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("rejects more same-type damages than the policy covers", () => {
    expect(() => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [
        { itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 },
      ] } },
    ] })).toThrow(/more.*sword.*damage|excess.*sword/i);
  });
  it("bases caps on unmodified item values: cursed sword 2000 G and sword plus 3 runes 3500 G", () => {
    const cap = (items: Array<Record<string, unknown>>) => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items },
      { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
    ] }).results[1]?.remainingCap;
    expect(cap([{ type: "sword", cursed: true }])).toBe(2000);
    expect(cap([{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(3500);
  });
  it("pays successive sword claims of 1400 G then 600 G and leaves no cap", () => {
    const damage = { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] }, damage, damage,
    ] });
    expect(result.results.slice(1)).toEqual([
      { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 },
    ]);
  });
  it("rounds a raw payout of 350.5 G downward to 350 G only at the end", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
    ] });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("rejects uninsured, unknown, and negative damages; CLI writes stderr, exits non-zero, and writes no stdout", () => {
    const invalidClaim = (itemType: string, amount: number) => () => runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [
      { op: "quote", items: [{ type: "sword" }] },
      { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount }] } },
    ] });
    expect(invalidClaim("amulet", 200)).toThrow(/amulet/i);
    expect(invalidClaim("broomstick", 200)).toThrow(/broomstick/i);
    expect(invalidClaim("sword", -200)).toThrow(/negative damage/i);

    const input = JSON.stringify({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    const cli = spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], { input, encoding: "utf8" });
    expect(cli.status).not.toBe(0);
    expect(cli.stderr).toMatch(/unknown item.*broomstick/i);
    expect(cli.stdout).toBe("");
  });
});
