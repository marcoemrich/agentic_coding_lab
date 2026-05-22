# TDD Journal

## Cycle 1 — Red: should return 5 G for an empty item list (processing fee only)
- Compilation prediction: Cannot find module './claim-office.js' (file does not exist) — Correct
- Runtime prediction: Expected 5, received undefined — Correct
- Discrepancies: none

## Cycle 1 — Green: should return 5 G for an empty item list (processing fee only)
- Minimal implementation: hardcoded return 5
- Tests passing: 1

## Cycle 2 — Red: should return 105 G for a single sword (100 base + 5 fee)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 105, received 5 — Correct
- Discrepancies: none

## Cycle 2 — Green: should return 105 G for a single sword (100 base + 5 fee)
- Minimal implementation: added loop over items with sword type check adding 100 base premium
- Tests passing: 2

## Cycle 3 — Red: should return 65 G for a single amulet (60 base + 5 fee)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 65, received 5 — Correct
- Discrepancies: none

## Cycle 3 — Green: should return 65 G for a single amulet (60 base + 5 fee)
- Minimal implementation: added else-if branch for "amulet" type adding 60 base premium
- Tests passing: 3

## Cycle 4 — Red: should return 85 G for a single staff (80 base + 5 fee)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 85, received 5 — Correct
- Discrepancies: none

## Cycle 4 — Green: should return 85 G for a single staff (80 base + 5 fee)
- Minimal implementation: added `staff: 80` entry to BASE_PREMIUM map
- Tests passing: 4

## Cycle 5 — Red: should return 45 G for a single potion (40 base + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 45, received 5 — Correct
- Discrepancies: none

## Cycle 5 — Green: should return 45 G for a single potion (40 base + 5 fee)
- Minimal implementation: added `potion: 40` entry to BASE_PREMIUM map
- Tests passing: 5

## Cycle 6 — Red: should return 30 G for a single rune component (25 base + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 30, received 5 — Correct
- Discrepancies: none

## Cycle 6 — Green: should return 30 G for a single rune component (25 base + 5 fee)
- Minimal implementation: added `rune: 25` entry to BASE_PREMIUM map
- Tests passing: 6

## Cycle 7 — Red: should return 55 G for 2 runes (50 base + 5 fee, no block)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately (55 = 55, existing additive logic handles 2 runes) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly sums 2 x 25 + 5 = 55. No Green phase needed.

## Cycle 8 — Red: should return 65 G for 3 runes (60 base + 5 fee, block applies for exactly 3 alike)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 65, received 80 (3 x 25 + 5 = 80, no block logic) — Correct
- Discrepancies: none

## Cycle 8 — Green: should return 65 G for 3 runes (60 base + 5 fee, block applies for exactly 3 alike)
- Minimal implementation: added component block logic -- group items by type, if a component type has exactly 3 items use 60 G block premium instead of 3x25
- Tests passing: 8

## Cycle 9 — Red: should return 105 G for 4 runes (100 base + 5 fee, no block -- block requires exactly 3)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Test passes immediately (105 = 105, existing block logic correctly rejects count != 3) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles 4 runes as non-block (4 x 25 + 5 = 105). No Green phase needed.

## Cycle 10 — Red: should return 180 G for 7 runes (175 base + 5 fee, no block)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately (180 = 180, existing logic handles 7 runes as non-block: 7 x 25 + 5 = 180) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles 7 runes as non-block. No Green phase needed.

## Cycle 11 — Red: should return 80 G for 2 runes + 1 moonstone (75 base + 5 fee, no block -- different types)
- Compilation prediction: No compilation error (function and types already exist with compatible signatures) — Correct
- Runtime prediction: Expected 80, received 55 (moonstone not in BASE_PREMIUM, contributes 0 instead of 25) — Correct
- Discrepancies: none

## Cycle 11 — Green: should return 80 G for 2 runes + 1 moonstone (75 base + 5 fee, no block -- different types)
- Minimal implementation: added `moonstone: 25` entry to BASE_PREMIUM map
- Tests passing: 11

## Cycle 12 — Red: should return 125 G for 3 runes + 3 moonstones (120 base + 5 fee, two separate blocks)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 125, received 140 (moonstone not in COMPONENT_TYPES, block discount not applied to moonstones) — Correct
- Discrepancies: none

## Cycle 12 — Green: should return 125 G for 3 runes + 3 moonstones (120 base + 5 fee, two separate blocks)
- Minimal implementation: added "moonstone" to COMPONENT_TYPES array
- Tests passing: 12

