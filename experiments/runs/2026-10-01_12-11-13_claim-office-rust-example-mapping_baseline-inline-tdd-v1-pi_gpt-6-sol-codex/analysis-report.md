# Analysis Report: 2026-10-01_12-11-13_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-10-01T12:15:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 234s |
| Started | 2026-10-01T12:11:16+00:00 |
| Ended | 2026-10-01T12:15:43+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 163
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 90
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 9; ignored: 0

**Status**: ✅ All tests passing (9 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.10s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 8 tests
test tests::claims_deductible_and_clause_priority ... ok
test tests::component_blocks_and_types ... ok
test tests::invalid_inputs ... ok
test tests::modifiers_and_followup ... ok
test tests::newcomer_sword_quote ... ok
test tests::prices_and_standard_reimbursement ... ok
test tests::rounding_and_independent_policies ... ok
test tests::repeated_items_and_cap_exhaustion ... ok

test result: ok. 8 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 1 test
test cli_json_and_errors ... ok

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

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
| Constants | 63 | ×1 | 63 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 5 | ×5 | 25 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **496** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 144 |
| Functions | 5 |
| Longest Function | 25 lines |
| Avg LOC/Function | 18.20 |
| Median LOC/Function | 19.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | n/a (clippy has no rule) |
| Code Quality | 0 |
| **Total** | **2** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 264971 |
| Context Utilization | 0% |

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


