# Architecture Notes

## After cycle 1
- Change: added typed `policy` parameter to `quote(policy: { items, customer, isFollowUp })` to match call-site shape
- Rationale: Rule 2 (Reveals Intent) -- function signature now documents its input contract and enables type checking
- Naming established: `quote` (confirmed as domain-appropriate), parameter `policy`

## After cycle 2
- Change: extracted `PROCESSING_FEE = 5` constant; expressed sword premium as `110 + PROCESSING_FEE`
- Rationale: Rule 2 (Reveals Intent) -- magic number 5 is now self-documenting; Rule 3 (No Duplication) -- fee value defined once
- Naming established: `PROCESSING_FEE`

## After cycle 3
- Change: extracted `FIRST_INSURANCE_RATE = 0.1` constant and `firstInsuranceSurcharge` local variable; return expression now reads `basePremium + firstInsuranceSurcharge + PROCESSING_FEE`
- Rationale: Rule 2 (Reveals Intent) -- magic number 0.1 is now a named business rule; return formula is self-documenting
- Naming established: `FIRST_INSURANCE_RATE`, `firstInsuranceSurcharge`

## After cycle 4
- Change: replaced chained ternary with `BASE_PREMIUM` record lookup and `DEFAULT_BASE_PREMIUM` constant; line now reads `BASE_PREMIUM[policy.items[0].type] ?? DEFAULT_BASE_PREMIUM`
- Rationale: Rule 2 (Reveals Intent) -- declarative mapping is more scannable than growing ternary chain; default value is now named
- Naming established: `BASE_PREMIUM`, `DEFAULT_BASE_PREMIUM`

## After cycle 5
- Change: extracted `Item` and `Policy` interfaces from inline type annotation on `quote` parameter
- Rationale: Rule 2 (Reveals Intent) -- function signature `quote(policy: Policy)` is cleaner than long inline object type; named interfaces document domain model
- Naming established: `Item`, `Policy`

## After cycle 6
- Change: extracted `premium` local variable from inline `Math.ceil(basePremium + firstInsuranceSurcharge + PROCESSING_FEE)` in return statement
- Rationale: Rule 2 (Reveals Intent) -- separates computation from return; cleaner `return { premium }` prepares for growing formula
- Naming established: `premium` (local variable in `quote`)

## After cycle 7
- Change: removed redundant early-return guard for empty items (`if (policy.items.length === 0)` branch)
- Rationale: Rule 3 (No Duplication) + Rule 4 (Fewest Elements) -- general formula already produces correct result for empty items (0 + 0 + fee = fee); early return duplicated return logic
- Naming established: --

## After cycle 8
- Change: extracted `countByType(items: Item[]): Record<string, number>` helper from inline counting loop in `quote`
- Rationale: Rule 2 (Reveals Intent) -- `quote` now reads at a higher abstraction level; counting concern separated from pricing concern
- Naming established: `countByType`

## After cycle 9
- Change: extracted `itemGroupPremium(type: string, count: number): number` from loop body in `quote`
- Rationale: Rule 2 (Reveals Intent) -- block-vs-individual pricing decision now encapsulated in named helper; `quote` loop body reduced to single accumulation statement
- Naming established: `itemGroupPremium`

## After cycle 10
- Change: extracted `basePremiumForType(type: string): number` from duplicated `BASE_PREMIUM[type] ?? DEFAULT_BASE_PREMIUM` in `itemGroupPremium` and curse surcharge loop
- Rationale: Rule 3 (No Duplication) -- type-to-premium lookup existed in two places; Rule 2 (Reveals Intent) -- concept now has a name
- Naming established: `basePremiumForType`

## After cycle 11
- Change: extracted `itemSurcharges(item: Item): number` from inline curse + high-enchantment conditional blocks in `quote`
- Rationale: Rule 2 (Reveals Intent) -- `quote` now reads at a higher abstraction level with three clear phases (base premium, item surcharges, final assembly); Rule 3 -- `basePremiumForType` call consolidated once per item
- Naming established: `itemSurcharges`

## After cycle 12
- Change: extracted `isLoyalCustomer` explaining variable from inline `policy.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD` comparison
- Rationale: Rule 2 (Reveals Intent) -- names the business concept "loyal customer" as a boolean; loyalty discount ternary now reads naturally
- Naming established: `isLoyalCustomer` (local variable in `quote`)

## After cycle 13
- Change: extracted `totalPolicyDiscounts` explaining variable grouping `loyaltyDiscount + followUpDiscount`; premium formula reduced from 6 terms to 5
- Rationale: Rule 2 (Reveals Intent) -- names the aggregate discount concept; premium formula is more scannable with additions grouped before single subtraction
- Naming established: `totalPolicyDiscounts` (local variable in `quote`)

## After cycle 14
- Change: extracted `Incident` interface from inline type annotation on `claim` parameter
- Rationale: Rule 2 (Reveals Intent) -- function signature `claim(policy: Policy, incident: Incident)` is now parallel with `quote(policy: Policy)`; named interface documents domain model consistently with `Item` and `Policy`
- Naming established: `Incident`

## After cycle 15
- Change: renamed local variable `cap` to `totalCap` in `claim` function
- Rationale: Rule 2 (Reveals Intent) -- `remainingCap = totalCap - payout` reads naturally; distinguishes initial cap from remaining cap
- Naming established: `totalCap` (local variable in `claim`)

## After cycle 16
- Change: promoted `HIGH_ENCH_CLAIM_THRESHOLD` and `HIGH_ENCH_REIMBURSEMENT_RATE` from local scope in `claim` to module-level constants; renamed to `HIGH_ENCHANTMENT_CLAIM_THRESHOLD` and `HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE` for consistency with existing naming convention
- Rationale: Rule 2 (Reveals Intent) -- all business constants now live at module level; `HIGH_ENCHANTMENT_` prefix is uniform across quote and claim domains
- Naming established: `HIGH_ENCHANTMENT_CLAIM_THRESHOLD`, `HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE`

## After cycle 17
- Change: renamed `reimbursement` to `grossReimbursement` in `claim` function to clarify it is the pre-deductible amount
- Rationale: Rule 2 (Reveals Intent) -- `payout += grossReimbursement - DEDUCTIBLE` now clearly communicates the deductible subtraction step
- Naming established: `grossReimbursement` (local variable in `claim`)
