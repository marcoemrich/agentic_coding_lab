# TDD Journal

## Cycle 1 — Red: should return 100 G base premium for a single sword
- Compilation prediction: Failed to load url ./claim-office.js (module does not exist) — Correct
- Runtime prediction: Expected 100, received undefined — Correct
- Discrepancies: none

## Cycle 1 — Green: should return 100 G base premium for a single sword
- Minimal implementation: hardcoded return 100
- Tests passing: 1

## Cycle 2 — Red: should return 60 G base premium for a single amulet
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected 60, received 100 — Correct
- Discrepancies: none

## Cycle 2 — Green: should return 60 G base premium for a single amulet
- Minimal implementation: added conditional `if (items[0].type === "amulet") return 60;` before default return 100
- Tests passing: 2

## Cycle 3 — Red: should return 80 G base premium for a single staff
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 80, received undefined — Correct
- Discrepancies: none

## Cycle 3 — Green: should return 80 G base premium for a single staff
- Minimal implementation: added `staff: 80` entry to BASE_PREMIUM lookup table
- Tests passing: 3

## Cycle 4 — Red: should return 40 G base premium for a single potion
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected 40, received undefined — Correct
- Discrepancies: none

## Cycle 4 — Green: should return 40 G base premium for a single potion
- Minimal implementation: added `potion: 40` entry to BASE_PREMIUM lookup table
- Tests passing: 4

## Cycle 5 — Red: should return 25 G base premium for a single rune component
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected 25, received undefined — Correct
- Discrepancies: none

## Cycle 5 — Green: should return 25 G base premium for a single rune component
- Minimal implementation: added `rune: 25` entry to BASE_PREMIUM lookup table
- Tests passing: 5

## Cycle 6 — Red: should return 50 G base premium for 2 runes (no block)
- Compilation prediction: No compilation error (function already exists, types compatible) — Correct
- Runtime prediction: Expected 50, received 25 — Correct
- Discrepancies: none

## Cycle 6 — Green: should return 50 G base premium for 2 runes (no block)
- Minimal implementation: replaced single-item lookup with loop summing BASE_PREMIUM for all items
- Tests passing: 6

## Cycle 7 — Red: should return 60 G base premium for 3 runes (block discount applies)
- Compilation prediction: No compilation error (function already exists and types are compatible) — Correct
- Runtime prediction: Expected 60, received 75 — Correct
- Discrepancies: none

## Cycle 7 — Green: should return 60 G base premium for 3 runes (block discount applies)
- Minimal implementation: added early-return guard for exactly 3 alike items with base premium 25 (components), returning 60
- Tests passing: 7

## Cycle 8 — Red: should return 100 G base premium for 4 runes (no block -- block requires exactly 3)
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: No runtime error, test passes immediately (4 x 25 = 100, isComponentBlock rejects length != 3) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already handles this boundary case)

## Cycle 9 — Red: should return 175 G base premium for 7 runes (no blocks possible)
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: No runtime error, test passes immediately (7 x 25 = 175, isComponentBlock rejects length != 3) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already handles this case)

## Cycle 10 — Red: should return 75 G base premium for 2 runes + 1 moonstone (no block -- different types)
- Compilation prediction: Type '"moonstone"' not assignable to ItemType — Incorrect (Vitest/esbuild strips types, no compile error)
- Runtime prediction: not formally made (expected compilation error first); actual result was NaN to be 75 — Incorrect
- Discrepancies: esbuild transpilation bypasses TS type checking; BASE_PREMIUM["moonstone"] returns undefined which becomes NaN in reduce sum

## Cycle 10 — Green: should return 75 G base premium for 2 runes + 1 moonstone (no block -- different types)
- Minimal implementation: added `moonstone: 25` to BASE_PREMIUM and `"moonstone"` to COMPONENT_TYPES set
- Tests passing: 10

## Cycle 11 — Red: should return 120 G base premium for 3 runes + 3 moonstones (two separate blocks)
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Expected 120, received 150 — Correct
- Discrepancies: none

