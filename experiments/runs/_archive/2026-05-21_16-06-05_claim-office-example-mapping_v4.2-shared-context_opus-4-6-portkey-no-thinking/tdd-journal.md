# TDD Journal

## Cycle 1 -- Red: "should return 5 G premium for an empty item list (processing fee only)"
- Compilation prediction: Failed to load ./claim-office.js (module not found) -- Correct
- Runtime prediction: Expected [{"premium": 5}], received undefined -- Correct
- Discrepancies: none

## Cycle 1 -- Green: "should return 5 G premium for an empty item list (processing fee only)"
- Minimal implementation: hardcoded return [{ premium: 5 }]
- Tests passing: 1

## Cycle 2 -- Red: "should return 115 G for a single plain sword -- new customer first quote (100 base + 10 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected [{ premium: 115 }], received [{ premium: 5 }] -- Correct
- Discrepancies: none

## Cycle 2 -- Green: "should return 115 G for a single plain sword -- new customer first quote (100 base + 10 first-insurance + 5 fee)"
- Minimal implementation: added empty-items check; hardcoded return 115 for non-empty items
- Tests passing: 2

## Cycle 3 -- Red: "should return 71 G for a single plain amulet -- new customer first quote (60 base + 6 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected [{ premium: 71 }], received [{ premium: 115 }] -- Correct
- Discrepancies: none

## Cycle 3 -- Green: "should return 71 G for a single plain amulet -- new customer first quote (60 base + 6 first-insurance + 5 fee)"
- Minimal implementation: added if/else branch on item type "amulet" returning hardcoded 71; sword falls through to default 115
- Tests passing: 3

## Cycle 4 -- Red: "should return 93 G for a single plain staff -- new customer first quote (80 base + 8 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function already exists, Record<string, number> allows unknown keys) -- Correct
- Runtime prediction: Expected [{ premium: 93 }], received [{ premium: NaN }] -- Correct
- Discrepancies: none

## Cycle 4 -- Green: "should return 93 G for a single plain staff -- new customer first quote (80 base + 8 first-insurance + 5 fee)"
- Minimal implementation: added `staff: 80` entry to BASE_PREMIUM map
- Tests passing: 4

## Cycle 5 -- Red: "should return 49 G for a single plain potion -- new customer first quote (40 base + 4 first-insurance + 5 fee)"
- Compilation prediction: No compilation error (function exists, Record<string, number> allows any string key) -- Correct
- Runtime prediction: Expected [{ premium: 49 }], received [{ premium: NaN }] -- Correct
- Discrepancies: none

## Cycle 5 -- Green: "should return 49 G for a single plain potion -- new customer first quote (40 base + 4 first-insurance + 5 fee)"
- Minimal implementation: added `potion: 40` entry to BASE_PREMIUM map
- Tests passing: 5

## Cycle 6 -- Red: "should return 33 G for a single rune -- new customer first quote (25 base + 2.5 first-insurance + 5 fee = 32.5, ceiling 33)"
- Compilation prediction: No compilation error (function already exists, accepts any) -- Correct
- Runtime prediction: Expected [{ premium: 33 }], received [{ premium: NaN }] -- Correct
- Discrepancies: none

## Cycle 6 -- Green: "should return 33 G for a single rune -- new customer first quote (25 base + 2.5 first-insurance + 5 fee = 32.5, ceiling 33)"
- Minimal implementation: added `rune: 25` to BASE_PREMIUM map; wrapped premium calculation with Math.ceil
- Tests passing: 6

## Cycle 7 -- Red: "should use 50 G base premium for 2 runes (2 x 25, no block)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Test passes immediately (premium 60 matches current implementation) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing reduce-based sum already handles multiple components

## Cycle 8 -- Red: "should use 60 G base premium for 3 runes (block of exactly 3 alike)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected [{ premium: 71 }], received [{ premium: 88 }] -- Correct
- Discrepancies: none

## Cycle 8 -- Green: "should use 60 G base premium for 3 runes (block of exactly 3 alike)"
- Minimal implementation: replaced reduce with group-by-type loop; when a component type has exactly 3 items, use 60 G block premium instead of 3 x 25 G
- Tests passing: 8

## Cycle 9 -- Red: "should use 100 G base premium for 4 runes (no block -- block requires exactly 3)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Test passes immediately (premium 115 matches current implementation) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing block-discount logic only triggers for count === 3, so 4 runes correctly use 4 x 25 = 100 base

