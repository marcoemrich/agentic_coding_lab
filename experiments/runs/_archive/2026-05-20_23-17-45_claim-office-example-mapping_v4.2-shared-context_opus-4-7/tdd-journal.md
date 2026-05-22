# TDD Journal

## Cycle 1 — Red: empty item list → premium 5 G (processing fee only)
- Compilation prediction: Cannot find module './claim-office.js' — Correct
- Runtime prediction: expected undefined to deeply equal { results: [{ premium: 5 }] } — Correct
- Discrepancies: none

## Cycle 1 — Green: empty item list → premium 5 G (processing fee only)
- Minimal implementation: hardcoded return { results: [{ premium: 5 }] }
- Tests passing: 1

## Cycle 2 — Red: single plain sword newcomer first → premium 115 G
- Compilation prediction: no compilation error (runScenario already exists with unknown signature) — Correct
- Runtime prediction: expected { results: [{ premium: 115 }] }, received { results: [{ premium: 5 }] } — Correct
- Discrepancies: none

## Cycle 2 — Green: single plain sword newcomer first → premium 115 G
- Minimal implementation: per-step map over items summing per-type base premium (sword=100), applied +10% first-insurance and +5 fee
- Tests passing: 2

## Cycle 3 — Red: single plain amulet newcomer first → premium 71 G
- Compilation prediction: no compilation error (runScenario signature is `unknown`, item.type is string) — Correct
- Runtime prediction: expected { results: [{ premium: 71 }] }, received { results: [{ premium: 5 }] } (amulet missing from BASE_PREMIUM → 0 base + 0 first + 5 fee) — Correct
- Discrepancies: none

## Cycle 3 — Green: single plain amulet newcomer first → premium 71 G
- Minimal implementation: added `amulet: 60` entry to BASE_PREMIUM lookup table
- Tests passing: 3

## Cycle 4 — Red: single plain staff newcomer first → premium 93 G
- Compilation prediction: no compilation error (runScenario signature is `unknown`, item.type is string) — Correct
- Runtime prediction: expected { results: [{ premium: 93 }] }, received { results: [{ premium: 5 }] } (staff missing from BASE_PREMIUM → 0 base + 0 first + 5 fee) — Correct
- Discrepancies: none

## Cycle 4 — Green: single plain staff newcomer first → premium 93 G
- Minimal implementation: added `staff: 80` entry to BASE_PREMIUM lookup table
- Tests passing: 4

## Cycle 5 — Red: single plain potion newcomer first → premium 49 G
- Compilation prediction: no compilation error (runScenario signature is `unknown`, item.type is string) — Correct
- Runtime prediction: expected { results: [{ premium: 49 }] }, received { results: [{ premium: 5 }] } (potion missing from BASE_PREMIUM → 0 base + 0 first + 5 fee) — Correct
- Discrepancies: none

## Cycle 5 — Green: single plain potion newcomer first → premium 49 G
- Minimal implementation: added `potion: 40` entry to BASE_PREMIUM lookup table
- Tests passing: 5

## Cycle 6 — Red: single rune newcomer first → premium 33 G (rounded up from 32.5)
- Compilation prediction: no compilation error (runScenario signature is `unknown`, item.type is string) — Correct
- Runtime prediction: expected { results: [{ premium: 33 }] }, received { results: [{ premium: 5 }] } (rune missing from BASE_PREMIUM → 0 base + 0 first + 5 fee) — Correct
- Discrepancies: none

## Cycle 6 — Green: single rune newcomer first → premium 33 G (rounded up from 32.5)
- Minimal implementation: added `rune: 25` to BASE_PREMIUM and wrapped premium computation in `Math.ceil(...)` to round up (R4)
- Tests passing: 6

## Cycle 7 — Red: 2 runes (no block) → premium 60 G for newcomer first
- Compilation prediction: no compilation error (runScenario takes `unknown`; item shape unchanged) — Correct
- Runtime prediction: no runtime error — existing per-item BASE_PREMIUM sum already computes 2×25 + 5 first + 5 fee = 60 G — Correct
- Discrepancies: test passes immediately; this exercise confirms current additive impl handles multi-rune sums (no block logic involved). Block discount enters with the next test (3 runes → 60 G base).