## Cycle 11 — Green: should return 120 G base premium for 3 runes + 3 moonstones (two separate blocks)
- Minimal implementation: replaced single-block early-return with group-by-type loop; each group of exactly 3 alike components gets BLOCK_PREMIUM, others get regular per-item pricing
- Tests passing: 11

## Cycle 12 — Red: should add 50% cursed surcharge to the cursed item base premium only -- cursed sword (100) + plain amulet (60) = 210 G before policy modifiers and fee
- Compilation prediction: No compilation error (esbuild strips types, extra `cursed` property ignored) — Correct
- Runtime prediction: Expected 210, received 160 — Correct
- Discrepancies: none

## Cycle 12 — Green: should add 50% cursed surcharge to the cursed item base premium only
- Minimal implementation: extended Item type with optional `cursed` property; added loop after group premium summation that adds 50% of BASE_PREMIUM for each cursed item
- Tests passing: 12

## Cycle 13 — Red: should add 30% high-enchantment surcharge for item with enchantment >= 5
- Compilation prediction: No compilation error (esbuild strips types, extra enchantment property ignored) — Correct
- Runtime prediction: Expected 130, received 100 — Correct
- Discrepancies: none

## Cycle 13 — Green: should add 30% high-enchantment surcharge for item with enchantment >= 5
- Minimal implementation: added `enchantmentSurcharge` accumulator in item loop; adds 30% of base premium when `enchantment >= 5`
- Tests passing: 13

## Cycle 14 — Red: should not add high-enchantment surcharge for item with enchantment 4
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: No runtime error, test passes immediately (enchantment 4 < 5, no surcharge applied, returns 100) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already handles this boundary case)

## Cycle 15 — Red: should stack cursed and high-enchantment surcharges on the same item
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: No runtime error, test passes immediately (100 base + 50 cursed + 30 enchantment = 180, itemSurcharge already stacks both) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already handles stacking)

## Cycle 16 — Red: should apply 20% loyalty discount for customer with yearsWithMHPCO >= 2
- Compilation prediction: No compilation error (esbuild strips types, extra customer argument ignored) — Correct
- Runtime prediction: Expected 80, received 100 — Correct
- Discrepancies: none

## Cycle 16 — Green: should apply 20% loyalty discount for customer with yearsWithMHPCO >= 2
- Minimal implementation: added optional `customer` parameter to `calculateBasePremium`; apply -20% to policy premium when `yearsWithMHPCO >= 2`
- Tests passing: 16

## Cycle 17 — Red: should apply loyalty discount for customer with exactly 2 years
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: No runtime error, test passes immediately (2 >= 2 triggers loyalty discount, 100 * 0.8 = 80) — Correct
- Discrepancies: none (test is a boundary regression guard; existing >= comparison already handles exact threshold)

## Cycle 18 — Red: should not apply loyalty discount for customer with 1 year
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: No runtime error, test passes immediately (1 < 2 threshold, no discount, returns 100) — Correct
- Discrepancies: none (test is a boundary regression guard; existing >= comparison already rejects 1 year)

## Cycle 19 — Red: should add 10% first insurance surcharge on policy base premium (always applies per item in quote)
- Compilation prediction: No compilation error (function already exists, valid call signature) — Correct
- Runtime prediction: Expected 110, received 100 — Correct
- Discrepancies: none

## Cycle 19 — Green: should add 10% first insurance surcharge on policy base premium (always applies per item in quote)
- Minimal implementation: added `policyPremium += policyPremium * FIRST_INSURANCE_SURCHARGE_RATE` (always applies); updated 18 existing test expectations to include the surcharge
- Tests passing: 19

## Cycle 20 — Red: should apply 15% follow-up discount on second and subsequent quotes in a scenario
- Compilation prediction: No compilation error (esbuild strips types, extra third argument ignored at runtime) — Correct
- Runtime prediction: Expected 93.5, received 110 — Correct
- Discrepancies: none

## Cycle 20 — Green: should apply 15% follow-up discount on second and subsequent quotes in a scenario
- Minimal implementation: added optional third `options` parameter with `isFollowUp` flag; apply `*= 1 - 0.15` after first insurance surcharge when true
- Tests passing: 20

