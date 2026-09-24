# Analysis Report: 2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-5

Generated: 2026-09-24T04:55:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 243s |
| Started | 2026-09-24T04:50:56+00:00 |
| Ended | 2026-09-24T04:55:06+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 71
- **Test files**: claims.spec.ts, cli.spec.ts, office.spec.ts
- **Test LOC** (total): 99
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-50-54_claim-office-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex-5

 ✓ src/claims.spec.ts  (4 tests) 5ms
 ✓ src/office.spec.ts  (4 tests) 4ms
 ✓ src/cli.spec.ts  (2 tests) 613ms

 Test Files  3 passed (3)
      Tests  10 passed (10)
   Start at  04:55:07
   Duration  1.31s (transform 66ms, setup 0ms, collect 81ms, tests 622ms, environment 0ms, prepare 216ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 6 | ×5 | 30 |
| Assignments | 32 | ×6 | 192 |
| **Total Mass** | | | **409** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 67 |
| Functions | 2 |
| Longest Function | 46 lines |
| Avg LOC/Function | 29.00 |
| Median LOC/Function | 29.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 8 |
| Duplication | 0 |
| Magic Numbers | 29 |
| Code Quality | 0 |
| **Total** | **37** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 20 | 6.50 | 1 |
| Cognitive (SonarJS) | 54 | 29.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 505865 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