## Cycle 7 — Green: 2 runes (no block) → premium 60 G for newcomer first
- Minimal implementation: no code change required — existing per-item `BASE_PREMIUM[item.type]` reduce already sums 25+25=50, plus 10% first-insurance (5) and processing fee (5) = 60 G
- Tests passing: 7

## Cycle 8 — Red: 3 runes (block applies) → premium 71 G for newcomer first
- Compilation prediction: no compilation error (runScenario signature is `unknown`; item shape `{type: "rune"}` unchanged) — Correct
- Runtime prediction: expected { results: [{ premium: 71 }] }, received { results: [{ premium: 88 }] } (current sum-only impl: 3×25=75 base + 7.5 first + 5 fee = 87.5 → ceil 88) — Correct
- Discrepancies: none

## Cycle 8 — Green: 3 runes (block applies) → premium 71 G for newcomer first
- Minimal implementation: grouped items by type and applied a narrow block rule — `if (type === "rune" && count === 3) basePremium += 60` else `perItem * count`
- Tests passing: 8

## Cycle 9 — Red: 4 runes (no block) → premium 115 G for newcomer first
- Compilation prediction: no compilation error (runScenario takes `unknown`; item shape `{type: "rune"}` unchanged) — Correct
- Runtime prediction: no runtime error — existing impl handles 4 runes correctly because `count === RUNE_BLOCK_SIZE` (3) is false for count=4, falls through to `perItem * count = 25 * 4 = 100`, +10 first, +5 fee = 115 G — Correct
- Discrepancies: test passes immediately; this exercise confirms the narrow `count === 3` branch correctly excludes 4-rune cases (no false-positive block discount). Block-discount generalisation pressure will come from "7 runes" (count > 3 with no block) and "3 runes + 3 moonstones" (multi-type blocks).

## Cycle 9 — Green: 4 runes (no block) → premium 115 G for newcomer first
- Minimal implementation: no code change required — narrow `type === "rune" && count === RUNE_BLOCK_SIZE` branch correctly falls through for count=4, yielding `perItem * count = 25 * 4 = 100` base + 10 first + 5 fee = 115 G
- Tests passing: 9

## Cycle 10 — Red: 7 runes (no block) → premium 198 G for newcomer first (rounded up from 197.5)
- Compilation prediction: no compilation error (runScenario takes `unknown`; item shape `{type: "rune"}` unchanged) — Correct
- Runtime prediction: no runtime error — existing impl handles 7 runes correctly: count=7 fails `count === RUNE_BLOCK_SIZE (3)` check, falls through to else with `perItem * count = 25 * 7 = 175` base, + 17.5 first, + 5 fee = 197.5, `Math.ceil` → 198 G — Correct
- Discrepancies: test passes immediately; this exercise confirms the narrow `count === 3` branch correctly excludes 7-rune (i.e. >3) cases and that rounding-up (R4) chains correctly with multi-rune sums. Block-discount generalisation pressure now comes only from "3 runes + 3 moonstones" (two separate blocks, multi-type).

## Cycle 10 — Green: 7 runes (no block) → premium 198 G for newcomer first (rounded up from 197.5)
- Minimal implementation: no code change required — narrow `type === "rune" && count === RUNE_BLOCK_SIZE` branch falls through for count=7, yielding `perItem * count = 25 * 7 = 175` base + 17.5 first + 5 fee = 197.5 → `Math.ceil` → 198 G
- Tests passing: 10

## Cycle 11 — Red: 2 runes + 1 moonstone (no block, different types) → premium 88 G for newcomer first
- Compilation prediction: no compilation error (runScenario takes `unknown`; item shape `{type: "moonstone"}` matches existing string-typed Item; BASE_PREMIUM uses `?? 0` fallback) — Correct
- Runtime prediction: expected { results: [{ premium: 88 }] }, received { results: [{ premium: 60 }] } (moonstone missing from BASE_PREMIUM → `?? 0` → 0; base 50 + 5 first + 5 fee = 60) — Correct
- Discrepancies: none

