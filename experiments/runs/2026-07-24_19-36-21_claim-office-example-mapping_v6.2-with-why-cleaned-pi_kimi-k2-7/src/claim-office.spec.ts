import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";
import { processInput } from "./cli.js";

const customer = (years: number) => ({ yearsWithMHPCO: years });

describe("claim-office quote", () => {
  it.todo("should return premium 5 for an empty quote (only the processing fee)");

  it.todo("should calculate a plain sword premium (base 100 + first insurance 10 + fee 5 = 115)");

  it.todo("should reject a quote that contains an unknown item type");

  it.todo("should apply component block pricing for 2/3/4/7 alike components (55 / 71 / 115 / 198)");

  it.todo("should treat different component types as not alike and allow separate blocks (88 / 137)");

  it.todo("should apply item-specific surcharges to the affected item and policy-wide modifiers to the policy base (cursed sword + amulet = 231)");

  it.todo("should apply modifier thresholds (loyalty at 2 years, high enchantment at 5, curse stacks)");

  it.todo("should calculate the newcomer-with-a-cursed-sword premium (165)");

  it.todo("should calculate the long-standing customer's second contract premium (160)");
});

describe("claim-office claim", () => {
  it.todo("should process standard reimbursement claims with a 100 G deductible (sword 400, rune 100)");

  it.todo("should apply special reimbursement rules for high enchantment and dragon material (dragon enchantment 9 -> 400, dragon enchantment 5 -> 700, steel enchantment 9 -> 400)");

  it.todo("should apply the deductible per damaged item and handle multiple/same-type items (sword+amulet -> 600, two swords cap)");

  it.todo("should enforce the policy cap across successive claims (2000 cap, 1500 damages -> 1400 then 600)");

  it.todo("should base the cap on unmodified insurance values and apply block discounts to premium only (cursed sword cap 2000, sword+3 runes sum 1750 / cap 3500)");

  it.todo("should round premiums up and payouts down in MHPCO's favor (premium 197.5 -> 198, payout 350.5 -> 350)");

  it.todo("should reject a claim with more damages of a type than the policy covers");

  it.todo("should reject claims with invalid damage entries (unknown type, not in policy, negative amount)");
});

describe("claim-office CLI", () => {
  it.todo("should return an error for unknown item types and invalid claim entries via the CLI facade");
});
