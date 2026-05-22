# TDD Journal

## Cycle 1 -- Red: "should return premium 5 G for empty item list (only processing fee)"
- Compilation prediction: Failed to load url ./claim-office.js (file does not exist) -- Correct
- Runtime prediction: Expected { results: [{ premium: 5 }] }, received undefined -- Correct
- Discrepancies: none

## Cycle 1 -- Green: "should return premium 5 G for empty item list (only processing fee)"
- Minimal implementation: hardcoded return { results: [{ premium: 5 }] }
- Tests passing: 1

## Cycle 2 -- Red: "should return premium 115 G for a single sword (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected 115, received 5 -- Correct
- Discrepancies: none

## Cycle 2 -- Green: "should return premium 115 G for a single sword (100 base + 10 first-insurance + 5 fee)"
- Minimal implementation: added BASE_PREMIUMS map with sword=100, parsed scenario to compute policyBasePremium + 10% first-insurance + processing fee
- Tests passing: 2

## Cycle 3 -- Red: "should return premium 71 G for a single amulet (60 base + 6 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected { results: [{ premium: 71 }] }, received { results: [{ premium: 5 }] } -- Correct
- Discrepancies: none

## Cycle 3 -- Green: "should return premium 71 G for a single amulet (60 base + 6 first-insurance + 5 fee)"
- Minimal implementation: added amulet: 60 to BASE_PREMIUMS map
- Tests passing: 3

## Cycle 4 -- Red: "should return premium 93 G for a single staff (80 base + 8 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected { results: [{ premium: 93 }] }, received { results: [{ premium: 5 }] } -- Correct
- Discrepancies: none

## Cycle 4 -- Green: "should return premium 93 G for a single staff (80 base + 8 first-insurance + 5 fee)"
- Minimal implementation: added staff: 80 to BASE_PREMIUMS map
- Tests passing: 4

## Cycle 5 -- Red: "should return premium 49 G for a single potion (40 base + 4 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected { results: [{ premium: 49 }] }, received { results: [{ premium: 5 }] } -- Correct
- Discrepancies: none

## Cycle 5 -- Green: "should return premium 49 G for a single potion (40 base + 4 first-insurance + 5 fee)"
- Minimal implementation: added potion: 40 to BASE_PREMIUMS map
- Tests passing: 5

## Cycle 6 -- Red: "should return premium 60 G for 2 runes (50 base + 5 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists, type: string accepts "rune") -- Correct
- Runtime prediction: Expected { results: [{ premium: 60 }] }, received { results: [{ premium: 5 }] } -- Correct
- Discrepancies: none

## Cycle 6 -- Green: "should return premium 60 G for 2 runes (50 base + 5 first-insurance + 5 fee)"
- Minimal implementation: added rune: 25 to BASE_PREMIUMS map
- Tests passing: 6

## Cycle 7 -- Red: "should return premium 71 G for 3 runes with block discount (60 base + 6 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected { results: [{ premium: 71 }] }, received { results: [{ premium: 87.5 }] } -- Correct
- Discrepancies: none

## Cycle 7 -- Green: "should return premium 71 G for 3 runes with block discount (60 base + 6 first-insurance + 5 fee)"
- Minimal implementation: added component block discount logic -- count items by type, apply 60 G block premium when exactly 3 alike components instead of 3 x 25
- Tests passing: 7

## Cycle 8 -- Red: "should return premium 115 G for 4 runes with no block (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: No assertion error -- test passes with existing implementation (4 runes bypasses block discount) -- Correct
- Discrepancies: none -- test passed immediately; existing block discount logic (count === BLOCK_SIZE where BLOCK_SIZE = 3) correctly handles 4 runes via else branch

## Cycle 9 -- Red: "should return premium 198 G for 7 runes (175 base + 17.5 first-insurance + 5 fee = 197.5, rounded up)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected { results: [{ premium: 198 }] }, received { results: [{ premium: 197.5 }] } -- Correct
- Discrepancies: none

