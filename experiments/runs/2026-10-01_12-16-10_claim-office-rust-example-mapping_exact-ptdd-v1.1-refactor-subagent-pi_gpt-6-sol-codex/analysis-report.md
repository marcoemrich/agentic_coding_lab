# Analysis Report: 2026-10-01_12-16-10_claim-office-rust-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-10-01T12:27:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-rust-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 652s |
| Started | 2026-10-01T12:16:11+00:00 |
| Ended | 2026-10-01T12:27:10+00:00 |

## Code Metrics

- **Implementation files**: domain.rs, lib.rs, main.rs
- **Implementation LOC** (total): 166
- **Test files**: lib.rs, cli.rs
- **Test LOC** (total): 164
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

- **Active tests** (from libtest, authoritative on Rust): 46; ignored: 0

**Status**: ✅ All tests passing (46 passed)

```
    Finished `test` profile [unoptimized + debuginfo] target(s) in 0.07s
     Running unittests src/lib.rs (target/debug/deps/kata-deec677121834d81)

running 44 tests
test tests::amulet_price ... ok
test tests::block_cap ... ok
test tests::curse_and_enchantment ... ok
test tests::cap_exhaustion ... ok
test tests::curse_scope ... ok
test tests::cursed_cap ... ok
test tests::dragon_eight ... ok
test tests::dragon_five ... ok
test tests::dragon_nine ... ok
test tests::empty_items ... ok
test tests::enchantment_five ... ok
test tests::enchantment_four ... ok
test tests::excess_same_type ... ok
test tests::first_insurance ... ok
test tests::followup_discount ... ok
test tests::four_runes ... ok
test tests::longstanding_second ... ok
test tests::loyalty_threshold ... ok
test tests::moonstone_price ... ok
test tests::mixed_components ... ok
test tests::multiple_damages ... ok
test tests::negative_damage ... ok
test tests::newcomer ... ok
test tests::payout_rounding ... ok
test tests::policy_modifier_scope ... ok
test tests::potion_price ... ok
test tests::rune_claim ... ok
test tests::premium_rounding ... ok
test tests::rune_price ... ok
test tests::schema_sequence ... ok
test tests::staff_price ... ok
test tests::seven_runes ... ok
test tests::standard_sword_claim ... ok
test tests::steel_nine ... ok
test tests::sword_price ... ok
test tests::sword_amulet_cap ... ok
test tests::three_runes ... ok
test tests::two_blocks ... ok
test tests::two_runes ... ok
test tests::two_sword_damages ... ok
test tests::two_swords ... ok
test tests::uninsured_damage ... ok
test tests::unknown_damage ... ok
test tests::unknown_quote ... ok

test result: ok. 44 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running unittests src/main.rs (target/debug/deps/kata-d4c1691e5c2131ec)

running 0 tests

test result: ok. 0 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.00s

     Running tests/cli.rs (target/debug/deps/cli-e5b80ed8904c4322)

running 2 tests
test schema_example_via_cli ... ok
test invalid_scenarios_exit_nonzero_with_stderr_and_no_results ... ok

test result: ok. 2 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.01s

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
| Constants | 65 | ×1 | 65 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 6 | ×5 | 30 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **543** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 144 |
| Functions | 10 |
| Longest Function | 22 lines |
| Avg LOC/Function | 9.80 |
| Median LOC/Function | 10.00 |
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
| Total Tokens | 1499661 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 5 |
| Predictions Total | 6 |
| Accuracy | 83% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


