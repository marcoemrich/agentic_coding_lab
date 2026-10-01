# Analysis Report: 2026-10-01_12-27-11_claim-office-rust-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-10-01T12:33:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 368s |
| Started | 2026-10-01T12:27:11+00:00 |
| Ended | 2026-10-01T12:33:25+00:00 |

## Code Metrics

- **Implementation files**: catalog.rs, claim.rs, json.rs, lib.rs, main.rs, money.rs, quote.rs, scenario.rs
- **Implementation LOC** (total): 630
- **Test files**: catalog.rs, claim.rs, json.rs, money.rs, quote.rs, scenario.rs, cli.rs
- **Test LOC** (total): 827
- **Active tests**: 71
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 71; ignored: 0

**Status**: ✅ All tests passing (71 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 55 tests
test catalog::tests::a_broomstick_is_not_on_the_price_list ... ok
test catalog::tests::components_are_insured_at_250_g_for_25_g ... ok
test catalog::tests::main_items_follow_the_price_list ... ok
test catalog::tests::sword_is_1000_g_insured_at_100_g_base_premium ... ok
test claim::tests::a_damaged_item_outside_the_policy_rejects_the_claim ... ok
test claim::tests::a_dragon_sword_at_exactly_enchantment_8_is_halved_then_deducted ... ok
test claim::tests::a_dragon_sword_below_the_half_threshold_is_fully_reimbursed ... ok
test claim::tests::a_negative_damage_amount_rejects_the_claim ... ok
test claim::tests::a_plain_item_gets_no_special_clause ... ok
test claim::tests::a_regular_sword_damaged_500_g_pays_out_400_g ... ok
test claim::tests::a_rune_damaged_200_g_pays_out_100_g ... ok
test claim::tests::a_steel_sword_at_enchantment_9_is_halved_then_deducted ... ok
test claim::tests::dragon_material_below_the_enchantment_threshold_gets_its_own_clause ... ok
test claim::tests::more_damages_of_a_type_than_insured_items_rejects_the_claim ... ok
test claim::tests::successive_claims_exhaust_the_cap ... ok
test claim::tests::the_cap_is_reduced_by_the_rounded_payout_not_the_fraction ... ok
test claim::tests::the_cap_is_twice_the_insurance_sum ... ok
test claim::tests::the_deductible_applies_once_per_damaged_item ... ok
test claim::tests::the_half_clause_wins_over_dragon_material ... ok
test claim::tests::the_high_enchantment_clause_outranks_dragon_material ... ok
test claim::tests::two_swords_each_carry_their_own_deductible ... ok
test json::tests::a_document_that_is_not_a_scenario_is_rejected ... ok
test json::tests::items_may_omit_the_optional_fields ... ok
test json::tests::results_render_with_the_binding_field_names ... ok
test json::tests::the_schema_example_parses_into_a_quote_and_a_claim ... ok
test money::tests::a_payout_of_350_point_5_g_rounds_down_to_350 ... ok
test money::tests::a_premium_of_197_point_5_g_rounds_up_to_198 ... ok
test money::tests::percentages_are_kept_as_fractions_until_rounded ... ok
test money::tests::subtraction_can_go_negative_and_clamps_to_zero ... ok
test money::tests::whole_amounts_round_to_themselves ... ok
test quote::tests::a_component_block_discount_does_not_shrink_the_insurance_sum ... ok
test quote::tests::a_cursed_highly_enchanted_sword_carries_both_surcharges ... ok
test quote::tests::a_long_standing_customers_second_contract_for_a_cursed_sword_costs_160_g ... ok
test quote::tests::a_newcomer_with_a_cursed_sword_pays_165_g ... ok
test quote::tests::a_sword_and_an_amulet_are_insured_for_1600_g ... ok
test quote::tests::alike_means_the_same_type_so_two_runes_and_a_moonstone_cost_75_g ... ok
test quote::tests::an_empty_item_list_costs_only_the_processing_fee ... ok
test quote::tests::an_unknown_item_type_is_rejected ... ok
test quote::tests::enchantment_4_earns_no_high_enchantment_surcharge ... ok
test quote::tests::exactly_2_years_with_mhpco_earns_the_loyalty_discount ... ok
test quote::tests::exactly_enchantment_5_earns_the_high_enchantment_surcharge ... ok
test quote::tests::four_runes_are_no_block_and_cost_100_g ... ok
test quote::tests::seven_runes_cost_175_g ... ok
test quote::tests::the_curse_surcharge_applies_to_the_cursed_item_only ... ok
test quote::tests::three_runes_and_three_moonstones_are_two_separate_blocks_at_120_g ... ok
test quote::tests::three_runes_form_a_block_at_60_g ... ok
test quote::tests::two_runes_cost_50_g_base_premium ... ok
test quote::tests::two_swords_are_insured_for_2000_g ... ok
test scenario::tests::a_claim_against_a_step_that_is_not_a_quote_rejects_the_scenario ... ok
test scenario::tests::a_claim_naming_a_later_step_rejects_the_scenario ... ok
test scenario::tests::a_damage_outside_the_policy_rejects_the_scenario ... ok
test scenario::tests::a_quote_then_a_claim_against_it_yields_both_results ... ok
test scenario::tests::an_unknown_item_type_rejects_the_scenario ... ok
test scenario::tests::claims_share_the_cap_of_the_policy_they_name ... ok
test scenario::tests::the_second_quote_in_a_scenario_earns_the_follow_up_discount ... ok

test result: ok. 55 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 16 tests
test a_block_discount_does_not_shrink_the_cap ... ok
test a_cursed_sword_is_capped_on_its_unmodified_insurance_value ... ok
test a_damage_outside_the_policy_is_rejected_with_a_message ... ok
test a_dragon_attack_on_two_items_deducts_once_per_item ... ok
test a_long_standing_customers_second_contract_is_quoted_160_g ... ok
test a_negative_damage_amount_is_rejected_with_a_message ... ok
test a_newcomer_with_a_cursed_sword_is_quoted_165_g ... ok
test a_payout_ending_in_a_half_g_rounds_down ... ok
test a_premium_ending_in_a_half_g_rounds_up ... ok
test an_empty_item_list_is_quoted_at_the_processing_fee ... ok
test an_unknown_item_type_is_rejected_with_a_message ... ok
test malformed_json_is_rejected ... ok
test more_sword_damages_than_insured_swords_is_rejected ... ok
test successive_claims_exhaust_the_cap ... ok
test the_schema_example_is_quoted_and_claimed ... ok
test two_swords_are_capped_at_4000_g ... ok

test result: ok. 16 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s

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
| Constants | 76 | ×1 | 76 |
| Invocations | 219 | ×2 | 438 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 30 | ×5 | 150 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **1134** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 463 |
| Functions | 33 |
| Longest Function | 33 lines |
| Avg LOC/Function | 8.79 |
| Median LOC/Function | 7.00 |
| Imports | 14 |

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
| Total Tokens | 2664947 |
| Context Utilization | 39% |

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


