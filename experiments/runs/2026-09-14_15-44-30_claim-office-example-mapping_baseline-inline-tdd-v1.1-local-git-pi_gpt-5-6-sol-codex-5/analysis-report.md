# Analysis Report: 2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-5

Generated: 2026-09-14T16:01:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 217s |
| Started | 2026-09-14T15:44:32+00:00 |
| Ended | 2026-09-14T15:48:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 200
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 110
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-5

 ✓ src/claim-office.spec.ts  (10 tests) 6ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  16:01:51
   Duration  349ms (transform 64ms, setup 1ms, collect 67ms, tests 6ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 120 | ×2 | 240 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 12 | ×5 | 60 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **878** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 178 |
| Functions | 21 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.71 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 2.24 | 0 |
| Cognitive (SonarJS) | 4 | 1.95 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 240067 |
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