## Cycle 9 -- Green: "should return premium 198 G for 7 runes (175 base + 17.5 first-insurance + 5 fee = 197.5, rounded up)"
- Minimal implementation: wrapped return value in Math.ceil to round premiums up
- Tests passing: 9

## Cycle 10 -- Red: "should return premium 88 G for 2 runes + 1 moonstone with no block (75 base + 7.5 first-insurance + 5 fee = 87.5, rounded up)"
- Compilation prediction: No compilation error (function already exists, string type accepts "moonstone") -- Correct
- Runtime prediction: Expected { results: [{ premium: 88 }] }, received { results: [{ premium: 60 }] } -- Correct
- Discrepancies: none

## Cycle 10 -- Green: "should return premium 88 G for 2 runes + 1 moonstone with no block (75 base + 7.5 first-insurance + 5 fee = 87.5, rounded up)"
- Minimal implementation: added moonstone: 25 to BASE_PREMIUMS map
- Tests passing: 10

## Cycle 11 -- Red: "should return premium 137 G for 3 runes + 3 moonstones as two separate blocks (120 base + 12 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected 137, received 154 (moonstone not in COMPONENT_TYPES so no block discount) -- Correct
- Discrepancies: none

## Cycle 11 -- Green: "should return premium 137 G for 3 runes + 3 moonstones as two separate blocks (120 base + 12 first-insurance + 5 fee)"
- Minimal implementation: added "moonstone" to COMPONENT_TYPES set
- Tests passing: 11

## Cycle 12 -- Red: "should return premium 165 G for a newcomer with a cursed sword (100 base + 50 curse + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (esbuild strips types, function exists, extra cursed property ignored) -- Correct
- Runtime prediction: Expected { results: [{ premium: 165 }] }, received { results: [{ premium: 115 }] } -- Correct
- Discrepancies: none

## Cycle 12 -- Green: "should return premium 165 G for a newcomer with a cursed sword (100 base + 50 curse + 10 first-insurance + 5 fee)"
- Minimal implementation: added CURSED_SURCHARGE_RATE constant and per-item cursed surcharge loop; introduced itemAdjustedTotal to separate item-specific modifiers from policyBasePremium (used for policy-wide first-insurance)
- Tests passing: 12

## Cycle 13 -- Red: "should apply cursed surcharge only to the cursed item, not the whole policy -- cursed sword + plain amulet = 231 G (item-adjusted 210 + 16 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists, types compatible) -- Correct
- Runtime prediction: No assertion error -- test passes with existing implementation (cursed surcharge already scoped to individual items) -- Correct
- Discrepancies: none -- test passed immediately; existing cursedSurchargeTotal applies surcharge per-item, and policyBasePremium correctly drives first-insurance calculation

## Cycle 14 -- Red: "should return premium 145 G for sword with enchantment 5 (100 base + 30 high-enchant + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (esbuild does not enforce type checks, extra enchantment property ignored) -- Correct
- Runtime prediction: Expected { results: [{ premium: 145 }] }, received { results: [{ premium: 115 }] } -- Correct
- Discrepancies: none

## Cycle 14 -- Green: "should return premium 145 G for sword with enchantment 5 (100 base + 30 high-enchant + 10 first-insurance + 5 fee)"
- Minimal implementation: added HIGH_ENCHANTMENT_SURCHARGE_RATE (0.3) and HIGH_ENCHANTMENT_THRESHOLD (5) constants, plus highEnchantmentSurchargeTotal function following same pattern as cursedSurchargeTotal; added enchantment to item type signatures
- Tests passing: 14

## Cycle 15 -- Red: "should return premium 115 G for sword with enchantment 4, no high-enchantment surcharge (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (enchantment 4 < threshold 5, yields 115 G) -- Correct
- Discrepancies: none

## Cycle 16 -- Red: "should return premium 195 G for cursed sword with enchantment 5 -- both surcharges apply (100 base + 50 curse + 30 high-enchant + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (existing implementation handles both surcharges independently, yields 195 G) -- Correct
- Discrepancies: none

