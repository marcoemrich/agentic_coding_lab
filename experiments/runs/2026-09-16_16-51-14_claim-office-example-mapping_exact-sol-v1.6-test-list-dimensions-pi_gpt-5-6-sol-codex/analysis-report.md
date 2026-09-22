# Analysis Report: 2026-09-16_16-51-14_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

Generated: 2026-09-22T17:04:39+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1571s |
| Started | 2026-09-16T16:51:15+00:00 |
| Ended | 2026-09-16T17:17:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 164
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 257
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```
[WARN] The "pnpm" field in package.json is no longer read by pnpm. The following keys were ignored: "pnpm.onlyBuiltDependencies". See https://pnpm.io/settings for the new home of each setting.

> tdd-experiment-run@ test /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-51-14_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/memrich/agentic_coding_lab/experiments/runs/2026-09-16_16-51-14_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (39 tests) 19833ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  17:04:41
   Duration  20.31s (transform 72ms, setup 0ms, collect 76ms, tests 19.83s, environment 0ms, prepare 107ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 6 | ×5 | 30 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **643** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 149 |
| Functions | 10 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.90 |
| Median LOC/Function | 8.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.52 | 0 |
| Cognitive (SonarJS) | 3 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 767175 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0.0s |
| Avg Green Phase | 0.0s |
| Avg Refactor Phase | 0.0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 78 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