## Cycle 11 — Green: 2 runes + 1 moonstone (no block, different types) → premium 88 G for newcomer first
- Minimal implementation: added `moonstone: 25` entry to BASE_PREMIUM lookup table (per-item component price per R1)
- Tests passing: 11

## Cycle 12 — Red: 3 runes + 3 moonstones (two separate blocks) → premium 137 G for newcomer first
- Compilation prediction: no compilation error (runScenario takes `unknown`; item shape `{type: "moonstone"}` already in BASE_PREMIUM; `Item.type: string` accepts any label) — Correct
- Runtime prediction: expected { results: [{ premium: 137 }] }, received { results: [{ premium: 154 }] } (current block branch gated on `type === "rune"` only: 3 runes → 60 block, 3 moonstones fall to else-branch → 25 * 3 = 75; base 135 + 13.5 first + 5 fee = 153.5 → ceil 154) — Correct
- Discrepancies: none

## Cycle 12 — Green: 3 runes + 3 moonstones (two separate blocks) → premium 137 G for newcomer first
- Minimal implementation: introduced module-level `const COMPONENT_TYPES = new Set(["rune", "moonstone"])` and generalized block branch from `type === "rune"` to `COMPONENT_TYPES.has(type)`; block size/price unchanged
- Tests passing: 12

## Cycle 13 — Red: cursed steel sword enchantment 3, newcomer first → premium 165 G (100 + 50 curse + 10 first + 5 fee)
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item.type: string accepts extra structural fields cursed/material/enchantment) — Correct
- Runtime prediction: expected { results: [{ premium: 165 }] }, received { results: [{ premium: 115 }] } (cursed flag ignored → plain sword 100 + 10 first + 5 fee) — Correct
- Discrepancies: none

## Cycle 13 — Green: cursed steel sword enchantment 3, newcomer first → premium 165 G
- Minimal implementation: added optional `cursed?: boolean` to Item; added a per-item pass that sums `cursedSurcharge += BASE_PREMIUM[item.type] * 0.5` when `item.cursed`; added `cursedSurcharge` into `rawPremium` between basePremium and firstInsurance (so first-insurance stays computed on basePremium only per spec)
- Tests passing: 13

## Cycle 14 — Red: steel sword enchantment 5, newcomer first → premium 145 G (100 + 30 high-ench + 10 first + 5 fee) [threshold]
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item.type: string accepts extra structural fields material/enchantment) — Correct
- Runtime prediction: expected { results: [{ premium: 145 }] }, received { results: [{ premium: 115 }] } (high-enchantment surcharge ignored → plain sword 100 + 10 first + 5 fee = 115) — Correct
- Discrepancies: none

## Cycle 14 — Green: steel sword enchantment 5, newcomer first → premium 145 G
- Minimal implementation: added optional `enchantment?: number` to Item; added module-level `HIGH_ENCHANTMENT_RATE = 0.3` and `HIGH_ENCHANTMENT_THRESHOLD = 5`; added a per-item pass that sums `highEnchantmentSurcharge += BASE_PREMIUM[item.type] * 0.3` when `(item.enchantment ?? 0) >= 5`; added `highEnchantmentSurcharge` into `rawPremium` between `cursedSurcharge` and `firstInsurance`
- Tests passing: 14

## Cycle 15 — Red: steel sword enchantment 4, newcomer first → premium 115 G (no high-ench surcharge)
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item.type: string accepts extra structural fields material/enchantment; enchantment already typed as optional number) — Correct
- Runtime prediction: no runtime error — existing `(item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD (5)` gate correctly excludes enchantment=4, yielding 100 base + 0 surcharge + 10 first + 5 fee = 115 G — Correct
- Discrepancies: test passes immediately; this exercise confirms the spec-R3 threshold ("level ≥ 5") is encoded with the correct strict `>=` boundary — enchantment values just below threshold do not leak surcharge. No new structural pressure introduced; the only remaining branch test for high-enchantment is the compound "cursed + enchantment 5" case (next test in the list), which will exercise both surcharges on the same item.