## Cycle 17 -- Red: "should return premium 165 G for cursed sword with enchantment 4 -- only curse surcharge, no high-enchant (100 base + 50 curse + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (enchantment 4 < threshold 5, yields 165 G) -- Correct
- Discrepancies: none

## Cycle 18 -- Red: "should return premium 95 G for customer with exactly 2 years and a single sword (100 base - 20 loyalty + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists, types compatible) -- Correct
- Runtime prediction: Expected { results: [{ premium: 95 }] }, received { results: [{ premium: 115 }] } -- Correct
- Discrepancies: none

## Cycle 18 -- Green: "should return premium 95 G for customer with exactly 2 years and a single sword (100 base - 20 loyalty + 10 first-insurance + 5 fee)"
- Minimal implementation: added LOYALTY_DISCOUNT_RATE (0.2) and LOYALTY_THRESHOLD (2) constants; passed yearsWithMHPCO from processScenario to calculateQuotePremium; applied loyalty discount when threshold met
- Tests passing: 18

## Cycle 19 -- Red: "should not apply loyalty discount for customer with 1 year -- premium 115 G for sword (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (yearsWithMHPCO 1 < threshold 2, yields 115 G) -- Correct
- Discrepancies: none

## Cycle 20 -- Red: "should apply 15% follow-up discount on second quote -- customer 0 years, second quote for sword = 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)"
- Compilation prediction: No compilation error (function already exists, types compatible) -- Correct
- Runtime prediction: Expected { premium: 100 }, received { premium: 115 } -- Correct
- Discrepancies: none

## Cycle 20 -- Green: "should apply 15% follow-up discount on second quote -- customer 0 years, second quote for sword = 100 G (100 base + 10 first-insurance - 15 follow-up + 5 fee)"
- Minimal implementation: added FOLLOW_UP_DISCOUNT_RATE constant and quoteIndex tracking in processScenario; applied 15% follow-up discount when quoteIndex > 0
- Tests passing: 20

## Cycle 21 -- Red: "should apply 10% first-insurance surcharge even for long-standing customer -- customer 3 years, single sword = 95 G (100 base - 20 loyalty + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists, types compatible) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (first-insurance surcharge already applies unconditionally, yields 95 G) -- Correct
- Discrepancies: none

## Cycle 22 -- Red: "should round premium up: 7 runes for newcomer = 198 G (175 base + 17.5 first-insurance + 5 fee = 197.5, ceiled to 198)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (Math.ceil already rounds 197.5 to 198) -- Correct
- Discrepancies: none

## Cycle 23 -- Red: "should return premium 165 G for newcomer (0 years, first contract) with cursed steel sword enchantment 3 (100 + 50 + 10 + 5 = 165)"
- Compilation prediction: No compilation error (function exists, esbuild ignores extra material property) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (expected 165, received 165; existing implementation handles cursed surcharge, first-insurance, and processing fee correctly) -- Correct
- Discrepancies: none

## Cycle 24 -- Red: "should return premium 160 G for customer 3 years on second contract with cursed steel sword enchantment 7 (100 + 50 + 30 - 20 + 10 - 15 + 5 = 160)"
- Compilation prediction: No compilation error (function exists, esbuild ignores extra material property) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (expected 160, received 160; all modifiers already implemented) -- Correct
- Discrepancies: none

## Cycle 25 -- Red: "should return payout 400 G for regular steel sword enchantment 3 with damage 500 G (500 - 100 deductible)"
- Compilation prediction: No compilation error (esbuild transpile-only, function exists, claim step structurally compatible) -- Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received { premium: 5 } (claim treated as quote with empty items) -- Correct
- Discrepancies: none

## Cycle 25 -- Green: "should return payout 400 G for regular steel sword enchantment 3 with damage 500 G (500 - 100 deductible)"
- Minimal implementation: distinguished quote vs claim in processScenario; added INSURANCE_VALUES (sword only), DEDUCTIBLE, CAP_MULTIPLIER constants; stored policies from quotes; computed payout as damage minus deductible, remainingCap as cap minus payout
- Tests passing: 25

