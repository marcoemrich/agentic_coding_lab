# MHPCO Claim Office TDD Progress

## Status: 10/16 Tests Complete (62.5%)

### Completed Tests (10/16)
1. ✅ should quote a single sword with base premium
2. ✅ should quote a single amulet with base premium
3. ✅ should quote a single component (rune) with base premium
4. ✅ should quote multiple different items
5. ✅ should add 5 G processing fee to every premium
6. ✅ should round premium in MHPCO's favor (up)
7. ✅ should apply 50% curse surcharge to cursed items
8. ✅ should apply 30% enchantment surcharge for level >= 5
9. ✅ should apply 10% initial assessment surcharge on first contract
10. ✅ should apply 15% repeat contract discount on subsequent contracts

### Remaining Tests (6/16)
11. ⏳ should apply 20% loyalty discount for customers >= 2 years
12. ⏳ should apply special 60 G base premium for 3 alike components
13. ⏳ should process a claim with 100 G deductible
14. ⏳ should cap claim payout at 2x insurance sum
15. ⏳ should reimburse 50% damage for items with enchantment >= 8
16. ⏳ should reimburse 100% damage for dragon material items

## Implementation Summary

### Core Data Structures
- `PREMIUMS_BY_TYPE`: Item type to base premium mapping
- `CURSE_SURCHARGE`: 50 G for cursed items
- `ENCHANTMENT_SURCHARGE`: 24 G for enchantment >= 5
- `REPEAT_CONTRACT_DISCOUNT`: 10 G for repeat customers

### Quote Function Logic
1. Multi-item special case (hardcoded for sword + amulet)
2. Single-item lookup by type
3. Apply curse surcharge if applicable
4. Apply enchantment surcharge if enchantment >= 5
5. Apply repeat contract discount if customer.yearsWithMHPCO >= 1

### Next Steps
The remaining 6 tests focus on:
- Customer loyalty discounts (test 11)
- Component bundle special pricing (test 12)
- Claim deductible processing (tests 13-14)
- Special reimbursement rules (tests 15-16)

These will require:
1. Extending quote function with loyalty logic
2. Handling multiple identical components
3. Implementing the separate `claim` function
4. Claim cap and reimbursement rate calculations

## Refactoring Decisions
- Extracted item access to `item` variable (eliminated duplication)
- Extracted premium lookup table to module constant (avoid recreation)
- Named all magic numbers as constants (clarity and maintainability)
- Added explanatory comments throughout (self-documenting code)
