# Analysis Report: 2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-2

Generated: 2026-09-14T18:31:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.4-lab-split-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3382s |
| Started | 2026-09-14T17:35:07+00:00 |
| Ended | 2026-09-14T18:31:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 332
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 870
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-35-07_claim-office-example-mapping_exact-hybrid-v2.4-lab-split-cc_opus-5-requesty-no-thinking-2

 ✓ src/claim-office.spec.ts  (49 tests) 1313ms

 Test Files  1 passed (1)
      Tests  49 passed (49)
   Start at  18:31:37
   Duration  1.66s (transform 97ms, setup 0ms, collect 99ms, tests 1.31s, environment 0ms, prepare 89ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 13 | ×5 | 65 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **807** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 23 |
| Longest Function | 19 lines |
| Avg LOC/Function | 3.61 |
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
| McCabe (Cyclomatic) | 5 | 1.44 | 0 |
| Cognitive (SonarJS) | 6 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50138646 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 111.28s |
| Avg Red Phase | 21.45s |
| Avg Green Phase | 27.2s |
| Avg Refactor Phase | 62.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 98 |
| Predictions Total | 98 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


