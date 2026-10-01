# Analysis Report: 2026-10-01_12-12-08_claim-office-rust-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T12:54:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2541s |
| Started | 2026-10-01T12:12:08+00:00 |
| Ended | 2026-10-01T12:54:40+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 534
- **Test files**: lib.rs
- **Test LOC** (total): 758
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 49; ignored: 0

**Status**: ✅ All tests passing (49 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 49 tests
test tests::a_claim_reports_the_remaining_cap ... ok
test tests::a_claim_is_limited_to_the_remaining_cap ... ok
test tests::a_claim_step_refers_to_the_policy_of_an_earlier_quote_step ... ok
test tests::a_fractional_payout_rounds_down ... ok
test tests::a_fractional_premium_rounds_up ... ok
test tests::amulet_has_base_premium_of_60_g ... ok
test tests::claim_for_an_item_outside_the_policy_is_rejected ... ok
test tests::claim_with_a_negative_damage_amount_is_rejected ... ok
test tests::claim_with_an_unknown_item_type_is_rejected ... ok
test tests::claim_with_more_damages_of_a_type_than_insured_is_rejected ... ok
test tests::component_damage_has_no_special_clause ... ok
test tests::cursed_and_highly_enchanted_item_gets_both_surcharges ... ok
test tests::cursed_item_adds_a_50_percent_risk_surcharge ... ok
test tests::different_component_types_do_not_form_a_block ... ok
test tests::dragon_material_damage_is_fully_reimbursed ... ok
test tests::each_component_type_forms_its_own_block ... ok
test tests::each_contract_after_the_first_gets_a_15_percent_discount ... ok
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::enchantment_of_4_adds_no_high_enchantment_surcharge ... ok
test tests::enchantment_of_exactly_5_adds_a_30_percent_surcharge ... ok
test tests::enchantment_of_exactly_8_triggers_the_50_percent_clause ... ok
test tests::exactly_two_years_with_mhpco_grants_the_loyalty_discount ... ok
test tests::fewer_than_two_years_grants_no_loyalty_discount ... ok
test tests::first_insurance_adds_a_10_percent_assessment_surcharge ... ok
test tests::first_insurance_surcharge_applies_to_every_quote_regardless_of_history ... ok
test tests::four_runes_get_no_block_and_cost_100_g_base_premium ... ok
test tests::high_enchantment_damage_is_reimbursed_at_50_percent ... ok
test tests::insurance_sum_is_the_sum_of_the_items_insurance_values ... ok
test tests::item_surcharge_applies_only_to_the_affected_items_base_premium ... ok
test tests::long_standing_customers_second_contract_pays_160_g ... ok
test tests::moonstone_has_base_premium_of_25_g ... ok
test tests::newcomer_with_a_cursed_sword_pays_165_g ... ok
test tests::only_the_final_premium_is_rounded ... ok
test tests::potion_has_base_premium_of_40_g ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::quote_with_an_unknown_item_type_is_rejected ... ok
test tests::repeated_damage_entries_of_one_type_are_separate_damages ... ok
test tests::results_mirror_the_input_steps_in_length_and_order ... ok
test tests::rune_has_base_premium_of_25_g ... ok
test tests::seven_runes_cost_175_g_base_premium ... ok
test tests::staff_has_base_premium_of_80_g ... ok
test tests::standard_damage_is_fully_reimbursed_minus_the_deductible ... ok
test tests::sword_has_base_premium_of_100_g ... ok
test tests::the_50_percent_clause_wins_over_dragon_material ... ok
test tests::the_block_discount_does_not_reduce_the_insurance_sum ... ok
test tests::the_deductible_applies_once_per_damaged_item ... ok
test tests::three_runes_form_a_block_of_60_g_base_premium ... ok
test tests::two_items_of_the_same_type_both_count_towards_the_insurance_sum ... ok
test tests::two_runes_cost_50_g_base_premium ... ok

test result: ok. 49 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Lines (production only) | 74% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 172 | ×2 | 344 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 21 | ×5 | 105 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **904** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 451 |
| Functions | 33 |
| Longest Function | 30 lines |
| Avg LOC/Function | 8.52 |
| Median LOC/Function | 6.00 |
| Imports | 5 |

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
| Total Tokens | 36231455 |
| Context Utilization | 94% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 78 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 96 |
| Predictions Total | 98 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 52 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


