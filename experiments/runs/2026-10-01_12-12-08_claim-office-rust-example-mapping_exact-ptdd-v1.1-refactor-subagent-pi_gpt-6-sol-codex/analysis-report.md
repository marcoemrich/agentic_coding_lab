# Analysis Report: 2026-10-01_12-12-08_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-10-01T12:43:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1840s |
| Started | 2026-10-01T12:12:09+00:00 |
| Ended | 2026-10-01T12:43:00+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 175
- **Test files**: cli.rs, office.rs
- **Test LOC** (total): 130
- **Active tests**: 47
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

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 6 tests
test cli_negative_damage ... ok
test cli_excess_damages ... ok
test cli_uninsured ... ok
test cli_unknown_quote ... ok
test cli_unknown_damage ... ok
test schema_example ... ok

test result: ok. 6 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

     Running tests/office.rs (target/debug/deps/office-6a9fedb0229c6c29)

running 41 tests
test amulet ... ok
test block_cap ... ok
test cap_exhaustion ... ok
test cursed_cap ... ok
test dragon_eight ... ok
test dragon_five ... ok
test dragon_nine ... ok
test empty_quote ... ok
test enchantment_five ... ok
test enchantment_four ... ok
test excess_damages ... ok
test four_runes ... ok
test loyalty_two ... ok
test mixed_components ... ok
test moonstone ... ok
test moonstone_insurance_value_and_claim ... ok
test negative_damage ... ok
test newcomer ... ok
test payout_rounding ... ok
test potion ... ok
test potion_insurance_value ... ok
test regular_claim ... ok
test rune ... ok
test rune_claim ... ok
test scoped_curse ... ok
test scoped_enchantment ... ok
test second_quote ... ok
test seven_runes ... ok
test staff ... ok
test staff_insurance_value ... ok
test sword ... ok
test steel_nine ... ok
test three_runes ... ok
test two_blocks ... ok
test two_runes ... ok
test two_damages ... ok
test two_swords ... ok
test uninsured ... ok
test unknown_damage ... ok
test unknown_quote ... ok
test veteran_second ... ok

test result: ok. 41 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

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
| Constants | 90 | ×1 | 90 |
| Invocations | 124 | ×2 | 248 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 10 | ×5 | 50 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **640** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 149 |
| Functions | 15 |
| Longest Function | 29 lines |
| Avg LOC/Function | 8.60 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | n/a (clippy has no rule) |
| Code Quality | 1 |
| **Total** | **2** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2507493 |
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
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


