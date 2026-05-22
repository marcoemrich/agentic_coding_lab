# TDD Journal

## Cycle 1 -- Red: should return 5 G for an empty item list (processing fee only)
- Compilation prediction: Failed to load url ./claim-office.js (module not found) -- Correct
- Runtime prediction: Expected 5, received undefined -- Correct
- Discrepancies: none

## Cycle 1 -- Green: should return 5 G for an empty item list (processing fee only)
- Minimal implementation: hardcoded return 5
- Tests passing: 1

## Cycle 2 -- Red: should return 115 G for a single sword (100 base + 10 first-insurance + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 115, received 5 -- Correct
- Discrepancies: none

## Cycle 2 -- Green: should return 115 G for a single sword (100 base + 10 first-insurance + 5 fee)
- Minimal implementation: added conditional -- empty list returns 5, non-empty returns hardcoded 115
- Tests passing: 2

## Cycle 3 -- Red: should return 71 G for a single amulet (60 base + 6 first-insurance + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 71, received 115 -- Correct
- Discrepancies: none

## Cycle 3 -- Green: should return 71 G for a single amulet (60 base + 6 first-insurance + 5 fee)
- Minimal implementation: added conditional for "amulet" type returning 66 + PROCESSING_FEE (= 71), default still returns 110 + PROCESSING_FEE (= 115)
- Tests passing: 3

## Cycle 4 -- Red: should return 93 G for a single staff (80 base + 8 first-insurance + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 93, received NaN (BASE_PREMIUM lacks "staff" entry, undefined propagates to NaN) -- Correct
- Discrepancies: none

## Cycle 4 -- Green: should return 93 G for a single staff (80 base + 8 first-insurance + 5 fee)
- Minimal implementation: added `staff: 80` entry to BASE_PREMIUM map
- Tests passing: 4

## Cycle 5 -- Red: should return 49 G for a single potion (40 base + 4 first-insurance + 5 fee)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 49, received NaN (BASE_PREMIUM lacks "potion" entry, undefined propagates to NaN) -- Correct
- Discrepancies: none

## Cycle 5 -- Green: should return 49 G for a single potion (40 base + 4 first-insurance + 5 fee)
- Minimal implementation: added `potion: 40` entry to BASE_PREMIUM map
- Tests passing: 5

## Cycle 6 -- Red: should return 33 G for a single rune component (25 base + 2.5 first-ins -> ceil(27.5) + 5 fee = 33)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 33, received NaN (BASE_PREMIUM lacks "rune" entry, undefined propagates to NaN) -- Correct
- Discrepancies: none

## Cycle 6 -- Green: should return 33 G for a single rune component (25 base + 2.5 first-ins -> ceil(27.5) + 5 fee = 33)
- Minimal implementation: added `rune: 25` entry to BASE_PREMIUM map and wrapped return in Math.ceil for rounding
- Tests passing: 6

## Cycle 7 -- Red: should return 50 G base premium for 2 runes (2 * 25, no block)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 60, received 33 -- Correct
- Discrepancies: none

## Cycle 7 -- Green: should return 50 G base premium for 2 runes (2 * 25, no block)
- Minimal implementation: replaced items[0] single-item lookup with a for-loop summing policyBase across all items
- Tests passing: 7

## Cycle 8 -- Red: should return 60 G base premium for 3 runes (block of 3 alike applies)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 71, received 88 (no block discount logic yet; 3*25=75 base + 7.5 first-ins = 82.5, ceil(82.5+5)=88) -- Correct
- Discrepancies: none

## Cycle 8 -- Green: should return 60 G base premium for 3 runes (block of 3 alike applies)
- Minimal implementation: count items by type; if exactly 3 of same type, use hardcoded 60 G instead of 3 * per-item base premium
- Tests passing: 8

## Cycle 9 -- Red: should return 100 G base premium for 4 runes (no block, 4 * 25)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (existing else branch handles count != 3: 4*25=100 base, +10 first-ins, +5 fee = 115) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed block-of-3 does not fire for count 4)

## Cycle 10 -- Red: should return 175 G base premium for 7 runes (no block, 7 * 25)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (existing else branch handles count != 3: 7*25=175 base, ceil(192.5+5)=198) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed block-of-3 does not fire for count 7)

## Cycle 11 -- Red: should return 75 G base premium for 2 runes + 1 moonstone (no block, different types)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 88, received NaN (BASE_PREMIUM lacks "moonstone" entry, undefined propagates to NaN) -- Correct
- Discrepancies: none

## Cycle 11 -- Green: should return 75 G base premium for 2 runes + 1 moonstone (no block, different types)
- Minimal implementation: added `moonstone: 25` entry to BASE_PREMIUM map
- Tests passing: 11

## Cycle 12 -- Red: should return 120 G base premium for 3 runes + 3 moonstones (two separate blocks)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 137, actual 137; existing loop handles two separate blocks) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed block-of-3 fires independently per type)

