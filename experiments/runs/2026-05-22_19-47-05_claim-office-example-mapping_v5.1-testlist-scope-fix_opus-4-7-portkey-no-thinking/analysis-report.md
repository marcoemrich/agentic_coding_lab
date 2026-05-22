# Analysis Report: 2026-05-22_19-47-05_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T19:57:06+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 600s |
| Started | 2026-05-22T19:47:05+00:00 |
| Ended | 2026-05-22T19:57:06+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 160
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 416
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_19-47-05_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_19-47-05_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 1785ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  19:57:06
   Duration  1.96s (transform 40ms, setup 0ms, collect 41ms, tests 1.78s, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 82% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 7 | ×5 | 35 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **645** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 12 |
| Longest Function | 36 lines |
| Avg LOC/Function | 9.17 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.93 | 0 |
| Cognitive (SonarJS) | 16 | 4.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17226872 |
| Context Utilization | 13% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 265.59s |
| Avg Red Phase | 20.12s |
| Avg Green Phase | 13.01s |
| Avg Refactor Phase | 232.46s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 4 |
| Predictions Total | 4 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


