# Analysis Report: 2026-10-01_12-11-12_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-3

Generated: 2026-10-01T12:26:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 903s |
| Started | 2026-10-01T12:11:15+00:00 |
| Ended | 2026-10-01T12:26:50+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 128
- **Test files**: scenarios.rs
- **Test LOC** (total): 128
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 44; ignored: 0

**Status**: ✅ All tests passing (44 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.06s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/scenarios.rs (target/debug/deps/scenarios-6bc6fc4318bff1b0)

running 44 tests
test before_loyalty ... ok
test amulet_quote ... ok
test cap_exhaustion ... ok
test block_cap ... ok
test curse_scope ... ok
test combined_cap ... ok
test cursed_cap ... ok
test cursed_newcomer ... ok
test dragon_eight ... ok
test dragon_five ... ok
test dragon_nine ... ok
test empty_quote ... ok
test enchanted_cursed ... ok
test enchantment_five ... ok
test enchantment_four ... ok
test excessive_damages ... ok
test follow_up ... ok
test four_runes ... ok
test longstanding_second ... ok
test loyalty_threshold ... ok
test mixed_components ... ok
test moonstone_cap ... ok
test moonstone_quote ... ok
test negative_damage ... ok
test potion_cap ... ok
test payout_rounding ... ok
test potion_quote ... ok
test regular_claim ... ok
test rune_claim ... ok
test rune_quote ... ok
test schema_example ... ok
test seven_runes ... ok
test staff_cap ... ok
test staff_quote ... ok
test steel_nine ... ok
test sword_quote ... ok
test three_runes ... ok
test two_blocks ... ok
test two_damages ... ok
test two_runes ... ok
test two_swords ... ok
test uninsured_damage ... ok
test unknown_damage ... ok
test unknown_quote ... ok

test result: ok. 44 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s

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
| Constants | 97 | ×1 | 97 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 31 | ×6 | 186 |
| **Total Mass** | | | **619** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 115 |
| Functions | 13 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.69 |
| Median LOC/Function | 7.00 |
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
| Total Tokens | 5269457 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 87 |
| Predictions Total | 88 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


