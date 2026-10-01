# Analysis Report: 2026-10-01_12-27-53_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T14:02:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5657s |
| Started | 2026-10-01T12:27:53+00:00 |
| Ended | 2026-10-01T14:02:16+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 795
- **Test files**: lib.rs
- **Test LOC** (total): 506
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 49; ignored: 0

**Status**: ✅ All tests passing (49 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 49 tests
test tests::a_cursed_item_adds_a_fifty_percent_risk_surcharge ... ok
test tests::a_damage_to_an_item_outside_the_policy_is_rejected ... ok
test tests::a_damage_with_an_unknown_item_type_is_rejected ... ok
test tests::a_follow_up_contract_gets_the_fifteen_percent_discount ... ok
test tests::a_fractional_payout_is_rounded_down ... ok
test tests::a_fractional_premium_is_rounded_up ... ok
test tests::a_negative_damage_amount_is_rejected ... ok
test tests::an_item_surcharge_applies_only_to_the_affected_items_base_premium ... ok
test tests::component_damage_is_reimbursed_in_full_minus_the_deductible ... ok
test tests::components_of_different_types_do_not_form_a_block ... ok
test tests::cursed_and_highly_enchanted_item_gets_both_surcharges ... ok
test tests::damage_to_a_highly_enchanted_item_is_halved_before_the_deductible ... ok
test tests::dragon_material_damage_is_fully_reimbursed_minus_the_deductible ... ok
test tests::dragon_material_with_enchantment_exactly_eight_pays_400 ... ok
test tests::a_scenario_returns_one_result_per_step_in_order ... ok
test tests::each_component_type_forms_its_own_block ... ok
test tests::each_damage_entry_of_a_repeated_item_type_gets_its_own_deductible ... ok
test tests::enchantment_of_exactly_eight_triggers_the_half_reimbursement ... ok
test tests::enchantment_of_exactly_five_adds_the_high_enchantment_surcharge ... ok
test tests::enchantment_of_four_adds_no_high_enchantment_surcharge ... ok
test tests::exactly_two_years_with_mhpco_grants_the_loyalty_discount ... ok
test tests::four_alike_components_get_no_block_discount ... ok
test tests::integration_long_standing_customers_second_contract_pays_160 ... ok
test tests::integration_newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::more_damage_entries_than_insured_items_of_that_type_is_rejected ... ok
test tests::one_year_with_mhpco_grants_no_loyalty_discount ... ok
test tests::premium_modifiers_do_not_change_the_cap ... ok
test tests::quote_for_a_plain_amulet_uses_the_amulet_base_premium ... ok
test tests::quote_for_a_plain_potion_uses_the_potion_base_premium ... ok
test tests::quote_for_a_plain_staff_uses_the_staff_base_premium ... ok
test tests::quote_for_a_plain_sword_uses_the_sword_base_premium ... ok
test tests::quote_for_a_single_moonstone_uses_the_component_base_premium ... ok
test tests::quote_for_a_single_rune_uses_the_component_base_premium ... ok
test tests::quote_for_empty_item_list_is_only_the_processing_fee ... ok
test tests::quote_with_an_unknown_item_type_is_rejected ... ok
test tests::seven_alike_components_get_no_block_discount ... ok
test tests::standard_damage_is_reimbursed_in_full_minus_the_deductible ... ok
test tests::successive_claims_exhaust_the_remaining_cap ... ok
test tests::the_block_discount_does_not_change_the_insurance_sum ... ok
test tests::the_cap_is_twice_the_sum_of_the_insured_items_values ... ok
test tests::the_deductible_applies_once_per_damaged_item ... ok
test tests::the_first_insurance_surcharge_applies_to_every_quoted_item ... ok
test tests::the_high_enchantment_clause_wins_over_dragon_material ... ok
test tests::the_json_contract_rejects_an_unknown_item_type ... ok
test tests::the_scenario_is_driven_by_the_documented_json_contract ... ok
test tests::the_schema_example_scenario_produces_a_quote_and_a_claim_result ... ok
test tests::three_alike_components_form_a_block_at_sixty ... ok
test tests::two_alike_components_have_no_block_discount ... ok
test tests::two_items_of_the_same_type_both_count_toward_the_insurance_sum ... ok

test result: ok. 49 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

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
| Constants | 87 | ×1 | 87 |
| Invocations | 216 | ×2 | 432 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 37 | ×5 | 185 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **1090** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 532 |
| Functions | 52 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.00 |
| Median LOC/Function | 6.00 |
| Imports | 4 |

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
| Total Tokens | 96455790 |
| Context Utilization | 144% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 82.25s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 82.25s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 94 |
| Predictions Total | 96 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 48 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


