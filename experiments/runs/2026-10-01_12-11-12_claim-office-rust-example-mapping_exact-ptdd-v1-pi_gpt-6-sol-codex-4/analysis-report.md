# Analysis Report: 2026-10-01_12-11-12_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-4

Generated: 2026-10-01T12:20:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 546s |
| Started | 2026-10-01T12:11:16+00:00 |
| Ended | 2026-10-01T12:20:54+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 136
- **Test files**: scenarios.rs
- **Test LOC** (total): 158
- **Active tests**: 28
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 47; ignored: 0

**Status**: ✅ All tests passing (47 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/scenarios.rs (target/debug/deps/scenarios-6bc6fc4318bff1b0)

running 47 tests
test amulet_value_600_base_60_premium_71 ... ok
test curse_only_on_sword_not_amulet_231 ... ok
test curse_and_enchantment_5_stack_195 ... ok
test cursed_sword_165 ... ok
test dragon_enchantment_5_damage_800_pays_700 ... ok
test dragon_enchantment_8_damage_1000_pays_400 ... ok
test cursed_sword_cap_2000 ... ok
test dragon_enchantment_9_damage_1000_pays_400 ... ok
test empty_items_only_fee_5 ... ok
test empty_steps_empty_results ... ok
test enchantment_4_no_surcharge_115 ... ok
test enchantment_5_surcharge_145 ... ok
test exactly_two_years_loyalty_95 ... ok
test fractional_modifiers_not_rounded_between_steps ... ok
test four_runes_no_block_100_premium_115 ... ok
test fractional_payout_350_point_5_rounds_down ... ok
test fractional_premium_197_point_5_rounds_to_198 ... ok
test loyalty_on_base_not_curse_145 ... ok
test loyal_second_quote_cursed_enchanted_sword_160 ... ok
test mixed_two_runes_one_moonstone_no_block_75_premium_88 ... ok
test moonstone_insurance_cap_500 ... ok
test moonstone_value_250_base_25_premium_33 ... ok
test more_sword_damages_than_insured_rejected ... ok
test negative_damage_rejected ... ok
test one_year_no_loyalty_115 ... ok
test potion_insurance_cap_800 ... ok
test potion_value_400_base_40_premium_49 ... ok
test rune_damage_200_pays_100 ... ok
test rune_value_250_base_25_premium_33 ... ok
test schema_example_amulet_fire ... ok
test second_quote_new_sword_first_insurance_and_follow_up_100 ... ok
test separate_rune_and_moonstone_blocks_120_premium_137 ... ok
test seven_runes_no_block_175_premium_198 ... ok
test staff_insurance_cap_1600 ... ok
test staff_value_800_base_80_premium_93 ... ok
test steel_enchantment_3_damage_500_pays_400 ... ok
test steel_enchantment_9_damage_1000_pays_400 ... ok
test successive_claims_pay_1400_then_600 ... ok
test sword_amulet_cap_3200 ... ok
test sword_three_runes_cap_3500 ... ok
test sword_value_1000_base_100_premium_115 ... ok
test three_runes_block_60_premium_71 ... ok
test two_runes_base_50_premium_60 ... ok
test uninsured_amulet_rejected ... ok
test two_swords_two_damages_separate_deductibles ... ok
test unknown_damage_type_rejected ... ok
test unknown_quote_type_rejected ... ok

test result: ok. 47 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.05s

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
| Constants | 92 | ×1 | 92 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 31 | ×6 | 186 |
| **Total Mass** | | | **563** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 116 |
| Functions | 11 |
| Longest Function | 26 lines |
| Avg LOC/Function | 9.91 |
| Median LOC/Function | 7.00 |
| Imports | 3 |

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
| Total Tokens | 1638200 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 18 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 49 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


