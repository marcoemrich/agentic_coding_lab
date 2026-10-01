# Analysis Report: 2026-10-01_12-11-12_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-3

Generated: 2026-10-01T12:15:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 230s |
| Started | 2026-10-01T12:11:15+00:00 |
| Ended | 2026-10-01T12:15:39+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 162
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 158
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 14; ignored: 0

**Status**: ✅ All tests passing (14 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 12 tests
test tests::enchantment_eight_overrides_dragon_and_rounds_down ... ok
test tests::component_blocks_are_exact_and_separate_by_type ... ok
test tests::item_surcharges_and_policy_discounts_stack_from_base ... ok
test tests::invalid_items_and_damages_reject_entire_scenario ... ok
test tests::multiple_identical_items_have_independent_deductibles ... ok
test tests::policy_indices_survive_claim_steps_and_component_blocks_do_not_reduce_cap ... ok
test tests::price_list_and_empty_quote ... ok
test tests::seven_runes_are_not_a_block_and_fractional_premium_rounds_up ... ok
test tests::repeated_claims_exhaust_unmodified_cap ... ok
test tests::standard_claim_and_per_damage_deductible ... ok
test tests::threshold_five_dragon_receives_full_reimbursement ... ok
test tests::thresholds_and_rounding_apply_only_at_end ... ok

test result: ok. 12 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 2 tests
test cli_prints_only_json_for_valid_scenario ... ok
test cli_reports_errors_only_on_stderr ... ok

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
| Constants | 63 | ×1 | 63 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **504** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 5 |
| Longest Function | 31 lines |
| Avg LOC/Function | 20.40 |
| Median LOC/Function | 24.00 |
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
| Total Tokens | 425358 |
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