## Cycle 10 -- Red: "should use 175 G base premium for 7 runes (7 x 25, no block)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Test passes immediately (premium 198 matches current implementation) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing block-discount logic only triggers for count === 3, so 7 runes correctly use 7 x 25 = 175 base

## Cycle 11 -- Red: "should use 75 G base premium for 2 runes + 1 moonstone (no block: different types)"
- Compilation prediction: No compilation error (function exists, Item type accepts any string) -- Correct
- Runtime prediction: Expected [{ premium: 88 }], received [{ premium: NaN }] -- Correct
- Discrepancies: none

## Cycle 11 -- Green: "should use 75 G base premium for 2 runes + 1 moonstone (no block: different types)"
- Minimal implementation: added `moonstone: 25` to BASE_PREMIUM map and `"moonstone"` to COMPONENT_TYPES set
- Tests passing: 11

## Cycle 12 -- Red: "should use 120 G base premium for 3 runes + 3 moonstones (two separate blocks: 60 + 60)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Test passes immediately (premium 137 matches current implementation) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing group-by-type block discount logic already handles multiple component types independently

## Cycle 13 -- Red: "should add 50% curse surcharge on a cursed sword's base premium"
- Compilation prediction: No compilation error (function exists, structural typing allows extra properties on inferred variable) -- Correct
- Runtime prediction: Expected [{ premium: 165 }], received [{ premium: 115 }] -- Correct
- Discrepancies: none

## Cycle 13 -- Green: "should add 50% curse surcharge on a cursed sword's base premium"
- Minimal implementation: added `cursed?: boolean` to Item interface, CURSE_SURCHARGE_RATE constant, and per-item curse surcharge reduce in processScenario
- Tests passing: 13

## Cycle 14 -- Red: "should add 30% high-enchantment surcharge for sword with enchantment exactly 5"
- Compilation prediction: No compilation error (function exists, excess properties not checked on variables) -- Correct
- Runtime prediction: Expected [{ premium: 145 }], received [{ premium: 115 }] -- Correct
- Discrepancies: none

## Cycle 14 -- Green: "should add 30% high-enchantment surcharge for sword with enchantment exactly 5"
- Minimal implementation: added enchantment surcharge in calculateItemSurcharges (30% of base when enchantment >= 5)
- Tests passing: 14

## Cycle 15 -- Red: "should not add high-enchantment surcharge for sword with enchantment 4"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (enchantment 4 < threshold 5, no surcharge, premium = 115 G) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing >= 5 threshold check correctly excludes enchantment 4

## Cycle 16 -- Red: "should apply both cursed and high-enchantment surcharges when sword is cursed with enchantment >= 5"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (premium 195 matches current implementation; both surcharges stack independently) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing calculateItemSurcharges already computes curse and enchantment surcharges independently

## Cycle 17 -- Red: "should apply cursed surcharge only to the cursed item's base premium — cursed sword + plain amulet: policy base 160 + 50 curse on sword = 210 before further modifiers and fee"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (premium 231 matches current implementation; curse surcharge already scoped per-item) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing calculateItemSurcharges already applies item-specific modifiers to each item's own base premium

## Cycle 18 -- Red: "should apply 20% loyalty discount for customer with exactly 2 years with MHPCO"
- Compilation prediction: No compilation error (function exists, structural typing allows extra customer property) -- Correct
- Runtime prediction: Expected [{ premium: 95 }], received [{ premium: 115 }] -- Correct
- Discrepancies: none

## Cycle 18 -- Green: "should apply 20% loyalty discount for customer with exactly 2 years with MHPCO"
- Minimal implementation: added Customer interface to Scenario; applied 20% loyalty discount on policy base premium when yearsWithMHPCO >= 2
- Tests passing: 18

## Cycle 19 -- Red: "should not apply loyalty discount for customer with 1 year with MHPCO"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (premium 115 matches current implementation; 1 year < 2 year threshold means no discount) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing >= 2 threshold check correctly excludes customers with 1 year

## Cycle 20 -- Red: "should apply 15% follow-up discount on second and subsequent quotes"
- Compilation prediction: No compilation error (function exists, structural typing allows extra quoteNumber property) -- Correct
- Runtime prediction: Expected [{ premium: 100 }], received [{ premium: 115 }] -- Correct
- Discrepancies: none

