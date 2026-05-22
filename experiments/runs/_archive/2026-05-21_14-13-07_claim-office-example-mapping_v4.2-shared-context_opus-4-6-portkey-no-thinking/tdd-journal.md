# TDD Journal

## Cycle 1 — Red: should return 5G for an empty item list (only processing fee)
- Compilation prediction: Failed to load url ./claim-office.js (module does not exist) — Correct
- Runtime prediction: Expected { premium: 5 }, received undefined — Correct
- Discrepancies: none

## Cycle 1 — Green: should return 5G for an empty item list (only processing fee)
- Minimal implementation: hardcoded return { premium: 5 }
- Tests passing: 1

## Cycle 2 — Red: should return 115G for a single sword (100G base + 10G first insurance + 5G fee)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 115 }, received { premium: 5 } — Correct
- Discrepancies: none

## Cycle 2 — Green: should return 115G for a single sword (100G base + 10G first insurance + 5G fee)
- Minimal implementation: added if-empty check returning 5, else hardcoded return 115
- Tests passing: 2

## Cycle 3 — Red: should return 71G for a single amulet (60G base + 6G first insurance + 5G fee)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 71 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 3 — Green: should return 71G for a single amulet (60G base + 6G first insurance + 5G fee)
- Minimal implementation: added if-amulet check returning 71, narrowed items type to { type: string }[]
- Tests passing: 3

## Cycle 4 — Red: should return 93G for a single staff (80G base + 8G first insurance + 5G fee)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 93 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 4 — Green: should return 93G for a single staff (80G base + 8G first insurance + 5G fee)
- Minimal implementation: added `staff: 80` entry to BASE_PRICE lookup table
- Tests passing: 4

## Cycle 5 — Red: should return 49G for a single potion (40G base + 4G first insurance + 5G fee)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 49 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 5 — Green: should return 49G for a single potion (40G base + 4G first insurance + 5G fee)
- Minimal implementation: added `potion: 40` entry to BASE_PRICE lookup table
- Tests passing: 5

## Cycle 6 — Red: should return 2 runes as 50G base premium (2 x 25G)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 60 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 6 — Green: should return 2 runes as 50G base premium (2 x 25G)
- Minimal implementation: added `rune: 25` entry to BASE_PRICE lookup table
- Tests passing: 6

## Cycle 7 — Red: should return 3 runes as 60G base premium (block of 3 alike applies)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 71 }, received { premium: 87.5 } — Correct
- Discrepancies: none

## Cycle 7 — Green: should return 3 runes as 60G base premium (block of 3 alike applies)
- Minimal implementation: restructured itemPremium to group items by type; groups of exactly 3 use 60G block base instead of 3x25G
- Tests passing: 7

## Cycle 8 — Red: should return 4 runes as 100G base premium (no block — block requires exactly 3)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — expected { premium: 115 }, received { premium: 115 } — Correct
- Discrepancies: none — the block-of-3 logic from cycle 7 already handles count != 3 by falling through to per-item pricing

## Cycle 9 — Red: should return 7 runes as 175G base premium (7 x 25G, no block)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 198 }, received { premium: 197.5 } — Correct
- Discrepancies: none

## Cycle 9 — Green: should return 7 runes as 175G base premium (7 x 25G, no block)
- Minimal implementation: wrapped final premium in Math.ceil for rounding up
- Tests passing: 9

## Cycle 10 — Red: should return 2 runes + 1 moonstone as 75G base premium (no block: different types)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 88 }, received { premium: NaN } — Correct
- Discrepancies: none

## Cycle 10 — Green: should return 2 runes + 1 moonstone as 75G base premium (no block: different types)
- Minimal implementation: added `moonstone: 25` entry to BASE_PRICE lookup table
- Tests passing: 10

## Cycle 11 — Red: should return 3 runes + 3 moonstones as 120G base premium (two separate blocks: 60G + 60G)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — expected { premium: 137 }, received { premium: 137 } — Correct
- Discrepancies: none

