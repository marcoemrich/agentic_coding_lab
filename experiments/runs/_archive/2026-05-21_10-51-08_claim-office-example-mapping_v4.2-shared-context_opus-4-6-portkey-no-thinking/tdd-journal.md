# TDD Journal

## Cycle 1 -- Red: "empty item list => premium 5 G (processing fee only)"
- Compilation prediction: Failed to load url ./claim-office.js (module does not exist) -- Correct
- Runtime prediction: TypeError: Cannot read properties of undefined (reading 'premium') -- Correct
- Discrepancies: none

## Cycle 1 -- Green: "empty item list => premium 5 G (processing fee only)"
- Minimal implementation: hardcoded return { premium: 5 }
- Tests passing: 1

## Cycle 2 -- Red: "single sword (0 years, first quote) => premium 115 G (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 115, received 5 (hardcoded return from cycle 1) -- Correct
- Discrepancies: none

## Cycle 2 -- Green: "single sword (0 years, first quote) => premium 115 G (100 base + 10 first-insurance + 5 fee)"
- Minimal implementation: added conditional -- empty items returns 5, non-empty returns hardcoded 115
- Tests passing: 2

## Cycle 3 -- Red: "single amulet (0 years, first quote) => premium 71 G (60 base + 6 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 71, received 115 (hardcoded return for any non-empty items) -- Correct
- Discrepancies: none

## Cycle 3 -- Green: "single amulet (0 years, first quote) => premium 71 G (60 base + 6 first-insurance + 5 fee)"
- Minimal implementation: replaced hardcoded 110 with ternary on item type (sword=100, else=60) and formula basePremium + basePremium*0.1 + fee
- Tests passing: 3

## Cycle 4 -- Red: "single staff (0 years, first quote) => premium 93 G (80 base + 8 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 93, received 71 (ternary defaults to 60 for non-sword types) -- Correct
- Discrepancies: none

## Cycle 4 -- Green: "single staff (0 years, first quote) => premium 93 G (80 base + 8 first-insurance + 5 fee)"
- Minimal implementation: extended ternary to add staff case (sword=100, staff=80, else=60)
- Tests passing: 4

## Cycle 5 -- Red: "single potion (0 years, first quote) => premium 49 G (40 base + 4 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 49, received 71 (potion not in BASE_PREMIUM record, falls through to DEFAULT_BASE_PREMIUM of 60) -- Correct
- Discrepancies: none

## Cycle 5 -- Green: "single potion (0 years, first quote) => premium 49 G (40 base + 4 first-insurance + 5 fee)"
- Minimal implementation: added potion: 40 to BASE_PREMIUM record
- Tests passing: 5

## Cycle 6 -- Red: "single rune (0 years, first quote) => premium 33 G (25 base + 2.5 first-insurance rounded up to 28 + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 33, received 71 (rune not in BASE_PREMIUM, falls to DEFAULT_BASE_PREMIUM of 60) -- Correct
- Discrepancies: none

## Cycle 6 -- Green: "single rune (0 years, first quote) => premium 33 G (25 base + 2.5 first-insurance rounded up to 28 + 5 fee)"
- Minimal implementation: added rune: 25 to BASE_PREMIUM record; wrapped return in Math.ceil for rounding
- Tests passing: 6