## Cycle 20 -- Green: "should apply 15% follow-up discount on second and subsequent quotes"
- Minimal implementation: added quoteNumber to Customer interface, FOLLOW_UP_DISCOUNT_RATE constant, and inline follow-up discount (15% of basePremium when quoteNumber >= 2)
- Tests passing: 20

## Cycle 21 -- Red: "should always apply 10% first-insurance surcharge to every item regardless of customer history"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (existing implementation already applies first-insurance unconditionally; premium = 80 G matches) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing FIRST_INSURANCE_RATE is applied unconditionally to basePremium

## Cycle 22 -- Red: "should round premium up (ceiling) in MHPCO's favor — e.g. 197.5 G becomes 198 G"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Test passes immediately (premium 198 matches; Math.ceil already applied) — Correct
- Discrepancies: none — test is a triangulation/guard test; existing Math.ceil in processScenario already handles fractional premiums

## Cycle 23 -- Red: "should return 165 G for newcomer with cursed sword — 0 years, first quote, cursed steel sword ench 3 (100 base + 50 curse + 10 first-ins + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist, extra material property allowed by structural typing) — Correct
- Runtime prediction: Test passes immediately (premium 165 matches current implementation; all modifiers already implemented) — Correct
- Discrepancies: none — test is an integration/triangulation test (E11); existing implementation already combines curse surcharge, first insurance, and processing fee correctly

## Cycle 24 -- Red: "should return 160 G for long-standing customer second contract — 3 years, second quote, cursed steel sword ench 7 (100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins - 15 follow-up + 5 fee)"
- Compilation prediction: No compilation error (function and types already exist, extra material property allowed by structural typing) — Correct
- Runtime prediction: Test passes immediately (premium 160 matches current implementation; all modifiers already implemented) — Correct
- Discrepancies: none — test is an integration/triangulation test (E12); existing implementation already combines all surcharges, discounts, and fee correctly

## Cycle 25 -- Red: "should return payout 400 G for regular steel sword ench 3 with 500 G damage (full reimbursement minus 100 G deductible)"
- Compilation prediction: No compilation error (function already exists, vitest does not type-check) — Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received undefined — Correct
- Discrepancies: none

## Cycle 25 -- Green: "should return payout 400 G for regular steel sword ench 3 with 500 G damage (full reimbursement minus 100 G deductible)"
- Minimal implementation: restructured processScenario to loop over all steps; added claim branch with Damage interface, INSURANCE_VALUE map (sword only), DEDUCTIBLE constant, and payout/remainingCap computation
- Tests passing: 25

## Cycle 26 -- Red: "should return payout 100 G for rune with 200 G damage (full reimbursement minus 100 G deductible; no special clause for components)"
- Compilation prediction: No compilation error (function already exists, vitest does not type-check) — Correct
- Runtime prediction: Expected { payout: 100, remainingCap: 400 }, received { payout: NaN, remainingCap: NaN } — Correct
- Discrepancies: none

## Cycle 26 -- Green: "should return payout 100 G for rune with 200 G damage (full reimbursement minus 100 G deductible; no special clause for components)"
- Minimal implementation: added `rune: 250` entry to INSURANCE_VALUE map
- Tests passing: 26

## Cycle 27 -- Red: "should return payout 400 G for dragon-material sword ench 9 with 1000 G damage (both clauses: 50% wins, 500 - 100 deductible)"
- Compilation prediction: No compilation error (function exists, vitest does not type-check) -- Correct
- Runtime prediction: Expected { payout: 400, remainingCap: 1600 }, received { payout: 900, remainingCap: 1100 } -- Correct
- Discrepancies: none

## Cycle 27 -- Green: "should return payout 400 G for dragon-material sword ench 9 with 1000 G damage (both clauses: 50% wins, 500 - 100 deductible)"
- Minimal implementation: added enchantment >= 8 check in calculateClaimPayout to apply 50% reimbursement rate; passed policyItems to look up item properties from the quote step
- Tests passing: 27

## Cycle 28 -- Red: "should return payout 700 G for dragon-material sword ench 5 with 800 G damage (only dragon clause: full, 800 - 100 deductible)"
- Compilation prediction: No compilation error (function exists, vitest does not type-check) -- Correct
- Runtime prediction: Test passes immediately (payout 700, remainingCap 1300 matches current implementation; default full-reimbursement path handles dragon-material with low enchantment) -- Correct
- Discrepancies: none

