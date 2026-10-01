# Analysis Report: 2026-10-01_12-15-39_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-10-01T12:43:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1658s |
| Started | 2026-10-01T12:15:40+00:00 |
| Ended | 2026-10-01T12:43:28+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 159
- **Test files**: scenarios.rs
- **Test LOC** (total): 119
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 48; ignored: 0

**Status**: ✅ All tests passing (48 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.07s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/scenarios.rs (target/debug/deps/scenarios-6bc6fc4318bff1b0)

running 48 tests
test amulet_price ... ok
test amulet_value ... ok
test block_cap ... ok
test curse_and_enchant ... ok
test cursed_cap ... ok
test cursed_item_scope ... ok
test cursed_sword ... ok
test dragon_five ... ok
test empty_quote ... ok
test enchant_eight_dragon ... ok
test enchant_five ... ok
test enchant_four ... ok
test enchant_nine_dragon ... ok
test excess_sword_damage ... ok
test first_insurance_new_item ... ok
test follow_up ... ok
test four_runes ... ok
test loyalty_boundary ... ok
test mixed_components ... ok
test moonstone_price ... ok
test multiple_deductibles ... ok
test moonstone_value ... ok
test negative_damage ... ok
test no_loyalty ... ok
test potion_price ... ok
test payout_rounding ... ok
test potion_value ... ok
test premium_rounding ... ok
test regular_damage ... ok
test rune_damage ... ok
test rune_price ... ok
test rune_value ... ok
test schema_example ... ok
test second_cursed_enchanted ... ok
test seven_runes ... ok
test staff_price ... ok
test staff_value ... ok
test steel_nine ... ok
test sword_amulet_cap ... ok
test successive_claims ... ok
test sword_price ... ok
test three_runes ... ok
test two_runes ... ok
test two_blocks ... ok
test two_swords ... ok
test uninsured_damage ... ok
test unknown_quote_type ... ok
test unknown_damage_type ... ok

test result: ok. 48 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s

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
| Constants | 95 | ×1 | 95 |
| Invocations | 122 | ×2 | 244 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 7 | ×5 | 35 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **682** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 144 |
| Functions | 11 |
| Longest Function | 29 lines |
| Avg LOC/Function | 12.36 |
| Median LOC/Function | 13.00 |
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
| Total Tokens | 1398893 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