## Cycle 12 — Red: should add 50% curse surcharge to a cursed sword (100G + 50G = 150G before policy modifiers)
- Compilation prediction: No compilation error (Vitest uses esbuild, no type checking; excess `cursed` property ignored) — Correct
- Runtime prediction: Expected { premium: 170 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 12 — Green: should add 50% curse surcharge to a cursed sword (100G + 50G = 150G before policy modifiers)
- Minimal implementation: added cursed check loop after base total — if item.cursed, adds 50% of item's base price to totalBase; widened item type to include cursed?: boolean
- Tests passing: 12

## Cycle 13 — Red: should add 30% high-enchantment surcharge for sword with enchantment 5 (100G + 30G = 130G before policy modifiers)
- Compilation prediction: No compilation error (esbuild ignores excess properties; function and imports exist) — Correct
- Runtime prediction: Expected { premium: 148 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 13 — Green: should add 30% high-enchantment surcharge for sword with enchantment 5 (100G + 30G = 130G before policy modifiers)
- Minimal implementation: added enchantment check in item-level modifier loop — if enchantment >= 5, adds 30% of item's base price to itemTotal; widened item type to include enchantment?: number
- Tests passing: 13

## Cycle 14 — Red: should not add high-enchantment surcharge for sword with enchantment 4 (100G before policy modifiers)
- Compilation prediction: No compilation error (function exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 115 }, received { premium: 115 } — Correct
- Discrepancies: none — existing surchargeFor checks enchantment >= 5; enchantment 4 is below threshold, so no surcharge applied

## Cycle 15 — Red: should add both cursed and high-enchantment surcharges for cursed sword ench 5 (100G + 50G + 30G = 180G before policy modifiers)
- Compilation prediction: No compilation error (function exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 203 }, received { premium: 203 } — Correct
- Discrepancies: none — existing surchargeFor already handles both cursed and high-enchantment surcharges independently

## Cycle 16 — Red: should apply cursed surcharge only to the cursed item: cursed sword + plain amulet = 210G before policy modifiers and fee
- Compilation prediction: No compilation error (function and imports exist, esbuild does not type-check) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 236 }, received { premium: 236 } — Correct
- Discrepancies: none — existing surchargeFor per-item logic already correctly scopes cursed surcharge to the individual item

## Cycle 17 — Red: should apply 20% loyalty discount for customer with >= 2 years
- Compilation prediction: No compilation error (function exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 95 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 17 — Green: should apply 20% loyalty discount for customer with >= 2 years
- Minimal implementation: moved first insurance from itemPremium to quote as policy-level modifier; added loyalty discount (20% of policyBase) when customer.years >= 2
- Tests passing: 17

## Cycle 18 — Red: should apply loyalty discount for customer with exactly 2 years
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 59 }, received { premium: 59 } — Correct
- Discrepancies: none — existing >= boundary logic already handles exactly 2 years

## Cycle 19 — Red: should not apply loyalty discount for customer with 1 year
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 115 }, received { premium: 115 } — Correct
- Discrepancies: none — existing >= 2 boundary logic correctly excludes customer with 1 year

## Cycle 20 — Red: should always apply 10% first insurance surcharge on every quote
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 149 }, received { premium: 149 } — Correct
- Discrepancies: none — existing implementation already applies first insurance surcharge unconditionally on every quote call

## Cycle 21 — Red: should apply 15% follow-up contract discount on second quote in scenario
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 100 }, received { premium: 115 } — Correct
- Discrepancies: none

## Cycle 21 — Green: should apply 15% follow-up contract discount on second quote in scenario
- Minimal implementation: renamed _options to options; added if (options.isFollowUp) block subtracting 15% of policyBase; added FOLLOW_UP_DISCOUNT_RATE constant
- Tests passing: 21

## Cycle 22 — Red: should apply policy-level modifiers to the sum of all item premiums (after item-level modifiers)
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 194 }, received { premium: 194 } — Correct
- Discrepancies: none — existing implementation already correctly applies policy-level modifiers (first insurance, loyalty) to the sum returned by itemPremium which includes item-level surcharges

## Cycle 23 — Red: should round premium up (ceil) — a calculation yielding 197.5G becomes 198G
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 198 }, received { premium: 198 } — Correct
- Discrepancies: none — Math.ceil was already applied in quote() since cycle 9

## Cycle 24 — Red: should keep intermediates as fractions and only round the final premium
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 24 }, received { premium: 24 } — Correct
- Discrepancies: none — implementation already keeps intermediates as fractions; Math.ceil applied only at the final return

## Cycle 25 — Red: should return 165G for newcomer (0 years) with cursed sword (steel, ench 3): 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165G
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Expected { premium: 165 }, received { premium: 170 } — Correct
- Discrepancies: none — the discrepancy between 165 and 170 reveals that first insurance is currently applied to policyBase including surcharges (150 * 10% = 15), while the spec expects it applied to base prices only (100 * 10% = 10); to be resolved in Green phase

## Cycle 25 — Green: should return 165G for newcomer (0 years) with cursed sword (steel, ench 3): 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165G
- Minimal implementation: changed itemPremium to return { baseSum, total } instead of a single number; quote now applies policy-level modifiers (first insurance, loyalty, follow-up) to baseSum only, not total including surcharges
- Fixed 5 tests (13, 14, 15, 17, 22) whose expected values were computed under the wrong assumption that policy-level modifiers apply to the sum including item-level surcharges
- Tests passing: 25

