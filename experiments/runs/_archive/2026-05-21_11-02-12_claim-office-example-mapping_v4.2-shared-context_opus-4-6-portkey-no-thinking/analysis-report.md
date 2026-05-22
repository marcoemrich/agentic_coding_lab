# Analysis Report: 2026-05-21_11-02-12_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T12:32:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5400s |
| Started | 2026-05-21T11:02:12+00:00 |
| Ended | 2026-05-21T12:32:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 80
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 306
- **Active tests**: 29
- **Remaining todos**: 22

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_11-02-12_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_11-02-12_claim-office-example-mapping_v4.2-shared-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (51 tests | 22 skipped) 5ms

 Test Files  1 passed (1)
      Tests  29 passed | 22 todo (51)
   Start at  12:32:14
   Duration  187ms (transform 37ms, setup 0ms, collect 35ms, tests 5ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 37 | ×1 | 37 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 3 | ×5 | 15 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **322** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 73 |
| Functions | 3 |
| Longest Function | 26 lines |
| Avg LOC/Function | 16.00 |
| Median LOC/Function | 13.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 10 | 4.00 | 0 |
| Cognitive (SonarJS) | 10 | 5.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9843375 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 218.54s |
| Avg Red Phase | 57.58s |
| Avg Green Phase | 66.88s |
| Avg Refactor Phase | 94.08s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 90 |
| Predictions Total | 94 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


