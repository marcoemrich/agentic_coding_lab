# Analysis Report: 2026-10-01_12-48-19_claim-office-rust-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T13:07:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1156s |
| Started | 2026-10-01T12:48:19+00:00 |
| Ended | 2026-10-01T13:07:41+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs, scenario.rs
- **Implementation LOC** (total): 481
- **Test files**: lib.rs
- **Test LOC** (total): 431
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 47; ignored: 0

**Status**: ✅ All tests passing (47 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 47 tests
test tests::a_claim_for_an_item_outside_the_policy_is_rejected ... ok
test tests::a_claim_for_an_unknown_item_type_is_rejected ... ok
test tests::a_component_damage_has_no_special_clause ... ok
test tests::a_claim_step_refers_to_an_earlier_quote_step_by_index ... ok
test tests::a_fractional_payout_is_rounded_down ... ok
test tests::a_fractional_premium_is_rounded_up ... ok
test tests::a_negative_damage_amount_is_rejected ... ok
test tests::a_quote_with_an_unknown_item_type_is_rejected ... ok
test tests::a_scenario_produces_one_result_per_step_in_order ... ok
test tests::alike_means_the_same_component_type ... ok
test tests::amulet_has_base_premium_60 ... ok
test tests::at_enchantment_eight_the_fifty_percent_rule_beats_dragon_material ... ok
test tests::curse_and_high_enchantment_surcharges_both_apply ... ok
test tests::cursed_item_adds_a_fifty_percent_risk_surcharge ... ok
test tests::dragon_material_damage_is_fully_reimbursed ... ok
test tests::each_contract_after_the_first_earns_a_follow_up_discount ... ok
test tests::each_damage_entry_of_a_repeated_type_gets_its_own_deductible ... ok
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::enchantment_of_eight_or_more_is_reimbursed_at_fifty_percent ... ok
test tests::enchantment_of_exactly_five_adds_a_thirty_percent_surcharge ... ok
test tests::enchantment_of_four_adds_no_surcharge ... ok
test tests::exactly_two_years_with_mhpco_earns_the_loyalty_discount ... ok
test tests::first_insurance_adds_an_initial_assessment_surcharge ... ok
test tests::first_insurance_surcharge_applies_to_every_quote_regardless_of_history ... ok
test tests::four_runes_cost_100_because_a_block_requires_exactly_three ... ok
test tests::item_modifiers_apply_only_to_the_affected_items_base_premium ... ok
test tests::long_standing_customers_second_contract_costs_160 ... ok
test tests::moonstone_component_has_base_premium_25 ... ok
test tests::more_damage_entries_than_insured_items_of_that_type_is_rejected ... ok
test tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::one_year_with_mhpco_earns_no_loyalty_discount ... ok
test tests::potion_has_base_premium_40 ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::rune_component_has_base_premium_25 ... ok
test tests::seven_runes_cost_175 ... ok
test tests::staff_has_base_premium_80 ... ok
test tests::standard_damage_is_reimbursed_in_full_minus_the_deductible ... ok
test tests::successive_claims_exhaust_the_remaining_cap ... ok
test tests::sword_has_base_premium_100 ... ok
test tests::the_block_discount_does_not_reduce_the_insurance_sum ... ok
test tests::the_cap_is_twice_the_sum_of_the_items_insurance_values ... ok
test tests::the_deductible_applies_once_per_damaged_item ... ok
test tests::the_fifty_percent_rule_wins_over_dragon_material ... ok
test tests::three_alike_runes_form_a_block_at_60 ... ok
test tests::two_items_of_the_same_type_each_add_their_insurance_value ... ok
test tests::two_runes_cost_50 ... ok
test tests::two_separate_alike_blocks_each_cost_60 ... ok

test result: ok. 47 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Constants | 64 | ×1 | 64 |
| Invocations | 169 | ×2 | 338 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 14 | ×5 | 70 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **908** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 371 |
| Functions | 33 |
| Longest Function | 28 lines |
| Avg LOC/Function | 7.58 |
| Median LOC/Function | 7.00 |
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
| Total Tokens | 24283851 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