## Cycle 29 -- Red: "should return payout 400 G for steel sword ench 9 with 1000 G damage (only high-ench clause: 50%, 500 - 100 deductible)"
- Compilation prediction: No compilation error (function exists, vitest does not type-check) -- Correct
- Runtime prediction: Test passes immediately (payout 400, remainingCap 1600 matches current implementation; enchantment >= 8 check already handles steel material with high enchantment) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing calculateClaimPayout already applies 50% rate for enchantment >= 8 regardless of material

## Cycle 30 -- Red: "should return payout 400 G for dragon-material sword ench exactly 8 with 1000 G damage (high-ench threshold at 8: 50%, 500 - 100 deductible)"
- Compilation prediction: No compilation error (function and types already exist) -- Correct
- Runtime prediction: Test passes immediately (payout 400, remainingCap 1600 matches current implementation; enchantment >= 8 boundary already handled) -- Correct
- Discrepancies: none -- test is a triangulation/guard test; existing calculateClaimPayout already applies 50% rate for enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD (8)

## Cycle 31 -- Red: "should apply 100 G deductible per damaged item — sword 500 G + amulet 300 G = payout 600 G (400 + 200)"
- Compilation prediction: No compilation error (function exists, vitest does not type-check) — Correct
- Runtime prediction: Expected { payout: 600, remainingCap: 2600 }, received { payout: NaN, remainingCap: NaN } — Correct
- Discrepancies: none

## Cycle 31 -- Green: "should apply 100 G deductible per damaged item — sword 500 G + amulet 300 G = payout 600 G (400 + 200)"
- Minimal implementation: added `amulet: 600` entry to INSURANCE_VALUE map
- Tests passing: 31

## Cycle 32 -- Red: "should compute insurance sum 2000 G and cap 4000 G for two swords"
- Compilation prediction: No compilation error (function exists, vitest does not type-check) — Correct
- Runtime prediction: Test passes immediately (calculateInsuranceCap already sums all policy items via reduce; two swords correctly yield sum 2000, cap 4000) — Correct
- Discrepancies: none

## Cycle 33 -- Red: "should treat two sword damage entries each with its own deductible"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Test passes immediately (existing reduce handles each damage entry with own deductible; payout 600, remainingCap 3400) — Correct
- Discrepancies: none

## Cycle 34 -- Red: "should reject claim with non-zero exit when damages exceed insured item count for a type"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: expected [Function] to throw an error (processScenario does not validate damage count) — Correct
- Discrepancies: none

## Cycle 34 -- Green: "should reject claim with non-zero exit when damages exceed insured item count for a type"
- Minimal implementation: added damage-count-vs-policy-count validation in claim branch; throws error when any damage type count exceeds insured item count for that type
- Tests passing: 34

## Cycle 35 -- Red: "should compute cap as 2x insurance sum — sword + amulet: sum 1600 G, cap 3200 G"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Test passes immediately (calculateInsuranceCap already sums insurance values and applies 2x multiplier; payout 400, remainingCap 2800) — Correct
- Discrepancies: none

## Cycle 36 -- Red: "should base cap on unmodified insurance value — cursed sword: value 1000 G, cap 2000 G"
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately (calculateInsuranceCap uses unmodified INSURANCE_VALUE; payout 400, remainingCap 1600) — Correct
- Discrepancies: none

## Cycle 37 -- Red: "should compute insurance sum including components at 250 G each — sword + 3 runes: sum 1750 G (block discount affects premium only)"
- Compilation prediction: No compilation error (function and types already exist) — Correct
- Runtime prediction: Test passes immediately (calculateInsuranceCap sums per-item insurance values; block discount only in calculateBasePremium; payout 400, remainingCap 3100) — Correct
- Discrepancies: none

## Cycle 38 -- Red: "should return payout 1400 G and remainingCap 600 G on first claim of 1500 G against sword policy (cap 2000 G)"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Test passes immediately (payout 1400, remainingCap 600 matches current implementation; single-claim cap exhaustion already handled by Math.min and subtraction) — Correct
- Discrepancies: none

## Cycle 39 -- Red: "should return payout 600 G and remainingCap 0 G on second claim of 1500 G when only 600 G cap remains"
- Compilation prediction: No compilation error (function already exists) — Correct
- Runtime prediction: Expected { payout: 600, remainingCap: 0 }, received { payout: 1400, remainingCap: 600 } — Correct
- Discrepancies: none

