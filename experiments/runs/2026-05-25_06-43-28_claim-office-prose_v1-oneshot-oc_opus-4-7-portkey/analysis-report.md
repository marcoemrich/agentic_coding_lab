# Analysis Report: 2026-05-25_06-43-28_claim-office-prose_v1-oneshot-oc_opus-4-7-portkey

Generated: 2026-05-25T06:45:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 128s |
| Started | 2026-05-25T06:43:28+00:00 |
| Ended | 2026-05-25T06:45:38+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts, scenario.ts
- **Implementation LOC** (total): 291
- **Test file**: scenario.spec.ts
- **Test file LOC**: 157
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_06-43-28_claim-office-prose_v1-oneshot-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_06-43-28_claim-office-prose_v1-oneshot-oc_opus-4-7-portkey

 ✓ src/scenario.spec.ts  (10 tests) 3ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  06:45:39
   Duration  167ms (transform 34ms, setup 0ms, collect 35ms, tests 3ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 15 | ×5 | 75 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **828** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 238 |
| Functions | 12 |
| Longest Function | 36 lines |
| Avg LOC/Function | 9.08 |
| Median LOC/Function | 6.00 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.14 | 0 |
| Cognitive (SonarJS) | 10 | 5.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 455544 |
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
| Predictions Correct | N/A |
| Predictions Total | N/A |
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


