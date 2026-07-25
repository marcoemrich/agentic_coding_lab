import { describe, it, expect } from "vitest";
import { calculateQuote, processClaim } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it.todo("should return 5 G premium for empty item list -- matches \"empty item list → premium 5 G (only the processing fee)\"");

  it.todo("should return 100 G base premium for a sword -- matches \"Sword: 1000 G insurance value, 100 G base premium\"");
  it.todo("should return 60 G base premium for an amulet -- matches \"Amulet: 600 G / 60 G\"");
  it.todo("should return 80 G base premium for a staff -- matches \"Staff: 800 G / 80 G\"");
  it.todo("should return 40 G base premium for a potion -- matches \"Potion: 400 G / 40 G\"");
  it.todo("should return 25 G base premium for a component (rune or moonstone) -- matches \"Components — for example runes and moonstones — are insured at 250 G each, with a base premium of 25 G per component\"");

  it.todo("should return 60 G base premium for a building block of exactly 3 alike components (e.g. 3 runes) -- matches \"a building block of 3 alike components is offered at a special base premium of 60 G\"");
  it.todo("should return 100 G base premium for 4 runes (no block applies) -- matches \"4 runes → 100 G base premium (no block — block requires exactly 3)\"");
  it.todo("should return 175 G base premium for 7 runes (no block applies) -- matches \"7 runes → 175 G base premium\"");
  it.todo("should return 75 G base premium for 2 runes and 1 moonstone (no block: different types) -- matches \"2 runes + 1 moonstone → 75 G base premium (no block: different types)\"");
  it.todo("should return 120 G base premium for 3 runes and 3 moonstones (two separate blocks) -- matches \"3 runes + 3 moonstones → 120 G base premium (two separate blocks)\"");

  it.todo("should add 50 % risk surcharge for cursed items (e.g. 100 G → 150 G) -- matches \"cursed items add a 50 % risk surcharge\" and example \"cursed sword (base premium 100 G) ... cursed surcharge adds 50 G\"");
  it.todo("should add 30 % risk surcharge for items with enchantment level ≥ 5 -- matches \"Highly enchanted items (enchantment level ≥ 5) add a 30 % risk surcharge\"");
  it.todo("should give 20 % loyalty discount for long-standing customers (≥ 2 years) -- matches \"Long-standing customers (≥ 2 years of business with MHPCO) receive a 20 % loyalty discount\"");
  it.todo("should add 10 % initial assessment surcharge for first insurance -- matches \"A first insurance carries a 10 % initial assessment surcharge\"");
  it.todo("should give 15 % discount for contracts after the first -- matches \"Customers receive a 15 % discount on each contract after their first\"");
  it.todo("should add 5 G processing fee to every premium -- matches \"A 5 G processing fee is added to every premium\"");

  it.todo("should apply cursed surcharge only to the base premium of the cursed item in a multi-item policy -- matches example: policy with cursed sword and plain amulet → surplus adds 50 G (50 % of sword's base premium, not of the policy total)\"");
  it.todo("should apply high-enchantment surcharge only to the base premium of the enchanted item in a multi-item policy -- matches modifier scope rule that item-specific modifiers apply to the affected item's base premium\"");
  it.todo("should apply loyalty discount to the policy base premium sum -- matches modifier scope rule that policy-wide modifiers apply to the policy base premium sum\"");
  it.todo("should apply follow-up contract discount to the policy base premium sum -- matches modifier scope rule that policy-wide modifiers apply to the policy base premium sum\"");

  it.todo("should apply loyalty discount for exactly 2 years of customer history -- matches \"customer with exactly 2 years with MHPCO → loyalty discount applies\"");
  it.todo("should apply high-enchantment surcharge for exactly enchantment 5 -- matches \"sword with exactly enchantment 5 → high-enchantment surcharge applies\"");
  it.todo("should apply both cursed and high-enchantment surcharges when applicable -- matches \"if cursed, both surcharges apply\"");

  it.todo("should have 100 G deductible per damage event -- matches \"A deductible of 100 G applies per damage event\" and example: 500 G damage to regular sword → payout 400 G\"");
  it.todo("should cap total payout per policy at twice the insurance sum -- matches \"The total payout per policy is capped at twice the insurance sum\" and example: sword insured (cap 2000 G); two claims of 1500 G each → second claim reduced to 600 G\"");

  it.todo("should reimburse 50 % of damage amount for items with enchantment level ≥ 8 -- matches \"Damage to items with enchantment level ≥ 8 is reimbursed at 50 % of the damage amount\"");
  it.todo("should fully reimburse damage to items made of dragon material -- matches \"Damage to items made of dragon material is fully reimbursed\"");

  it.todo("should apply high-enchantment clause (50 % reimbursement) rather than dragon material clause for dragon-material item with enchantment ≥ 8 -- matches example: dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins, then deductible)\"");
  it.todo("should apply dragon material clause (full reimbursement) for dragon-material item with enchantment < 8 -- matches example: dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)\"");
  it.todo("should apply 50 % rule for non-dragon item with enchantment ≥ 8 -- matches example: steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)\"");

  it.todo("should process two separate damages for two swords insured under policy -- matches \"a policy covers two swords → ... each entry is treated as a separate damage with its own deductible\"");
  it.todo("should reject claim when damages list includes item not covered by policy -- matches \"if the `damages` array contains more entries of a given type than the policy actually covers → whole claim rejected\"");
  it.todo("should reject claim when damage entry has invalid amount (e.g. negative) -- matches \"claim contains damage entry with `amount: -200` → CLI exits with non-zero status\"");

  it.todo("should use unmodified insurance value to calculate policy cap (premium modifiers do not raise cap) -- matches \"a cursed sword (insurance value 1000 G, premium with modifiers 165 G) → cap 2000 G (based on unmodified insurance value)\"");
  it.todo("should calculate insurance sum as sum of items' insurance values, even for components -- matches \"a policy covers a sword and 3 runes (a block) → insurance sum 1750 G (= 1000 + 3×250); the block discount affects the premium only, not the insurance sum\"");

  it.todo("should reject quote for unknown item type (e.g. broomstick) -- matches \"quote includes an item with an unknown type → the CLI exits with non-zero status\"");
  it.todo("should reject claim for item not part of the policy -- matches \"claim references a damage entry whose item is not part of the policy → the CLI exits with non-zero status\"");

  it.todo("should round final premium up in MHPCO's favor (e.g. 197.5 G → 198 G) -- matches \"only the final premium or payout is rounded\" and \"rounded up\"\"");
  it.todo("should round final payout down in MHPCO's favor (e.g. 350.5 G → 350 G) -- matches \"only the final premium or payout is rounded\" and \"rounded down\"\"");

  it.todo("should compute 165 G premium for newcomer with cursed sword (cursed: 100+50, first insurance: +10, fee: +5) = 165 G -- matches integration example\"");
  it.todo("should compute 160 G premium for long-standing customer's second contract with cursed sword with high enchantment: base 100, curse +50, high enchant +30, loyalty -20, first insurance +10, follow-up -15, fee +5 = 160 G -- matches integration example\"");
});
