# Architecture Notes

## After cycle 1
- Change: added typed parameter signatures to `quote(_policy, _options)` matching test call site
- Rationale: Rule 2 (Reveals Intent) — function signature now documents expected inputs
- Naming established: `quote(policy, options)` interface with `{ customer: { years }, items[] }` and `{ isFollowUp }`

## After cycle 2
- Change: extracted `PROCESSING_FEE = 5` module-level constant from hardcoded literal
- Rationale: Rule 2 (Reveals Intent) — names the domain concept "processing fee" explicitly in the code
- Naming established: `PROCESSING_FEE` constant

## After cycle 3
- Change: replaced hardcoded premium values with `BASE_PRICE` lookup table, `FIRST_INSURANCE_RATE` constant, and explicit formula `base + base * FIRST_INSURANCE_RATE + PROCESSING_FEE`
- Rationale: Rule 2 (Reveals Intent) + Rule 3 (No Duplication) — formula was implicit and duplicated across two branches; now expressed once with named domain concepts
- Naming established: `BASE_PRICE` (Record<string, number>), `FIRST_INSURANCE_RATE` constant, `base` local binding

## After cycle 4
- Change: extracted `itemPremium(items) -> number` helper; `quote` now reads `itemPremium(policy.items) + PROCESSING_FEE`
- Rationale: Rule 2 (Reveals Intent) + Rule 3 (No Duplication) -- processing fee was applied in two separate return paths; now applied once, and quote body is a single expression revealing the domain formula
- Naming established: `itemPremium` (private helper)

## After cycle 5
- Change: replaced conditional + index-access (`if empty return 0; items[0]`) in `itemPremium` with `reduce` accumulator
- Rationale: Rule 2 (Reveals Intent) -- reduce directly communicates "sum premiums over all items" and naturally handles the empty case without a branch
- Naming established: --

## After cycle 6
- Change: extracted `singleItemPremium(item) -> number` from inline reduce callback in `itemPremium`
- Rationale: Rule 2 (Reveals Intent) -- separates per-item premium calculation from aggregation; each function now has a single clear purpose
- Naming established: `singleItemPremium` (private helper)

## After cycle 7
- Change: removed dead `singleItemPremium` function (no longer called after block-of-3 restructuring); extracted `BLOCK_OF_THREE_PRICE = 60` named constant
- Rationale: Rule 4 (Fewest Elements) for dead code removal; Rule 2 (Reveals Intent) for naming the magic number 60
- Naming established: `BLOCK_OF_THREE_PRICE` constant

## After cycle 8
- Change: extracted explaining variable `isBlockOfThree = count === 3` in `itemPremium` to name the conditional's domain concept
- Rationale: Rule 2 (Reveals Intent) -- bare `count === 3` did not communicate the "block of three" pricing rule; explaining variable makes the business rule self-documenting
- Naming established: `isBlockOfThree` local binding

## After cycle 9
- Change: renamed `counts` to `countsByType` in `itemPremium`
- Rationale: Rule 2 (Reveals Intent) -- generic name `counts` did not communicate that the map keys are item types; `countsByType` is self-documenting
- Naming established: `countsByType` local binding

## After cycle 10
- Change: extracted `CURSED_SURCHARGE_RATE = 0.5` named constant; renamed `totalBase` to `itemTotal` in `itemPremium`
- Rationale: Rule 2 (Reveals Intent) -- magic number 0.5 now names the domain concept; accumulator name was misleading after it absorbed cursed surcharges beyond just the base
- Naming established: `CURSED_SURCHARGE_RATE` constant, `itemTotal` local binding

## After cycle 11
- Change: extracted `surchargeFor(item) -> number` helper from inline surcharge conditionals in `itemPremium`
- Rationale: Rule 2 (Reveals Intent) -- separates per-item surcharge calculation (cursed + high-enchantment) from aggregation; each function now has a single clear purpose
- Naming established: `surchargeFor` (private helper)

## After cycle 12
- Change: extracted `PolicyItem` type alias from inline `{ type: string; cursed?: boolean; enchantment?: number }` repeated in `surchargeFor`, `itemPremium`, and `quote` signatures
- Rationale: Rule 3 (No Duplication) + Rule 2 (Reveals Intent) -- eliminated triple type repetition and named the domain concept; also attempted consolidating `quote` body into single rate-multiplier expression but reverted due to floating-point interaction with `Math.ceil`
- Naming established: `PolicyItem` type alias

## After cycle 13
- Change: extracted `base = BASE_PRICE[item.type]` explaining variable in `surchargeFor`, eliminating duplicate lookup
- Rationale: Rule 3 (No Duplication) + Rule 2 (Reveals Intent) -- names "base price for this item type" concept; also attempted consolidating first-insurance assignment in `quote` but reverted (floating-point + Math.ceil confirmed again)
- Naming established: `base` local binding in `surchargeFor`

## After cycle 14
- Change: renamed `itemPremium` to `itemPremiums` (plural) to reflect aggregate return type `{ baseSum, total }`
- Rationale: Rule 2 (Reveals Intent) -- singular name was misleading after return type changed from `number` to composite object
- Naming established: `itemPremiums` (private helper, replaces `itemPremium`)

## After cycle 15
- Change: renamed `cap` to `insuranceCap` in `claim`; extracted `INSURANCE_CAP_MULTIPLIER = 2` named constant
- Rationale: Rule 2 (Reveals Intent) -- `insuranceCap` mirrors return field `remainingCap`; magic number `2` now has a domain name consistent with project convention
- Naming established: `insuranceCap` local binding, `INSURANCE_CAP_MULTIPLIER` constant

## After cycle 16
- Change: extracted `CLAIM_ENCHANTMENT_THRESHOLD = 8` and `CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5` from inline magic numbers in `claim`
- Rationale: Rule 2 (Reveals Intent) -- names two domain concepts; `CLAIM_` prefix distinguishes from quote-side `HIGH_ENCHANTMENT_THRESHOLD = 5` which uses a different threshold
- Naming established: `CLAIM_ENCHANTMENT_THRESHOLD` constant, `CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE` constant
