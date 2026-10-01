# Analysis Report: 2026-10-01_14-39-03_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-10-01T14:57:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1100s |
| Started | 2026-10-01T14:39:04+00:00 |
| Ended | 2026-10-01T14:57:29+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 128
- **Test files**: office.rs
- **Test LOC** (total): 75
- **Active tests**: 2
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
test before_loyalty ... ok
test amulet ... ok
test block_cap ... ok
test both_modifiers ... ok
test curse ... ok
test cap_exhaustion ... ok
test dragon_eight ... ok
test cursed_cap ... ok
test dragon_nine ... ok
test dragon_five ... ok
test empty_items ... ok
test enchantment_five ... ok
test enchantment_four ... ok
test excess_damages ... ok
test four_runes ... ok
test loyalty_threshold ... ok
test mixed_components ... ok
test moonstone ... ok
test moonstone_cap ... ok
test negative_damage ... ok
test newcomer ... ok
test ordinary_damage ... ok
test payout_rounding ... ok
test potion ... ok
test potion_cap ... ok
test premium_rounding ... ok
test rune ... ok
test rune_damage ... ok
test seven_runes ... ok
test second_contract ... ok
test staff ... ok
test staff_cap ... ok
test steel_nine ... ok
test sword ... ok
test three_runes ... ok
test two_blocks ... ok
test two_runes ... ok
test two_damages ... ok
test two_swords ... ok
test uninsured_damage ... ok
test unknown_quote ... ok
test unknown_damage ... ok

test result: ok. 42 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s

   Doc-tests kata

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Lines (production only) | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **578** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 117 |
| Functions | 9 |
| Longest Function | 28 lines |
| Avg LOC/Function | 12.44 |
| Median LOC/Function | 12.00 |
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
| Total Tokens | 1948969 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 5 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


