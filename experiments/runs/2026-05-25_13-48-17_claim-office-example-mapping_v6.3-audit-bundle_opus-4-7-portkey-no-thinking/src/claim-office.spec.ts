import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Simplest: empty item list
  it("empty item list yields premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // Base premiums per item type
  it("plain sword (no modifiers, first quote) yields premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("plain amulet yields premium 71 G (60 + 6 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("plain staff yields premium 93 G (80 + 8 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("plain potion yields premium 49 G (40 + 4 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // Component pricing (runes / moonstones)
  it("1 rune yields premium 33 G (25 + 2.5 first + 5 fee = 32.5 rounded up to 33)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("2 runes yield premium 60 G (50 base + 5 first + 5 fee = 60)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it.todo("3 runes yield block discount premium 71 G (60 + 6 + 5)");
  it.todo("4 runes yield premium 115 G (100 + 10 + 5, no block — block requires exactly 3)");
  it.todo("7 runes yield premium 198 G (175 + 17.5 first → 192.5 + 5 fee = 197.5 rounded up 198)");

  // 'Alike' components clarification
  it.todo("2 runes + 1 moonstone yields no block: 75 + 7.5 + 5 = 87.5 → 88 G");
  it.todo("3 runes + 3 moonstones yields two separate blocks: 120 base → 120 + 12 + 5 = 137 G");

  // Individual modifiers
  it.todo("cursed sword (newcomer): 165 G (100 + 50 curse + 10 first + 5 fee)");
  it.todo("highly enchanted sword (ench 5, newcomer): 100 + 30 + 10 + 5 = 145 G");
  it.todo("sword enchantment 4 (newcomer): no high-ench surcharge → 115 G");
  it.todo("cursed + enchantment 5 sword: both surcharges apply (100 + 50 + 30 + 10 + 5 = 195 G)");
  it.todo("long-standing customer (2 years exactly) gets 20% loyalty discount");
  it.todo("customer's second contract gets 15% follow-up discount");

  // Multi-item modifier scope
  it.todo("cursed sword + plain amulet (newcomer, single contract): 100+60=160 base, +50 curse = 210, +21 first (10% of 210), +5 fee = 236 G");

  // Rounding
  it.todo("premium rounded up: calculation 197.5 G yields 198 G");
  it.todo("payout rounded down: calculation 350.5 yields 350 G");

  // Integration examples
  it.todo("newcomer with cursed sword (ench 3): premium 165 G");
  it.todo("long-standing customer's second contract with cursed sword (ench 7, 3 years): premium 160 G");

  // Claim — standard reimbursement
  it.todo("regular steel sword (ench 3), damage 500 G: payout 400 G (500 - 100 deductible)");
  it.todo("damage to a rune (value 250), damage 200: payout 100 G (200 - 100)");

  // Special clauses
  it.todo("high enchantment (ench ≥ 8): 50% of damage, then deductible — sword ench 8, damage 1000 → 400 G");
  it.todo("dragon-material sword, ench 9, damage 1000: both clauses, 50% wins, 500 - 100 = 400 G");
  it.todo("dragon-material sword, ench 5, damage 800: full reimbursement, 800 - 100 = 700 G");
  it.todo("steel sword, ench 9, damage 1000: high-ench only, 500 - 100 = 400 G");

  // Deductible per damage event
  it.todo("dragon attack damages sword 500 and amulet 300: payout 600 G (deductible per item)");

  // Multiple same-type items
  it.todo("two swords insured: insurance sum 2000, cap 4000");
  it.todo("two swords both damaged (two sword damage entries) get separate deductibles");
  it.todo("more damage entries of a type than insured items rejected (CLI exits non-zero)");

  // Cap exhaustion
  it.todo("sword + amulet policy: insurance sum 1600, cap 3200");
  it.todo("cursed sword: cap 2000 (based on unmodified insurance value, ignoring premium modifiers)");
  it.todo("sword + 3 runes: insurance sum 1750 (block discount affects premium only)");
  it.todo("sword cap 2000, two successive 1500 claims: first payout 1400 (cap rem 600), second payout 600 (cap rem 0)");

  // Edge cases
  it.todo("unknown item type in quote: CLI exits non-zero with stderr message");
  it.todo("claim references item not in policy: CLI exits non-zero with stderr message");
  it.todo("claim with negative damage amount: CLI exits non-zero with stderr message");
});