## Cycle 39 -- Green: "should return payout 600 G and remainingCap 0 G on second claim of 1500 G when only 600 G cap remains"
- Minimal implementation: added policyPayouts tracking map in processScenario to accumulate prior payouts per policy index; compute currentCap as full cap minus prior payouts
- Tests passing: 39

## Cycle 40 -- Red: "should round payout down (floor) in MHPCO's favor -- e.g. 350.5 G becomes 350 G"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Expected { payout: 350, remainingCap: 1650 }, received { payout: 350.5, remainingCap: 1649.5 } -- Correct
- Discrepancies: none

## Cycle 40 -- Green: "should round payout down (floor) in MHPCO's favor -- e.g. 350.5 G becomes 350 G"
- Minimal implementation: wrapped payout computation with Math.floor to round down fractional payouts
- Tests passing: 40

## Cycle 41 -- Red: "should exit with non-zero status and write error to stderr for unknown item type in quote (e.g. broomstick)"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: expected [Function] to throw an error (function does not validate unknown item types) -- Correct
- Discrepancies: none

## Cycle 41 -- Green: "should exit with non-zero status and write error to stderr for unknown item type in quote (e.g. broomstick)"
- Minimal implementation: added item-type validation loop in calculateQuotePremium that throws for types not in BASE_PREMIUM
- Tests passing: 41

## Cycle 42 -- Red: "should exit with non-zero status and write error to stderr when claim references item not in policy"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Test passes immediately (existing validateDamageCounts already throws when damage type is absent from policy counts) -- Correct
- Discrepancies: none

## Cycle 43 -- Red: "should exit with non-zero status and write error to stderr for negative damage amount"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: expected [Function] to throw an error (function does not validate negative damage amounts) -- Correct
- Discrepancies: none

## Cycle 43 -- Green: "should exit with non-zero status and write error to stderr for negative damage amount"
- Minimal implementation: added for-loop validation in claim branch that throws when any damage.amount < 0
- Tests passing: 43

## Cycle 44 -- Red: "should exit with non-zero status and write error to stderr when claim references unknown item type"
- Compilation prediction: No compilation error (function already exists) -- Correct
- Runtime prediction: Test passes immediately (existing validateDamageCounts already throws for unknown damage types not in policy) -- Correct
- Discrepancies: none

## Cycle 45 -- Red: "should read JSON scenario from stdin and write JSON results to stdout with correct structure"
- Compilation prediction: No compilation error (test spawns cli.ts via execFileSync, does not import it) -- Correct
- Runtime prediction: SyntaxError: Unexpected end of JSON input (cli.ts is empty, writes nothing to stdout) -- Correct
- Discrepancies: none

## Cycle 45 -- Green: "should read JSON scenario from stdin and write JSON results to stdout with correct structure"
- Minimal implementation: cli.ts reads stdin with readFileSync(0), parses JSON, calls processScenario, writes { results } to stdout
- Tests passing: 45

## Cycle 46 -- Red: "should produce results array of same length and order as input steps"
- Compilation prediction: No compilation error (test uses existing imports and CLI infrastructure) -- Correct
- Runtime prediction: Test passes immediately (processScenario already handles multi-step scenarios; CLI serializes full results array) -- Correct
- Discrepancies: none

## Cycle 47 -- Red: "should output quote result with integer premium field"
- Compilation prediction: No compilation error (test uses already-imported execFileSync, no new functions needed) -- Correct
- Runtime prediction: Test passes immediately (CLI already produces integer premium via Math.ceil; value 198 matches) -- Correct
- Discrepancies: none

## Cycle 48 -- Red: "should output claim result with integer payout and remainingCap fields"
- Compilation prediction: No compilation error (test uses already-imported execFileSync, no new functions needed) -- Correct
- Runtime prediction: Test passes immediately (CLI already produces integer payout via Math.floor; remainingCap is integer from integer arithmetic) -- Correct
- Discrepancies: none

## Cycle 49 -- Red: "should exit with non-zero status code and write to stderr on error — no results written to stdout"
- Compilation prediction: No compilation error (execFileSync already imported, no new constructs needed) — Correct
- Runtime prediction: Test passes immediately (Node.js unhandled exception exits non-zero, writes to stderr, produces no stdout) — Correct
- Discrepancies: none
