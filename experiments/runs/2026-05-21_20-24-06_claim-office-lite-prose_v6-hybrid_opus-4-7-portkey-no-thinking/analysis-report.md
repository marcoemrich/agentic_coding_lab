# Analysis Report: 2026-05-21_20-24-06_claim-office-lite-prose_v6-hybrid_opus-4-7-portkey-no-thinking

Generated: 2026-05-21T20:37:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v6-hybrid |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 815s |
| Started | 2026-05-21T20:24:06+00:00 |
| Ended | 2026-05-21T20:37:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 145
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 298
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_20-24-06_claim-office-lite-prose_v6-hybrid_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_20-24-06_claim-office-lite-prose_v6-hybrid_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 366ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  20:37:43
   Duration  533ms (transform 37ms, setup 0ms, collect 35ms, tests 366ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 46 | ×1 | 46 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 3 | ×5 | 15 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **535** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 11 |
| Longest Function | 13 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 7.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 6 | 1.69 | 0 |
| Cognitive (SonarJS) | 3 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20524964 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 76.73s |
| Avg Red Phase | 17.44s |
| Avg Green Phase | 18.21s |
| Avg Refactor Phase | 41.08s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