## Cycle 7 -- Red: "2 runes => 50 G base premium (no block)"
- Compilation prediction: No compilation error (function exists with compatible signature) -- Correct
- Runtime prediction: Expected 60, received 33 (only first item's base premium used, ignores second rune) -- Correct
- Discrepancies: none

## Cycle 7 -- Green: "2 runes => 50 G base premium (no block)"
- Minimal implementation: replaced single-item basePremium lookup with a loop summing base premiums across all items
- Tests passing: 7

## Cycle 8 -- Red: "3 runes => 60 G base premium (block of 3 alike applies)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 71, received 88 (3*25=75 base with no block discount, yields 88 after surcharge+fee) -- Correct
- Discrepancies: none

## Cycle 8 -- Green: "3 runes => 60 G base premium (block of 3 alike applies)"
- Minimal implementation: replaced per-item loop with count-by-type grouping; groups of exactly 3 use BLOCK_PREMIUM (60) instead of 3 * per-item premium
- Tests passing: 8

## Cycle 9 -- Red: "4 runes => 100 G base premium (no block; block requires exactly 3)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Test passes immediately with value 115 (Cycle 8 generalization handles this) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Cycle 8's count === BLOCK_SIZE guard already routes non-3 counts to per-item pricing.

## Cycle 10 -- Red: "7 runes => 175 G base premium (no blocks possible)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Test passes immediately with value 198 (Cycle 8 generalization handles non-3 counts via per-item pricing) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Same reasoning as Cycle 9 -- count !== BLOCK_SIZE routes to per-item pricing.

## Cycle 11 -- Red: "2 runes + 1 moonstone => 75 G base premium (no block; different types are not alike)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 88, received 126 (moonstone not in BASE_PREMIUM, defaults to 60 instead of 25) -- Correct
- Discrepancies: none

## Cycle 11 -- Green: "2 runes + 1 moonstone => 75 G base premium (no block; different types are not alike)"
- Minimal implementation: added moonstone: 25 to BASE_PREMIUM record
- Tests passing: 11

## Cycle 12 -- Red: "3 runes + 3 moonstones => 120 G base premium (two separate blocks of alike components)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Test passes immediately with value 137 (countByType groups separately, itemGroupPremium returns BLOCK_PREMIUM for each group of exactly 3) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Cycle 8's block discount + Cycle 11's moonstone support already handle two separate blocks of alike components.

## Cycle 13 -- Red: "cursed sword (0 years, first quote) => premium 165 G (100 base + 50 curse + 10 first-ins + 5 fee)"
- Compilation prediction: "Object literal may only specify known properties, and 'cursed' does not exist in type 'Item'" -- Incorrect (vitest/esbuild skips type checking)
- Runtime prediction: Expected 165, received 115 -- Correct
- Discrepancies: No compilation error because vitest uses esbuild transpilation without TypeScript type checking; added `cursed?: boolean` to Item interface manually

## Cycle 13 -- Green: "cursed sword (0 years, first quote) => premium 165 G (100 base + 50 curse + 10 first-ins + 5 fee)"
- Minimal implementation: added CURSE_SURCHARGE_RATE constant and loop over items to accumulate curse surcharge (50% of cursed item's base premium); added curseSurcharge to premium formula
- Tests passing: 13

## Cycle 14 -- Red: "sword with enchantment 5 (0 years, first quote) => premium 145 G (100 base + 30 high-ench + 10 first-ins + 5 fee)"
- Compilation prediction: No compilation error (vitest/esbuild skips type checking; function already exists) -- Correct
- Runtime prediction: Expected 145, received 115 (implementation ignores enchantment property) -- Correct
- Discrepancies: none

## Cycle 14 -- Green: "sword with enchantment 5 (0 years, first quote) => premium 145 G (100 base + 30 high-ench + 10 first-ins + 5 fee)"
- Minimal implementation: added HIGH_ENCHANTMENT_THRESHOLD and HIGH_ENCHANTMENT_SURCHARGE_RATE constants; accumulated highEnchantmentSurcharge in existing item loop for items with enchantment >= 5; added to premium formula
- Tests passing: 14

## Cycle 15 -- Red: "sword with enchantment 4 (0 years, first quote) => premium 115 G (no high-enchantment surcharge)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Test passes immediately with value 115 (enchantment 4 < threshold 5, no surcharge) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Cycle 14's HIGH_ENCHANTMENT_THRESHOLD >= 5 guard already excludes enchantment 4 from the surcharge.

## Cycle 16 -- Red: "cursed sword with enchantment 5 (0 years, first quote) => premium 195 G (100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee)"
- Compilation prediction: No compilation error (function and interface already exist with compatible signature) -- Correct
- Runtime prediction: Test passes immediately with value 195 (itemSurcharges already accumulates both curse and high-enchantment surcharges independently) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Cycles 13 and 14's generalized itemSurcharges function already handles both surcharges on the same item.

## Cycle 17 -- Red: "cursed sword + plain amulet (0 years, first quote) => 231 G (curse does not affect amulet)"
- Compilation prediction: No compilation error (function and interface already exist) -- Correct
- Runtime prediction: Test passes immediately with value 231 (basePremium sums group premiums, itemSurcharges applies curse per-item, firstInsuranceSurcharge on policy base total) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Prior cycles' implementation already computes item-specific surcharges per-item and policy-wide modifiers on the base total.

## Cycle 18 -- Red: "long-standing customer (exactly 2 years), plain sword, first quote => premium 95 G (100 - 20 loyalty + 10 first-ins + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 95, received 115 (no loyalty discount applied; implementation ignores yearsWithMHPCO) -- Correct
- Discrepancies: none

## Cycle 18 -- Green: "long-standing customer (exactly 2 years), plain sword, first quote => premium 95 G (100 - 20 loyalty + 10 first-ins + 5 fee)"
- Minimal implementation: added LOYALTY_THRESHOLD and LOYALTY_DISCOUNT_RATE constants; computed loyaltyDiscount as 20% of basePremium when yearsWithMHPCO >= 2; subtracted from premium formula
- Tests passing: 18

## Cycle 19 -- Red: "customer with 1 year, plain sword, first quote => premium 115 G (no loyalty discount)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Test passes immediately with value 115 (yearsWithMHPCO=1 < LOYALTY_THRESHOLD=2, no loyalty discount) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Cycle 18's LOYALTY_THRESHOLD >= 2 guard already excludes customers with 1 year from the loyalty discount.

## Cycle 20 -- Red: "second quote in scenario (0 years), plain sword => premium 100 G (100 + 10 first-ins - 15 follow-up + 5 fee)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected 100, received 115 (implementation ignores isFollowUp, no follow-up discount applied) -- Correct
- Discrepancies: none

## Cycle 20 -- Green: "second quote in scenario (0 years), plain sword => premium 100 G (100 + 10 first-ins - 15 follow-up + 5 fee)"
- Minimal implementation: added FOLLOW_UP_DISCOUNT_RATE constant and followUpDiscount computation (15% of basePremium when isFollowUp is true); subtracted from premium formula
- Tests passing: 20

## Cycle 21 -- Red: "first-insurance surcharge always applies to every item regardless of customer history (per spec Q3)"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) — Correct
- Runtime prediction: Test passes immediately with value 149 (firstInsuranceSurcharge already unconditional) — Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing implementation already computes firstInsuranceSurcharge unconditionally, confirming Q3's requirement that it applies regardless of customer history.

## Cycle 22 -- Red: "newcomer with cursed sword => 165 G (100 base + 50 curse + 10 first-ins = 160 + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately with value 165 (integration test covers already-implemented code paths) — Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. This E12 integration test exercises the same code paths as the unit test from cycle 13, with the addition of enchantment: 3 which is below the HIGH_ENCHANTMENT_THRESHOLD and has no effect.

## Cycle 23 -- Red: "long-standing customer second contract: cursed ench-7 sword => 160 G"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) — Correct
- Runtime prediction: Test passes immediately with value 160 (all modifiers already implemented) — Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. This E13 integration test combines curse surcharge (cycle 13), high-enchantment surcharge (cycle 14), loyalty discount (cycle 18), first-insurance surcharge (unconditional), and follow-up discount (cycle 20).

## Cycle 24 -- Red: "premium calculation yielding 197.5 G => final premium 198 G (rounded up in MHPCO favor)"
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately with value 198 (Math.ceil rounding already implemented in Cycle 6) — Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. Math.ceil was added in Cycle 6 and already handles this E11 rounding scenario. The 7 runes input produces basePremium=175, firstInsuranceSurcharge=17.5, fee=5, raw=197.5, ceil=198.

## Cycle 25 -- Red: "regular steel sword ench 3, damage 500 G => payout 400 G (full reimbursement minus 100 G deductible)"
- Compilation prediction: No compilation error (claim already exported and imported, vitest/esbuild skips type checking) — Correct
- Runtime prediction: TypeError: Cannot read properties of undefined (reading 'payout') — Correct
- Discrepancies: none

## Cycle 25 -- Green: "regular steel sword ench 3, damage 500 G => payout 400 G (full reimbursement minus 100 G deductible)"
- Minimal implementation: added INSURANCE_VALUE record (sword only), DEDUCTIBLE constant, and claim function that computes payout (damage - deductible) and remainingCap (2x insurance sum - payout)
- Tests passing: 25

## Cycle 26 -- Red: "rune, damage 200 G => payout 100 G (full reimbursement minus 100 G deductible; no special clause)"
- Compilation prediction: No compilation error (function already exists with compatible signature) -- Correct
- Runtime prediction: Expected remainingCap 400, received -100 (rune not in INSURANCE_VALUE, insuranceSum=0, cap=0) -- Correct
- Discrepancies: none

## Cycle 26 -- Green: "rune, damage 200 G => payout 100 G (full reimbursement minus 100 G deductible; no special clause)"
- Minimal implementation: added rune: 250 to INSURANCE_VALUE record
- Tests passing: 26

## Cycle 27 -- Red: "dragon-material sword ench 9, damage 1000 G => payout 400 G (both clauses: 50% wins, 500 - 100 deductible)"
- Compilation prediction: No compilation error (vitest/esbuild skips type checking; function already exists) -- Correct
- Runtime prediction: Expected 400, received 900 (claim does full reimbursement 1000-100=900, ignoring enchantment/material clauses) -- Correct
- Discrepancies: none

## Cycle 27 -- Green: "dragon-material sword ench 9, damage 1000 G => payout 400 G (both clauses: 50% wins, 500 - 100 deductible)"
- Minimal implementation: added enchantment >= 8 check in claim damage loop; finds matching policy item and applies 50% reimbursement rate before deductible when threshold met
- Tests passing: 27

## Cycle 28 -- Red: "dragon-material sword ench 5, damage 800 G => payout 700 G (dragon clause only: full, 800 - 100)"
- Compilation prediction: No compilation error (vitest/esbuild skips type checking; function already exists) -- Correct
- Runtime prediction: Test passes immediately with payout 700 and remainingCap 1300 (enchantment 5 < threshold 8, standard full reimbursement matches dragon clause result) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The dragon clause specifies full reimbursement, which is the same as the standard reimbursement path. Since enchantment 5 < HIGH_ENCHANTMENT_CLAIM_THRESHOLD (8), the else branch already computes damage.amount (full reimbursement), yielding 800-100=700.

## Cycle 29 -- Red: "steel sword ench 9, damage 1000 G => payout 400 G (enchantment clause only: 50%, 500 - 100)"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 400 and remainingCap 1600 (enchantment >= 8 check applies 50% reimbursement regardless of material) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD check (cycle 27) already handles steel swords with high enchantment; material is not consulted in the reimbursement logic.

## Cycle 30 -- Red: "dragon-material sword ench exactly 8, damage 1000 G => payout 400 G (high-ench clause: 50%, 500 - 100)"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 400 and remainingCap 1600 (enchantment 8 >= threshold 8 triggers 50% reimbursement) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. This E8 boundary test confirms that enchantment exactly at the HIGH_ENCHANTMENT_CLAIM_THRESHOLD (8) triggers the 50% reimbursement clause, which was already implemented in cycle 27 using `>=` comparison.

## Cycle 31 -- Red: "deductible per damage event: sword 500 G + amulet 300 G => total payout 600 G (100 G deductible per item)"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Expected remainingCap 2600, received 1400 (amulet missing from INSURANCE_VALUE, insuranceSum=1000 instead of 1600) -- Correct
- Discrepancies: none

## Cycle 31 -- Green: "deductible per damage event: sword 500 G + amulet 300 G => total payout 600 G (100 G deductible per item)"
- Minimal implementation: added amulet: 600 to INSURANCE_VALUE record
- Tests passing: 31

## Cycle 32 -- Red: "two swords insured => insurance sum 2000 G, cap 4000 G"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 400 and remainingCap 3600 (existing implementation already sums insurance values across all policy items including duplicates) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing `claim` function iterates over all policy items in the insuranceSum loop, so two swords correctly produce insuranceSum=2000 and totalCap=4000.

## Cycle 33 -- Red: "two sword damages both get their own deductible"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 800 and remainingCap 3200 (damage loop already processes each entry independently with its own deductible) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing damage loop in `claim` iterates over each damage entry independently, applying `grossReimbursement - DEDUCTIBLE` per entry, which naturally gives each sword damage its own 100 G deductible.

## Cycle 34 -- Red: "sword + amulet => insurance sum 1600 G, cap 3200 G (2x insurance sum)"
- Compilation prediction: No compilation error (claim already exists and is imported) — Correct
- Runtime prediction: Test passes immediately (payout 100, remainingCap 3100; existing implementation sums sword+amulet insurance values and computes 2x cap correctly) — Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing `claim` function already computes insuranceSum from all policy items (sword 1000 + amulet 600 = 1600) and totalCap = 2 * insuranceSum = 3200. The deductible test in cycle 31 implicitly proved this same cap value.

## Cycle 35 -- Red: "cursed sword: cap based on unmodified insurance value (1000 G => cap 2000 G, not affected by premium modifiers)"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 100 and remainingCap 1900 (insuranceSum computed by item type only, ignoring premium modifiers) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing `claim` function computes insuranceSum from INSURANCE_VALUE keyed by item type, which inherently ignores premium modifiers like `cursed`. This confirms E10's rule that the cap is based on unmodified insurance values.

## Cycle 36 -- Red: "sword + 3 runes block => insurance sum 1750 G (block discount affects premium only, not insurance sum)"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 100 and remainingCap 3400 (insuranceSum computed per-item from INSURANCE_VALUE, unaffected by block discount) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing `claim` function iterates over individual policy items to compute insuranceSum from INSURANCE_VALUE (1000 + 250 + 250 + 250 = 1750), which is completely independent of the block discount logic in `itemGroupPremium`. This confirms E10's rule that block discount affects premium only, not insurance sum.

## Cycle 37 -- Red: "cap exhaustion first claim: damage 1500 G => payout 1400 G, remaining cap 600 G"
- Compilation prediction: No compilation error (function already exists, vitest/esbuild skips type checking) -- Correct
- Runtime prediction: Test passes immediately with payout 1400 and remainingCap 600 (payout within cap, no capping logic needed) -- Correct
- Discrepancies: none
- Note: Test passed immediately; no Green phase needed. The existing `claim` function computes payout = 1500 - 100 = 1400 and remainingCap = 2000 - 1400 = 600. Since the uncapped payout (1400) does not exceed the total cap (2000), the current implementation produces the correct result without any cap-enforcement logic.

## Cycle 38 -- Red: "cap exhaustion second claim: damage 1500 G => payout 600 G (capped to remaining), remaining cap 0 G"
- Compilation prediction: No compilation error (vitest/esbuild skips type checking; extra arguments silently ignored in JS) -- Correct
- Runtime prediction: Expected 600, received 1400 (claim ignores previousPayouts third argument, computes uncapped 1500-100=1400) -- Correct
- Discrepancies: none
