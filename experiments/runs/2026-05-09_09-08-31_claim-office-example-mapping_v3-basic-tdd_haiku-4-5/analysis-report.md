# Analysis Report: 2026-05-09_09-08-31_claim-office-example-mapping_v3-basic-tdd_haiku-4-5

Generated: 2026-05-09T09:13:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 310s |
| Started | 2026-05-09T09:08:31+00:00 |
| Ended | 2026-05-09T09:13:44+00:00 |

## Code Metrics

- **Implementation file**: types.ts
- **Implementation LOC**: 61
- **Test file**: core.spec.ts
- **Test file LOC**: 534
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```
Lockfile is up to date, resolution step is skipped
Already up to date

Done in 360ms using pnpm v11.0.8
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-09_09-08-31_claim-office-example-mapping_v3-basic-tdd_haiku-4-5

 ✓ src/core.spec.ts  (41 tests) 9ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  09:13:46
   Duration  306ms (transform 67ms, setup 0ms, collect 60ms, tests 9ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 0 | ×2 | 0 |
| Conditionals | 1 | ×4 | 4 |
| Loops | 0 | ×5 | 0 |
| Assignments | 2 | ×6 | 12 |
| **Total Mass** | | | **24** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 9 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 5.33 | 2 |
| Cognitive (SonarJS) | 20 | 7.62 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6865121 |
| Context Utilization | 46% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 27.33s |
| Avg Red Phase | 16.55s |
| Avg Green Phase | 8.04s |
| Avg Refactor Phase | 2.74s |

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


