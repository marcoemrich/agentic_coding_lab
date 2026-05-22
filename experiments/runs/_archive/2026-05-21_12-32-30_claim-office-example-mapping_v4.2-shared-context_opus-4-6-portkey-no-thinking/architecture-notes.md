# Architecture Notes

## After cycle 1
- Change: extracted magic number 5 into named constant PROCESSING_FEE
- Rationale: Rule 2 (Reveals Intent) -- the constant name communicates the domain concept "processing fee" that a bare literal does not
- Naming established: PROCESSING_FEE (module-level constant, value 5)

## After cycle 2
- Change: consolidated two duplicate return statements into single return with `premium` variable
- Rationale: Rule 3 (No Duplication) -- both branches returned identical `{ results: [{ premium: X }] }` shape; single return makes the varying part (premium value) explicit
- Naming established: --

## After cycle 3
- Change: replaced hardcoded premiums (71, 115) with explicit formula `base + base * FIRST_INSURANCE_RATE + PROCESSING_FEE` and extracted `BASE_PREMIUM` lookup map and `FIRST_INSURANCE_RATE` constant
- Rationale: Rule 2 (Reveals Intent) -- magic numbers hid the domain calculation; also Rule 3 (No Duplication) -- same formula was embedded in two separate literals
- Naming established: BASE_PREMIUM (Record<string, number> mapping item type to base value), FIRST_INSURANCE_RATE (0.1)

## After cycle 4
- Change: renamed local variable `base` to `basePremium` in processScenario
- Rationale: Rule 2 (Reveals Intent) -- `basePremium` mirrors the constant `BASE_PREMIUM` and makes the premium formula self-documenting
- Naming established: basePremium (local variable holding the looked-up base premium for an item type)

## After cycle 5
- Change: extracted explaining variable `firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE`
- Rationale: Rule 2 (Reveals Intent) -- premium formula now reads as sum of three named domain concepts
- Naming established: firstInsuranceSurcharge (local variable, the 10% surcharge applied to the base premium)

## After cycle 6
- Change: removed early-return guard for empty items -- the general loop+formula path already yields PROCESSING_FEE when items is empty
- Rationale: Rule 3 (No Duplication) and Rule 4 (Fewest Elements) -- the empty case was a redundant special case of the general formula
- Naming established: --

## After cycle 7
- Change: extracted magic number 60 into BLOCK_OF_3_PRICE constant; introduced isComponentType and formsBlockOf3 explaining variables in the block-discount conditional
- Rationale: Rule 2 (Reveals Intent) -- the conditional now reads as domain logic ("forms block of 3 components") rather than raw arithmetic checks
- Naming established: BLOCK_OF_3_PRICE (module-level constant, value 60), isComponentType (local boolean, true when item's base premium equals component price), formsBlockOf3 (local boolean, true when count is 3 and type is a component)

## After cycle 8
- Change: extracted COMPONENT_TYPES = new Set(["rune", "moonstone"]) to replace implicit check `BASE_PREMIUM[type] === 25`
- Rationale: Rule 2 (Reveals Intent) -- "component type" is now an explicit domain concept instead of being derived from a coincidental base premium value
- Naming established: COMPONENT_TYPES (module-level Set<string>, the item types eligible for block-of-3 pricing)

## After cycle 9
- Change: extracted magic number 0.5 into named constant CURSE_SURCHARGE_RATE
- Rationale: Rule 2 (Reveals Intent) -- mirrors FIRST_INSURANCE_RATE pattern; curse surcharge formula now reads as domain concept rather than bare literal
- Naming established: CURSE_SURCHARGE_RATE (module-level constant, value 0.5)

## After cycle 10
- Change: extracted magic numbers 0.3 and 5 into named constants HIGH_ENCHANTMENT_SURCHARGE_RATE and HIGH_ENCHANTMENT_THRESHOLD
- Rationale: Rule 2 (Reveals Intent) -- consistent with established rate-constant pattern (CURSE_SURCHARGE_RATE, FIRST_INSURANCE_RATE); threshold naming makes the enchantment boundary a visible domain concept
- Naming established: HIGH_ENCHANTMENT_SURCHARGE_RATE (module-level constant, value 0.3), HIGH_ENCHANTMENT_THRESHOLD (module-level constant, value 5)

## After cycle 11
- Change: extracted magic numbers 0.2 and 2 into named constants LOYALTY_DISCOUNT_RATE and LOYALTY_THRESHOLD_YEARS
- Rationale: Rule 2 (Reveals Intent) -- consistent with established *_RATE and *_THRESHOLD naming patterns; loyalty conditional and formula now self-documenting
- Naming established: LOYALTY_DISCOUNT_RATE (module-level constant, value 0.2), LOYALTY_THRESHOLD_YEARS (module-level constant, value 2)

## After cycle 12
- Change: merged two separate `for (item of step.items)` loops into one -- type counting, curse surcharge, and high-enchantment surcharge now computed in a single pass
- Rationale: Rule 3 (No Duplication) and Rule 4 (Fewest Elements) -- eliminated redundant iteration over the same collection
- Naming established: --

## After cycle 13
- Change: extracted `totalSurcharges` and `totalDiscounts` explaining variables from 7-term premium formula
- Rationale: Rule 2 (Reveals Intent) -- premium formula now reads as `basePremium + totalSurcharges - totalDiscounts + PROCESSING_FEE`, mapping directly to domain concepts
- Naming established: totalSurcharges (local const, sum of curseSurcharge + highEnchantmentSurcharge + firstInsuranceSurcharge), totalDiscounts (local const, sum of loyaltyDiscount + followUpDiscount)

## After cycle 14
- Change: extracted `processClaim(step, quoteStep)` helper function from inline claim block in processScenario
- Rationale: Rule 2 (Reveals Intent) -- main loop now clearly shows two domain operations (claim vs quote); claim logic gets a descriptive name and explicit return type `{ payout: number; remainingCap: number }`
- Naming established: processClaim (module-level function, computes insurance sum, cap, payout, and remaining cap for a claim step)

## After cycle 15
- Change: extracted `isHighEnchantment` explaining variable in processClaim; replaced mutable `let reimbursement` with const + ternary
- Rationale: Rule 2 (Reveals Intent) -- names the domain concept; also eliminates unnecessary mutation, consistent with explaining-variable pattern (isComponentType, formsBlockOf3)
- Naming established: isHighEnchantment (local const in processClaim damage loop, true when matched item's enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD)
