import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: empty and single items (base premiums + processing fee)
  it("empty item list yields 5 G premium (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single plain sword for newcomer yields 115 G premium (100 + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet for newcomer yields 71 G premium (60 + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff for newcomer yields 93 G premium (80 + 8 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion for newcomer yields 49 G premium (40 + 4 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components: per-piece pricing and the block-of-3 rule
  it("2 runes newcomer: 60 G (50 + 5 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes newcomer: 71 G (60 block + 6 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes newcomer: 115 G (100 + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes newcomer: 198 G (175 + 17.5 first ins + 5 fee = 197.5 → 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("2 runes + 1 moonstone newcomer: 88 G (50 + 25 + 7.5 first ins + 5 fee = 87.5 → 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones newcomer: 137 G (60+60 + 12 first ins + 5 fee)", () => {
    const result = runScenario({
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
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item-specific modifiers (cursed, high enchantment)
  it("cursed sword (newcomer, first ever) yields 165 G premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment 5 newcomer: 145 G (100 + 30 high-ench + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 has no high-ench surcharge: 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it.todo("cursed sword with enchantment 5 stacks both surcharges");

  // Policy-wide modifiers and mixed items
  it.todo("policy with cursed sword + plain amulet: 215 G premium for newcomer");
  it.todo("long-standing customer (2 years) gets 20% loyalty discount");
  it.todo("second contract gets 15% follow-up discount");

  // Integration: long-standing customer second contract with cursed enchanted sword
  it.todo("long-standing customer second contract with cursed enchanted sword yields 160 G");

  // Rounding in MHPCO's favor (premium rounds up)
  it.todo("premium that yields 197.5 G rounds up to 198 G");

  // Claim: basic payouts and deductible
  it.todo("plain sword claim of 500 G yields payout 400 G (500 - 100 deductible)");
  it.todo("rune claim of 200 G yields payout 100 G (200 - 100 deductible)");

  // Claim: special clauses
  it.todo("dragon-material sword enchantment 9, damage 1000 G yields payout 400 G");
  it.todo("dragon-material sword enchantment 5, damage 800 G yields payout 700 G");
  it.todo("steel sword enchantment 9, damage 1000 G yields payout 400 G");
  it.todo("dragon-material sword enchantment 8, damage 1000 G yields payout 400 G");

  // Claim: multiple damages with per-event deductible
  it.todo("two damages (sword 500 + amulet 300) yield total payout 600 G");

  // Claim: cap on payouts (2× insurance sum)
  it.todo("two successive claims exhaust the cap correctly");

  // Claim: rounding (payout rounds down)
  it.todo("payout calculation yielding 350.5 G rounds down to 350 G");

  // Multiple items of same type
  it.todo("policy with two swords damaged: two separate deductibles applied");
  it.todo("claim with more damages of a type than insured rejects the claim");

  // Error handling
  it.todo("unknown item type in quote causes non-zero exit");
  it.todo("claim references item not in policy causes non-zero exit");
  it.todo("negative damage amount causes non-zero exit");
});
