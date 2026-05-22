# TDD Journal

## Cycle 1 — Red: "should return premium 5 G for an empty item list (processing fee only)"
- Compilation prediction: Cannot find module './claim-office.js' (got "Failed to load url ./claim-office.js ... Does the file exist?") — Correct
- Runtime prediction: TypeError: Cannot read properties of undefined (reading 'results') — Correct
- Discrepancies: none

## Cycle 1 — Green: "should return premium 5 G for an empty item list (processing fee only)"
- Minimal implementation: hardcoded return `{ results: [{ premium: 5 }] }`
- Tests passing: 1

## Cycle 2 — Red: "should return premium 115 G for a single plain sword (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { premium: 115 }, received { premium: 5 } — Correct
- Discrepancies: none

## Cycle 2 — Green: "should return premium 115 G for a single plain sword (100 base + 10 first-insurance + 5 fee)"
- Minimal implementation: added if/else on items.length; hardcoded return 115 for non-empty items
- Tests passing: 2

## Cycle 3 — Red: "should return premium 71 G for a single plain amulet (60 base + 6 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { premium: 71 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 3 — Green: "should return premium 71 G for a single plain amulet (60 base + 6 first-insurance + 5 fee)"
- Minimal implementation: added conditional on item.type; hardcoded return 71 for "amulet", 115 otherwise
- Tests passing: 3

## Cycle 4 — Red: "should return premium 93 G for a single plain staff (80 base + 8 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { premium: 93 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 4 — Green: "should return premium 93 G for a single plain staff (80 base + 8 first-insurance + 5 fee)"
- Minimal implementation: added `staff: 80` to BASE_PREMIUM lookup map
- Tests passing: 4

## Cycle 5 — Red: "should return premium 49 G for a single plain potion (40 base + 4 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { premium: 49 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 5 — Green: "should return premium 49 G for a single plain potion (40 base + 4 first-insurance + 5 fee)"
- Minimal implementation: added `potion: 40` to BASE_PREMIUM lookup map
- Tests passing: 5

## Cycle 6 — Red: "should compute base premium 50 G for 2 runes (2 x 25, no block)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { premium: 60 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 6 — Green: "should compute base premium 50 G for 2 runes (2 x 25, no block)"
- Minimal implementation: added `rune: 25` to BASE_PREMIUM map; changed single-item lookup to loop summing basePremium across all items
- Tests passing: 6

## Cycle 7 — Red: "should compute base premium 60 G for 3 runes (block of 3 alike applies)"
- Compilation prediction: No compilation error expected — Correct
- Runtime prediction: Expected { premium: 71 }, received { premium: 87.5 } — Correct
- Discrepancies: none

## Cycle 7 — Green: "should compute base premium 60 G for 3 runes (block of 3 alike applies)"
- Minimal implementation: replaced per-item loop with type-counting loop; when count === 3 and base premium is 25 (component), use 60 instead of 3 x 25
- Tests passing: 7

## Cycle 8 — Red: "should compute base premium 100 G for 4 runes (no block -- block requires exactly 3)"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); else branch handles count != 3 correctly — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 9 — Red: "should compute base premium 175 G for 7 runes (7 x 25, no block)"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); else branch handles count != 3 correctly — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 10 — Red: "should compute base premium 75 G for 2 runes + 1 moonstone (no block: different types)"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: Expected { premium: 87.5 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 10 — Green: "should compute base premium 75 G for 2 runes + 1 moonstone (no block: different types)"
- Minimal implementation: added `moonstone: 25` to BASE_PREMIUM map
- Tests passing: 10

## Cycle 11 — Red: "should compute base premium 120 G for 3 runes + 3 moonstones (two separate blocks: 60 + 60)"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); existing typeCounts loop handles multiple component types each forming independent blocks of 3 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 12 — Red: "should add 50% curse surcharge -- cursed sword newcomer: 100 + 50 curse + 10 first-insurance + 5 fee = 165 G"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: Expected { premium: 165 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 12 — Green: "should add 50% curse surcharge -- cursed sword newcomer: 100 + 50 curse + 10 first-insurance + 5 fee = 165 G"
- Minimal implementation: added loop over items to accumulate curseSurcharge (50% of base premium) for cursed items; added curseSurcharge to premium formula
- Tests passing: 12

