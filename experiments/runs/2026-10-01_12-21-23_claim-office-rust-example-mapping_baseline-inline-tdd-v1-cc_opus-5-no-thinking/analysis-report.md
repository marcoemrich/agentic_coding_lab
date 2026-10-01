# Analysis Report: 2026-10-01_12-21-23_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T12:37:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 936s |
| Started | 2026-10-01T12:21:23+00:00 |
| Ended | 2026-10-01T12:37:05+00:00 |

## Code Metrics

- **Implementation files**: claim.rs, item.rs, lib.rs, main.rs, money.rs, premium.rs, scenario.rs
- **Implementation LOC** (total): 594
- **Test files**: claim.rs, item.rs, money.rs, premium.rs, scenario.rs, cli.rs
- **Test LOC** (total): 496
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 42; ignored: 0

**Status**: ✅ All tests passing (42 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 38 tests
test claim::tests::cap_is_twice_the_insurance_sum ... ok
test claim::tests::component_without_enchantment_or_material_has_no_special_clause ... ok
test claim::tests::damage_to_an_uninsured_item_is_rejected ... ok
test claim::tests::deductible_applies_once_per_damaged_item ... ok
test claim::tests::dragon_material_alone_is_reimbursed_in_full ... ok
test claim::tests::fifty_percent_rule_wins_over_dragon_material ... ok
test claim::tests::high_enchantment_clause_starts_at_exactly_eight ... ok
test claim::tests::high_enchantment_halves_the_damage_before_the_deductible ... ok
test claim::tests::more_damages_of_a_type_than_insured_items_is_rejected ... ok
test claim::tests::negative_damage_amount_is_rejected ... ok
test claim::tests::premium_modifiers_do_not_raise_the_cap ... ok
test claim::tests::standard_damage_is_reimbursed_in_full_minus_deductible ... ok
test claim::tests::successive_claims_exhaust_the_cap ... ok
test claim::tests::two_items_of_the_same_type_are_separate_damages ... ok
test item::tests::price_list_gives_value_and_premium_per_kind ... ok
test item::tests::runes_and_moonstones_are_different_component_types ... ok
test item::tests::unknown_type_is_not_covered ... ok
test money::tests::fractions_survive_intermediate_steps ... ok
test money::tests::payout_rounds_down ... ok
test money::tests::premium_rounds_up ... ok
test money::tests::whole_amounts_are_unchanged_by_rounding ... ok
test premium::tests::alike_means_same_component_type ... ok
test premium::tests::block_of_three_alike_components_is_cheaper ... ok
test premium::tests::block_requires_exactly_three_components ... ok
test premium::tests::curse_and_high_enchantment_stack_on_the_same_item ... ok
test premium::tests::empty_item_list_pays_only_the_processing_fee ... ok
test premium::tests::high_enchantment_applies_from_exactly_five ... ok
test premium::tests::insurance_sum_ignores_the_block_discount ... ok
test premium::tests::item_surcharge_applies_only_to_the_cursed_items_base_premium ... ok
test premium::tests::long_standing_customers_second_contract_pays_160 ... ok
test premium::tests::loyalty_applies_from_exactly_two_years ... ok
test premium::tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test premium::tests::two_groups_of_three_form_two_separate_blocks ... ok
test scenario::tests::a_claim_against_an_uninsured_item_fails_the_scenario ... ok
test scenario::tests::an_unknown_item_type_in_a_quote_fails_the_scenario ... ok
test scenario::tests::items_may_omit_material_and_enchantment ... ok
test scenario::tests::quote_then_claim_follows_the_schema_example ... ok
test scenario::tests::the_second_quote_in_a_scenario_is_a_follow_up_contract ... ok

test result: ok. 38 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 4 tests
test a_negative_damage_amount_exits_non_zero ... ok
test an_unknown_item_type_exits_non_zero_without_results_on_stdout ... ok
test malformed_json_exits_non_zero ... ok
test writes_the_results_of_the_schema_example_to_stdout ... ok

test result: ok. 4 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests kata

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Lines (production only) | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 93 | ×1 | 93 |
| Invocations | 217 | ×2 | 434 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 22 | ×5 | 110 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **1105** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 430 |
| Functions | 36 |
| Longest Function | 26 lines |
| Avg LOC/Function | 7.78 |
| Median LOC/Function | 6.00 |
| Imports | 13 |

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
| Total Tokens | 2796887 |
| Context Utilization | 37% |

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


