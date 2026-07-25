import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base premium and fee
  it.todo("should return premium 5 G for an empty quote -- only the processing fee");
  it.todo("should compute premium 115 G for a single plain sword -- base 100 + first insurance 10 + fee 5");
  it.todo("should compute premium 71 G for a single plain amulet -- base 60 + first insurance 6 + fee 5");
  it.todo("should compute premium 93 G for a single plain staff -- base 80 + first insurance 8 + fee 5");
  it.todo("should compute premium 49 G for a single plain potion -- base 40 + first insurance 4 + fee 5");
  it.todo("should compute premium 33 G for a single rune -- base 25 + first insurance 2.5 rounded up + fee 5");
  it.todo("should compute premium 33 G for a single moonstone -- base 25 + first insurance 2.5 rounded up + fee 5");

  // Component blocks
  it.todo("should compute premium 60 G for 2 runes -- 2 * 25 + first insurance 5 + fee 5");
  it.todo("should compute premium 71 G for 3 runes -- block 60 + first insurance 6 + fee 5");
  it.todo("should compute premium 115 G for 4 runes -- 4 * 25 + first insurance 10 + fee 5");
  it.todo("should compute premium 198 G for 7 runes -- 7 * 25 + first insurance 17.5 rounded up + fee 5");
  it.todo("should compute premium 88 G for 2 runes + 1 moonstone -- base 75 + first insurance 7.5 rounded up + fee 5");
  it.todo("should compute premium 137 G for 3 runes + 3 moonstones -- two blocks 120 + first insurance 12 + fee 5");

  // Item-specific modifiers
  it.todo("should compute premium 165 G for a newcomer with a cursed steel sword -- 100 + 50 curse + 10 first + fee 5");
  it.todo("should compute premium 145 G for a highly enchanted sword (enchantment 5) -- 100 + 30 high + 10 first + fee 5");
  it.todo("should compute premium 115 G for an enchantment-4 sword -- no high-enchantment surcharge");
  it.todo("should compute premium 195 G for a cursed and highly enchanted sword -- 100 + 50 + 30 + 10 + fee 5");

  // Policy-wide modifiers
  it.todo("should apply a 20 % loyalty discount for a customer with exactly 2 years -- plain sword premium 95 G");
  it.todo("should apply a 15 % follow-up contract discount on the second quote -- second quote sword premium 100 G");

  // Modifier scope and integration
  it.todo("should apply cursed surcharge to the affected item only on a multi-item policy -- cursed sword + amulet premium 231 G");
  it.todo("should compute premium 165 G for newcomer with a cursed sword (integration example)");
  it.todo("should compute premium 160 G for long-standing customer's second cursed highly-enchanted sword (integration example)");

  // Claim reimbursement rules
  it.todo("should reimburse a regular sword damage 500 G with payout 400 G after deductible");
  it.todo("should reimburse a rune damage 200 G with payout 100 G after deductible");
  it.todo("should fully reimburse a dragon-material sword (enchantment 5) damage 800 G with payout 700 G");
  it.todo("should reimburse a steel sword with enchantment 9 damage 1000 G at 50 % with payout 400 G");
  it.todo("should apply the 50 % rule over dragon full reimbursement for an enchantment-9 dragon sword damage 1000 G with payout 400 G");
  it.todo("should apply the 50 % rule to an enchantment-8 dragon sword damage 1000 G with payout 400 G");

  // Deductible, multiple items and same-type items
  it.todo("should apply a 100 G deductible per damaged item for a dragon attack on sword 500 G and amulet 300 G with payout 600 G");
  it.todo("should treat two damage entries for two insured swords as separate damages with payout 700 G");

  // Cap and cap exhaustion
  it.todo("should cap total payout at twice the insurance sum for a sword and amulet policy");
  it.todo("should exhaust the cap across two successive claims on a single sword -- 1400 G then 600 G");

  // Error handling
  it.todo("should reject a quote containing an unknown item type with an error");
  it.todo("should reject a claim damage entry whose item type is not in the policy");
  it.todo("should reject a claim with more damage entries of a type than the policy covers");
  it.todo("should reject a claim damage entry with a negative amount");
});
