# Analysis Report: 2026-10-01_12-17-52_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T14:07:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6543s |
| Started | 2026-10-01T12:17:52+00:00 |
| Ended | 2026-10-01T14:07:02+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 725
- **Test files**: lib.rs
- **Test LOC** (total): 767
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 58; ignored: 0

**Status**: ✅ All tests passing (58 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 58 tests
test tests::adds_processing_fee_after_all_modifiers ... ok
test tests::applies_deductible_once_per_damaged_item ... ok
test tests::applies_item_modifiers_only_to_the_affected_item ... ok
test tests::caps_payout_at_twice_the_insurance_sum ... ok
test tests::does_not_halve_damage_below_enchantment_eight ... ok
test tests::defaults_the_optional_item_properties ... ok
test tests::excludes_block_discount_from_the_insurance_sum ... ok
test tests::excludes_premium_modifiers_from_the_cap ... ok
test tests::exhausts_the_cap_across_successive_claims ... ok
test tests::fully_reimburses_dragon_material_item ... ok
test tests::halves_damage_above_enchantment_eight ... ok
test tests::halves_damage_for_dragon_material_item_at_enchantment_eight ... ok
test tests::insures_a_staff_for_800_and_a_potion_for_400 ... ok
test tests::keeps_intermediate_premium_amounts_fractional ... ok
test tests::pays_nothing_for_a_damage_below_the_deductible ... ok
test tests::pays_out_component_damage_minus_deductible ... ok
test tests::pays_out_damage_minus_deductible_for_plain_item ... ok
test tests::prefers_high_enchantment_clause_over_dragon_material ... ok
test tests::processes_the_schema_example_scenario ... ok
test tests::quotes_curse_and_high_enchantment_surcharges_together ... ok
test tests::quotes_cursed_sword_with_curse_surcharge ... ok
test tests::quotes_empty_item_list_as_processing_fee_only ... ok
test tests::quotes_first_insurance_surcharge_on_policy_base ... ok
test tests::quotes_follow_up_contract_discount_on_every_later_contract ... ok
test tests::quotes_follow_up_contract_discount_on_second_quote ... ok
test tests::quotes_high_enchantment_surcharge_at_level_five ... ok
test tests::quotes_four_runes_without_block_discount ... ok
test tests::quotes_long_standing_customers_second_contract_as_160 ... ok
test tests::quotes_loyalty_discount_at_exactly_two_years ... ok
test tests::quotes_mixed_component_types_without_block_discount ... ok
test tests::quotes_newcomer_with_cursed_sword_as_165 ... ok
test tests::quotes_no_high_enchantment_surcharge_below_level_five ... ok
test tests::quotes_no_loyalty_discount_below_two_years ... ok
test tests::quotes_plain_amulet_base_premium_of_60 ... ok
test tests::quotes_plain_potion_base_premium_of_40 ... ok
test tests::quotes_plain_staff_base_premium_of_80 ... ok
test tests::quotes_plain_sword_base_premium_of_100 ... ok
test tests::quotes_seven_runes_without_block_discount ... ok
test tests::quotes_single_moonstone_base_premium_of_25 ... ok
test tests::quotes_single_rune_base_premium_of_25 ... ok
test tests::quotes_three_runes_as_one_block ... ok
test tests::quotes_two_component_blocks_of_different_types ... ok
test tests::quotes_two_runes_without_block_discount ... ok
test tests::rejects_a_claim_referring_to_a_later_quote_step ... ok
test tests::rejects_a_claim_whose_policy_index_names_no_earlier_quote ... ok
test tests::rejects_claim_for_an_item_outside_the_policy ... ok
test tests::rejects_claim_with_negative_damage_amount ... ok
test tests::rejects_claim_with_unknown_damaged_item_type ... ok
test tests::rejects_more_damage_entries_than_insured_items_of_that_type ... ok
test tests::rejects_quote_with_unknown_item_type ... ok
test tests::resolves_the_policy_by_zero_based_step_index ... ok
test tests::returns_one_result_per_step_in_order ... ok
test tests::rounds_payout_down_to_whole_g ... ok
test tests::rounds_premium_up_to_whole_g ... ok
test tests::sums_insurance_values_of_all_items_for_the_cap ... ok
test tests::serializes_results_as_json_with_a_results_array ... ok
test tests::sums_insurance_values_of_repeated_item_types ... ok
test tests::treats_each_damage_entry_of_the_same_type_separately ... ok

test result: ok. 58 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Lines (production only) | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 231 | ×2 | 462 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 34 | ×5 | 170 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **1059** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 494 |
| Functions | 53 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.04 |
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
| Total Tokens | 114823800 |
| Context Utilization | 173% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 58 |
| Avg Cycle Time | 77.31s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 77.31s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 113 |
| Predictions Total | 113 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 56 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


