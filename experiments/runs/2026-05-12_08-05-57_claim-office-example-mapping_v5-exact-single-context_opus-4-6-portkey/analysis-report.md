# Analysis Report: 2026-05-12_08-05-57_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

Generated: 2026-05-12T08:51:53+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey |
| Model Version(s) | claude-opus-4-6 |
| Thinking | true |
| Duration | 2755s |
| Started | 2026-05-12T08:05:57+00:00 |
| Ended | 2026-05-12T08:51:53+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 99
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 608
- **Active tests**: 30
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (30 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_08-05-57_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_08-05-57_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey

 ✓ src/claim-office.spec.ts  (30 tests) 7ms

 Test Files  1 passed (1)
      Tests  30 passed (30)
   Start at  08:51:54
   Duration  214ms (transform 59ms, setup 0ms, collect 59ms, tests 7ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 29 | ×2 | 58 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **389** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 86 |
| Functions | 3 |
| Longest Function | 40 lines |
| Avg LOC/Function | 26.67 |
| Median LOC/Function | 27.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 4.40 | 1 |
| Cognitive (SonarJS) | 17 | 9.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 55584203 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 112.22s |
| Avg Red Phase | 34.86s |
| Avg Green Phase | 31.21s |
| Avg Refactor Phase | 46.15s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 58 |
| Predictions Total | 58 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


