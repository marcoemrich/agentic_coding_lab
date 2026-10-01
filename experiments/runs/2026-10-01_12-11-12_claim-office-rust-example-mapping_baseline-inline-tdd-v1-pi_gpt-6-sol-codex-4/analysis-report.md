# Analysis Report: 2026-10-01_12-11-12_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-4

Generated: 2026-10-01T12:20:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 549s |
| Started | 2026-10-01T12:11:16+00:00 |
| Ended | 2026-10-01T12:20:57+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 117
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 150
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 10; ignored: 0

**Status**: ✅ All tests passing (10 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.03s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 9 tests
test tests::base_prices_and_component_blocks ... ok
test tests::block_requires_exactly_three_of_the_same_type ... ok
test tests::claim_deductibles_special_clauses_and_cap ... ok
test tests::empty_quote_pays_only_processing_fee ... ok
test tests::fractional_amounts_round_once_at_end ... ok
test tests::modifiers_stack_on_correct_bases_and_contract_history ... ok
test tests::invalid_input_rejects_whole_scenario ... ok
test tests::thresholds_and_dragon_priority ... ok
test tests::repeated_items_have_independent_deductibles_and_cap_exhausts ... ok

test result: ok. 9 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 1 test
test cli_emits_only_json_and_reports_errors_to_stderr ... ok

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
| Constants | 79 | ×1 | 79 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **576** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 107 |
| Functions | 5 |
| Longest Function | 29 lines |
| Avg LOC/Function | 20.40 |
| Median LOC/Function | 22.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | n/a (clippy has no rule) |
| Code Quality | 1 |
| **Total** | **1** |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 288915 |
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