## Cycle 13 — Red: "should add 30% high-enchantment surcharge for sword with enchantment exactly 5"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: Expected { premium: 145 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 13 — Green: "should add 30% high-enchantment surcharge for sword with enchantment exactly 5"
- Minimal implementation: added highEnchantmentSurcharge accumulator in the item loop; when enchantment >= 5, adds 30% of item's base premium
- Tests passing: 13

## Cycle 14 — Red: "should NOT add high-enchantment surcharge for sword with enchantment 4"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); enchantment 4 < threshold 5 means no surcharge, premium = 115 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 15 — Red: "should apply both curse and high-enchantment surcharges to sword with enchantment 5, cursed"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); both surcharges accumulate independently yielding 195 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 16 — Red: "should apply item-specific modifiers only to the affected item -- cursed sword (100 base) + plain amulet (60 base) = 210 G before policy-wide modifiers and fee"
- Compilation prediction: No compilation error expected (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); existing implementation scopes curse surcharge to individual items and computes first-insurance on policy base premium, yielding 231 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 17 — Red: "should apply 20% loyalty discount for customer with exactly 2 years with MHPCO"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { premium: 95 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 17 — Green: "should apply 20% loyalty discount for customer with exactly 2 years with MHPCO"
- Minimal implementation: added loyaltyDiscount variable; when customer.yearsWithMHPCO >= 2, subtract 20% of basePremium from premium
- Tests passing: 17

## Cycle 18 — Red: "should NOT apply loyalty discount for customer with 1 year with MHPCO"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); customer with 1 year does not meet >= 2 threshold — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 19 — Red: "should apply 10% first-insurance surcharge on every quote (always applies)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: No runtime error expected — test passes immediately (already-green); first-insurance surcharge already implemented since cycle 3, staff premium = 80 + 8 + 5 = 93 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 20 — Red: "should apply 15% follow-up contract discount on the customer's second quote in the scenario"
- Compilation prediction: No compilation error (function already exists, accepts `any`) — Correct
- Runtime prediction: Expected { premium: 100 }, received undefined (results[1] is undefined because implementation only processes steps[0]) — Correct
- Discrepancies: none

## Cycle 20 — Green: "should apply 15% follow-up contract discount on the customer's second quote in the scenario"
- Minimal implementation: wrapped step processing in loop over all steps; added quoteCount tracker and FOLLOW_UP_DISCOUNT_RATE (0.15) applied when quoteCount > 0
- Tests passing: 20

## Cycle 21 — Red: "should apply first-insurance surcharge even on follow-up contracts -- both modifiers coexist"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); premium = 62 for second quote (60 base + 6 first-ins - 9 follow-up + 5 fee) — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 22 — Red: "should return 165 G for newcomer (0 years, first contract) with cursed sword (steel, ench 3) -- 100 base + 50 curse + 10 first-ins = 160 + 5 fee"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); integration example 1 is identical to the curse surcharge test from cycle 12 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 23 — Red: "should return 160 G for long-standing customer (3 years, second contract) with cursed sword (steel, ench 7) -- 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up = 155 + 5 fee"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); all individual modifiers already implemented and integration yields 160 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 24 — Red: "should round premium UP in MHPCO's favor -- 197.5 G rounds to 198 G"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: Expected { premium: 198 }, received { premium: 197.5 } — Correct
- Discrepancies: none

## Cycle 24 — Green: "should round premium UP in MHPCO's favor -- 197.5 G rounds to 198 G"
- Minimal implementation: wrapped premium calculation in Math.ceil(); updated two existing test expectations (197.5 -> 198, 87.5 -> 88) to match rounding behavior
- Tests passing: 24

## Cycle 25 — Red: "should return payout 400 G for regular sword (steel, ench 3), damage 500 G (full reimbursement minus 100 G deductible)"
- Compilation prediction: No compilation error (processScenario already exists with `any` type) — Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received { payout: 0, remainingCap: 0 } — Correct
- Discrepancies: none

## Cycle 25 — Green: "should return payout 400 G for regular sword (steel, ench 3), damage 500 G (full reimbursement minus 100 G deductible)"
- Minimal implementation: added INSURANCE_VALUE map, DEDUCTIBLE constant, and claim handling block that looks up policy items, computes insurance sum, cap (2x), payout (damage - deductible), and remainingCap
- Tests passing: 25

## Cycle 26 — Red: "should return payout 100 G for rune, damage 200 G (full reimbursement minus 100 G deductible)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); existing processClaim handles rune damage correctly yielding { payout: 100, remainingCap: 400 } — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 27 — Red: "should apply 100 G deductible per damaged item -- sword 500 G + amulet 300 G = payout 600 G (400 + 200)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); existing processClaim handles multiple damages with per-item deductible correctly — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 28 — Red: "should reimburse at 50% for steel sword with enchantment 9 -- damage 1000 G -> payout 400 G (500 - 100)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received { payout: 900, remainingCap: 1100 } — Correct
- Discrepancies: none

## Cycle 28 — Green: "should reimburse at 50% for steel sword with enchantment 9 -- damage 1000 G -> payout 400 G (500 - 100)"
- Minimal implementation: added item lookup by damage.itemType in processClaim; when matched item has enchantment >= 8, reimburse at 50% of damage amount before deductible
- Tests passing: 28

## Cycle 29 — Red: "should reimburse at 50% for dragon-material sword with enchantment 8 -- damage 1000 G -> payout 400 G (500 - 100)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); enchantment 8 >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD (8) already triggers 50% reimbursement yielding payout 400, remainingCap 1600 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 30 — Red: "should fully reimburse dragon-material sword with enchantment 5 -- damage 800 G -> payout 700 G (800 - 100)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); standard reimbursement path yields payout 700, remainingCap 1300 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 31 — Red: "should apply 50% rule when dragon-material sword has enchantment 9 -- damage 1000 G -> payout 400 G (50% wins over dragon-material full reimbursement)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); existing processClaim applies 50% for enchantment >= 8, yielding payout 400, remainingCap 1600 — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 32 — Red: "should round payout DOWN in MHPCO's favor -- 350.5 G rounds to 350 G"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: Expected { payout: 350, remainingCap: 1650 }, received { payout: 350.5, remainingCap: 1649.5 } — Correct
- Discrepancies: none

## Cycle 32 — Green: "should round payout DOWN in MHPCO's favor -- 350.5 G rounds to 350 G"
- Minimal implementation: added Math.floor(payout) before return in processClaim
- Tests passing: 32

## Cycle 33 — Red: "should set cap at 2x insurance sum -- sword (1000) + amulet (600) = insurance sum 1600, cap 3200 G"
- Compilation prediction: No compilation error expected (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); existing processClaim computes insuranceSum, cap (2x), and remainingCap correctly for multi-item policies — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 34 — Red: "should base cap on unmodified insurance value -- cursed sword (ins value 1000) -> cap 2000 G"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); processClaim computes insuranceSum from INSURANCE_VALUE map unaffected by curse modifier — Correct
- Discrepancies: none — test passed without code changes (free green)

## Cycle 35 — Red: "should not let block discount affect insurance sum -- sword + 3 runes -> insurance sum 1750 G (1000 + 3x250)"
- Compilation prediction: No compilation error (processScenario already exists) — Correct
- Runtime prediction: No runtime error — test passes immediately (free green); processClaim computes insuranceSum per-item from INSURANCE_VALUE map, unaffected by block discount — Correct
- Discrepancies: none — test passed without code changes (free green)
