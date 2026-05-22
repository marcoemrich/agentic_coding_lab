# Architecture Notes

## After cycle 1
- Change: extracted `PROCESSING_FEE = 5` named constant from magic number in hardcoded return
- Rationale: Rule 2 (Reveals Intent) — magic number 5 now self-documents as processing fee
- Naming established: `PROCESSING_FEE` constant, `processScenario` function retained

## After cycle 2
- Change: consolidated duplicate `return [{ premium: X }]` into single return with ternary for premium value
- Rationale: Rule 3 (No Duplication) — both branches had identical return structure; Rule 2 — single return clarifies that only premium varies
- Naming established: `premium` local variable for computed premium value

## After cycle 3
- Change: replaced hardcoded 71/115 with `BASE_PREMIUM` lookup map and explicit formula `basePremium + firstInsurance + PROCESSING_FEE`; eliminated if/else if/else conditionals
- Rationale: Rule 2 (Reveals Intent) — formula now self-documents the business rule; Rule 3 — single calculation path removes conceptual duplication
- Naming established: `BASE_PREMIUM` (Record<string, number>), `FIRST_INSURANCE_RATE` constant, `basePremium` / `firstInsurance` locals

## After cycle 4
- Change: inlined `step` intermediate variable into `const items = scenario.steps[0].items`
- Rationale: Rule 4 (Fewest Elements) — `step` was used only once; removing it eliminates an unnecessary binding without hurting clarity
- Naming established: —

## After cycle 5
- Change: extracted `Item` interface from inline type annotation `{ type: string }` in reduce callback; typed `items` as `Item[]`
- Rationale: Rule 2 (Reveals Intent) — names the domain concept explicitly, cleans up the reduce callback, establishes reusable type
- Naming established: `Item` interface

## After cycle 6
- Change: replaced `scenario: any` with typed `Scenario` and `Step` interfaces; removed redundant `Item[]` annotation on `items` local (now inferred)
- Rationale: Rule 2 (Reveals Intent) — `any` hid the expected input structure; explicit interfaces make the contract self-documenting and compiler-enforced
- Naming established: `Scenario` interface, `Step` interface

## After cycle 7
- Change: extracted `calculateBasePremium(items: Item[]): number` helper encapsulating type-counting and block discount logic
- Rationale: Rule 2 (Reveals Intent) — `processScenario` now reads as a high-level recipe; block discount complexity hidden behind a named concept
- Naming established: `calculateBasePremium` helper function

## After cycle 8
- Change: replaced imperative `for`/`let total`/`+=` summing loop with `Object.entries().reduce()` and `premium` explaining variable in `calculateBasePremium`
- Rationale: Rule 4 (Fewest Elements) — eliminated mutable `let total` and two `+=` assignments; Rule 2 — `premium` explaining variable names the per-type computed value
- Naming established: `premium` local in reduce callback

## After cycle 9
- Change: extracted `calculateItemSurcharges(items: Item[]): number` from inline reduce in `processScenario`
- Rationale: Rule 2 (Reveals Intent) — names the per-item surcharge concept; keeps `processScenario` at consistent abstraction level
- Naming established: `calculateItemSurcharges` helper function, `itemSurcharges` local variable

## After cycle 10
- Change: extracted `itemBasePremium` explaining variable in `calculateItemSurcharges` to de-duplicate `BASE_PREMIUM[item.type]` lookup
- Rationale: Rule 3 (No Duplication) — both curse and enchantment surcharges used the same lookup; Rule 2 — names the shared concept
- Naming established: `itemBasePremium` local variable in reduce callback

## After cycle 11
- Change: extracted `calculateLoyaltyDiscount(customer, basePremium): number` helper from inline ternary in `processScenario`
- Rationale: Rule 2 (Reveals Intent) — `processScenario` now delegates all computations to named helpers at consistent abstraction level
- Naming established: `calculateLoyaltyDiscount` helper function