## Cycle 21 — Red: should add 5 G processing fee at the very end of premium calculation
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected 115, received 110 — Correct
- Discrepancies: none

## Cycle 21 — Green: should add 5 G processing fee at the very end of premium calculation
- Minimal implementation: added `PROCESSING_FEE = 5` constant and `+ PROCESSING_FEE` at return; updated 20 existing test expectations to include the fee
- Tests passing: 21

## Cycle 22 — Red: should return 5 G premium for empty item list (processing fee only)
- Compilation prediction: No compilation error (function exists, empty array is valid Item[]) — Correct
- Runtime prediction: No runtime error, test passes immediately (empty items yields policyPremium=0, plus 5 fee = 5) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already handles empty item list)

## Cycle 23 — Red: should apply item-specific modifiers to item base premium, then policy-wide modifiers to sum, then fee last
- Compilation prediction: No compilation error (function exists with compatible signature) — Correct
- Runtime prediction: No runtime error, test passes immediately (cursed sword + amulet with loyalty customer yields 189.8 as expected) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already applies modifiers in correct order)

## Cycle 24 — Red: should round premium UP (ceil) -- a calculation yielding 197.5 G becomes 198 G
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Expected 198, received 197.5 — Correct
- Discrepancies: none

## Cycle 24 — Green: should round premium UP (ceil) -- a calculation yielding 197.5 G becomes 198 G
- Minimal implementation: wrapped final return value in `Math.ceil()`; updated 5 existing test expectations from fractional to ceiled values
- Tests passing: 24

## Cycle 25 — Red: should round payout DOWN (floor) -- a calculation yielding 350.5 G becomes 350 G
- Compilation prediction: TypeError: calculatePayout is not a function (module loads but function not exported, import yields undefined) — Correct
- Runtime prediction: Expected 350, received 0 — Correct
- Discrepancies: none

## Cycle 25 — Green: should round payout DOWN (floor) -- a calculation yielding 350.5 G becomes 350 G
- Minimal implementation: hardcoded 50% reimbursement for all damages (ignoring policy), subtract 100 deductible per damage, Math.floor the total
- Tests passing: 25

## Cycle 26 — Red: should keep intermediates as fractions and round only the final result
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: No runtime error, test passes immediately (intermediates kept as fractions, Math.ceil only at final return, result is 65) — Correct
- Discrepancies: none (test is a regression guard; existing implementation already rounds only the final result)

## Cycle 27 — Red: should compute 165 G premium for newcomer with cursed sword (integration E12)
- Compilation prediction: No compilation error (function exists with compatible signature) — Correct
- Runtime prediction: Expected 165, received 170 (first insurance applies to base+surcharges=150 instead of base-only=100) — Correct
- Discrepancies: none

## Cycle 27 — Green: should compute 165 G premium for newcomer with cursed sword (integration E12)
- Minimal implementation: changed policy-wide modifiers to apply to basePremiumTotal only (not including item surcharges); totalSurcharge added after policy-wide modifiers; updated 4 existing test expectations to match corrected calculation order
- Tests passing: 27

## Cycle 28 — Red: should compute 160 G premium for 3-year customer on second quote with cursed sword (steel, enchantment 7) (integration E13)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: No runtime error, test passes immediately (all constituent features already implemented, returns 160) — Correct
- Discrepancies: none (test is a regression guard; all features composing E13 were implemented in prior cycles)

## Cycle 29 — Red: should apply 100 G deductible per damaged item -- sword 500 G + amulet 300 G = 600 G payout
- Compilation prediction: No compilation error (calculatePayout already exists and is imported) — Correct
- Runtime prediction: Expected 600, received 200 (hardcoded 50% reimbursement yields (500*0.5-100)+(300*0.5-100)=200 instead of full reimbursement) — Correct
- Discrepancies: none

## Cycle 29 — Green: should apply 100 G deductible per damaged item -- sword 500 G + amulet 300 G = 600 G payout
- Minimal implementation: look up matching policy item for each damage; apply 50% rate only when enchantment >= 8, otherwise full reimbursement (rate 1); replaces hardcoded 50% for all items
- Tests passing: 29
