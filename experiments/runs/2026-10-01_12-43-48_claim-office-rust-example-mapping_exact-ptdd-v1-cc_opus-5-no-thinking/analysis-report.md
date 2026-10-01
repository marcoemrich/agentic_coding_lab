# Analysis Report: 2026-10-01_12-43-48_claim-office-rust-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T13:04:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1225s |
| Started | 2026-10-01T12:43:48+00:00 |
| Ended | 2026-10-01T13:04:18+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs, scenario.rs
- **Implementation LOC** (total): 545
- **Test files**: lib.rs
- **Test LOC** (total): 599
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 57; ignored: 0

**Status**: ✅ All tests passing (57 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 57 tests
test tests::a_claim_is_capped_at_the_remaining_cap ... ok
test tests::a_claim_uses_the_policy_from_the_referenced_quote_step ... ok
test tests::alike_means_same_component_type ... ok
test tests::block_discount_affects_the_premium_not_the_insurance_sum ... ok
test tests::cap_is_twice_the_sum_of_item_insurance_values ... ok
test tests::claim_for_an_uninsured_item_is_rejected ... ok
test tests::claim_referencing_a_non_quote_policy_index_is_rejected ... ok
test tests::claim_with_a_negative_damage_amount_is_rejected ... ok
test tests::claim_with_an_unknown_item_type_is_rejected ... ok
test tests::claim_with_more_damages_than_insured_items_is_rejected ... ok
test tests::component_damage_has_no_special_clause ... ok
test tests::curse_and_high_enchantment_both_apply ... ok
test tests::cursed_item_adds_fifty_percent_of_its_base_premium ... ok
test tests::dragon_material_damage_is_fully_reimbursed ... ok
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::enchantment_exactly_five_adds_the_high_enchantment_surcharge ... ok
test tests::enchantment_four_adds_no_high_enchantment_surcharge ... ok
test tests::enchantment_four_cursed_applies_only_the_curse_surcharge ... ok
test tests::enchantment_seven_gets_full_reimbursement ... ok
test tests::first_claim_reduces_the_remaining_cap ... ok
test tests::first_insurance_surcharge_applies_even_on_a_follow_up_contract ... ok
test tests::follow_up_contract_discount_applies_from_the_second_quote ... ok
test tests::first_insurance_surcharge_applies_to_a_quote ... ok
test tests::four_runes_have_no_block_discount ... ok
test tests::high_enchantment_clause_applies_at_exactly_eight ... ok
test tests::high_enchantment_damage_is_reimbursed_at_fifty_percent ... ok
test tests::high_enchantment_wins_over_dragon_material_at_eight ... ok
test tests::high_enchantment_wins_over_dragon_material_at_nine ... ok
test tests::item_modifiers_apply_to_the_affected_items_base_premium_only ... ok
test tests::long_standing_customers_second_contract_pays_160 ... ok
test tests::loyalty_discount_applies_at_exactly_two_years ... ok
test tests::loyalty_discount_does_not_apply_below_two_years ... ok
test tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::only_the_final_premium_is_rounded ... ok
test tests::payout_is_never_negative ... ok
test tests::payout_is_rounded_down ... ok
test tests::plain_amulet_premium ... ok
test tests::plain_potion_premium ... ok
test tests::plain_staff_premium ... ok
test tests::plain_sword_premium ... ok
test tests::policy_wide_modifiers_use_the_policy_base_premium ... ok
test tests::premium_is_rounded_up ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::quote_with_an_unknown_item_type_is_rejected ... ok
test tests::repeated_item_types_are_separate_damages ... ok
test tests::scenario_results_mirror_the_steps ... ok
test tests::schema_example_scenario_round_trip ... ok
test tests::seven_runes_have_no_block_discount ... ok
test tests::single_moonstone_base_premium ... ok
test tests::single_rune_base_premium ... ok
test tests::standard_reimbursement_subtracts_the_deductible ... ok
test tests::the_deductible_applies_once_per_damage_entry ... ok
test tests::three_moonstones_form_a_block ... ok
test tests::three_runes_form_a_block ... ok
test tests::two_items_of_the_same_type_both_count_toward_the_insurance_sum ... ok
test tests::two_runes_have_no_block_discount ... ok
test tests::two_separate_blocks_each_get_the_block_premium ... ok

test result: ok. 57 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Constants | 72 | ×1 | 72 |
| Invocations | 198 | ×2 | 396 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 18 | ×5 | 90 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **978** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 425 |
| Functions | 46 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.50 |
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
| Total Tokens | 23466798 |
| Context Utilization | 82% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 114 |
| Predictions Total | 115 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 57 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