## After cycle 12
- Change: extracted `calculateFollowUpDiscount(customer, basePremium): number` helper from inline ternary in `processScenario`
- Rationale: Rule 2 (Reveals Intent) — consistent abstraction level with `calculateLoyaltyDiscount`; Rule 3 — eliminates structural duplication of threshold-check-then-rate pattern
- Naming established: `calculateFollowUpDiscount` helper function

## After cycle 13
- Change: extracted `calculateInsuranceCap(policyItems: Item[]): number` and `calculateClaimPayout(damages: Damage[]): number` from inline claim logic in `processScenario`
- Rationale: Rule 2 (Reveals Intent) — claim branch now delegates to named helpers at consistent abstraction level with quote branch
- Naming established: `calculateInsuranceCap` helper function, `calculateClaimPayout` helper function

## After cycle 14
- Change: extracted `INSURANCE_CAP_MULTIPLIER = 2` named constant from magic number in `calculateInsuranceCap`
- Rationale: Rule 2 (Reveals Intent) — magic number 2 now self-documents as the cap multiplier, consistent with all other named business-rule constants
- Naming established: `INSURANCE_CAP_MULTIPLIER` constant

## After cycle 15
- Change: extracted `FULL_REIMBURSEMENT_RATE = 1` named constant from magic number in `calculateClaimPayout` ternary
- Rationale: Rule 2 (Reveals Intent) — ternary now reads as a choice between two named rates instead of a named rate vs. a bare `1`
- Naming established: `FULL_REIMBURSEMENT_RATE` constant

## After cycle 16
- Change: extracted `calculateDamageReimbursement(damage, policyItems): number` from reduce callback in `calculateClaimPayout`
- Rationale: Rule 2 (Reveals Intent) — names the per-damage reimbursement concept; `calculateClaimPayout` now reads as a simple summation at consistent abstraction level
- Naming established: `calculateDamageReimbursement` helper function

## After cycle 17
- Change: extracted `countByType(items): Record<string, number>` and `validateDamageCounts(damages, policyItems): void`; replaced three inline counting loops (two in claim validation, one in `calculateBasePremium`) with calls to `countByType`
- Rationale: Rule 3 (No Duplication) — three identical count-by-type loops consolidated into one helper; Rule 2 — claim branch in `processScenario` now delegates to named helpers at consistent abstraction level
- Naming established: `countByType` helper function, `validateDamageCounts` helper function

## After cycle 18
- Change: inlined single-use `cap` variable into `currentCap = calculateInsuranceCap(policyItems) - priorPayouts`
- Rationale: Rule 4 (Fewest Elements) — `cap` was used only once; inlining eliminates an unnecessary binding without hurting clarity
- Naming established: —

## After cycle 19
- Change: extracted `calculateQuotePremium(customer: Customer, items: Item[]): number` from inline quote logic in `processScenario`
- Rationale: Rule 2 (Reveals Intent) — `processScenario` now delegates both quote and claim branches to named helpers at consistent abstraction level
- Naming established: `calculateQuotePremium` helper function

## After cycle 20
- Change: extracted `validateItemTypes(items: Item[]): void` from inline validation loop in `calculateQuotePremium`
- Rationale: Rule 2 (Reveals Intent) — `calculateQuotePremium` now delegates validation to a named helper at consistent abstraction level; mirrors existing `validateDamageCounts` pattern
- Naming established: `validateItemTypes` helper function

## After cycle 21
- Change: extracted `validateDamageAmounts(damages: Damage[]): void` from inline for/if/throw loop in `processScenario` claim branch
- Rationale: Rule 2 (Reveals Intent) — claim branch now delegates to named helpers at consistent abstraction level; mirrors `validateDamageCounts` and `validateItemTypes` patterns
- Naming established: `validateDamageAmounts` helper function

## After cycle 22
- Change: inlined single-use `input` variable in `cli.ts` into `JSON.parse(readFileSync(0, "utf-8"))`
- Rationale: Rule 4 (Fewest Elements) — `input` was used only once; inlining eliminates unnecessary binding and assignment
- Naming established: —
