# Analysis Report: 2026-10-01_12-43-20_claim-office-rust-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T13:04:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1271s |
| Started | 2026-10-01T12:43:20+00:00 |
| Ended | 2026-10-01T13:04:36+00:00 |

## Code Metrics

- **Implementation files**: json.rs, lib.rs, main.rs
- **Implementation LOC** (total): 516
- **Test files**: lib.rs
- **Test LOC** (total): 595
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 53; ignored: 0

**Status**: ✅ All tests passing (53 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 53 tests
test tests::a_claim_reduces_the_remaining_cap ... ok
test tests::a_claim_is_limited_to_the_remaining_cap ... ok
test tests::a_claim_step_refers_to_its_policy_by_step_index ... ok
test tests::a_component_damage_has_no_special_clause ... ok
test tests::a_damage_below_the_deductible_pays_out_nothing ... ok
test tests::a_damage_to_an_uninsured_item_is_rejected ... ok
test tests::a_damage_with_an_unknown_item_type_is_rejected ... ok
test tests::a_first_insurance_adds_a_10_percent_assessment_surcharge ... ok
test tests::a_fractional_payout_is_rounded_down ... ok
test tests::a_fractional_premium_is_rounded_up ... ok
test tests::a_negative_damage_amount_is_rejected ... ok
test tests::a_policys_cap_is_twice_its_insurance_sum ... ok
test tests::a_quote_with_an_unknown_item_type_is_rejected ... ok
test tests::a_scenario_returns_one_result_per_step_in_order ... ok
test tests::a_standard_damage_is_reimbursed_in_full_minus_the_deductible ... ok
test tests::amulet_has_base_premium_of_60 ... ok
test tests::curse_and_high_enchantment_surcharges_stack ... ok
test tests::cursed_item_adds_a_50_percent_risk_surcharge ... ok
test tests::dragon_material_alone_is_fully_reimbursed ... ok
test tests::each_contract_after_the_first_receives_a_15_percent_discount ... ok
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::enchantment_of_4_adds_no_surcharge ... ok
test tests::enchantment_of_at_least_8_halves_the_damage_before_the_deductible ... ok
test tests::enchantment_of_exactly_5_adds_a_30_percent_surcharge ... ok
test tests::enchantment_of_exactly_8_triggers_the_half_reimbursement ... ok
test tests::exactly_two_years_with_mhpco_grants_the_loyalty_discount ... ok
test tests::fewer_than_two_years_grants_no_loyalty_discount ... ok
test tests::four_runes_cost_100_because_the_block_requires_exactly_three ... ok
test tests::item_modifiers_apply_only_to_the_affected_items_base_premium ... ok
test tests::long_standing_customers_second_contract_costs_160 ... ok
test tests::mixed_component_types_do_not_form_a_block ... ok
test tests::moonstone_has_component_base_premium_of_25 ... ok
test tests::more_damages_of_a_type_than_insured_items_rejects_the_claim ... ok
test tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::only_the_final_premium_is_rounded ... ok
test tests::potion_has_base_premium_of_40 ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::rune_has_component_base_premium_of_25 ... ok
test tests::seven_runes_cost_175 ... ok
test tests::staff_has_base_premium_of_80 ... ok
test tests::sword_has_base_premium_of_100 ... ok
test tests::the_block_discount_does_not_reduce_the_insurance_sum ... ok
test tests::the_deductible_applies_once_per_damage_entry ... ok
test tests::the_first_insurance_surcharge_applies_to_every_quote ... ok
test tests::the_half_reimbursement_wins_over_dragon_material ... ok
test tests::the_insurance_sum_adds_up_the_items_insurance_values ... ok
test tests::the_processing_fee_is_added_last ... ok
test tests::three_runes_form_a_block_costing_60 ... ok
test tests::the_scenario_json_round_trips_through_the_documented_shape ... ok
test tests::two_entries_of_the_same_item_type_are_separate_damages ... ok
test tests::two_runes_cost_50 ... ok
test tests::two_separate_component_types_form_two_blocks ... ok
test tests::two_swords_double_the_insurance_sum ... ok

test result: ok. 53 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Lines (production only) | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 166 | ×2 | 332 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 22 | ×5 | 110 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **969** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 426 |
| Functions | 32 |
| Longest Function | 27 lines |
| Avg LOC/Function | 8.81 |
| Median LOC/Function | 8.00 |
| Imports | 7 |

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
| Total Tokens | 22883684 |
| Context Utilization | 78% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 84 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 105 |
| Predictions Total | 106 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 54 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 31 |


