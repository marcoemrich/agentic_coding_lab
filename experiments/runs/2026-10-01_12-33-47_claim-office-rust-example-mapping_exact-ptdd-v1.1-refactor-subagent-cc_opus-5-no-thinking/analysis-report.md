# Analysis Report: 2026-10-01_12-33-47_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T14:22:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6510s |
| Started | 2026-10-01T12:33:47+00:00 |
| Ended | 2026-10-01T14:22:23+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs, wire.rs
- **Implementation LOC** (total): 917
- **Test files**: lib.rs
- **Test LOC** (total): 481
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 50; ignored: 0

**Status**: ✅ All tests passing (50 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 50 tests
test tests::adds_high_enchantment_surcharge_at_exactly_enchantment_five ... ok
test tests::adds_fifty_percent_curse_surcharge_to_the_cursed_item ... ok
test tests::applies_item_modifiers_only_to_the_affected_item_base_premium ... ok
test tests::applies_the_deductible_once_per_damaged_item ... ok
test tests::applies_the_high_enchantment_clause_at_exactly_enchantment_eight ... ok
test tests::caps_payout_at_twice_the_summed_insurance_values ... ok
test tests::derives_the_cap_from_unmodified_insurance_values ... ok
test tests::does_not_form_a_block_from_components_of_different_types ... ok
test tests::excludes_the_block_discount_from_the_insurance_sum ... ok
test tests::forms_a_separate_block_per_component_type ... ok
test tests::grants_follow_up_contract_discount_from_the_second_contract_on ... ok
test tests::grants_follow_up_contract_discount_on_each_contract_after_the_first ... ok
test tests::grants_loyalty_discount_at_exactly_two_years ... ok
test tests::halves_damage_for_highly_enchanted_items_before_the_deductible ... ok
test tests::lets_the_high_enchantment_clause_win_at_exactly_enchantment_eight ... ok
test tests::lets_the_high_enchantment_clause_win_over_dragon_material ... ok
test tests::limits_a_later_payout_to_the_remaining_cap ... ok
test tests::measures_initial_assessment_surcharge_against_the_policy_base_premium ... ok
test tests::omits_high_enchantment_surcharge_below_enchantment_five ... ok
test tests::quotes_empty_item_list_as_processing_fee_only ... ok
test tests::quotes_four_runes_without_block_discount ... ok
test tests::quotes_long_standing_customers_second_contract_at_160 ... ok
test tests::quotes_newcomer_with_a_cursed_sword_at_165 ... ok
test tests::quotes_seven_runes_without_block_discount ... ok
test tests::quotes_single_amulet_at_its_base_premium ... ok
test tests::quotes_single_moonstone_at_component_base_premium ... ok
test tests::quotes_single_potion_at_its_base_premium ... ok
test tests::quotes_single_rune_at_component_base_premium ... ok
test tests::quotes_single_staff_at_its_base_premium ... ok
test tests::quotes_single_sword_at_its_base_premium ... ok
test tests::quotes_three_runes_as_one_block ... ok
test tests::quotes_two_runes_without_block_discount ... ok
test tests::refuses_to_name_the_damaged_item_of_a_claim_by_an_unknown_type ... ok
test tests::reimburses_component_damage_in_full_minus_the_deductible ... ok
test tests::reimburses_damage_in_full_minus_the_deductible ... ok
test tests::reimburses_dragon_material_damage_fully_before_the_deductible ... ok
test tests::rejects_a_claim_for_an_item_not_covered_by_the_policy ... ok
test tests::rejects_a_claim_with_a_negative_damage_amount ... ok
test tests::rejects_a_claim_with_more_damages_of_a_type_than_the_policy_covers ... ok
test tests::rejects_a_quote_containing_an_unknown_item_type ... ok
test tests::reports_the_remaining_cap_after_a_claim ... ok
test tests::resolves_a_claim_against_the_policy_of_the_referenced_quote_step ... ok
test tests::returns_one_result_per_step_in_order ... ok
test tests::rounds_a_fractional_payout_down ... ok
test tests::rounds_a_fractional_premium_up ... ok
test tests::stacks_curse_and_high_enchantment_surcharges_on_one_item ... ok
test tests::serializes_scenario_results_in_the_documented_json_shape ... ok
test tests::sums_insurance_values_of_two_items_of_the_same_type ... ok
test tests::treats_each_damage_entry_of_the_same_type_separately ... ok
test tests::withholds_loyalty_discount_below_two_years ... ok

test result: ok. 50 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Lines (production only) | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 79 | ×1 | 79 |
| Invocations | 276 | ×2 | 552 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 38 | ×5 | 190 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **1245** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 610 |
| Functions | 65 |
| Longest Function | 23 lines |
| Avg LOC/Function | 5.97 |
| Median LOC/Function | 6.00 |
| Imports | 6 |

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
| Total Tokens | 99178953 |
| Context Utilization | 145% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 90.01s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 90.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 99 |
| Predictions Total | 100 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