## Cycle 15 — Green: steel sword enchantment 4, newcomer first → premium 115 G (no high-ench surcharge)
- Minimal implementation: no code change required — existing `(item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD (5)` gate correctly excludes enchantment=4 (4 < 5), yielding `itemBase * HIGH_ENCHANTMENT_RATE` not added; 100 base + 0 surcharge + 10 first + 5 fee = 115 G
- Tests passing: 15

## Cycle 16 — Red: cursed steel sword enchantment 5, newcomer first → premium 195 G (100 + 50 curse + 30 high-ench + 10 first + 5 fee)
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item.type: string with optional cursed/enchantment; material structural) — Correct
- Runtime prediction: no runtime error — cycle-14 unified surcharge loop applies both cursed (+50) and enchantment≥5 (+30) independently on the same item, yielding 100 + 50 + 30 + 10 first + 5 fee = 195 G — Correct
- Discrepancies: test passes immediately; this exercise confirms the cycle-14 unified surcharge loop composes BOTH modifiers on a single item additively (each surcharge based on the original BASE_PREMIUM, not curse-augmented), matching spec R3's per-modifier "% on the item's base premium" phrasing. No new structural pressure introduced.

## Cycle 16 — Green: cursed steel sword enchantment 5, newcomer first → premium 195 G
- Minimal implementation: no code change required — cycle-14's unified per-item surcharge loop already composes cursed (+50% of base) and enchantment≥5 (+30% of base) additively on the same item; 100 base + 50 + 30 + 10 first + 5 fee = 195 G
- Tests passing: 16

## Cycle 17 — Red: cursed sword + plain amulet, newcomer first → premium 231 G (sum base 160 + 50 curse on sword + 16 first on 160 + 5 fee)
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item.type: string with optional cursed; existing structural fields suffice) — Correct
- Runtime prediction: no runtime error — existing impl correctly scopes curse to the cursed sword only (cursed surcharge += BASE_PREMIUM[sword] * 0.5 = 50) and computes first-insurance on the policy basePremium sum (160 * 0.1 = 16), yielding 160 base + 50 + 16 + 5 = 231 G — Correct
- Discrepancies: test passes immediately; this exercise confirms the cycle-13/14 design separates per-item modifiers (cursed iterated per item, gated on `item.cursed`) from policy-wide modifiers (firstInsurance computed once from `basePremium` sum). The plain amulet correctly contributes 0 to itemSurcharges (no cursed flag), while still contributing 60 to basePremium that the policy-wide first-insurance percentages from. This is the first multi-item modifier-scope test; no new structural pressure introduced — the existing partition matches spec R3's modifier scoping exactly.

## Cycle 17 — Green: cursed sword + plain amulet, newcomer first → premium 231 G
- Minimal implementation: no code change required — `computeItemSurcharges` already iterates per item and gates the curse surcharge on `item.cursed`, so only the sword contributes 50 (amulet contributes 0). `computeBasePremium` sums per-type aggregates (sword 100 + amulet 60 = 160), and `firstInsurance` is computed once on the policy-wide `basePremium` (160 × 0.1 = 16). Total: 160 + 50 + 16 + 5 = 231 G.
- Tests passing: 17

## Cycle 18 — Red: plain sword for customer with exactly 2 years, first contract → premium 95 G (100 − 20 loyalty + 10 first + 5 fee) [loyalty threshold]
- Compilation prediction: no compilation error (runScenario takes `unknown`; existing Scenario/QuoteStep/Item interfaces accept `{customer: {yearsWithMHPCO: 2}, ...}` exactly) — Correct
- Runtime prediction: expected { results: [{ premium: 95 }] }, received { results: [{ premium: 115 }] } (yearsWithMHPCO ignored — no loyalty discount; current impl yields 100 base + 10 first + 5 fee = 115 G) — Correct
- Discrepancies: none

