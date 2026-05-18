# Analysis Report: 2026-05-18_17-36-13_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking

Generated: 2026-05-18T18:16:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2424s |
| Started | 2026-05-18T17:36:13+00:00 |
| Ended | 2026-05-18T18:16:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 287
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 476
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_17-36-13_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_17-36-13_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (29 tests) 5ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  18:16:39
   Duration  175ms (transform 46ms, setup 0ms, collect 46ms, tests 5ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 13 | ×5 | 65 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **802** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 24 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.58 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 7 | 1.83 | 0 |
| Cognitive (SonarJS) | 8 | 1.94 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37993625 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 121.21s |
| Avg Red Phase | 25.65s |
| Avg Green Phase | 33.38s |
| Avg Refactor Phase | 62.18s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 52 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


