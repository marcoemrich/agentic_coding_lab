import { describe, it, expect } from "vitest";
import { run } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge: empty
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(out).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items (single item, newcomer 0 yrs, first contract: +10% first insurance, +5G fee)
  it("single plain sword (0 yrs, first quote) → 100 + 10 + 5 = 115 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (0 yrs, first quote) → 60 + 6 + 5 = 71 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (0 yrs, first quote) → 80 + 8 + 5 = 93 G", () => {
    const out = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it.todo("single plain potion (0 yrs, first quote) → 40 + 4 + 5 = 49 G");

  // Components and 3-alike block
  it.todo("2 runes → base 50 G; with first insurance 55 + 5 fee = 60 G");
  it.todo("3 runes → block: base 60 G; 66 + 5 = 71 G");
  it.todo("4 runes → no block: 100 G base; 110 + 5 = 115 G");
  it.todo("7 runes → 175 G base; 192.5→193 + 5 = 198 G (rounded up in MHPCO favor)");
  it.todo("alike: 2 runes + 1 moonstone → 75 G base (no block, different types)");
  it.todo("alike: 3 runes + 3 moonstones → 120 G base (two separate blocks)");

  // Item-specific modifiers
  it.todo("cursed sword adds 50% to sword base premium");
  it.todo("sword enchantment 5 adds 30% (high enchantment threshold)");
  it.todo("sword enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword enchantment 5 → both surcharges apply");

  // Policy-wide modifiers
  it.todo("loyalty: customer with exactly 2 years receives 20% discount");
  it.todo("first insurance: +10% on policy base premium");
  it.todo("follow-up contract: -15% on second and later contracts");
  it.todo("processing fee 5G added at the end");

  // Modifier scope (multi-item)
  it.todo("cursed sword + plain amulet: 100+60 base, +50 cursed surcharge (cursed only), +5 fee = 215 with no other modifiers — actually 210 before fee per spec");

  // Rounding
  it.todo("premium 197.5 G → 198 G (rounded up)");
  it.todo("payout 350.5 G → 350 G (rounded down)");

  // Edge: unknown item type
  it.todo("quote with unknown item type → CLI exits non-zero, error to stderr, no results to stdout");

  // Integration examples
  it.todo("integration: newcomer 0 yrs, cursed sword (steel, ench 3) → premium 165 G");
  it.todo("integration: 3-yr customer, second quote, cursed sword ench 7 → premium 160 G");

  // Claim: standard reimbursement
  it.todo("regular sword (steel, ench 3), damage 500 → payout 400 (500 - 100 deductible)");
  it.todo("rune damage 200 → payout 100 (no special clause for components)");

  // Claim: enchantment threshold
  it.todo("dragon sword, ench 8, damage 1000 → payout 400 (high-enchantment 50% applies first, then deductible)");
  it.todo("dragon sword, ench 9, damage 1000 → payout 400 (both clauses; 50% wins, then deductible)");
  it.todo("dragon sword, ench 5, damage 800 → payout 700 (only dragon clause: full reimbursement, then deductible)");
  it.todo("steel sword, ench 9, damage 1000 → payout 400 (only high-enchantment clause)");

  // Claim: deductible per item
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)");

  // Multiple items of same type
  it.todo("two swords policy → insurance sum 2000, cap 4000; dragon attack damages both → two separate damages with own deductibles");
  it.todo("damages array has more entries of a type than policy covers → CLI exits non-zero");

  // Cap
  it.todo("sword + amulet → insurance sum 1600, cap 3200");
  it.todo("cursed sword cap is based on unmodified insurance value: cap 2000");
  it.todo("sword + 3 runes (block) → insurance sum 1750 (block discount affects premium only)");
  it.todo("sword cap 2000: two claims of 1500 each → first payout 1400 cap remaining 600; second payout 600 cap remaining 0");

  // Claim error cases
  it.todo("claim references damage for item not in policy → CLI exits non-zero");
  it.todo("claim with negative damage amount → CLI exits non-zero");
});