## Cycle 13 -- Red: should add 50% surcharge to a cursed sword's base premium (100 + 50 = 150 item premium)
- Compilation prediction: Excess property 'cursed' not in QuoteItem would cause TS error -- Incorrect (esbuild in Vitest does not enforce excess property checks)
- Runtime prediction: Expected 165, received 115 -- Correct
- Discrepancies: No compilation error occurred; esbuild strips types so excess property `cursed: true` is silently accepted

## Cycle 13 -- Green: should add 50% surcharge to a cursed sword's base premium (100 + 50 = 150 item premium)
- Minimal implementation: added `cursed?: boolean` to QuoteItem, added CURSED_SURCHARGE_RATE constant (0.5), added item-level surcharge loop accumulating cursed surcharges into policyPremium
- Tests passing: 13

## Cycle 14 -- Red: should apply cursed surcharge only to the cursed item, not the whole policy -- cursed sword (100+50) + plain amulet (60) = 210 before policy modifiers and fee
- Compilation prediction: No compilation error (function, types, and cursed property already exist) -- Correct
- Runtime prediction: Test passes immediately (existing per-item cursed surcharge logic already yields 231 G correctly) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed cursed surcharge scoping is correct for multi-item policies)

## Cycle 15 -- Red: should add 30% surcharge for sword with enchantment exactly 5 (100 + 30 = 130 item premium)
- Compilation prediction: No compilation error (esbuild strips types without strict checking) -- Correct
- Runtime prediction: Expected 145, received 115 -- Correct
- Discrepancies: none

## Cycle 15 -- Green: should add 30% surcharge for sword with enchantment exactly 5 (100 + 30 = 130 item premium)
- Minimal implementation: added HIGH_ENCHANTMENT_SURCHARGE_RATE constant (0.3) and enchantment >= 5 check in item surcharges loop
- Tests passing: 15

## Cycle 16 -- Red: should NOT add high-enchantment surcharge for sword with enchantment 4
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (existing >= 5 check correctly excludes enchantment 4, yielding 115) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed high-enchantment boundary at >= 5)

## Cycle 17 -- Red: should apply both cursed (50%) and high-enchantment (30%) surcharges when both conditions met on same item
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 195, actual 195; existing surcharge loop handles both independently) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed both item-level surcharges stack correctly on same item)

## Cycle 18 -- Red: should apply 20% loyalty discount for customer with exactly 2 years with MHPCO
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 95, received 115 -- Correct
- Discrepancies: none

## Cycle 18 -- Green: should apply 20% loyalty discount for customer with exactly 2 years with MHPCO
- Minimal implementation: added LOYALTY_DISCOUNT_RATE constant (0.2) and conditional discount subtraction when customer.yearsWithMHPCO >= 2
- Tests passing: 18

## Cycle 19 -- Red: should NOT apply loyalty discount for customer with 1 year with MHPCO
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 115, actual 115; existing loyalty threshold >= 2 correctly excludes 1-year customer) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed loyalty discount boundary at >= 2 years)

## Cycle 20 -- Red: should apply 10% first-insurance surcharge to policy base premium
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 115, actual 115; first-insurance surcharge already implemented since cycle 2) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed first-insurance surcharge applies at 10% of policy base premium)

## Cycle 21 -- Red: should apply first-insurance surcharge even for long-standing customer (per item, not per customer)
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 95, actual 95; first-insurance surcharge unconditionally applied) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed first-insurance surcharge applies regardless of customer history per R6, Q4)

## Cycle 22 -- Red: should NOT apply follow-up discount on the customer's first quote
- Compilation prediction: No compilation error (function, types, and isFollowUp field already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 115, actual 115; no follow-up discount logic exists yet, absence is correct for isFollowUp: false) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed first quote receives no follow-up discount)

## Cycle 23 -- Red: should apply 15% follow-up discount on the customer's second quote step
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Expected 100, received 115 (no follow-up discount logic exists yet; isFollowUp flag is ignored) -- Correct
- Discrepancies: none

## Cycle 23 -- Green: should apply 15% follow-up discount on the customer's second quote step
- Minimal implementation: added FOLLOW_UP_DISCOUNT_RATE constant (0.15) and conditional discount subtraction when input.isFollowUp is true
- Tests passing: 23

## Cycle 24 -- Red: should add 5 G processing fee at the very end of every premium calculation
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 181, actual 181; processing fee already implemented since cycle 1) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed flat 5 G fee is added at end, not scaled to items or policy size)

## Cycle 25 -- Red: should round premium UP (ceil) in MHPCO's favor -- e.g. 197.5 -> 198 G
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 198, actual 198; Math.ceil already rounds up fractional premiums since cycle 6) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed ceil rounding for premium calculation using E10 scenario)

## Cycle 26 -- Red: newcomer with cursed sword (steel, ench 3): 100 base + 50 curse + 10 first-ins = 160 + 5 fee = 165 G
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 165, actual 165; integration test of already-implemented rules R1, R3, R6, R8) -- Correct
- Discrepancies: none (test already green -- integration test E12 confirms all constituent rules work together correctly)