## Cycle 26 — Red: should return 160G for 3-year customer on second quote with cursed sword (steel, ench 7): 100 base + 50 curse + 30 high ench - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160G
- Compilation prediction: No compilation error (function already exists with compatible signature) — Correct
- Runtime prediction: Test passes immediately — Expected { premium: 160 }, received { premium: 160 } — Correct
- Discrepancies: none

## Cycle 27 — Red: should return payout 400G for regular sword (steel, ench 3) with 500G damage (full reimbursement minus 100G deductible)
- Compilation prediction: No compilation error (claim already exists, esbuild does not type-check) — Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received undefined — Correct
- Discrepancies: none

## Cycle 27 — Green: should return payout 400G for regular sword (steel, ench 3) with 500G damage (full reimbursement minus 100G deductible)
- Minimal implementation: implemented claim() with INSURANCE_VALUE lookup, DEDUCTIBLE constant, loop over damages subtracting deductible, cap = 2x insurance sum
- Tests passing: 27

## Cycle 28 — Red: should return payout 100G for rune with 200G damage (full reimbursement minus 100G deductible; no special clauses)
- Compilation prediction: No compilation error (claim function already exists and is imported) — Correct
- Runtime prediction: Test passes immediately — Expected { payout: 100, remainingCap: 400 }, received { payout: 100, remainingCap: 400 } — Correct
- Discrepancies: none

## Cycle 29 — Red: should apply 100G deductible per damaged item: sword 500G + amulet 300G = payout 600G (400 + 200)
- Compilation prediction: No compilation error (claim function already exists and is imported) — Correct
- Runtime prediction: Test passes immediately — Expected { payout: 600, remainingCap: 2600 }, received { payout: 600, remainingCap: 2600 } — Correct
- Discrepancies: none

## Cycle 30 — Red: should return payout 400G for dragon-material sword ench 9, damage 1000G (both clauses: 50% wins, 500 - 100 deductible)
- Compilation prediction: No compilation error (claim exists, PolicyItem has material/enchantment fields) — Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received { payout: 900, remainingCap: 1100 } — Correct
- Discrepancies: none

## Cycle 30 — Green: should return payout 400G for dragon-material sword ench 9, damage 1000G (both clauses: 50% wins, 500 - 100 deductible)
- Minimal implementation: added policy item lookup per damage entry; if enchantment >= 8, apply 50% reimbursement rate before deductible
- Tests passing: 30

## Cycle 31 — Red: should return payout 700G for dragon-material sword ench 5, damage 800G (only dragon clause: 800 - 100 deductible)
- Compilation prediction: No compilation error (function exists, PolicyItem includes material, esbuild does not type-check) — Correct
- Runtime prediction: Test passes immediately — Expected { payout: 700, remainingCap: 1300 }, received { payout: 700, remainingCap: 1300 } — Correct
- Discrepancies: none — dragon material clause means 100% reimbursement which is the default; enchantment 5 < threshold 8, so no enchantment clause fires

## Cycle 32 — Red: should return payout 400G for steel sword ench 9, damage 1000G (only high-ench clause: 50% = 500, minus 100 deductible)
- Compilation prediction: No compilation error (function exists and is imported) — Correct
- Runtime prediction: Test passes immediately — Expected { payout: 400, remainingCap: 1600 }, received { payout: 400, remainingCap: 1600 } — Correct
- Discrepancies: none — existing enchantment >= 8 clause already handles steel (non-dragon) material with high enchantment

## Cycle 33 — Red: should return payout 400G for dragon-material sword ench 8, damage 1000G (threshold at 8: both clauses, 50% wins, 500 - 100)
- Compilation prediction: No compilation error (function exists, esbuild does not type-check) — Correct
- Runtime prediction: Test passes immediately — Expected { payout: 400, remainingCap: 1600 }, received { payout: 400, remainingCap: 1600 } — Correct
- Discrepancies: none — existing enchantment >= 8 clause already handles the boundary value; dragon material + high enchantment conflict resolution (50% wins) matches enchantment-only behavior

## Cycle 34 — Red: should round payout down (floor) — a calculation yielding 350.5G becomes 350G
- Compilation prediction: No compilation error (claim function already exists and is imported) — Correct
- Runtime prediction: Expected { payout: 350, remainingCap: 1650 }, received { payout: 350.5, remainingCap: 1649.5 } — Correct
- Discrepancies: none

## Cycle 34 — Green: should round payout down (floor) — a calculation yielding 350.5G becomes 350G
- Minimal implementation: added Math.floor to payout before return in claim()
- Tests passing: 34
