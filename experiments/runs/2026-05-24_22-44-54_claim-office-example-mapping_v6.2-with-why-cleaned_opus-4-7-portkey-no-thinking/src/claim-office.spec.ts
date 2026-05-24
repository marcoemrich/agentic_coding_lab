import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Basic premium calculation ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
  it("single sword (no modifiers, newcomer first contract) → 100 base + 10 first + 5 fee = 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet (no modifiers, newcomer first contract) → 60 + 6 + 5 = 71 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("single staff (no modifiers, newcomer first contract) → 80 + 8 + 5 = 93 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 93 });
  });
  it("single potion (no modifiers, newcomer first contract) → 40 + 4 + 5 = 49 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 49 });
  });

  // --- Components and block discount ---
  it("2 runes → base 50 G (newcomer: 50 + 5 + 5 fee = 60 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → base 60 G (block applies, total 60+6+5=71)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → base 100 G (no block; total 100+10+5=115)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes → base 175 G; total 175 + 17.5 + 5 = 197.5 → rounded up to 198", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone → base 75 G; total 88 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones → base 120 G (two blocks); total 137 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 137 });
  });

  // --- Item-specific modifiers ---
  it("cursed sword newcomer first contract → 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("sword with enchantment 5 → high-enchantment surcharge applies (145 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 145 });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (115 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("cursed sword enchantment 5 → both surcharges apply (195 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 195 });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years → loyalty discount applies (95 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("second contract → follow-up discount applies (100 G)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 100 });
  });

  // --- Modifier scope on multi-item policy ---
  it("cursed sword + plain amulet → curse scoped to sword only (231 G total)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 231 });
  });

  // --- Rounding ---
  // (premium up: covered by "7 runes" test above which yields 197.5 → 198)
  it.todo("payout yielding 350.5 G → rounded down to 350 G");

  // --- Integration examples ---
  it("newcomer with cursed sword (enchantment 3) → 165 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("long-standing customer (3y) second contract, cursed sword enchantment 7 → 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: basic and deductible ---
  it("regular sword damage 500 G → payout 400 G (full minus deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "orc raid", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (no enchantment/material) damage 200 G → payout 100 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "thief", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: enchantment and dragon clauses ---
  it("dragon-material sword enchantment 8, damage 1000 → payout 400 G (50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 → payout 400 G (50% wins, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 → payout 700 G (full, then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 → payout 400 G (50% then deductible)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "lightning", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Multiple items of the same type ---
  it("policy with two swords, both damaged → each treated as separate damage with own deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dual ambush",
            damages: [
              { itemType: "sword", amount: 800 },
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    });
    expect(out.results[1]).toEqual({ payout: 1300, remainingCap: 2700 });
  });
  it.todo("damages array has more entries of a type than policy covers → CLI rejects whole claim");

  // --- Cap exhaustion ---
  it.todo("policy: sword + amulet → insurance sum 1600, cap 3200");
  it.todo("cursed sword premium modifiers do not raise cap → cap remains 2000");
  it.todo("sword + 3 runes (block) → insurance sum 1750 (block does not reduce insurance sum)");
  it.todo("sword cap 2000: two claims of 1500 → first payout 1400 (cap 600), second payout 600 (cap 0)");

  // --- Edge cases / CLI errors ---
  it.todo("quote with unknown item type → CLI exits non-zero, writes stderr, no results");
  it.todo("claim references item not in policy → CLI exits non-zero, writes stderr");
  it.todo("claim damage with negative amount → CLI exits non-zero, writes stderr");
});
