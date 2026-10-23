# Analysis Report: 2026-10-19_02-32-59_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-19T06:32:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6910s |
| Started | 2026-10-19T02:32:59+00:00 |
| Ended | 2026-10-19T04:28:13+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 783
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 762
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 58; ignored: 0

**Status**: ✅ All tests passing (58 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 55 tests
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::component_block_discount_does_not_reduce_the_insurance_sum ... ok
test tests::component_damage_is_reimbursed_minus_the_deductible ... ok
test tests::claiming_more_damages_of_a_type_than_insured_is_rejected ... ok
test tests::a_negative_damage_amount_is_rejected ... ok
test tests::claiming_for_an_unknown_item_type_is_rejected ... ok
test tests::cursed_item_adds_a_fifty_percent_risk_surcharge ... ok
test tests::claiming_for_an_item_outside_the_policy_is_rejected ... ok
test tests::a_later_claim_is_reduced_to_the_remaining_cap ... ok
test tests::dragon_material_damage_is_fully_reimbursed ... ok
test tests::damage_below_the_deductible_pays_nothing ... ok
test tests::cursed_and_highly_enchanted_item_adds_both_surcharges ... ok
test tests::a_scenarios_later_quote_carries_the_follow_up_discount ... ok
test tests::a_scenario_produces_one_result_per_step_in_order ... ok
test tests::a_claim_step_refers_to_its_policy_by_step_index ... ok
test tests::enchantment_of_exactly_five_adds_a_thirty_percent_surcharge ... ok
test tests::a_claim_reports_the_remaining_cap ... ok
test tests::enchantment_of_four_adds_no_high_enchantment_surcharge ... ok
test tests::enchantment_of_seven_does_not_trigger_the_fifty_percent_clause ... ok
test tests::first_insurance_surcharge_applies_to_each_quoted_item ... ok
test tests::follow_up_contract_discount_applies_from_the_second_quote_on ... ok
test tests::high_enchantment_wins_over_dragon_material_at_exactly_eight ... ok
test tests::four_runes_have_no_block_and_base_premium_of_100 ... ok
test tests::high_enchantment_damage_is_reimbursed_at_fifty_percent ... ok
test tests::insurance_sum_is_the_sum_of_item_values_and_the_cap_is_twice_that ... ok
test tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::payout_rounds_down_in_the_offices_favor ... ok
test tests::mixed_component_types_do_not_form_a_block ... ok
test tests::item_modifiers_apply_only_to_the_affected_items_base_premium ... ok
test tests::plain_amulet_has_base_premium_of_60 ... ok
test tests::high_enchantment_wins_over_dragon_material ... ok
test tests::long_standing_customers_second_contract_costs_160 ... ok
test tests::plain_potion_has_base_premium_of_40 ... ok
test tests::plain_staff_has_base_premium_of_80 ... ok
test tests::loyalty_discount_does_not_apply_below_two_years ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::loyalty_discount_applies_at_exactly_two_years ... ok
test tests::premium_rounds_up_in_the_offices_favor ... ok
test tests::plain_sword_has_base_premium_of_100 ... ok
test tests::processing_fee_is_added_at_the_very_end ... ok
test tests::quoting_an_unknown_item_type_is_rejected ... ok
test tests::seven_runes_have_base_premium_of_175 ... ok
test tests::repeated_damages_of_the_same_type_each_carry_a_deductible ... ok
test tests::potion_has_insurance_value_of_400 ... ok
test tests::single_moonstone_has_base_premium_of_25 ... ok
test tests::single_rune_has_base_premium_of_25 ... ok
test tests::staff_has_insurance_value_of_800 ... ok
test tests::standard_damage_is_fully_reimbursed_minus_the_deductible ... ok
test tests::the_deductible_applies_once_per_damaged_item ... ok
test tests::successive_claim_steps_exhaust_the_policy_cap ... ok
test tests::three_runes_form_a_block_with_base_premium_of_60 ... ok
test tests::two_items_of_the_same_type_both_count_toward_the_insurance_sum ... ok
test tests::the_schema_example_scenario_serializes_to_the_documented_shape ... ok
test tests::two_runes_have_base_premium_of_50 ... ok
test tests::two_separate_blocks_of_alike_components_cost_120 ... ok

test result: ok. 55 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 3 tests
test a_refused_scenario_exits_non_zero_with_a_description_on_stderr ... ok
test the_binary_writes_the_results_document_to_stdout ... ok
test the_binary_writes_no_other_stdout_output ... ok

test result: ok. 3 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests kata

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Lines (production only) | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 118 | ×1 | 118 |
| Invocations | 193 | ×2 | 386 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 33 | ×5 | 165 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **1137** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 428 |
| Functions | 38 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.82 |
| Median LOC/Function | 7.50 |
| Imports | 2 |

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
| Total Tokens | 129124386 |
| Context Utilization | 176% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 60 |
| Avg Cycle Time | 83.48s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 83.48s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 144 |
| Predictions Total | 147 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 58 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


