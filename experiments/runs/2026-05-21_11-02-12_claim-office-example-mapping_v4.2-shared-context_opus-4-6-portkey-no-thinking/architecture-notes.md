# Architecture Notes

## After cycle 1
- Change: extracted inline `{ type: string }` to exported `type Item` for function signature clarity
- Rationale: Rule 2 (Reveals Intent) -- `items: Item[]` reads better than `items: { type: string }[]`
- Naming established: `Item` (type alias for item objects), `calculateBasePremium` (function)

## After cycle 2
- Change: replaced if/else conditional with `BASE_PREMIUM` lookup table (`Record<string, number>`)
- Rationale: Rule 2 (Reveals Intent) -- declarative map makes type-to-premium mapping explicit and treats all item types symmetrically
- Naming established: `BASE_PREMIUM` (module-level constant mapping item type to base premium value)

## After cycle 3
- Change: added `Readonly` wrapper to `BASE_PREMIUM` type annotation
- Rationale: Rule 2 (Reveals Intent) -- communicates immutability of configuration constant and enables compile-time mutation prevention
- Naming established: --

## After cycle 4
- No refactoring (justified): attempted destructuring `items[0]` into named binding but reverted -- mass increased from 8 to 15 with only marginal clarity gain; code already at local optimum after 3 prior refinement cycles

## After cycle 5
- Change: replaced `Readonly<Record<string, number>>` with `as const` assertion and derived `ItemType = keyof typeof BASE_PREMIUM` union type
- Rationale: Rule 2 (Reveals Intent) -- `Item.type` is now a precise union instead of `string`, enabling compile-time validation of item types
- Naming established: `ItemType` (union type: `"sword" | "amulet" | "staff" | "potion" | "rune"`)

## After cycle 6
- Change: replaced imperative `for` loop + mutable `sum` with `items.reduce(...)` single expression
- Rationale: Rule 2 (Reveals Intent) + Rule 4 (Fewest Elements) -- reduce expresses "fold to sum" directly and eliminates 2 assignments (mass 28 -> 18)
- Naming established: --

## After cycle 7
- Change: extracted `isComponentBlock(items)` helper, introduced `BLOCK_SIZE`, `BLOCK_PREMIUM`, and `COMPONENT_TYPES` named constants
- Rationale: Rule 2 (Reveals Intent) -- inline condition `items.length === 3 && items.every(...) && BASE_PREMIUM[...] === 25` was opaque; extracted function makes block-detection logic self-documenting; mass +5 justified by clarity gain
- Naming established: `isComponentBlock` (predicate), `BLOCK_SIZE` (3), `BLOCK_PREMIUM` (60), `COMPONENT_TYPES` (ReadonlySet of component item types eligible for block discount)

## After cycle 8
- Change: restructured `isComponentBlock` with early-return guard clause and extracted `blockType` named binding from repeated `items[0].type`
- Rationale: Rule 2 (Reveals Intent) -- guard clause separates precondition from core logic; `blockType` names the concept more clearly than indexed access; mass +1 justified by clarity
- Naming established: `blockType` (local binding in `isComponentBlock` for the type that defines the block)

## After cycle 9
- Change: removed dead `isComponentBlock` function (no longer called after green phase replaced it with inline group-by-type block detection in `calculateBasePremium`)
- Rationale: Rule 4 (Fewest Elements) -- dead code adds cognitive load and 11 mass units for zero value
- Naming established: --

## After cycle 10
- Change: merged cursed surcharge loop into item iteration loop; introduced `cursedSurcharge` named accumulator separate from `total`
- Rationale: Rule 2 (Reveals Intent) + Rule 4 (Fewest Elements) -- named separation of base premiums (`total`) vs item-specific modifiers (`cursedSurcharge`) clarifies composition; reduced loops from 3 to 2
- Naming established: `cursedSurcharge` (accumulator for item-level cursed modifier, kept separate from base premium total)