## Cycle 26 -- Red: "should return payout 100 G for rune with damage 200 G (200 - 100 deductible; no special clause for components)"
- Compilation prediction: No compilation error (function exists, types compatible) -- Correct
- Runtime prediction: Expected { payout: 100, remainingCap: 400 }, received { payout: 100, remainingCap: -100 } -- Correct
- Discrepancies: none

## Cycle 26 -- Green: "should return payout 100 G for rune with damage 200 G (200 - 100 deductible; no special clause for components)"
- Minimal implementation: added rune: 250 to INSURANCE_VALUES map
- Tests passing: 26

## Cycle 27 -- Red: "should return payout 400 G for steel sword enchantment 9 with damage 1000 G (50% of 1000 = 500 - 100 deductible)"
- Compilation prediction: No compilation error (function exists, types compatible) -- Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received { payout: 900, remainingCap: 1100 } -- Correct
- Discrepancies: none

## Cycle 27 -- Green: "should return payout 400 G for steel sword enchantment 9 with damage 1000 G (50% of 1000 = 500 - 100 deductible)"
- Minimal implementation: added HIGH_ENCHANTMENT_CLAIM_THRESHOLD (8) and HIGH_ENCHANTMENT_CLAIM_RATE (0.5) constants; updated calculateClaimResult to look up policy item's enchantment and apply 50% reimbursement when enchantment >= 8
- Tests passing: 27

## Cycle 28 -- Red: "should return payout 400 G for steel sword enchantment 7 with damage 500 G -- no high-enchantment clause (enchantment 7 < 8), full reimbursement minus deductible"
- Compilation prediction: No compilation error (function exists, esbuild ignores extra material property) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (enchantment 7 < threshold 8, yields payout 400, remainingCap 1600) -- Correct
- Discrepancies: none

## Cycle 29 -- Red: "should return payout 700 G for dragon-material sword enchantment 5 with damage 800 G (full reimbursement 800 - 100 deductible)"
- Compilation prediction: No compilation error (function exists, esbuild ignores extra material property) -- Correct
- Runtime prediction: Expected assertion failure (payout 700, remainingCap 1300) but test passed immediately -- Incorrect
- Discrepancies: The default code path (full reimbursement for enchantment < 8) already handles dragon-material with enchantment 5 correctly; no dragon-material-specific logic was needed for this case

## Cycle 30 -- Red: "should return payout 400 G for dragon-material sword enchantment 9 with damage 1000 G (50% rule wins: 500 - 100)"
- Compilation prediction: No compilation error (function exists, esbuild ignores extra material property) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (enchantment 9 >= 8 triggers existing 50% clause, yielding payout 400, remainingCap 1600) -- Correct
- Discrepancies: none

## Cycle 31 -- Red: "should return payout 400 G for dragon-material sword enchantment 8 with damage 1000 G (50% rule wins: 500 - 100)"
- Compilation prediction: No compilation error (function exists, esbuild ignores extra material property) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (enchantment 8 >= 8 triggers existing 50% clause, yielding payout 400, remainingCap 1600) -- Correct
- Discrepancies: none

## Cycle 32 -- Red: "should return payout 600 G for sword damage 500 G and amulet damage 300 G (400 + 200, each with own 100 G deductible)"
- Compilation prediction: No compilation error (function exists, types compatible) -- Correct
- Runtime prediction: Expected { payout: 600, remainingCap: 2600 }, received { payout: 600, remainingCap: 1400 } -- Correct
- Discrepancies: none

## Cycle 32 -- Green: "should return payout 600 G for sword damage 500 G and amulet damage 300 G (400 + 200, each with own 100 G deductible)"
- Minimal implementation: added amulet: 600 to INSURANCE_VALUES map
- Tests passing: 32

## Cycle 33 -- Red: "should compute insurance sum 2000 G and cap 4000 G for a policy covering two swords"
- Compilation prediction: No compilation error (function exists, types compatible) -- Correct
- Runtime prediction: No assertion error -- test passes immediately (existing reduce over policy.items correctly sums two swords' insurance values to 2000, cap 4000) -- Correct
- Discrepancies: none
