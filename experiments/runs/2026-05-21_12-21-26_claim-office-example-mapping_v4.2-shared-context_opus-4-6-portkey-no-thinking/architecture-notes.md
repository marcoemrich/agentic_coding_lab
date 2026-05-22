# Architecture Notes

## After cycle 1
- Change: added `QuoteInput` interface and typed `quote(_input: QuoteInput): number` signature
- Rationale: Rule 2 (Reveals Intent) -- function signature now documents the input contract the test already exercises
- Naming established: `QuoteInput` (interface for quote input shape), `quote`, `claim` (domain function names retained)

## After cycle 2
- Change: extracted `PROCESSING_FEE` constant; decomposed hardcoded `115` into `110 + PROCESSING_FEE`
- Rationale: Rule 2 (Reveals Intent) -- makes fee concept explicit; Rule 3 (No Duplication) -- fee value shared across both branches
- Naming established: `PROCESSING_FEE` (module-level constant, 5 G)

## After cycle 3
- Change: extracted `BASE_PREMIUM` lookup map and `FIRST_INSURANCE_RATE` constant; replaced conditional item-type branches with data-driven lookup and explicit formula `base + base * FIRST_INSURANCE_RATE + PROCESSING_FEE`
- Rationale: Rule 2 (Reveals Intent) -- eliminates magic numbers 66/110, names domain concepts; Rule 3 (No Duplication) -- unifies two conditional branches into one code path
- Naming established: `BASE_PREMIUM` (Record<string, number> map of item-type base premiums), `FIRST_INSURANCE_RATE` (0.1), `base` (local), `itemPremium` (local)

## After cycle 4
- Change: introduced `QuoteItem` interface (`{ type: string }`), changed `QuoteInput.items` from `unknown[]` to `QuoteItem[]`, removed unsafe `as` cast in `quote`
- Rationale: Rule 2 (Reveals Intent) -- interface now self-documents item shape; eliminates type cast
- Naming established: `QuoteItem` (exported interface for individual quote items)

## After cycle 5
- Change: inlined `itemPremium` variable into single return expression `base + base * FIRST_INSURANCE_RATE + PROCESSING_FEE`
- Rationale: Rule 4 (Fewest Elements) -- intermediate variable used only once; formula is short enough to be self-documenting inline
- Naming established: --

## After cycle 6
- Change: re-extracted `itemPremium` variable from return expression now that `Math.ceil` wraps it
- Rationale: Rule 2 (Reveals Intent) -- with `Math.ceil` added, the single-line expression mixes item premium computation with fee/rounding; extracting separates these concerns
- Naming established: `itemPremium` (local, reintroduced)

## After cycle 7
- Change: renamed `itemPremium` to `policyPremium`; removed early-return guard for empty items (general path handles it)
- Rationale: Rule 2 (Reveals Intent) -- variable now sums all items, not one; Rule 3/4 -- early return duplicated general-case logic
- Naming established: `policyPremium` (local, replaces `itemPremium`)

## After cycle 8
- Change: extracted magic number `60` to named constant `BLOCK_OF_3_PREMIUM`
- Rationale: Rule 2 (Reveals Intent) -- all pricing domain values are now named constants; eliminates last magic number in pricing logic
- Naming established: `BLOCK_OF_3_PREMIUM` (module-level constant, 60 G flat rate for exactly 3 alike components)

## After cycle 9
- Change: renamed local variable `counts` to `itemTypeCounts`
- Rationale: Rule 2 (Reveals Intent) -- generic name "counts" didn't communicate what is being counted; new name clarifies it tracks per-item-type frequencies for block-of-3 rule
- Naming established: `itemTypeCounts` (local variable in `quote`)

## After cycle 10
- Change: extracted `firstInsuranceSurcharge` explaining variable from inline `policyBase * FIRST_INSURANCE_RATE` in policyPremium formula
- Rationale: Rule 2 (Reveals Intent) -- policyPremium formula now reads as sum of three named components; clarifies first-insurance applies only to policyBase, not to itemSurcharges
- Naming established: `firstInsuranceSurcharge` (local variable in `quote`)

## After cycle 11
- Change: extracted `itemBase` local variable from duplicated `BASE_PREMIUM[item.type]` lookups in surcharge loop
- Rationale: Rule 3 (No Duplication) -- eliminates repeated map lookup; Rule 2 -- names the item's base premium concept
- Naming established: `itemBase` (local variable in surcharge loop within `quote`)

## After cycle 12
- Change: extracted magic number `2` to named constant `LOYALTY_THRESHOLD_YEARS`
- Rationale: Rule 2 (Reveals Intent) -- all other domain values already had named constants; this eliminates the last magic number in pricing logic
- Naming established: `LOYALTY_THRESHOLD_YEARS` (module-level constant, 2 years)

## After cycle 13
- Change: extracted `totalDiscounts` explaining variable grouping `loyaltyDiscount + followUpDiscount`; simplified `policyPremium` formula to `policyBase + itemSurcharges + firstInsuranceSurcharge - totalDiscounts`
- Rationale: Rule 2 (Reveals Intent) -- premium formula now clearly separates positive components from aggregate discounts; future discounts aggregate into one named concept
- Naming established: `totalDiscounts` (local variable in `quote`)

## After cycle 14
- Change: inlined single-use `payout` variable into return object literal in `claim`
- Rationale: Rule 4 (Fewest Elements) -- variable used only once; return type `ClaimResult.payout` already names the concept
- Naming established: --

## After cycle 15
- Change: replaced imperative `for` loop with mutable `let payout += ...` accumulator with declarative `reduce` in `claim`
- Rationale: Rule 4 (Fewest Elements) -- eliminates 2 assignments (mutation); mass 27 to 20; `payout` is now `const`
- Naming established: --

## After cycle 16
- Change: extracted `isHighEnchantment` explaining variable; converted `let reimbursement` + mutation to `const` with ternary in `claim`
- Rationale: Rule 2 (Reveals Intent) -- names the business concept; Rule 4 (Fewest Elements) -- eliminates all assignments in reduce callback; mass 54 to 46
- Naming established: `isHighEnchantment` (local boolean in `claim` reduce callback)

## After cycle 17
- Change: extracted `enchantmentLevel` explaining variable; replaced verbose `!== undefined && ... !== undefined && ... >=` null-check chain with `policyItem?.enchantment ?? 0` and simple threshold comparison
- Rationale: Rule 2 (Reveals Intent) -- names the concept being tested; Rule 4 (Fewest Elements) -- eliminates 2 redundant null-check invocations; mass 47 to 45
- Naming established: `enchantmentLevel` (local variable in `claim` reduce callback)

## After cycle 18
- Change: renamed local variable `cap` to `insuranceCap` in `claim`
- Rationale: Rule 2 (Reveals Intent) -- `cap` was ambiguous; `insuranceCap` makes return expression `remainingCap: insuranceCap - flooredPayout` self-documenting
- Naming established: `insuranceCap` (local variable in `claim`)
