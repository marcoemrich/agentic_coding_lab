import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums and processing fee
  it("empty item list yields premium of 5 G (only processing fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out.results[0]).toEqual({ premium: 5 });
  });
  it("single sword for new customer (first insurance) yields 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet for new customer yields 71 G (60 base + 6 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });

  // Component blocks
  it("3 alike runes get block discount: 60 G base + 6 first ins + 5 fee = 71 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 71 });
  });
  it("2 runes (no block): 50 G base + 5 first ins + 5 fee = 60 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(out.results[0]).toEqual({ premium: 60 });
  });
  it("4 runes (no block): 100 G base + 10 first ins + 5 fee = 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
  });
  it("3 runes + 3 moonstones (two blocks): 120 G base + 12 first ins + 5 fee = 137 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 137 });
  });

  // Item-specific modifiers
  it("cursed sword for newcomer: 165 G (integration example)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 165 });
  });
  it("highly enchanted sword (enchantment 5) gets +30% on that item", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 145 });
  });

  // Policy-wide modifiers
  it("loyalty discount applies for 2+ years customer", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: false },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 95 });
  });
  it("follow-up contract gets 15% discount on second quote", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    expect(out.results[0]).toEqual({ premium: 115 });
    expect(out.results[1]).toEqual({ premium: 100 });
  });
  it("long-standing customer's second contract cursed sword enchantment 7 yields 160 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 160 });
  });

  // Multi-item policy
  it("cursed sword + plain amulet for newcomer: 231 G (210 base+curse + 16 first ins + 5 fee)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 231 });
  });

  // Rounding
  it("premium rounds up in MHPCO's favor", () => {
    // 5 runes for newcomer: 5*25=125 base + 12.5 first ins + 5 fee = 142.5 → 143
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(out.results[0]).toEqual({ premium: 143 });
  });

  // Claim: basic
  it.todo("regular sword damaged 500 G → payout 400 G");
  it.todo("rune damaged 200 G → payout 100 G");

  // Claim: special clauses
  it.todo("dragon-material sword enchantment 9 damage 1000 G → payout 400 G");
  it.todo("dragon-material sword enchantment 5 damage 800 G → payout 700 G");
  it.todo("steel sword enchantment 9 damage 1000 G → payout 400 G");

  // Cap
  it.todo("payout capped at twice insurance sum across successive claims");

  // Multi-damage event
  it.todo("dragon attack on sword and amulet: 600 G payout (deductible per item)");
});
