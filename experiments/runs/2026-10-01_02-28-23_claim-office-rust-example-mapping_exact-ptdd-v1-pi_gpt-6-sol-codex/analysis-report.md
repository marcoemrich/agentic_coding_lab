# Analysis Report: 2026-10-01_02-28-23_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

Generated: 2026-10-01T02:41:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 746s |
| Started | 2026-10-01T02:28:24+00:00 |
| Ended | 2026-10-01T02:40:54+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 151
- **Test files**: office.rs
- **Test LOC** (total): 75
- **Active tests**: 1
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 42; ignored: 0

**Status**: ✅ All tests passing (42 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/office.rs (target/debug/deps/office-6a9fedb0229c6c29)

running 42 tests
test amulet_base_60 ... ok
test block_discount_does_not_reduce_sum_1750 ... ok
test cursed_sword_newcomer_165 ... ok
test cursed_sword_cap_unmodified_2000 ... ok
test dragon_sword_enchantment_eight_damage_1000_pays_400 ... ok
test dragon_sword_enchantment_five_damage_800_pays_700 ... ok
test empty_quote_is_five ... ok
test curse_only_affects_sword_not_amulet ... ok
test followup_contract_discount_15_on_base ... ok
test dragon_sword_enchantment_nine_damage_1000_pays_400 ... ok
test enchantment_four_no_surcharge ... ok
test four_runes_no_block_base_100 ... ok
test enchantment_five_adds_30 ... ok
test curse_and_enchantment_five_both_apply ... ok
test fractional_payout_350_point_5_rounds_down_350 ... ok
test fractional_intermediate_premium_rounds_once ... ok
test quote_unknown_type_rejected ... ok
test successive_claims_1400_then_600_exhaust_cap ... ok
test loyalty_at_two_years_discount_20 ... ok
test longstanding_second_new_cursed_enchanted_sword_160 ... ok
test mixed_components_no_block_base_75 ... ok
test negative_damage_rejected ... ok
test regular_sword_damage_500_pays_400_cap_1600 ... ok
test one_year_no_loyalty ... ok
test single_moonstone_base_25 ... ok
test potion_base_40 ... ok
test rune_damage_200_pays_100_cap_400 ... ok
test too_many_sword_damages_rejected ... ok
test two_runes_base_50 ... ok
test three_runes_block_base_60 ... ok
test sword_and_amulet_cap_3200 ... ok
test two_damaged_items_each_have_deductible_pays_600 ... ok
test two_swords_value_2000_cap_4000_and_separate_damages ... ok
test uninsured_amulet_damage_rejected ... ok
test sword_value_and_base_1000_100 ... ok
test unknown_damage_type_rejected ... ok
test two_separate_blocks_base_120 ... ok
test steel_sword_enchantment_nine_damage_1000_pays_400 ... ok
test single_rune_base_25 ... ok
test seven_runes_no_block_base_175 ... ok
test staff_base_80 ... ok
test schema_example_quote_then_claim ... ok

test result: ok. 42 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

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
| Constants | 101 | ×1 | 101 |
| Invocations | 124 | ×2 | 248 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 31 | ×6 | 186 |
| **Total Mass** | | | **629** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 14 |
| Longest Function | 23 lines |
| Avg LOC/Function | 9.29 |
| Median LOC/Function | 9.00 |
| Imports | 2 |

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
| Total Tokens | 3674653 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 83 |
| Predictions Total | 84 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


