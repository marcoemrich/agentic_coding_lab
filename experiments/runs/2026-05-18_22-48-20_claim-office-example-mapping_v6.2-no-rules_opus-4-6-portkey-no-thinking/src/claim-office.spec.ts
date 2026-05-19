import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  // === QUOTE: Base premiums ===
  it("returns 5G premium for an empty item list (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it.todo("returns 115G premium for a single sword (100G base + 10G first insurance + 5G fee)");
  it.todo("returns 71G premium for a single amulet (60G base + 6G first insurance + 5G fee)");
  it.todo("returns 93G premium for a single staff (80G base + 8G first insurance + 5G fee)");
  it.todo("returns 49G premium for a single potion (40G base + 4G first insurance + 5G fee)");

  // === QUOTE: Components ===
  it.todo("returns 33G premium for a single rune (25G base + 2.5G first insurance + 5G fee, rounded up)");
  it.todo("returns 60G premium for 2 runes (50G base + 5G first insurance + 5G fee)");
  it.todo("returns 72G premium for 3 runes (60G block base + 6G first insurance + 5G fee)");
  it.todo("returns 115G premium for 4 runes (100G base, no block + 10G first insurance + 5G fee)");
  it.todo("returns 75G base premium for 2 runes + 1 moonstone (no block, different types)");
  it.todo("returns 120G base premium for 3 runes + 3 moonstones (two separate blocks)");

  // === QUOTE: Item-level modifiers ===
  it.todo("adds 50% cursed surcharge to the cursed item's base premium only");
  it.todo("adds 30% high-enchantment surcharge for enchantment level 5");
  it.todo("applies both cursed and high-enchantment surcharges to same item");
  it.todo("does not apply high-enchantment surcharge for enchantment level 4");
  it.todo("item-specific modifiers apply per-item, not to policy total");

  // === QUOTE: Policy-level modifiers ===
  it.todo("applies 20% loyalty discount for customer with 2+ years");
  it.todo("does not apply loyalty discount for customer with less than 2 years");
  it.todo("applies 10% first insurance surcharge (always applies per quote)");
  it.todo("applies 15% follow-up discount on second and subsequent quotes");

  // === QUOTE: Integration ===
  it.todo("newcomer with cursed sword: 165G");
  it.todo("long-standing customer second contract with cursed high-enchantment sword: 160G");
  it.todo("rounds premium up in MHPCO's favor");

  // === QUOTE: Errors ===
  it.todo("rejects unknown item type with non-zero exit");

  // === CLAIM: Basic ===
  it.todo("applies 100G deductible per damaged item");
  it.todo("fully reimburses standard item damage minus deductible");
  it.todo("fully reimburses component damage minus deductible");

  // === CLAIM: Special clauses ===
  it.todo("reimburses at 50% for items with enchantment >= 8, then deductible");
  it.todo("fully reimburses dragon-material items minus deductible");
  it.todo("applies 50% rule when both dragon material and enchantment >= 8");
  it.todo("does not apply enchantment clause below level 8");

  // === CLAIM: Cap ===
  it.todo("caps total payout at 2x insurance sum");
  it.todo("tracks remaining cap across multiple claims on same policy");
  it.todo("insurance sum based on item values not premiums");

  // === CLAIM: Multiple items ===
  it.todo("handles multiple damaged items in one event with separate deductibles");
  it.todo("handles multiple items of same type in policy");

  // === CLAIM: Errors ===
  it.todo("rejects claim with more damage entries than insured items of that type");
  it.todo("rejects claim referencing uninsured item type");
  it.todo("rejects claim with negative damage amount");

  // === CLAIM: Rounding ===
  it.todo("rounds payout down in MHPCO's favor");

  // === CLI ===
  it.todo("processes sequential steps and returns results array");
  it.todo("claim step references policy from earlier quote step by index");
});
