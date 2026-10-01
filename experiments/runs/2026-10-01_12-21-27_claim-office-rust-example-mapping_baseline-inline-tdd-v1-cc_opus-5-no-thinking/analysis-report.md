# Analysis Report: 2026-10-01_12-21-27_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T12:27:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 359s |
| Started | 2026-10-01T12:21:27+00:00 |
| Ended | 2026-10-01T12:27:32+00:00 |

## Code Metrics

- **Implementation files**: claim.rs, item.rs, lib.rs, main.rs, money.rs, pricing.rs, quote.rs, scenario.rs
- **Implementation LOC** (total): 560
- **Test files**: claim.rs, item.rs, money.rs, pricing.rs, quote.rs, scenario.rs
- **Test LOC** (total): 512
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 54; ignored: 0

**Status**: ✅ All tests passing (54 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 54 tests
test claim::tests::a_cap_is_twice_the_insurance_sum ... ok
test claim::tests::a_component_has_no_special_clause ... ok
test claim::tests::a_damaged_rune_pays_100_g ... ok
test claim::tests::a_deductible_applies_once_per_damaged_item ... ok
test claim::tests::a_dragon_sword_at_enchantment_eight_pays_400_g ... ok
test claim::tests::a_highly_enchanted_item_is_reimbursed_at_half ... ok
test claim::tests::a_negative_damage_amount_is_rejected ... ok
test claim::tests::a_regular_item_is_reimbursed_in_full ... ok
test claim::tests::an_uninsured_item_is_rejected ... ok
test claim::tests::dragon_material_alone_is_reimbursed_in_full ... ok
test claim::tests::enchantment_exactly_eight_is_already_highly_enchanted ... ok
test claim::tests::more_damages_than_insured_items_is_rejected ... ok
test claim::tests::successive_claims_exhaust_the_cap ... ok
test claim::tests::the_half_rule_wins_over_dragon_material ... ok
test claim::tests::two_entries_of_a_type_need_two_insured_items ... ok
test item::tests::a_component_parses_without_material_or_enchantment ... ok
test item::tests::a_full_item_parses_every_field ... ok
test item::tests::a_sword_is_not_a_component ... ok
test money::tests::a_payout_is_rounded_down_in_the_offices_favour ... ok
test money::tests::a_percentage_of_a_whole_amount_stays_exact ... ok
test money::tests::a_premium_is_rounded_up_in_the_offices_favour ... ok
test money::tests::a_whole_amount_is_unchanged_by_rounding ... ok
test money::tests::amounts_add_and_subtract ... ok
test pricing::tests::a_block_of_three_alike_components_is_cheaper ... ok
test pricing::tests::a_pile_other_than_exactly_three_pays_full_price ... ok
test pricing::tests::an_unknown_type_is_not_in_the_price_list ... ok
test pricing::tests::components_are_250_g_insured_for_25_g ... ok
test pricing::tests::main_items_follow_the_price_list ... ok
test pricing::tests::sword_is_1000_g_insured_for_100_g ... ok
test quote::tests::a_component_block_does_not_shrink_the_insurance_sum ... ok
test quote::tests::a_curse_surcharges_only_the_cursed_items_base_premium ... ok
test quote::tests::a_cursed_highly_enchanted_item_pays_both_surcharges ... ok
test quote::tests::a_long_standing_customers_second_contract_pays_160_g ... ok
test quote::tests::a_newcomer_with_a_cursed_sword_pays_165_g ... ok
test quote::tests::a_quote_with_an_unknown_type_is_rejected ... ok
test quote::tests::alike_components_form_a_block_by_type ... ok
test quote::tests::an_empty_item_list_costs_only_the_processing_fee ... ok
test quote::tests::an_empty_item_list_has_no_base_premium ... ok
test quote::tests::an_unknown_item_type_is_rejected ... ok
test quote::tests::enchantment_four_earns_no_surcharge ... ok
test quote::tests::exactly_enchantment_five_earns_the_high_enchantment_surcharge ... ok
test quote::tests::exactly_two_years_earns_the_loyalty_discount ... ok
test quote::tests::main_items_add_up_their_base_premiums ... ok
test quote::tests::piles_of_runes_follow_the_block_examples ... ok
test quote::tests::the_insurance_sum_adds_up_the_items_values ... ok
test quote::tests::two_separate_types_form_two_separate_blocks ... ok
test quote::tests::two_swords_are_insured_twice_over ... ok
test scenario::tests::a_claim_against_a_missing_policy_sinks_the_scenario ... ok
test scenario::tests::a_claim_draws_on_the_policy_from_its_quote_step ... ok
test scenario::tests::a_quote_step_yields_a_premium ... ok
test scenario::tests::a_second_quote_earns_the_follow_up_discount ... ok
test scenario::tests::an_empty_quote_costs_only_the_processing_fee ... ok
test scenario::tests::an_unknown_item_type_sinks_the_scenario ... ok
test scenario::tests::successive_claims_against_one_policy_share_its_cap ... ok

test result: ok. 54 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Lines (production only) | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 89 | ×1 | 89 |
| Invocations | 194 | ×2 | 388 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 30 | ×5 | 150 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **1059** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 398 |
| Functions | 29 |
| Longest Function | 33 lines |
| Avg LOC/Function | 9.66 |
| Median LOC/Function | 6.00 |
| Imports | 15 |

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
| Total Tokens | 4023870 |
| Context Utilization | 37% |

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


