import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums per item type
  it("quotes empty item list at 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("quotes a single sword for a new customer at 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("quotes a single amulet for a new customer at 71 G (60 base + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quotes a single staff for a new customer at 93 G (80 base + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("quotes a single potion for a new customer at 49 G (40 base + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Components and block pricing
  it("quotes 2 runes at 60 G (50 base + 5 first + 5 fee)", () => {
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
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("quotes 3 alike runes as a block (60 base + 6 first + 5 fee = 71 G)", () => {
    const result = runScenario({
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
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("quotes 4 runes without block at 115 G (100 base + 10 first + 5 fee)", () => {
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
    expect(result.results[0]).toEqual({ premium: 115 });
  });

  // Cursed and enchantment surcharges (item-specific)
  it.todo("applies cursed surcharge to a sword: newcomer cursed sword premium 165 G");
  it.todo("applies high-enchantment surcharge for enchantment ≥ 5");
  it.todo("treats enchantment exactly 5 as high-enchantment");

  // Customer-level modifiers
  it.todo("applies loyalty discount for ≥ 2 years with MHPCO");
  it.todo("applies follow-up contract discount on second quote in scenario");

  // Multi-item integration
  it.todo("computes premium for cursed sword + plain amulet at 210 G before fee = 215 G total");
  it.todo("computes long-standing customer second-contract cursed enchanted sword at 160 G");

  // Rounding
  it.todo("rounds premium up in MHPCO's favor");

  // Claim processing
  it.todo("pays out damage minus 100 G deductible for plain item");
  it.todo("reimburses dragon-material item fully (minus deductible)");
  it.todo("reimburses 50 % for enchantment ≥ 8 items (minus deductible)");
  it.todo("caps total payout at twice insurance sum across multiple claims");
  it.todo("applies deductible per damage event (multiple damages, multiple deductibles)");

  // CLI errors
  it.todo("rejects unknown item type in quote");
  it.todo("rejects claim referencing item not in policy");
  it.todo("rejects claim with negative damage amount");
});
