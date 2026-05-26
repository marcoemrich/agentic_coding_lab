import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: empty
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums per item type
  it("quote for a single plain sword yields 105 G (100 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("quote for a single plain amulet yields 65 G (60 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("quote for a single plain staff yields 85 G (80 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("quote for a single plain potion yields 45 G (40 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 45 }] });
  });

  // Components
  it("quote for a single rune yields 30 G (25 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 30 }] });
  });
  it("quote for 2 runes yields 55 G (50 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 55 }] });
  });
  it("quote for 3 runes yields 65 G (block: 60 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("quote for 4 runes yields 105 G (100 base + 5 fee, no block)", () => {
    const result = processScenario({
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
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("quote for 7 runes yields 180 G (175 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 180 }] });
  });

  // Alike components
  it("quote for 2 runes + 1 moonstone yields 80 G (75 base + 5 fee, no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 80 }] });
  });
  it("quote for 3 runes + 3 moonstones yields 125 G (120 base + 5 fee, two blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 125 }] });
  });

  // Item-specific modifiers
  it("cursed sword adds 50% surcharge on item base premium → 155 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 155 }] });
  });
  it("sword with enchantment 5 adds 30% high-enchantment surcharge → 135 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 135 }] });
  });
  it("sword with enchantment 4 has no high-enchantment surcharge → 105 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("cursed sword with enchantment 5 gets both surcharges → 185 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true, enchantment: 5 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 185 }] });
  });

  // Modifier scope on multi-item policy
  it("policy with cursed sword + plain amulet: curse surcharge applies only to sword → 215 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 215 }] });
  });

  // Customer modifiers
  it("customer with exactly 2 years gets 20% loyalty discount → 85 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("first insurance adds 10% surcharge per item base premium → sword 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0, isFirstInsurance: true },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("follow-up contract gets 15% discount on policy → sword 90 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0, isFollowUpContract: true },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 90 }] });
  });

  // Rounding
  it("premium that yields 197.5 G rounds UP to 198 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0, isFirstInsurance: true },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it.todo("payout that yields 350.5 G rounds DOWN to 350 G");

  // Integration examples
  it("newcomer with cursed sword (steel, enchantment 3) → premium 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0, isFirstInsurance: true },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it.todo("3-year customer's second quote with cursed sword (steel, enchantment 7) → premium 160 G");

  // Claim: standard reimbursement
  it.todo("regular sword damage 500 G → payout 400 G (deductible)");
  it.todo("rune damage 200 G → payout 100 G (deductible)");

  // Claim: special clauses
  it.todo("dragon-material sword enchantment 8 damage 1000 G → payout 400 G (50% then deductible)");
  it.todo("dragon-material sword enchantment 9 damage 1000 G → payout 400 G (50% wins)");
  it.todo("dragon-material sword enchantment 5 damage 800 G → payout 700 G (full then deductible)");
  it.todo("steel sword enchantment 9 damage 1000 G → payout 400 G (50% then deductible)");

  // Deductible per damage event
  it.todo("dragon attack damages sword 500 + amulet 300 → payout 600 G (deductible per item)");

  // Multiple items of same type
  it.todo("policy with two swords → insurance sum 2000 G, cap 4000 G");
  it.todo("two-sword policy: two sword damages → each treated separately with own deductible");
  it.todo("claim with more sword damages than policy covers → CLI error");

  // Cap exhaustion
  it.todo("sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value)");
  it.todo("sword + 3 runes (block) → insurance sum 1750 G");
  it.todo("sword cap 2000 G: two claims of 1500 G → 1400 G then 600 G");

  // Error edge cases
  it.todo("quote with unknown item type → CLI error");
  it.todo("claim damage references item not in policy → CLI error");
  it.todo("claim damage with negative amount → CLI error");
});
