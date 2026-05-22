# Architecture Notes

## After cycle 1
- Change: added typed parameters to `quote(items: unknown[], customer: CustomerContext): number` and introduced `CustomerContext` interface
- Rationale: Rule 2 (Reveals Intent) -- signature now matches test call site and documents expected inputs
- Naming established: `CustomerContext` interface with `yearsWithMHPCO` and `previousQuotes` fields

## After cycle 2
- Change: introduced `Item` interface, changed `items` param from `unknown[]` to `Item[]`, removed inline type assertion
- Rationale: Rule 2 (Reveals Intent) -- parameter type now declares expected shape instead of hiding it in a cast
- Naming established: `Item` interface with `type: string` field

## After cycle 3
- Change: replaced if/else-if chain with `BASE_PREMIUM` Record lookup map; extracted `PROCESSING_FEE` constant
- Rationale: Rule 2 (Reveals Intent) + Rule 3 (No Duplication) -- declarative data map replaces repeated conditional branching pattern; magic number named
- Naming established: `BASE_PREMIUM` (Record<string, number>), `PROCESSING_FEE` (number)

## After cycle 4
- Change: replaced imperative for-loop with mutable accumulator with `items.reduce()` and const binding
- Rationale: Rule 4 (Fewest Elements) + Rule 2 (Reveals Intent) -- eliminates mutation, expresses sum as single declarative expression; APP mass 38 to 27
- Naming established: ---

## After cycle 5
- Change: extracted `basePremiumFor(item: Item): number` helper from inline map lookup in reduce callback
- Rationale: Rule 2 (Reveals Intent) -- named function reads more clearly than inline `(BASE_PREMIUM[item.type] ?? 0)` and provides natural expansion point for item-specific modifiers
- Naming established: `basePremiumFor` (private helper, Item -> number)

## After cycle 6
- Change: extracted `DEFAULT_CUSTOMER` constant in test file, replacing 6 inline duplications of `{ yearsWithMHPCO: 0, previousQuotes: 0 }`
- Rationale: Rule 3 (No Duplication) -- test code had 6-fold repetition of the same default customer context
- Naming established: `DEFAULT_CUSTOMER` (test-scope constant, shared across all base-premium tests)

## After cycle 7
- Change: removed dead `basePremiumFor(item: Item): number` helper -- no longer called after group-by-type refactor in green phase
- Rationale: Rule 4 (Fewest Elements) + Rule 2 (Reveals Intent) -- unused function misleads readers and adds unnecessary elements
- Naming established: ---

## After cycle 8
- Change: extracted `countByType(items: Item[]): Record<string, number>` and `premiumForGroup(type: string, count: number): number` from `quote`
- Rationale: Rule 2 (Reveals Intent) -- `quote` now reads as a clear 3-step pipeline (count, price groups, add fee); each helper has a focused named responsibility
- Naming established: `countByType` (private helper, Item[] -> Record<string, number>), `premiumForGroup` (private helper, (string, number) -> number)

## After cycle 9
- Change: replaced imperative for-loop with mutable accumulator (`let premium = 0; for ... premium += ...`) in `quote` with declarative `Object.entries(counts).reduce()`
- Rationale: Rule 4 (Fewest Elements) -- eliminates 2 assignments, converts mutable `let` to `const`; APP mass 76 to 69
- Naming established: ---

## After cycle 10
- Change: extracted `basePremiumForType(type: string): number` and `cursedSurchargeFor(item: Item): number` from inline expressions
- Rationale: Rule 3 (No Duplication) -- `BASE_PREMIUM[type] ?? 0` appeared in both `premiumForGroup` and cursed surcharge; Rule 2 (Reveals Intent) -- `quote` now reads as a clear pipeline without inline ternary
- Naming established: `basePremiumForType` (private helper, string -> number), `cursedSurchargeFor` (private helper, Item -> number)

## After cycle 11
- Change: extracted `itemSurchargesFor(item: Item): number` combining `cursedSurchargeFor` + `highEnchantmentSurchargeFor`; collapsed two parallel reduces in `quote` into one
- Rationale: Rule 3 (No Duplication) -- two identical reduce-over-items-summing-surcharge patterns merged into single loop; APP mass ~141 to ~133
- Naming established: `itemSurchargesFor` (private helper, Item -> number, aggregates all per-item surcharges)

## After cycle 12
- Change: extracted `loyaltyDiscountFor(basePremium, customer)` helper and named constants `LOYALTY_YEARS_THRESHOLD` (2) and `LOYALTY_DISCOUNT_RATE` (0.2)
- Rationale: Rule 2 (Reveals Intent) -- magic numbers now self-documenting; establishes pattern for upcoming policy-wide modifiers (first-insurance surcharge, follow-up discount)
- Naming established: `loyaltyDiscountFor` (private helper, (number, CustomerContext) -> number), `LOYALTY_YEARS_THRESHOLD`, `LOYALTY_DISCOUNT_RATE`

## After cycle 13
- Change: extracted `FIRST_INSURANCE_SURCHARGE_RATE = 0.1` constant and `firstInsuranceSurchargeFor(basePremium: number): number` helper from inline `basePremium * 0.1`
- Rationale: Rule 2 (Reveals Intent) -- eliminates magic number, establishes consistent pattern with `loyaltyDiscountFor` for all policy-wide modifiers
- Naming established: `FIRST_INSURANCE_SURCHARGE_RATE` (constant, 0.1), `firstInsuranceSurchargeFor` (private helper, number -> number)

## After cycle 14
- Change: consolidated three separate policy-wide modifier variables into single `policyAdjustment` explaining variable in `quote`; return expression simplified from 6-term mixed-sign sum to 4-term addition
- Rationale: Rule 2 (Reveals Intent) -- return line now reads as clear business formula; policy-wide sign logic grouped in one place
- Naming established: `policyAdjustment` (local binding in `quote`, net of loyalty discount + first-insurance surcharge + follow-up discount)

## After cycle 15
- Change: extracted `Damage` interface from inline type literal `{ type: string; amount: number }` in `claim` parameter
- Rationale: Rule 2 (Reveals Intent) -- gives domain concept a name consistent with `Item` and `CustomerContext` patterns
- Naming established: `Damage` interface with `type: string` and `amount: number` fields

## After cycle 16
- Change: extracted `DEDUCTIBLE_PER_DAMAGE = 100` constant from inline magic number in `claim` reduce callback
- Rationale: Rule 2 (Reveals Intent) -- self-documenting business constant, consistent with all other named constants in the file
- Naming established: `DEDUCTIBLE_PER_DAMAGE` (constant, 100)

## After cycle 17
- Change: extracted `HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8` and `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5` from inline magic numbers in `claim`; renamed callback param `d` to `damage`
- Rationale: Rule 2 (Reveals Intent) -- self-documenting business constants consistent with codebase pattern; full parameter name matches type name convention
- Naming established: `HIGH_ENCHANTMENT_CLAIM_THRESHOLD` (constant, 8), `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE` (constant, 0.5)

## After cycle 18
- Change: extracted `reimbursementFor(damage: Damage, policyItem: Item | undefined): number` from inline ternary in `claim` reduce callback
- Rationale: Rule 2 (Reveals Intent) -- names the reimbursement calculation and simplifies `claim` body to read as "sum of (reimbursement minus deductible)"; follows established helper extraction pattern
- Naming established: `reimbursementFor` (private helper, (Damage, Item | undefined) -> number)