## Cycle 13 — Red: should add 50% cursed surcharge to the cursed item's base premium only
- Compilation prediction: No compilation error (Vitest/esbuild strips types, extra properties allowed at runtime) — Correct
- Runtime prediction: Expected 155, received 105 — Correct
- Discrepancies: none

## Cycle 13 — Green: should add 50% cursed surcharge to the cursed item's base premium only
- Minimal implementation: added `cursed?: boolean` to Item interface, added per-item cursed surcharge loop (50% of base premium for cursed items)
- Tests passing: 13

## Cycle 14 — Red: should add 30% high-enchantment surcharge for enchantment level >= 5
- Compilation prediction: No compilation error (function exists, esbuild strips types) — Correct
- Runtime prediction: Expected 135, received 105 — Correct
- Discrepancies: none

## Cycle 14 — Green: should add 30% high-enchantment surcharge for enchantment level >= 5
- Minimal implementation: added `enchantment?: number` to Item interface, added `highEnchantmentSurchargeFor` helper (30% of base premium when enchantment >= 5), included enchantment surcharge in quote total
- Tests passing: 14

## Cycle 15 — Red: should not add high-enchantment surcharge for enchantment level 4
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Test passes immediately (105 = 105, existing >= 5 check correctly rejects enchantment 4) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles the boundary. No Green phase needed.

## Cycle 16 — Red: should apply both cursed and high-enchantment surcharges when both conditions met (enchantment 5 + cursed)
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Test passes immediately (185 = 185, existing itemSurchargesFor sums both surcharges) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles both surcharges stacking additively via itemSurchargesFor. No Green phase needed.

## Cycle 17 — Red: should apply cursed surcharge only to the cursed item -- cursed sword (100) + plain amulet (60) = 210 before policy modifiers and fee
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Test passes immediately (215 = 215, existing itemSurchargesFor applies per-item surcharges correctly) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly scopes cursed surcharge to the cursed item only via the per-item itemSurchargesFor loop. No Green phase needed.

## Cycle 18 — Red: should apply 20% loyalty discount when customer has >= 2 years with MHPCO
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 85, received 105 (no loyalty discount logic implemented) — Correct
- Discrepancies: none

## Cycle 18 — Green: should apply 20% loyalty discount when customer has >= 2 years with MHPCO
- Minimal implementation: added loyaltyDiscount calculation (20% of basePremium when yearsWithMHPCO >= 2), subtracted from total
- Tests passing: 18

## Cycle 19 — Red: should apply loyalty discount when customer has exactly 2 years with MHPCO
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Test passes immediately (53 = 53, existing loyalty discount logic handles yearsWithMHPCO >= 2 boundary correctly) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles the exact boundary. No Green phase needed.

## Cycle 20 — Red: should not apply loyalty discount when customer has < 2 years with MHPCO
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Test passes immediately (105 = 105, existing loyaltyDiscountFor correctly returns 0 when yearsWithMHPCO < 2) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles the below-threshold case. No Green phase needed.

## Cycle 21 — Red: should apply 10% first insurance surcharge on the policy base premium
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 115, received 105 (no first insurance surcharge logic exists) — Correct
- Discrepancies: none

## Cycle 21 — Green: should apply 10% first insurance surcharge on the policy base premium
- Minimal implementation: added `firstInsuranceSurcharge = basePremium * 0.1` to quote total; added `Math.ceil` to final return (required because surcharge creates fractional results for odd base premiums); updated all 20 existing test expectations to account for the always-applied 10% surcharge
- Tests passing: 21

## Cycle 22 — Red: should apply 15% follow-up contract discount on the customer's second quote in the scenario
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Expected 100, received 115 — Correct
- Discrepancies: none

## Cycle 22 — Green: should apply 15% follow-up contract discount on the customer's second quote in the scenario
- Minimal implementation: added `followUpDiscountFor(basePremium, customer)` helper (15% of basePremium when previousQuotes >= 1), subtracted from total in quote
- Tests passing: 22

## Cycle 23 — Red: should round premium UP when calculation yields a fractional amount (e.g. 197.5 -> 198 G)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Test passes immediately (198 = 198, existing Math.ceil rounding already handles fractional premiums) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly rounds premiums up via Math.ceil. No Green phase needed.

## Cycle 24 — Red: should return 165 G for newcomer (0 years, first contract) with cursed steel sword ench 3 (100 base + 50 curse + 10 first insurance = 160 + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately (165 = 165, all individual pieces already implemented) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles the newcomer cursed sword integration scenario. No Green phase needed.

