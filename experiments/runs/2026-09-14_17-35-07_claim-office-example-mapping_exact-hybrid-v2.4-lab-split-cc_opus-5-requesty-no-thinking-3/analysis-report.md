# Analysis Report: 2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-3

Generated: 2026-09-14T18:42:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4066s |
| Started | 2026-09-14T17:35:07+00:00 |
| Ended | 2026-09-14T18:42:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 457
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 967
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-3

 ✓ src/claim-office.spec.ts  (51 tests) 540ms

 Test Files  1 passed (1)
      Tests  51 passed (51)
   Start at  18:43:00
   Duration  901ms (transform 78ms, setup 0ms, collect 87ms, tests 540ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 23 | ×5 | 115 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **960** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 355 |
| Functions | 31 |
| Longest Function | 14 lines |
| Avg LOC/Function | 3.94 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 51185739 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 132.23s |
| Avg Red Phase | 26.73s |
| Avg Green Phase | 27.25s |
| Avg Refactor Phase | 78.25s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 102 |
| Predictions Total | 102 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 28 |


