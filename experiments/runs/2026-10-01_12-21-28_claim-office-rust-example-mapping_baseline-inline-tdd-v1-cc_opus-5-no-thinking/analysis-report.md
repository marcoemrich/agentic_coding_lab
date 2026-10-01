# Analysis Report: 2026-10-01_12-21-28_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T12:29:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 476s |
| Started | 2026-10-01T12:21:28+00:00 |
| Ended | 2026-10-01T12:29:30+00:00 |

## Code Metrics

- **Implementation files**: amount.rs, catalog.rs, claim.rs, components.rs, lib.rs, main.rs, policy.rs, premium.rs, scenario.rs
- **Implementation LOC** (total): 740
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 769
- **Active tests**: 82
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 82; ignored: 0

**Status**: ✅ All tests passing (82 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.01s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 76 tests
test amount_tests::a_payout_of_350_point_5_rounds_down_to_350 ... ok
test amount_tests::a_premium_of_197_point_5_rounds_up_to_198 ... ok
test amount_tests::percent_of_an_amount_stays_exact_across_additions ... ok
test amount_tests::subtracting_a_discount_is_exact ... ok
test amount_tests::thirds_are_kept_as_fractions_rather_than_truncated ... ok
test amount_tests::whole_amounts_round_to_themselves ... ok
test catalog_tests::amulet_has_base_premium_60 ... ok
test catalog_tests::components_are_insured_at_250 ... ok
test catalog_tests::components_have_base_premium_25 ... ok
test catalog_tests::main_items_have_their_price_list_insurance_value ... ok
test catalog_tests::only_runes_and_moonstones_are_components ... ok
test catalog_tests::potion_has_base_premium_40 ... ok
test catalog_tests::staff_has_base_premium_80 ... ok
test catalog_tests::sword_has_base_premium_100 ... ok
test catalog_tests::unknown_type_has_no_base_premium ... ok
test catalog_tests::unknown_type_has_no_insurance_value ... ok
test claim_tests::a_damage_to_an_item_the_policy_does_not_cover_is_rejected ... ok
test claim_tests::a_negative_damage_amount_is_rejected ... ok
test claim_tests::a_payout_of_350_point_5_is_rounded_down ... ok
test claim_tests::a_plain_item_is_reimbursed_in_full_minus_the_deductible ... ok
test claim_tests::a_rejected_claim_leaves_the_cap_untouched ... ok
test claim_tests::a_rune_without_enchantment_or_material_has_no_special_clause ... ok
test claim_tests::an_unknown_damaged_item_type_is_rejected ... ok
test claim_tests::damage_below_the_deductible_pays_nothing ... ok
test claim_tests::dragon_material_is_fully_reimbursed_minus_the_deductible ... ok
test claim_tests::enchantment_exactly_eight_triggers_the_half_rule ... ok
test claim_tests::enchantment_nine_halves_the_damage_before_the_deductible ... ok
test claim_tests::more_damages_of_a_type_than_the_policy_covers_is_rejected ... ok
test claim_tests::premium_modifiers_do_not_raise_the_cap ... ok
test claim_tests::the_cap_is_twice_the_insurance_sum_and_shrinks_with_each_claim ... ok
test claim_tests::the_deductible_applies_once_per_damaged_item ... ok
test claim_tests::the_half_rule_wins_over_dragon_material ... ok
test claim_tests::two_swords_each_get_their_own_deductible ... ok
test component_block_tests::exactly_three_alike_components_form_a_block ... ok
test component_block_tests::four_alike_components_do_not_form_a_block ... ok
test component_block_tests::no_components_cost_nothing ... ok
test component_block_tests::seven_alike_components_do_not_form_a_block ... ok
test component_block_tests::two_alike_components_cost_the_plain_rate ... ok
test policy_base_premium_tests::a_single_sword_has_the_price_list_base_premium ... ok
test policy_base_premium_tests::an_empty_item_list_has_no_base_premium ... ok
test policy_base_premium_tests::an_unknown_item_type_is_rejected ... ok
test policy_base_premium_tests::base_premiums_of_several_main_items_add_up ... ok
test policy_base_premium_tests::components_of_different_types_do_not_form_a_block ... ok
test policy_base_premium_tests::each_component_type_forms_its_own_block ... ok
test policy_base_premium_tests::insurance_sum_adds_the_items_insurance_values ... ok
test policy_base_premium_tests::the_block_discount_does_not_shrink_the_insurance_sum ... ok
test policy_base_premium_tests::three_alike_components_are_charged_as_a_block ... ok
test policy_base_premium_tests::two_swords_double_the_insurance_sum ... ok
test premium_tests::a_component_has_no_enchantment_or_curse_surcharge ... ok
test premium_tests::a_cursed_highly_enchanted_item_carries_both_surcharges ... ok
test premium_tests::a_cursed_item_adds_half_its_base_premium ... ok
test premium_tests::a_follow_up_contract_earns_the_fifteen_percent_discount ... ok
test premium_tests::a_plain_item_carries_only_the_first_insurance_surcharge_and_fee ... ok
test premium_tests::an_empty_item_list_costs_only_the_processing_fee ... ok
test premium_tests::enchantment_five_adds_the_high_enchantment_surcharge ... ok
test premium_tests::enchantment_four_adds_no_surcharge ... ok
test premium_tests::exactly_two_years_earn_the_loyalty_discount ... ok
test premium_tests::one_year_earns_no_loyalty_discount ... ok
test premium_tests::the_item_surcharge_applies_to_the_item_not_the_policy_total ... ok
test prompt_example_tests::a_dragon_attack_deducts_once_per_damaged_item ... ok
test prompt_example_tests::premium_modifiers_do_not_raise_the_cap ... ok
test prompt_example_tests::seven_runes_round_a_premium_of_197_point_5_up_to_198 ... ok
test prompt_example_tests::the_block_discount_does_not_shrink_the_cap ... ok
test prompt_example_tests::three_runes_and_three_moonstones_form_two_blocks ... ok
test prompt_example_tests::two_runes_and_a_moonstone_form_no_block ... ok
test scenario_tests::a_claim_against_an_uninsured_item_fails_the_scenario ... ok
test scenario_tests::a_claim_referring_to_a_missing_policy_fails_the_scenario ... ok
test scenario_tests::a_claim_step_reports_payout_and_remaining_cap ... ok
test scenario_tests::a_negative_damage_amount_fails_the_scenario ... ok
test scenario_tests::a_quote_step_reports_its_premium ... ok
test scenario_tests::a_second_quote_earns_the_follow_up_discount ... ok
test scenario_tests::an_absent_cursed_flag_defaults_to_not_cursed ... ok
test scenario_tests::an_empty_quote_reports_only_the_fee ... ok
test scenario_tests::an_unknown_item_type_fails_the_scenario ... ok
test scenario_tests::malformed_json_fails_the_scenario ... ok
test scenario_tests::successive_claims_draw_down_the_same_policy_cap ... ok

test result: ok. 76 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 6 tests
test it_rejects_a_claim_on_an_uninsured_item ... ok
test it_rejects_a_negative_damage_amount ... ok
test it_rejects_an_unknown_item_type_without_writing_results ... ok
test it_rejects_more_damages_of_a_type_than_are_insured ... ok
test it_writes_the_results_document_to_stdout ... ok
test it_settles_a_dragon_attack_on_two_insured_swords ... ok

test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Constants | 73 | ×1 | 73 |
| Invocations | 266 | ×2 | 532 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 35 | ×5 | 175 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **1224** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 533 |
| Functions | 49 |
| Longest Function | 16 lines |
| Avg LOC/Function | 7.31 |
| Median LOC/Function | 7.00 |
| Imports | 18 |

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
| Total Tokens | 3537658 |
| Context Utilization | 38% |

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


