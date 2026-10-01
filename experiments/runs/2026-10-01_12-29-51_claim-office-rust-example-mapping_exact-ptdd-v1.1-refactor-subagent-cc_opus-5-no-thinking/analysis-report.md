# Analysis Report: 2026-10-01_12-29-51_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T14:29:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 7200s |
| Started | 2026-10-01T12:29:51+00:00 |
| Ended | 2026-10-01T14:29:57+00:00 |

## Code Metrics

- **Implementation files**: lib.rs
- **Implementation LOC** (total): 178
- **Test files**: lib.rs
- **Test LOC** (total): 349
- **Active tests**: 49
- **Remaining todos**: 32

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 17; ignored: 32

**Status**: ✅ All tests passing (17 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 49 tests
test tests::a_claim_for_an_item_outside_the_policy_is_rejected ... ignored, TODO: claim damaging an amulet when only a sword is insured -> Err describing the uncovered item
test tests::a_claim_for_an_unknown_item_type_is_rejected ... ignored, TODO: claim damaging an unknown item type -> Err describing the unknown type
test tests::a_claim_reduces_the_remaining_cap_by_the_payout ... ignored, TODO: sword (cap 2000 G), first claim 1500 G -> payout 1400 G, remainingCap 600 G
test tests::a_claim_referencing_a_missing_policy_is_rejected ... ignored, TODO: claim referencing a policy index that is not a quote step -> Err describing the bad reference
test tests::a_claim_with_a_negative_damage_amount_is_rejected ... ignored, TODO: claim with a damage amount of -200 -> Err describing the negative amount
test tests::a_claim_with_more_damages_of_a_type_than_insured_is_rejected ... ignored, TODO: two sword damage entries but only one sword insured -> Err; the whole claim is rejected
test tests::a_cursed_highly_enchanted_item_carries_both_surcharges ... ignored, TODO: cursed sword enchantment 5 -> both curse and high-enchantment surcharges apply
test tests::a_fractional_payout_is_rounded_down ... ignored, TODO: payout of 350.5 G -> 350 G (rounded down, in MHPCO's favor)
test tests::a_fractional_premium_is_rounded_up ... ignored, TODO: premium of 197.5 G -> 198 G (rounded up, in MHPCO's favor)
test tests::a_cursed_item_adds_a_fifty_percent_risk_surcharge ... ok
test tests::a_moonstone_is_charged_the_25_g_component_base_premium ... ok
test tests::a_payout_is_limited_to_the_remaining_cap ... ignored, TODO: sword (cap 2000 G), two claims of 1500 G -> second payout 600 G, remainingCap 0 G
test tests::a_quote_with_an_unknown_item_type_is_rejected ... ignored, TODO: quote with an unknown item type (broomstick) -> Err describing the unknown type
test tests::a_standard_damage_is_reimbursed_in_full_minus_the_deductible ... ignored, TODO: steel sword enchantment 3, damage 500 G -> payout 400 G (full minus 100 G deductible)
test tests::a_rune_is_charged_the_25_g_component_base_premium ... ok
test tests::damage_to_a_component_applies_only_the_deductible ... ignored, TODO: rune (insurance value 250 G), damage 200 G -> payout 100 G; a component has no enchantment or material, so no special clause applies
test tests::components_of_different_types_do_not_form_a_block ... ok
test tests::damage_to_a_dragon_material_item_is_fully_reimbursed ... ignored, TODO: dragon-material sword enchantment 5, damage 800 G -> payout 700 G (full reimbursement, then deductible)
test tests::damage_to_a_very_highly_enchanted_item_is_reimbursed_at_fifty_percent ... ignored, TODO: steel sword enchantment 9, damage 1000 G -> payout 400 G (50 % clause, then deductible)
test tests::each_contract_after_the_first_earns_the_follow_up_discount ... ignored, TODO: the second quote in a scenario gets a 15 % follow-up contract discount; the first does not
test tests::each_component_type_forms_its_own_building_block ... ok
test tests::enchantment_of_exactly_eight_triggers_the_fifty_percent_clause ... ignored, TODO: dragon-material sword enchantment 8, damage 1000 G -> payout 400 G (enchantment threshold is inclusive and wins)
test tests::enchantment_below_five_adds_no_high_enchantment_surcharge ... ok
test tests::every_quote_carries_the_first_insurance_surcharge ... ignored, TODO: first insurance surcharge 10 % of the policy base premium applies to every quote
test tests::exactly_two_years_with_mhpco_earns_the_loyalty_discount ... ignored, TODO: customer with exactly 2 years -> 20 % loyalty discount applies
test tests::enchantment_of_exactly_five_adds_the_high_enchantment_surcharge ... ok
test tests::fewer_than_two_years_with_mhpco_earns_no_loyalty_discount ... ignored, TODO: customer with 1 year -> no loyalty discount
test tests::item_modifiers_apply_only_to_the_affected_items_base_premium ... ignored, TODO: cursed sword (base 100) + plain amulet (base 60) -> 210 G before policy modifiers and fee; curse applies to the cursed item's base premium only
test tests::long_standing_customers_second_contract_pays_160_g ... ignored, TODO: 3-year customer, second quote, cursed sword enchantment 7 -> premium 160 G
test tests::newcomer_with_a_cursed_sword_pays_165_g ... ignored, TODO: newcomer (0 years), cursed steel sword enchantment 3 -> premium 165 G
test tests::premium_modifiers_do_not_raise_the_cap ... ignored, TODO: cursed sword -> cap 2000 G from the unmodified insurance value; premium modifiers do not raise the cap
test tests::four_runes_are_priced_individually_because_a_block_needs_exactly_three ... ok
test tests::repeated_damage_entries_of_one_type_are_separate_damage_events ... ignored, TODO: two sword damage entries on a policy covering two swords -> each entry is a separate damage with its own deductible
test tests::results_mirror_the_steps_in_length_and_order ... ignored, TODO: results array has the same length and order as steps; quote results carry premium, claim results carry payout and remainingCap
test tests::quote_for_empty_item_list_is_only_the_processing_fee ... ok
test tests::the_building_block_discount_does_not_reduce_the_insurance_sum ... ignored, TODO: policy with sword + 3 runes -> insurance sum 1750 G, cap 3500 G; the block discount does not reduce the insurance sum
test tests::seven_runes_are_priced_individually_because_a_block_needs_exactly_three ... ok
test tests::the_cap_is_twice_the_sum_of_the_items_insurance_values ... ignored, TODO: policy with sword + amulet -> insurance sum 1600 G, cap 3200 G (observed via remainingCap)
test tests::the_deductible_applies_once_per_damage_entry ... ignored, TODO: dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G; the deductible applies once per damaged item
test tests::the_fifty_percent_clause_wins_over_dragon_material ... ignored, TODO: dragon-material sword enchantment 9, damage 1000 G -> payout 400 G; the 50 % rule wins over full reimbursement
test tests::the_policy_base_premium_sums_the_items_base_premiums ... ok
test tests::the_price_list_charges_100_g_base_premium_for_a_sword ... ok
test tests::the_price_list_charges_40_g_base_premium_for_a_potion ... ok
test tests::the_price_list_charges_60_g_base_premium_for_an_amulet ... ok
test tests::the_scenario_json_contract_round_trips ... ignored, TODO: schema example scenario (amulet quote then 200 G fire claim) round-trips through the JSON contract
test tests::the_price_list_charges_80_g_base_premium_for_a_staff ... ok
test tests::two_items_of_the_same_type_each_add_their_insurance_value ... ignored, TODO: policy with two swords -> insurance sum 2000 G, cap 4000 G
test tests::three_alike_runes_form_a_building_block ... ok
test tests::two_runes_are_priced_individually ... ok

test result: ok. 17 passed; 0 failed; 32 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Constants | 18 | ×1 | 18 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 13 | ×5 | 65 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **255** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 94 |
| Functions | 13 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.38 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

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
| Total Tokens | 22757849 |
| Context Utilization | 73% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 233.33s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 233.33s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 37 |
| Predictions Total | 37 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


