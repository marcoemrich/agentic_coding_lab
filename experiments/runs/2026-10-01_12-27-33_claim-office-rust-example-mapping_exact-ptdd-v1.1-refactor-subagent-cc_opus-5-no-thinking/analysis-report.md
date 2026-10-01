# Analysis Report: 2026-10-01_12-27-33_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T14:00:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5550s |
| Started | 2026-10-01T12:27:34+00:00 |
| Ended | 2026-10-01T14:00:10+00:00 |

## Code Metrics

- **Implementation files**: admissibility.rs, business_done.rs, coverage.rs, lib.rs, main.rs, pricing.rs, reimbursement.rs, risk.rs, rounding.rs, scenario.rs, settlement_limit.rs, standing.rs
- **Implementation LOC** (total): 841
- **Test files**: lib.rs
- **Test LOC** (total): 559
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 46; ignored: 0

**Status**: ✅ All tests passing (46 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 46 tests
test tests::claim_for_an_uninsured_item_is_rejected ... ok
test tests::a_scenario_produces_one_result_per_step_in_order ... ok
test tests::claim_with_a_negative_damage_amount_is_rejected ... ok
test tests::claim_with_an_unknown_item_type_is_rejected ... ok
test tests::component_damage_is_reimbursed_minus_the_deductible ... ok
test tests::cursed_and_highly_enchanted_item_adds_both_surcharges ... ok
test tests::cursed_item_adds_a_fifty_percent_surcharge ... ok
test tests::dragon_material_damage_is_fully_reimbursed ... ok
test tests::each_damage_entry_of_the_same_type_carries_its_own_deductible ... ok
test tests::empty_item_list_costs_only_the_processing_fee ... ok
test tests::enchantment_of_exactly_eight_triggers_the_half_reimbursement ... ok
test tests::enchantment_of_exactly_five_adds_the_high_enchantment_surcharge ... ok
test tests::enchantment_of_four_adds_no_high_enchantment_surcharge ... ok
test tests::exactly_two_years_grants_the_loyalty_discount ... ok
test tests::first_insurance_adds_the_initial_assessment_surcharge ... ok
test tests::first_insurance_surcharge_applies_on_every_quote ... ok
test tests::follow_up_contract_grants_the_fifteen_percent_discount ... ok
test tests::four_runes_do_not_form_a_block ... ok
test tests::high_enchantment_beats_dragon_material ... ok
test tests::highly_enchanted_damage_is_reimbursed_at_half ... ok
test tests::item_modifiers_apply_only_to_the_affected_items_base_premium ... ok
test tests::long_standing_customers_second_contract_pays_160 ... ok
test tests::mixed_component_types_do_not_form_a_block ... ok
test tests::more_damages_of_a_type_than_insured_items_is_rejected ... ok
test tests::newcomer_with_a_cursed_sword_pays_165 ... ok
test tests::one_year_grants_no_loyalty_discount ... ok
test tests::payout_is_rounded_down ... ok
test tests::plain_amulet_uses_its_base_premium ... ok
test tests::plain_potion_uses_its_base_premium ... ok
test tests::plain_staff_uses_its_base_premium ... ok
test tests::plain_sword_uses_its_base_premium ... ok
test tests::premium_is_rounded_up ... ok
test tests::premium_modifiers_do_not_raise_the_cap ... ok
test tests::quote_with_an_unknown_item_type_is_rejected ... ok
test tests::seven_runes_do_not_form_a_block ... ok
test tests::single_moonstone_uses_the_component_base_premium ... ok
test tests::single_rune_uses_the_component_base_premium ... ok
test tests::standard_damage_is_reimbursed_minus_the_deductible ... ok
test tests::successive_claims_exhaust_the_remaining_cap ... ok
test tests::the_cap_is_twice_the_sum_of_the_items_insurance_values ... ok
test tests::the_component_block_discount_does_not_lower_the_insurance_sum ... ok
test tests::three_runes_form_a_block ... ok
test tests::the_deductible_applies_once_per_damaged_item ... ok
test tests::two_items_of_the_same_type_are_insured_separately ... ok
test tests::two_runes_cost_fifty ... ok
test tests::two_separate_component_types_each_form_a_block ... ok

test result: ok. 46 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Lines (production only) | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 270 | ×2 | 540 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 44 | ×5 | 220 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **1229** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 509 |
| Functions | 50 |
| Longest Function | 34 lines |
| Avg LOC/Function | 6.36 |
| Median LOC/Function | 6.00 |
| Imports | 31 |

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
| Total Tokens | 84029258 |
| Context Utilization | 131% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 87.34s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 87.34s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 93 |
| Predictions Total | 94 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