## Cycle 27 -- Red: long-standing customer second contract, cursed sword (steel, ench 7): 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up = 155 + 5 fee = 160 G
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 160, actual 160; integration test of already-implemented rules R1, R3, R4, R5, R6, R7, R8) -- Correct
- Discrepancies: none (test already green -- integration test E13 confirms all constituent rules work together correctly)

## Cycle 28 -- Red: should return payout 400 G for regular steel sword (ench 3), damage 500 G (500 - 100 deductible)
- Compilation prediction: No compilation error (esbuild strips types without enforcing argument count) -- Correct
- Runtime prediction: Expected 400, received 0 -- Correct
- Discrepancies: none

## Cycle 28 -- Green: should return payout 400 G for regular steel sword (ench 3), damage 500 G (500 - 100 deductible)
- Minimal implementation: added DEDUCTIBLE constant (100) and computed payout as damages[0].amount - DEDUCTIBLE
- Tests passing: 28

## Cycle 29 -- Red: should return payout 100 G for rune component, damage 200 G (200 - 100 deductible, no special clause)
- Compilation prediction: No compilation error (function, types, and interfaces already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 100, actual 100; existing deductible logic handles component claims) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed standard reimbursement with deductible works for components)

## Cycle 30 -- Red: should apply 100 G deductible per damaged item -- sword 500 + amulet 300 = (400 + 200) = 600 G payout
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 600, received 400 (only damages[0] processed: 500 - 100 = 400) — Correct
- Discrepancies: none

## Cycle 30 -- Green: should apply 100 G deductible per damaged item -- sword 500 + amulet 300 = (400 + 200) = 600 G payout
- Minimal implementation: replaced damages[0] single-entry access with a for-loop summing (damage.amount - DEDUCTIBLE) across all damages
- Tests passing: 30

## Cycle 31 -- Red: should reimburse at 50% for steel sword ench 9, damage 1000 -> payout 400 G (500 - 100)
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 400, received 900 (1000 - 100, no 50% high-enchantment clause) — Correct
- Discrepancies: none

## Cycle 31 -- Green: should reimburse at 50% for steel sword ench 9, damage 1000 -> payout 400 G (500 - 100)
- Minimal implementation: added policy item lookup by type in claim reduce, check enchantment >= 8, apply 50% rate to damage amount before deductible
- Tests passing: 31

## Cycle 32 -- Red: should fully reimburse dragon-material sword ench 5, damage 800 -> payout 700 G (800 - 100)
- Compilation prediction: No compilation error (ClaimItem already has material?: string) — Correct
- Runtime prediction: Test passes immediately (default path gives full reimbursement for ench 5 < 8, yielding 700) — Correct
- Discrepancies: none (test already green -- triangulation confirmed dragon-material with ench < 8 receives full reimbursement via existing default code path)

## Cycle 33 -- Red: should apply 50% rule when dragon-material AND ench >= 8: dragon sword ench 9, damage 1000 -> payout 400 G (500 - 100)
- Compilation prediction: No compilation error (function, types, and interfaces already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 400, actual 400; existing isHighEnchantment check handles R15 interaction) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed R15: when both dragon-material and ench >= 8 apply, 50% rule wins via existing isHighEnchantment branch)

## Cycle 34 -- Red: should apply 50% for dragon-material sword ench exactly 8, damage 1000 -> payout 400 G
- Compilation prediction: No compilation error (function, types, and interfaces already exist) -- Correct
- Runtime prediction: Test passes immediately (expected 400, actual 400; existing isHighEnchantment check handles enchantment exactly 8 boundary via >= 8 threshold) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed R15 boundary at enchantment exactly 8 with dragon material)

## Cycle 35 -- Red: should round payout DOWN (floor) in MHPCO's favor -- e.g. 350.5 -> 350 G
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Expected 350, received 350.5 — Correct
- Discrepancies: none

## Cycle 35 -- Green: should round payout DOWN (floor) in MHPCO's favor -- e.g. 350.5 -> 350 G
- Minimal implementation: wrapped payout in Math.floor in the return statement of claim
- Tests passing: 35

## Cycle 36 -- Red: should compute insurance sum 2000 G and cap 4000 G for two insured swords
- Compilation prediction: No compilation error (esbuild strips types without strict checking) — Correct
- Runtime prediction: Expected 3600, received undefined — Correct
- Discrepancies: none

## Cycle 36 -- Green: should compute insurance sum 2000 G and cap 4000 G for two insured swords
- Minimal implementation: added INSURANCE_VALUE map, computed insuranceSum from policyItems, cap = 2 * insuranceSum, added remainingCap to ClaimResult (cap - payout)
- Tests passing: 36

## Cycle 37 -- Red: should apply separate deductibles when both swords are damaged in one event
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (payout 800, remainingCap 3200; existing reduce loop handles per-damage deductibles) -- Correct
- Discrepancies: none (test already green -- triangulation confirmed separate deductibles per damage entry for multiple items of same type)

## Cycle 38 -- Red: should reject claim when damages array has more entries of a type than the policy covers
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: expected [Function] to throw an error (function returns normally instead of throwing) -- Correct
- Discrepancies: none
