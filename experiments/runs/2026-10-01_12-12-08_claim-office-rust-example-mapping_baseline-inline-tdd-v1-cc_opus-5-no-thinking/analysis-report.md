# Analysis Report: 2026-10-01_12-12-08_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T12:17:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 310s |
| Started | 2026-10-01T12:12:08+00:00 |
| Ended | 2026-10-01T12:17:29+00:00 |

## Code Metrics

- **Implementation files**: claim.rs, lib.rs, main.rs, money.rs, quote.rs, scenario.rs
- **Implementation LOC** (total): 362
- **Test files**: claim.rs, quote.rs, scenario.rs
- **Test LOC** (total): 332
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 28; ignored: 0

**Status**: ✅ All tests passing (28 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 28 tests
test claim::tests::a_component_has_no_special_clause ... ok
test claim::tests::a_damage_below_the_deductible_pays_nothing_and_offsets_nothing ... ok
test claim::tests::a_damage_to_an_uninsured_item_is_rejected ... ok
test claim::tests::a_fractional_payout_is_rounded_down ... ok
test claim::tests::a_negative_damage_amount_is_rejected ... ok
test claim::tests::a_plain_item_is_reimbursed_in_full_minus_the_deductible ... ok
test claim::tests::high_enchantment_halves_the_damage_before_the_deductible ... ok
test claim::tests::more_damages_of_a_type_than_insured_items_are_rejected ... ok
test claim::tests::successive_claims_eat_into_the_cap ... ok
test claim::tests::the_deductible_applies_once_per_damaged_item ... ok
test claim::tests::the_halving_clause_wins_over_dragon_material ... ok
test claim::tests::two_of_the_same_item_can_each_be_damaged_separately ... ok
test quote::tests::a_block_of_three_alike_components_is_cheaper ... ok
test claim::tests::dragon_material_is_reimbursed_in_full ... ok
test quote::tests::blocks_require_components_of_the_same_type ... ok
test quote::tests::empty_item_list_costs_only_the_processing_fee ... ok
test quote::tests::high_enchantment_applies_from_exactly_five ... ok
test quote::tests::an_unknown_item_type_is_rejected ... ok
test quote::tests::item_modifiers_apply_only_to_the_affected_items_base ... ok
test quote::tests::long_standing_customers_second_contract ... ok
test quote::tests::loyalty_applies_from_exactly_two_years ... ok
test quote::tests::newcomer_with_a_cursed_sword ... ok
test quote::tests::plain_item_base_premiums_follow_the_price_list ... ok
test quote::tests::the_cap_is_twice_the_sum_of_the_items_insurance_values ... ok
test scenario::tests::a_claim_against_an_uninsured_item_fails_the_whole_scenario ... ok
test scenario::tests::an_unknown_item_type_fails_the_whole_scenario ... ok
test scenario::tests::runs_a_quote_followed_by_a_claim_against_its_policy ... ok
test scenario::tests::every_quote_after_the_first_gets_the_follow_up_discount ... ok

test result: ok. 28 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests kata

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Lines (production only) | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 137 | ×2 | 274 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 14 | ×5 | 70 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **776** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 291 |
| Functions | 19 |
| Longest Function | 33 lines |
| Avg LOC/Function | 10.21 |
| Median LOC/Function | 9.00 |
| Imports | 11 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | n/a (clippy has no rule) |
| Code Quality | 0 |
| **Total** | **0** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4942895 |
| Context Utilization | 39% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


