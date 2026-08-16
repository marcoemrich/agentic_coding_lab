import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { processScenario, type Item, type Scenario } from "./claim-office.js";

const quote = (items: Item[], yearsWithMHPCO = 0) =>
  processScenario({ customer: { yearsWithMHPCO }, steps: [{ op: "quote", items }] }).results[0];

const runCli = (scenario: unknown) => spawnSync("pnpm", ["exec", "tsx", "src/cli.ts"], {
  input: JSON.stringify(scenario),
  encoding: "utf8",
});

describe("MHPCO claim office", () => {
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    expect(quote([])).toEqual({ premium: 5 });
  });
  it("uses the main-item price list and quotes 2, 4, and 7 ordinary components at 50, 100, and 175 G base premium before quote modifiers", () => {
    expect(quote([{ type: "sword" }])).toEqual({ premium: 115 });
    expect(quote([{ type: "amulet" }])).toEqual({ premium: 71 });
    expect(quote([{ type: "staff" }])).toEqual({ premium: 93 });
    expect(quote([{ type: "potion" }])).toEqual({ premium: 49 });
    expect(quote(Array.from({ length: 2 }, () => ({ type: "rune" })))).toEqual({ premium: 60 });
    expect(quote(Array.from({ length: 4 }, () => ({ type: "rune" })))).toEqual({ premium: 115 });
    expect(quote(Array.from({ length: 7 }, () => ({ type: "rune" })))).toEqual({ premium: 198 });
  });
  it("quotes exactly 3 alike runes at the special 60 G base premium while 4 and 7 receive no block", () => {
    expect(quote(Array.from({ length: 3 }, () => ({ type: "rune" })))).toEqual({ premium: 71 });
  });
  it("quotes 2 runes + 1 moonstone at 75 G and separate triples of runes and moonstones at 120 G base premium", () => {
    expect(quote([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toEqual({ premium: 88 });
    expect(quote([...Array.from({ length: 3 }, () => ({ type: "rune" })), ...Array.from({ length: 3 }, () => ({ type: "moonstone" }))])).toEqual({ premium: 137 });
  });
  it("applies a cursed surcharge only to the cursed sword: sword + amulet is 210 G before policy modifiers and fee", () => {
    expect(quote([{ type: "sword", cursed: true }, { type: "amulet" }])).toEqual({ premium: 231 });
  });
  it("applies loyalty at exactly 2 years and high enchantment at exactly 5, combines curse + enchantment, and excludes enchantment 4", () => {
    expect(quote([{ type: "sword" }], 2)).toEqual({ premium: 95 });
    expect(quote([{ type: "sword", cursed: true, enchantment: 5 }], 2)).toEqual({ premium: 175 });
    expect(quote([{ type: "sword", cursed: true, enchantment: 4 }], 2)).toEqual({ premium: 145 });
  });
  it("quotes a newcomer's first cursed sword contract at 165 G", () => {
    expect(quote([{ type: "sword", material: "steel", enchantment: 3, cursed: true }])).toEqual({ premium: 165 });
  });
  it("quotes a long-standing customer's second cursed enchantment-7 sword contract at 160 G, retaining first-insurance and adding follow-up discount", () => {
    const scenario: Scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    expect(processScenario(scenario).results[1]).toEqual({ premium: 160 });
  });
  it("rounds a 197.5 G premium up to 198 G only after retaining fractional intermediate amounts", () => {
    expect(quote([{ type: "rune" }, { type: "sword", cursed: true, enchantment: 5 }], 2)).toEqual({ premium: 198 });
  });
  it("pays 400 G for ordinary sword damage 500 and 100 G for rune damage 200", () => {
    const claim = (item: Item, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [item] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: item.type, amount }] } },
      ],
    }).results[1];
    expect(claim({ type: "sword", material: "steel", enchantment: 3 }, 500)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(claim({ type: "rune" }, 200)).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("pays 400, 400, 700, and 400 G for exact-enchantment-8 dragon, enchantment-9 dragon, enchantment-5 dragon, and enchantment-9 steel examples", () => {
    const swordClaim = (material: string, enchantment: number, amount: number) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material, enchantment }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount }] } },
      ],
    }).results[1];
    expect(swordClaim("dragon", 8, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(swordClaim("dragon", 9, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
    expect(swordClaim("dragon", 5, 800)).toEqual({ payout: 700, remainingCap: 1300 });
    expect(swordClaim("steel", 9, 1000)).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("pays 600 G when sword damage 500 and amulet damage 300 each receive a 100 G deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "amulet", amount: 300 }] } },
      ],
    }).results[1];
    expect(result).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("treats two insured swords and two sword damages separately and establishes a 4000 G cap", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }] } },
      ],
    }).results[1];
    expect(result).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("exits non-zero with stderr and no stdout results when same-type damages outnumber insured items", () => {
    const execution = runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "attack", damages: [{ itemType: "sword", amount: 200 }, { itemType: "sword", amount: 200 }] } },
      ],
    });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/damage entries exceed insured items/i);
    expect(execution.stdout).toBe("");
  });
  it("bases caps on unmodified insurance values: sword + amulet 3200 G, cursed sword 2000 G, and sword + 3-rune block 3500 G", () => {
    const capFor = (items: Item[]) => processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items },
        { op: "claim", policy: 0, incident: { cause: "inspection", damages: [] } },
      ],
    }).results[1];
    expect(capFor([{ type: "sword" }, { type: "amulet" }])).toEqual({ payout: 0, remainingCap: 3200 });
    expect(capFor([{ type: "sword", cursed: true }])).toEqual({ payout: 0, remainingCap: 2000 });
    expect(capFor([{ type: "sword" }, ...Array.from({ length: 3 }, () => ({ type: "rune" }))])).toEqual({ payout: 0, remainingCap: 3500 });
  });
  it("pays successive 1500 G sword claims as 1400 G then 600 G with remaining cap 600 G then 0 G", () => {
    const damage = { op: "claim" as const, policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 1500 }] } };
    const results = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }, damage, damage],
    }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("rounds a raw payout of 350.5 G down to 350 G only after retaining fractional intermediate amounts", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    }).results[1];
    expect(result).toEqual({ payout: 350, remainingCap: 1650 });
  });
  it("exits non-zero with stderr and no stdout results for an unknown quote item type", () => {
    const execution = runCli({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items: [{ type: "broomstick" }] }] });
    expect(execution.status).not.toBe(0);
    expect(execution.stderr).toMatch(/unknown item type.*broomstick/i);
    expect(execution.stdout).toBe("");
  });
  it("exits non-zero with stderr for uninsured, unknown, and negative claim damage entries", () => {
    const invalidClaim = (itemType: string, amount: number) => runCli({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "damage", damages: [{ itemType, amount }] } },
      ],
    });
    const uninsured = invalidClaim("amulet", 200);
    expect(uninsured.status).not.toBe(0);
    expect(uninsured.stderr).toMatch(/amulet.*not insured/i);
    expect(uninsured.stdout).toBe("");
    const unknown = invalidClaim("broomstick", 200);
    expect(unknown.status).not.toBe(0);
    expect(unknown.stderr).toMatch(/unknown item type.*broomstick/i);
    expect(unknown.stdout).toBe("");
    const negative = invalidClaim("sword", -200);
    expect(negative.status).not.toBe(0);
    expect(negative.stderr).toMatch(/negative damage amount/i);
    expect(negative.stdout).toBe("");
  });
});
