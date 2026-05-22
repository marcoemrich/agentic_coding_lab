# Analysis Report: 2026-05-21_14-13-07_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T15:43:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T14:13:07+00:00 |
| Ended | 2026-05-21T15:43:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 119
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 349
- **Active tests**: 34
- **Remaining todos**: 14

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_14-13-07_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_14-13-07_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests | 14 skipped) 5ms

 Test Files  1 passed (1)
      Tests  34 passed | 14 todo (48)
   Start at  15:43:10
   Duration  225ms (transform 45ms, setup 0ms, collect 66ms, tests 5ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 5 | ×5 | 25 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **398** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 104 |
| Functions | 5 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.40 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.50 | 0 |
| Cognitive (SonarJS) | 7 | 4.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9854917 |
| Context Utilization | 49% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 213.12s |
| Avg Red Phase | 61.33s |
| Avg Green Phase | 57.11s |
| Avg Refactor Phase | 94.68s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 112 |
| Predictions Total | 112 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


