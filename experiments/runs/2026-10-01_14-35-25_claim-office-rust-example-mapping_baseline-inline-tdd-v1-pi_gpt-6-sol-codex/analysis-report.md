# Analysis Report: 2026-10-01_14-35-25_claim-office-rust-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-10-01T14:38:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 188s |
| Started | 2026-10-01T14:35:27+00:00 |
| Ended | 2026-10-01T14:38:40+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 166
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 130
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 12; ignored: 0

**Status**: ✅ All tests passing (12 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.02s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 10 tests
test tests::cap_uses_insurance_value_and_persists_across_claims ... ok
test tests::basic_price_list_and_empty_policy ... ok
test tests::claims_deduct_each_damage_and_use_enchantment_before_dragon ... ok
test tests::component_blocks_are_exact_and_type_specific ... ok
test tests::components_insure_at_full_value_even_when_block_discount_applies ... ok
test tests::fractional_payout_rounds_down_only_at_end ... ok
test tests::identical_items_are_distinct_and_caps_are_consumed ... ok
test tests::modifiers_apply_to_item_or_policy_base_as_appropriate ... ok
test tests::newcomer_and_veteran_examples ... ok
test tests::rejects_invalid_items_and_damages ... ok

test result: ok. 10 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 2 tests
test cli_reports_errors_without_results ... ok
test cli_reads_scenario_and_emits_only_json ... ok

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
| Constants | 66 | ×1 | 66 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 4 | ×5 | 20 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **520** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 148 |
| Functions | 6 |
| Longest Function | 33 lines |
| Avg LOC/Function | 17.50 |
| Median LOC/Function | 17.00 |
| Imports | 4 |

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
| Total Tokens | 240850 |
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


