# Analysis Report: 2026-05-12_23-08-25_claim-office-example-mapping_v5-exact-single-context_opus-4-7

Generated: 2026-05-12T23:25:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 1045s |
| Started | 2026-05-12T23:08:25+00:00 |
| Ended | 2026-05-12T23:25:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 207
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 503
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_23-08-25_claim-office-example-mapping_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_23-08-25_claim-office-example-mapping_v5-exact-single-context_opus-4-7

 ✓ src/claim-office.spec.ts  (46 tests) 1048ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  23:25:52
   Duration  1.26s (transform 62ms, setup 0ms, collect 75ms, tests 1.05s, environment 0ms, prepare 52ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 13 | ×5 | 65 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **829** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 17 |
| Longest Function | 14 lines |
| Avg LOC/Function | 6.35 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 6 | 2.17 | 0 |
| Cognitive (SonarJS) | 7 | 2.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32533259 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 71.14s |
| Avg Red Phase | 42.55s |
| Avg Green Phase | 18.2s |
| Avg Refactor Phase | 10.39s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 9 |
| Predictions Total | 9 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


