# Analysis Report: 2026-10-01_14-35-25_claim-office-rust-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

Generated: 2026-10-01T14:46:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 676s |
| Started | 2026-10-01T14:35:27+00:00 |
| Ended | 2026-10-01T14:46:48+00:00 |

## Code Metrics

- **Implementation files**: lib.rs, main.rs
- **Implementation LOC** (total): 143
- **Test files**: scenarios.rs
- **Test LOC** (total): 118
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 41; ignored: 0

**Status**: ✅ All tests passing (41 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.05s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/scenarios.rs (target/debug/deps/scenarios-6bc6fc4318bff1b0)

running 41 tests
test amulet_quote ... ok
test block_cap ... ok
test cap_exhaustion ... ok
test curse_scope ... ok
test cursed_cap ... ok
test cursed_sword ... ok
test dragon_claim ... ok
test dragon_high_claim ... ok
test dragon_threshold_claim ... ok
test duplicate_swords ... ok
test empty_quote ... ok
test enchantment_below ... ok
test enchantment_boundary ... ok
test excess_damage_entries ... ok
test follow_up ... ok
test four_runes ... ok
test long_standing_second ... ok
test high_enchantment_claim ... ok
test loyalty_boundary ... ok
test mixed_components ... ok
test mixed_cap ... ok
test moonstone_quote ... ok
test negative_damage ... ok
test no_loyalty ... ok
test payout_rounding ... ok
test potion_quote ... ok
test regular_claim ... ok
test rune_claim ... ok
test rune_quote ... ok
test schema_example ... ok
test seven_runes ... ok
test stacked_item_surcharges ... ok
test staff_quote ... ok
test sword_quote ... ok
test three_runes ... ok
test two_blocks ... ok
test two_damages ... ok
test two_runes ... ok
test uninsured_damage ... ok
test unknown_damage ... ok
test unknown_quote ... ok

test result: ok. 41 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.03s

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
| Constants | 86 | ×1 | 86 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 38 | ×6 | 228 |
| **Total Mass** | | | **585** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 129 |
| Functions | 10 |
| Longest Function | 27 lines |
| Avg LOC/Function | 12.50 |
| Median LOC/Function | 11.50 |
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
| Total Tokens | 1145819 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