## Cycle 25 — Red: should return 160 G for 3-year customer's second contract with cursed steel sword ench 7
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately (160 = 160, all individual modifiers already implemented) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles the long-standing customer second contract integration scenario. No Green phase needed.

## Cycle 26 — Red: should return payout 400 G for regular steel sword (ench 3), damage 500 G (full reimbursement minus 100 deductible)
- Compilation prediction: No compilation error (claim function already exists and is imported; esbuild strips types) — Correct
- Runtime prediction: Expected 400, received 0 — Correct
- Discrepancies: none

## Cycle 26 — Green: should return payout 400 G for regular steel sword (ench 3), damage 500 G (full reimbursement minus 100 deductible)
- Minimal implementation: hardcoded return { payout: 400, remainingCap: 0 }
- Tests passing: 26

## Cycle 27 — Red: should return payout 100 G for rune component, damage 200 G (full reimbursement minus 100 deductible; no special clause)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 100, received 400 — Correct
- Discrepancies: none

## Cycle 27 — Green: should return payout 100 G for rune component, damage 200 G (full reimbursement minus 100 deductible; no special clause)
- Minimal implementation: replaced hardcoded return with reduce over damages computing (amount - 100) per entry
- Tests passing: 27

## Cycle 28 — Red: should reimburse at 50% for items with enchantment >= 8 -- steel sword ench 9, damage 1000 G -> payout 400 G (500 - 100)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 400, received 900 (no reimbursement clause logic; claim just subtracts deductible: 1000 - 100 = 900) — Correct
- Discrepancies: none

## Cycle 28 — Green: should reimburse at 50% for items with enchantment >= 8 -- steel sword ench 9, damage 1000 G -> payout 400 G (500 - 100)
- Minimal implementation: added policy item lookup by type in claim reduce; apply 50% reimbursement when enchantment >= 8, otherwise full amount
- Tests passing: 28

## Cycle 29 — Red: should reimburse at 50% for dragon-material sword with ench 8, damage 1000 G -> payout 400 G (500 - 100)
- Compilation prediction: No compilation error (function exists, esbuild strips types) — Correct
- Runtime prediction: Test passes immediately (400 = 400, existing enchantment >= 8 check handles ench 8 dragon-material sword) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles high-enchantment reimbursement at the exact threshold. No Green phase needed.

## Cycle 30 — Red: should fully reimburse dragon-material items with ench < 8 -- dragon sword ench 5, damage 800 G -> payout 700 G (800 - 100)
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Test passes immediately (700 = 700, enchantment 5 < 8 so full reimbursement: 800 - 100 = 700) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles dragon-material items with enchantment below 8 via the standard full-reimbursement path. No Green phase needed.

## Cycle 31 — Red: should apply 50% rule when both dragon material and ench >= 8 -- dragon sword ench 9, damage 1000 G -> payout 400 G
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Test passes immediately (400 = 400, existing enchantment >= 8 check handles dragon material + high enchantment) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly applies 50% reimbursement when enchantment >= 8, which is exactly the rule that wins when both dragon material and high enchantment are present. No Green phase needed.

## Cycle 32 — Red: should apply 100 G deductible per damaged item -- sword (500 G) + amulet (300 G) -> payout 600 G ((500-100) + (300-100))
- Compilation prediction: No compilation error (function exists, types compatible) — Correct
- Runtime prediction: Test passes immediately (600 = 600, existing reduce-over-damages already handles multiple items with per-item deductible) — Correct
- Discrepancies: Test passed without any code changes; existing implementation already correctly handles multiple damaged items with individual 100 G deductibles via the reduce loop. No Green phase needed.

## Cycle 33 — Red: should round payout DOWN when calculation yields a fractional amount (e.g. 350.5 -> 350 G)
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 350, received 350.5 — Correct
- Discrepancies: none

## Cycle 33 — Green: should round payout DOWN when calculation yields a fractional amount (e.g. 350.5 -> 350 G)
- Minimal implementation: wrapped payout in Math.floor() in claim return statement
- Tests passing: 33

## Cycle 34 — Red: should set cap at 2x insurance sum -- sword (1000) + amulet (600) = insurance sum 1600, cap 3200 G
- Compilation prediction: No compilation error (function already exists with compatible types) — Correct
- Runtime prediction: Expected 2800, received 0 — Correct
- Discrepancies: none

## Cycle 34 — Green: should set cap at 2x insurance sum -- sword (1000) + amulet (600) = insurance sum 1600, cap 3200 G
- Minimal implementation: added INSURANCE_VALUE map, computed insuranceSum from policy items, set cap = 2 * insuranceSum, returned remainingCap = cap - payout
- Tests passing: 34
