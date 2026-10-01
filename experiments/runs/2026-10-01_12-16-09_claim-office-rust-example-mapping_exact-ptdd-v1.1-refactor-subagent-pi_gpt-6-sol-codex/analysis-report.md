# Analysis Report: 2026-10-01_12-16-09_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-10-01T12:47:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1902s |
| Started | 2026-10-01T12:16:10+00:00 |
| Ended | 2026-10-01T12:47:59+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 153
- **Test files**: scenarios.rs
- **Test LOC** (total): 84
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 43; ignored: 0

**Status**: ✅ All tests passing (43 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.08s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/scenarios.rs (target/debug/deps/scenarios-6bc6fc4318bff1b0)

running 43 tests
test amulet_price ... ok
test block_cap ... ok
test curse_scope ... ok
test both_risks ... ok
test cursed_cap ... ok
test cursed_sword ... ok
test dragon_eight ... ok
test dragon_five ... ok
test dragon_nine ... ok
test empty_items ... ok
test enchantment_five ... ok
test enchantment_four ... ok
test excess_damage ... ok
test followup ... ok
test four_runes ... ok
test longstanding_second ... ok
test loyalty_at_two ... ok
test loyalty_below ... ok
test mixed_components ... ok
test moonstone_cap ... ok
test moonstone_price ... ok
test negative_damage ... ok
test payout_rounding ... ok
test potion_cap ... ok
test potion_price ... ok
test regular_claim ... ok
test rune_claim ... ok
test rune_price ... ok
test seven_runes ... ok
test schema_example ... ok
test staff_cap ... ok
test staff_price ... ok
test steel_nine ... ok
test successive_claims ... ok
test sword_price ... ok
test three_runes ... ok
test two_damages ... ok
test two_blocks ... ok
test two_runes ... ok
test two_swords ... ok
test uninsured_damage ... ok
test unknown_damage ... ok
test unknown_quote ... ok

test result: ok. 43 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.03s

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
| Constants | 89 | ×1 | 89 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **585** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 136 |
| Functions | 12 |
| Longest Function | 29 lines |
| Avg LOC/Function | 10.42 |
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
| Total Tokens | 3006324 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


