import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("Claim Office", () => {
  // === QUOTE: Edge cases ===
  it.todo("should return premium of 5 G for empty item list (only processing fee)");
  it.todo("should reject quote with unknown item type (non-zero exit, error to stderr)");

  // === QUOTE: Item base premiums ===
  it.todo("should quote a plain sword at 105 G (100 base + 5 fee)");
  it.todo("should quote a plain amulet at 65 G (60 base + 5 fee)");
  it.todo("should quote a plain staff at 85 G (80 base + 5 fee)");
  it.todo("should quote a plain potion at 45 G (40 base + 5 fee)");
  it.todo("should quote a single rune (component) at 30 G (25 base + 5 fee)");
  it.todo("should quote a single moonstone (component) at 30 G (25 base + 5 fee)");

  // === QUOTE: Building block of 3 alike components ===
  it.todo("should quote 2 runes at 55 G (50 base + 5 fee) -- no block");
  it.todo("should quote 3 runes at 65 G (60 base block + 5 fee) -- block applies");
  it.todo("should quote 4 runes at 105 G (100 base + 5 fee) -- no block, block requires exactly 3");
  it.todo("should quote 7 runes at 180 G (175 base + 5 fee)");

  // === QUOTE: \"Alike\" components -- different types don't form blocks ===
  it.todo("should quote 2 runes + 1 moonstone at 80 G (75 base + 5 fee) -- no block, different types");
  it.todo("should quote 3 runes + 3 moonstones at 125 G (120 base two blocks + 5 fee)");

  // === QUOTE: Modifier scope on multi-item policies ===
  it.todo("should quote cursed sword + plain amulet at 215 G -- modifiers apply per-item not policy-total");

  // === QUOTE: Cursed items (50% risk surcharge) ===
  it.todo("should quote a cursed sword at 155 G (100 base + 50 curse + 5 fee) -- 50% surcharge on base");
  it.todo("should quote a cursed amulet at 95 G (60 base + 30 curse + 5 fee)");

  // === QUOTE: Highly enchanted items (enchantment ≥ 5, 30% risk surcharge) ===
  it.todo("should quote a sword enchantment 5 at 135 G (100 base + 30 high-enchantment + 5 fee)");
  it.todo("should quote a sword enchantment 4 at 105 G -- no high-enchantment surcharge");
  it.todo("should quote a sword enchantment 5 AND cursed at 185 G (100 base + 50 curse + 30 high-enchantment + 5 fee)");

  // === QUOTE: Loyalty discount (≥ 2 years, 20%) ===
  it.todo("should quote a plain sword for customer with 2 years at 85 G (100 base - 20 loyalty + 5 fee) -- loyalty applies");
  it.todo("should quote a plain sword for customer with 1 year at 105 G -- no loyalty discount");

  // === QUOTE: First insurance surcharge (10%) ===
  it.todo("should quote a plain sword with first insurance surcharge at 115 G (100 base + 10 first + 5 fee)");

  // === QUOTE: Follow-up contract discount (15% on each contract after first) ===
  it.todo("should quote a plain sword as second contract at 100 G (100 base + 10 first - 15 follow-up + 5 fee)");

  // === QUOTE: Integration examples ===
  it.todo("should quote newcomer with cursed sword at 165 G -- integration example 1");
  it.todo("should quote long-standing customer second contract cursed sword enchantment 7 at 160 G -- integration example 2");

  // === QUOTE: Rounding in MHPCO's favor (round up) ===
  it.todo("should round premium 197.5 up to 198 G");

  // === CLAIM: Edge cases ===
  it.todo("should reject claim for unknown item type (non-zero exit, error to stderr)");
  it.todo("should reject claim for item not in policy (non-zero exit, error to stderr)");
  it.todo("should reject claim with negative damage amount (non-zero exit, error to stderr)");
  it.todo("should reject claim with more damages of a type than insured (non-zero exit, error to stderr)");

  // === CLAIM: Deductible per damage event (100 G per damaged item) ===
  it.todo("should pay 400 G for sword damage 500 G (standard, enchantment 3 steel) -- 500 - 100 deductible");
  it.todo("should pay 100 G for rune damage 200 G (standard, no special clause) -- 200 - 100 deductible");

  // === CLAIM: Multi-item damage, deductible per item ===
  it.todo("should pay 600 G for dragon attack damaging sword 500 G + amulet 300 G");

  // === CLAIM: Enchantment ≥ 8: 50% reimbursement ===
  it.todo("should pay 400 G for steel sword enchantment 9 damage 1000 G -- 50% then deductible");

  // === CLAIM: Dragon material: full reimbursement ===
  it.todo("should pay 700 G for dragon-material sword enchantment 5 damage 800 G -- full then deductible");

  // === CLAIM: Enchantment ≥ 8 AND dragon material: 50% clause wins ===
  it.todo("should pay 400 G for dragon-material sword enchantment 9 damage 1000 G -- 50% wins then deductible");
  it.todo("should pay 400 G for dragon-material sword enchantment 8 damage 1000 G -- from spec example");

  // === CLAIM: Multiple items of same type ===
  it.todo("should handle two swords insured, both damaged -- separate deductibles");

  // === CLAIM: Cap ===
  it.todo("should have cap 2000 G for single sword (2× insurance sum)");
  it.todo("should have cap 3200 G for sword + amulet (2× 1600)");
  it.todo("should have cap 2000 G for cursed sword (cap based on unmodified insurance value)");
  it.todo("should have cap 3500 G for sword + 3 runes block (block discount doesn't affect cap)");
  it.todo("should exhaust cap across successive claims: first 1400 G payout, then 600 G remaining");

  // === CLAIM: Rounding in MHPCO's favor (round down for payouts) ===
  it.todo("should round payout 350.5 down to 350 G");

  // === Multi-step scenarios ===
  it.todo("should process a multi-step scenario: quote then claim");
});