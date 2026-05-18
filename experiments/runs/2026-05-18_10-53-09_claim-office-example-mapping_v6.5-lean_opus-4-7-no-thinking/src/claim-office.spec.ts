import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Premium / quote basics
  it("empty item list quote produces premium of 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote with a single plain sword for a new customer produces base + first-insurance + fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance (10%) + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with a single amulet for a new customer applies base premium + first insurance + fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    // 60 base + 6 first insurance + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with multiple plain items sums their base premiums then adds first insurance and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // base: 100+60+80+40 = 280 ; first insurance 28 ; fee 5 ; total 313
    expect(result).toEqual({ results: [{ premium: 313 }] });
  });

  // Component blocks
  it("quote with 2 runes: 50 G base (no block) plus first insurance and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // base: 2 * 25 = 50 ; first insurance 5 ; fee 5 ; total 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote with 3 runes applies the building block discount: 60 G base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // block: 60 ; first insurance 6 ; fee 5 ; total 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with 4 runes uses individual premiums (no block — requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // 4*25 = 100 ; first insurance 10 ; fee 5 ; total 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it.todo("quote with 3 runes + 3 moonstones forms two separate blocks: 120 G base");

  // Item-specific modifiers
  it.todo("cursed item adds 50% surcharge to that item's base premium");
  it.todo("highly enchanted item (enchantment >= 5) adds 30% surcharge");
  it.todo("item with enchantment exactly 5 triggers the high-enchantment surcharge");
  it.todo("item with enchantment 4 does not trigger high-enchantment surcharge");
  it.todo("cursed AND highly enchanted item applies both surcharges");

  // Policy-wide modifiers and rounding
  it.todo("long-standing customer (>= 2 years) receives a 20% loyalty discount on policy base");
  it.todo("customer with exactly 2 years receives the loyalty discount");
  it.todo("follow-up contract (customer's 2nd+ quote in scenario) receives a 15% discount");
  it.todo("premium rounds up in MHPCO's favor (e.g. 197.5 G becomes 198 G)");

  // Integration examples from the prompt
  it.todo("newcomer with cursed sword premium is 165 G (full integration example)");
  it.todo("long-standing customer's second contract with cursed enchant-7 sword is 160 G");

  // Claim basics
  it.todo("standard claim: regular sword damage 500 G yields payout 400 G after 100 G deductible");
  it.todo("claim on a rune (no enchantment/material): damage 200 G yields payout 100 G");
  it.todo("high-enchantment item (>= 8) reimbursed at 50% of damage, then deductible");
  it.todo("dragon-material item fully reimbursed (then deductible)");
  it.todo("dragon-material sword with enchant 9: 50% rule wins (combined clauses)");
  it.todo("deductible applies once per damaged item (multi-item incident)");
  it.todo("payout rounds down in MHPCO's favor (e.g. 350.5 G becomes 350 G)");

  // Cap
  it.todo("policy cap is 2x insurance sum; first claim subtracts payout from cap");
  it.todo("subsequent claim is limited to remaining cap");

  // Error handling
  it.todo("quote with unknown item type causes CLI non-zero exit (programmatic: throws)");
  it.todo("claim with damage on item not in policy throws an error");
  it.todo("claim with negative damage amount throws an error");
});
