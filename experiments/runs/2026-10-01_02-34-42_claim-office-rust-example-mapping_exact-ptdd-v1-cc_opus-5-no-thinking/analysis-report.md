# Analysis Report: 2026-10-01_02-34-42_claim-office-rust-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T02:56:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1307s |
| Started | 2026-10-01T02:34:42+00:00 |
| Ended | 2026-10-01T02:56:32+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs, scenario.rs
- **Implementation LOC** (total): 604
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 840
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 53; ignored: 0

**Status**: ✅ All tests passing (53 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 48 tests
test tests::amulet_has_base_premium_60 ... ok
test tests::block_requires_components_of_the_same_type ... ok
test tests::a_claim_is_limited_to_the_remaining_cap ... ok
test tests::cursed_item_adds_fifty_percent_risk_surcharge ... ok
test tests::block_discount_does_not_reduce_the_insurance_sum ... ok
test tests::cursed_and_highly_enchanted_item_gets_both_surcharges ... ok
test tests::damage_with_an_unknown_item_type_is_rejected ... ok
test tests::damage_to_an_item_outside_the_policy_is_rejected ... ok
test tests::component_damage_has_no_special_clause ... ok
test tests::dragon_material_damage_is_fully_reimbursed ... ok
test tests::dragon_material_with_enchantment_exactly_eight_pays_400 ... ok
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::enchantment_exactly_eight_triggers_the_fifty_percent_clause ... ok
test tests::enchantment_five_adds_thirty_percent_risk_surcharge ... ok
test tests::enchantment_four_adds_no_high_enchantment_surcharge ... ok
test tests::exactly_two_years_grants_the_loyalty_discount ... ok
test tests::first_claim_reduces_the_remaining_cap ... ok
test tests::first_insurance_adds_ten_percent_initial_assessment ... ok
test tests::first_insurance_surcharge_also_applies_on_a_follow_up_contract ... ok
test tests::follow_up_contract_grants_fifteen_percent_discount ... ok
test tests::high_enchantment_clause_wins_over_dragon_material ... ok
test tests::four_runes_have_base_premium_100 ... ok
test tests::high_enchantment_damage_is_reimbursed_at_fifty_percent ... ok
test tests::insurance_sum_is_the_sum_of_item_insurance_values ... ok
test tests::negative_damage_amount_is_rejected ... ok
test tests::item_modifier_applies_only_to_the_affected_items_base_premium ... ok
test tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::long_standing_customers_second_contract_pays_160 ... ok
test tests::one_year_grants_no_loyalty_discount ... ok
test tests::more_damage_entries_of_a_type_than_insured_items_is_rejected ... ok
test tests::potion_has_base_premium_40 ... ok
test tests::payout_is_rounded_down ... ok
test tests::premium_is_rounded_up ... ok
test tests::only_the_final_premium_is_rounded ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::moonstone_has_component_base_premium_25 ... ok
test tests::repeated_item_type_damages_each_carry_their_own_deductible ... ok
test tests::rune_has_component_base_premium_25 ... ok
test tests::seven_runes_have_base_premium_175 ... ok
test tests::staff_has_base_premium_80 ... ok
test tests::standard_damage_is_fully_reimbursed_minus_the_deductible ... ok
test tests::sword_has_base_premium_100 ... ok
test tests::the_deductible_applies_once_per_damage_entry ... ok
test tests::three_alike_components_form_a_block_priced_60 ... ok
test tests::two_items_of_the_same_type_both_count_toward_the_insurance_sum ... ok
test tests::two_runes_have_base_premium_50 ... ok
test tests::two_separate_blocks_of_different_component_types ... ok
test tests::unknown_item_type_in_a_quote_is_rejected ... ok

test result: ok. 48 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 5 tests
test cli_treats_the_second_quote_of_a_scenario_as_a_follow_up_contract ... ok
test cli_resolves_the_policy_reference_of_a_claim_step ... ok
test cli_rejects_a_damage_with_an_unknown_item_type ... ok
test cli_exits_non_zero_without_stdout_results_on_an_invalid_scenario ... ok
test cli_reads_a_scenario_from_stdin_and_writes_results_to_stdout ... ok

test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests kata

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Lines (production only) | 99% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 166 | ×2 | 332 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 23 | ×5 | 115 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **887** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 433 |
| Functions | 36 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.22 |
| Median LOC/Function | 7.00 |
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
| Total Tokens | 29186725 |
| Context Utilization | 96% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 106 |
| Predictions Total | 106 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 53 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


