# Architecture Notes

## After cycle 1
- Change: extracted magic number 5 into `PROCESSING_FEE` constant
- Rationale: Rule 2 (reveals intent) -- the literal 5 is the processing fee per test description; naming it makes the domain concept explicit
- Naming established: `PROCESSING_FEE` (module-level constant, value 5)

## After cycle 2
- Change: renamed `firstInsurance` to `firstInsuranceSurcharge` and extracted magic `0.1` into `FIRST_INSURANCE_RATE` constant
- Rationale: Rule 2 (reveals intent) -- variable name now matches domain language ("first-insurance surcharge"), and the rate is no longer a magic number
- Naming established: `FIRST_INSURANCE_RATE` (module-level constant, value 0.1), `firstInsuranceSurcharge` (local variable in quote calculation)

## After cycle 3
- Change: extracted `calculateQuotePremium(items) -> number` from inline map callback in `processScenario`
- Rationale: Rule 2 (reveals intent) -- the function name explicitly states this is a quote premium calculation; `processScenario` now reads at a higher abstraction level
- Naming established: `calculateQuotePremium` (module-private function, takes items array, returns premium number)

## After cycle 4
- Change: introduced `QuoteResult` and `ScenarioOutcome` interfaces; changed `processScenario` return type from `unknown` to `ScenarioOutcome`
- Rationale: Rule 2 (reveals intent) -- explicit return type documents the function's output contract instead of hiding it behind `unknown`
- Naming established: `QuoteResult` (interface: { premium: number }), `ScenarioOutcome` (interface: { results: QuoteResult[] })

## After cycle 5
- Change: inlined temporary `premium` variable in `processScenario` map callback into object literal
- Rationale: Rule 4 (fewest elements) -- the variable was assigned and immediately returned; the property name in the literal preserves intent
- Naming established: --

## After cycle 6
- Change: inlined temporary `results` variable in `processScenario` into the return object literal
- Rationale: Rule 4 (fewest elements) -- same pattern as cycle 5; variable was assigned and immediately returned, property name preserves intent
- Naming established: --

## After cycle 7
- Change: renamed `counts` to `countsByType` in `calculateQuotePremium`
- Rationale: Rule 2 (reveals intent) -- the variable maps item types to their counts; the new name makes that mapping explicit
- Naming established: `countsByType` (local variable in `calculateQuotePremium`)

## After cycle 8
- Change: extracted `rawPremium` variable in `calculateQuotePremium` to separate premium computation from `Math.ceil` rounding
- Rationale: Rule 2 (reveals intent) -- separates "what the premium total is" from "how we round it," making the rounding step an explicit, distinct concern
- Naming established: `rawPremium` (local variable in `calculateQuotePremium`)

## After cycle 9
- Change: extracted `typePremium(type, count) -> number` from inline conditional in `calculateQuotePremium`'s premium accumulation loop
- Rationale: Rule 2 (reveals intent) -- block pricing logic is now named and isolated; the accumulation loop reads declaratively
- Naming established: `typePremium` (module-private function, takes type string and count number, returns premium for that type)

## After cycle 10
- Change: extracted `countByType(items) -> Record<string, number>` from inline counting loop in `calculateQuotePremium`
- Rationale: Rule 2 (reveals intent) -- `calculateQuotePremium` now reads at a consistent abstraction level, delegating counting and per-type pricing to named helpers
- Naming established: `countByType` (module-private function, takes items array, returns type-to-count mapping)

## After cycle 11
- Change: extracted `cursedSurchargeTotal(items) -> number` from inline cursed-surcharge loop in `calculateQuotePremium`; changed `itemAdjustedTotal` from mutable `let` to immutable `const`
- Rationale: Rule 2 (reveals intent) -- `calculateQuotePremium` now delegates all sub-computations to named helpers at a consistent abstraction level; also eliminates a mutation (assignment mass)
- Naming established: `cursedSurchargeTotal` (module-private function, takes items array with optional `cursed` flag, returns total cursed surcharge amount)

## After cycle 12
- Change: extracted generic `surchargeTotal<T>(items, appliesTo, rate) -> number` to deduplicate `cursedSurchargeTotal` and `highEnchantmentSurchargeTotal`
- Rationale: Rule 3 (no duplication) -- both functions shared identical loop/conditional/accumulate structure with only predicate and rate varying
- Naming established: `surchargeTotal` (module-private generic function, takes items array, predicate, and rate; returns total surcharge amount)

## After cycle 13
- Change: extracted `basePremiumTotal(items) -> number` from inline loop in `calculateQuotePremium`; `policyBasePremium` became `const`
- Rationale: Rule 2 (reveals intent) -- `calculateQuotePremium` now reads at a consistent abstraction level, composing only named sub-computations with no loops or mutable assignments
- Naming established: `basePremiumTotal` (module-private function, takes items array, returns sum of per-type base premiums including block pricing)

## After cycle 14
- Change: replaced mutable `quoteCount` counter with `map`'s built-in index parameter in `processScenario`
- Rationale: Rule 2 (reveals intent) and Rule 4 (fewest elements) -- index directly expresses that quote position is the array position; eliminates 2 assignments and extra bindings
- Naming established: --

## After cycle 15
- Change: extracted `calculateClaimResult(policy, damages) -> ClaimResult` from inline claim block in `processScenario`; replaced mutable `totalPayout` loop with `reduce`
- Rationale: Rule 2 (reveals intent) -- `processScenario` now delegates to named functions for both quote and claim branches, reading at a consistent abstraction level
- Naming established: `calculateClaimResult` (module-private function, takes policy and damages, returns ClaimResult with payout and remainingCap)

## After cycle 16
- Change: eliminated mutable `quoteIndex` counter in `processScenario`; derived quote position from `policies.length` before push
- Rationale: Rule 4 (fewest elements) -- the quote index is already implicit in the policies array length; removing the mutable variable eliminates 2 assignments and 1 binding
- Naming established: --

## After cycle 17
- Change: renamed `HIGH_ENCHANTMENT_CLAIM_RATE` to `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE`
- Rationale: Rule 2 (reveals intent) -- "claim rate" was ambiguous; "reimbursement rate" precisely describes the constant's role as the fraction of damage reimbursed for highly enchanted items
- Naming established: `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE` (module-level constant, value 0.5)

## After cycle 18
- Change: extracted `damageReimbursement(damage, policyItems) -> number` from inline reduce callback in `calculateClaimResult`
- Rationale: Rule 2 (reveals intent) -- `calculateClaimResult` now delegates per-damage reimbursement logic to a named helper, reading at a consistent abstraction level
- Naming established: `damageReimbursement` (module-private function, takes damage object and policy items array, returns net reimbursement for one damage after deductible)