## Cycle 18 — Green: plain sword for customer with exactly 2 years, first contract → premium 95 G
- Minimal implementation: added inline `loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? basePremium * 0.2 : 0` in `runScenario`'s step.map; subtracted it in the `rawPremium` sum between `firstInsurance` and `PROCESSING_FEE`
- Tests passing: 18

## Cycle 19 — Red: long-standing 2nd contract: customer 3y, second quote, cursed sword enchantment 7 → premium 160 G [integration example]
- Compilation prediction: no compilation error (existing `Item` interface already has optional `cursed`/`enchantment`; `Scenario.customer.yearsWithMHPCO` already supported; multi-step `steps: QuoteStep[]` already supported) — Correct
- Runtime prediction: expected { premium: 160 }, received { premium: 175 } (current impl lacks follow-up discount on second quote: 100 base + 80 surcharges (50 curse + 30 high-ench) + 10 first - 20 loyalty + 5 fee = 175; missing -15 follow-up discount) — Correct
- Discrepancies: none

## Cycle 19 — Green: long-standing 2nd contract: customer 3y, second quote, cursed sword enchantment 7 → premium 160 G
- Minimal implementation: added module-level `FOLLOW_UP_DISCOUNT_RATE = 0.15`; threaded `stepIndex` from `scenario.steps.map((step, stepIndex) => ...)` and computed `followUpDiscount = stepIndex >= 1 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0`, subtracted from `rawPremium`

## Cycle 20 — Red: standard claim — steel sword enchantment 3, damage 500 → payout 400 G; remainingCap 1600 G
- Compilation prediction: no compilation error (runScenario takes `unknown`; new claim-step shape is admitted by cast). After widening `Scenario.steps` to `Step[]` (union of QuoteStep|ClaimStep) the dispatch `step.op === "claim"` narrows correctly — Correct
- Runtime prediction: first ran into `TypeError: items is not iterable` because `computeQuote` was invoked for claim steps lacking `items`. After adding a `ClaimStep` interface and an empty `computeClaim()` stub returning `{payout: 0, remainingCap: 0}` plus the `step.op === "claim"` dispatch, second run yielded `AssertionError: expected { payout: 0, remainingCap: 0 } to deeply equal { payout: 400, remainingCap: 1600 }` — Correct
- Discrepancies: none — claim-path scaffolding (ClaimStep interface, Step union, computeClaim stub, dispatch) was the empty-function setup for Red.

- Tests passing: 19

## Cycle 20 — Green: standard claim — steel sword enchantment 3, damage 500 → payout 400 G; remainingCap 1600 G
- Minimal implementation: added INSURANCE_VALUE lookup table (sword 1000, amulet 600, staff 800, potion 400, rune/moonstone 250) and named constants CLAIM_DEDUCTIBLE = 100 and CAP_MULTIPLIER = 2; in computeClaim, indexed `scenario.steps[step.policy]` (cast to QuoteStep) to retrieve the policy's items, looked up the first item's insurance value (single-item policy in this test), computed cap = insuranceSum * CAP_MULTIPLIER, computed payout = damages[0].amount - CLAIM_DEDUCTIBLE (single-damage case), and returned `{payout, remainingCap: cap - payout}`. Single-item / single-damage shortcut keeps step minimal; reduce-based generalization deferred until forward tests demand it (E11 multi-damage, E14 multi-item).
- Tests passing: 20

## Cycle 21 — Red: standard claim on rune (no enchantment/material), damage 200 → payout 100 G; remainingCap 400 G (cap 500 − 100)
- Compilation prediction: no compilation error (runScenario takes `unknown`; rune already in INSURANCE_VALUE and BASE_PREMIUM; ClaimStep interface unchanged) — Correct
- Runtime prediction: no runtime error — existing single-item/single-damage shortcut from cycle 20 generalises to rune policies (INSURANCE_VALUE["rune"]=250, cap=500, damages[0].amount=200, payout=200-100=100, remainingCap=500-100=400) — Correct
- Discrepancies: test passes immediately; this exercise confirms the cycle-20 single-item/single-damage shortcut applies uniformly to component-type policies (not just main items). No new structural pressure introduced; multi-damage (E11), multi-item (E14), block-vs-insurance-sum independence (E15), and cap-exhaustion across claims will drive the next generalisations.