## After cycle 11
- Change: extracted `itemSurcharge(item: Item): number` helper; collapsed `cursedSurcharge`/`enchantmentSurcharge` into single `totalSurcharge` accumulator in main function
- Rationale: Rule 2 (Reveals Intent) -- separates per-item surcharge logic from grouping/block-discount logic; names the concept; simplifies main loop body from 3 accumulators + 2 conditionals to 1 accumulator + 1 call
- Naming established: `itemSurcharge` (function computing all item-level surcharges for one item), `totalSurcharge` (accumulator in main function)

## After cycle 12
- Change: renamed `calculateBasePremium` to `calculatePremium`; extracted `LOYALTY_YEARS_THRESHOLD = 2` and `LOYALTY_DISCOUNT_RATE = 0.2` as named constants
- Rationale: Rule 2 (Reveals Intent) -- function now computes full premium with policy-wide modifiers, not just base; magic numbers replaced with self-documenting constants
- Naming established: `calculatePremium` (renamed from `calculateBasePremium`), `LOYALTY_YEARS_THRESHOLD` (2), `LOYALTY_DISCOUNT_RATE` (0.2)

## After cycle 13
- Change: extracted inline magic numbers in `itemSurcharge` to named constants `CURSED_SURCHARGE_RATE` (0.5), `HIGH_ENCHANTMENT_THRESHOLD` (5), `HIGH_ENCHANTMENT_SURCHARGE_RATE` (0.3)
- Rationale: Rule 2 (Reveals Intent) -- consistent with existing pattern of named rate/threshold constants; mass +24 justified by clarity
- Naming established: `CURSED_SURCHARGE_RATE` (0.5), `HIGH_ENCHANTMENT_THRESHOLD` (5), `HIGH_ENCHANTMENT_SURCHARGE_RATE` (0.3)

## After cycle 14
- Change: replaced mutable accumulator (`let surcharge = 0; surcharge += ...`) in `itemSurcharge` with immutable named bindings (`const cursed`, `const enchantment`) and direct return
- Rationale: Rule 2 (Reveals Intent) + Rule 4 (Fewest Elements) -- named bindings make surcharge composition explicit; eliminating 3 assignments reduced mass from 43 to 29
- Naming established: `cursed` (local const in `itemSurcharge` for curse surcharge amount), `enchantment` (local const for high-enchantment surcharge amount)

## After cycle 15
- Change: extracted inline `{ yearsWithMHPCO: number }` and `{ isFollowUp?: boolean }` to exported `Customer` and `QuoteOptions` type aliases
- Rationale: Rule 2 (Reveals Intent) -- named types make `calculatePremium` signature self-documenting; consistent with `Item` type extraction from cycle 1
- Naming established: `Customer` (type for customer parameter), `QuoteOptions` (type for quote options parameter)

## After cycle 16
- Change: renamed `total` to `basePremiumTotal` in `calculatePremium` to distinguish from `totalSurcharge` and `policyPremium`
- Rationale: Rule 2 (Reveals Intent) -- generic `total` was ambiguous among three accumulators; `basePremiumTotal` clarifies it holds base premiums from group/block computation
- Naming established: `basePremiumTotal` (accumulator for base premiums from item groups, replacing former `total`)

## After cycle 17
- Change: extracted inline `0.5` and `100` in `calculatePayout` to `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE` and `DEDUCTIBLE` constants; renamed `total` to `totalPayout`
- Rationale: Rule 2 (Reveals Intent) -- consistent with codebase convention of named constants for domain rates/thresholds; disambiguates accumulator name per cycle 16 pattern
- Naming established: `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE` (0.5), `DEDUCTIBLE` (100), `totalPayout` (accumulator in `calculatePayout`)

## After cycle 18
- Change: replaced mutable `let totalPayout` + `for...of` loop with `const totalPayout = damages.reduce(...)` in `calculatePayout`
- Rationale: Rule 2 (Reveals Intent) + Rule 4 (Fewest Elements) -- consistent with cycle 6 reduce pattern; eliminates 2 assignments (mass 28 -> 17)
- Naming established: --
