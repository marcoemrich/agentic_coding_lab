# Analysis Report: 2026-10-01_12-11-12_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-10-01T12:15:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 207s |
| Started | 2026-10-01T12:11:15+00:00 |
| Ended | 2026-10-01T12:15:15+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 172
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 107
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 12; ignored: 0

**Status**: ✅ All tests passing (12 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 10 tests
test tests::basic_quote_and_empty_quote ... ok
test tests::cap_is_based_on_insurance_value_not_premium ... ok
test tests::claims_deduct_per_item_and_exhaust_policy_cap ... ok
test tests::half_gold_payout_rounds_down ... ok
test tests::high_enchantment_precedes_dragon_material_and_deductible ... ok
test tests::component_blocks_require_exactly_three_of_one_type ... ok
test tests::modifiers_stack_on_item_and_policy_bases ... ok
test tests::payout_fractions_round_down_only_after_aggregation ... ok
test tests::rejects_uninsured_excess_and_negative_damage ... ok
test tests::thresholds_rounding_and_separate_policies ... ok

test result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 2 tests
test cli_reports_errors_without_results_on_stdout ... ok
test cli_emits_only_json_for_quotes_and_claims ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

   Doc-tests kata

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Lines (production only) | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 6 | ×5 | 30 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **491** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 7 |
| Longest Function | 25 lines |
| Avg LOC/Function | 13.71 |
| Median LOC/Function | 10.00 |
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
| Total Tokens | 369112 |
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