## Cycle 21 — Green: standard claim on rune (no enchantment/material), damage 200 → payout 100 G; remainingCap 400 G
- Minimal implementation: no code change required — cycle-20's `computeClaim` single-item/single-damage path generalises directly to rune policies via the existing INSURANCE_VALUE lookup (rune=250); cap=250×2=500, payout=200−100=100, remainingCap=500−100=400.
- Tests passing: 21

## Cycle 22 — Red: high-enchantment clause — steel sword enchantment 9, damage 1000 → payout 400 G (500 − 100); remainingCap 1600 G
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item already has optional `enchantment?: number`; damage entry shape `{type, amount}` unchanged from existing claim tests; no new structural fields required) — Correct
- Runtime prediction: expected { payout: 400, remainingCap: 1600 }, received { payout: 900, remainingCap: 1100 } (current computeClaim ignores policy-item enchantment ≥ 8 clause; 1000 − 100 = 900 instead of (1000 × 0.5) − 100 = 400; remainingCap = 2000 − 900 = 1100 instead of 2000 − 400 = 1600) — Correct
- Discrepancies: none

## Cycle 22 — Green: high-enchantment clause — steel sword enchantment 9, damage 1000 → payout 400 G
- Minimal implementation: in `computeClaim`, looked up the policy's first item, computed `reducedDamage = (damagedItem.enchantment ?? 0) >= 8 ? damageAmount * 0.5 : damageAmount`, and used `reducedDamage - CLAIM_DEDUCTIBLE` as the payout. Single-item shortcut preserved; threshold 8 and 0.5 rate kept as inline literals (will be named in Refactor).
- Tests passing: 22

## Cycle 23 — Red: dragon-material clause — dragon sword enchantment 5, damage 800 → payout 700 G (800 − 100); remainingCap 1300 G
- Compilation prediction: no compilation error (runScenario takes `unknown`; Item.type: string admits additional structural fields material/enchantment; existing tests already use `material: "steel"`) — Correct
- Runtime prediction: no runtime error — existing `computeClaim` produces the correct result by coincidence: enchantment 5 < HIGH_ENCHANTMENT_CLAIM_THRESHOLD (8), so the else branch sets effectiveDamage = damageAmount = 800; payout = 800 − 100 = 700; cap = 100 × 10 × 2 = 2000; remainingCap = 2000 − 700 = 1300 G — Correct
- Discrepancies: test passes immediately; this exercise confirms that the spec's dragon-material clause ("full reimbursement before deductible") produces the SAME numeric result as the default branch for items where no other clause activates — so the current code coincidentally handles this case without an explicit `material === "dragon"` check. Structural pressure to add a dragon branch comes from the NEXT two tests: "both clauses (50 % wins): dragon sword enchantment 9, damage 1000 → 400 G" (where dragon AND high-ench compete, and the high-ench branch must still win) and "enchantment threshold exactly 8: dragon sword enchantment 8, damage 1000 → 400 G" (same precedence test at the threshold boundary). Until then, no code change is needed: the dragon clause is observationally equivalent to "no clause" when high-ench is not in play.

## Cycle 23 — Green: dragon-material clause — dragon sword enchantment 5, damage 800 → payout 700 G (800 − 100); remainingCap 1300 G
- Minimal implementation: no code change required — current `computeClaim` else-branch correctly handles enchantment 5 < HIGH_ENCHANTMENT_CLAIM_THRESHOLD (8) → effectiveDamage = 800; payout = 800 − 100 = 700; cap = 100 × 10 × 2 = 2000; remainingCap = 2000 − 700 = 1300 G. Per Red predictions, the dragon-material clause is observationally equivalent to "no clause" when high-ench is not in play, so the default full-damage path produces the correct result without an explicit `material === "dragon"` check. Adding one now would be over-implementation: structural pressure for an explicit dragon branch only arrives with the next two tests (both clauses → 50% wins; enchantment exactly 8 → 50% wins) where precedence between dragon and high-ench must be encoded.
- Tests passing: 23
