# Analysis Report: 2026-05-20_21-58-27_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-20T22:41:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2585s |
| Started | 2026-05-20T21:58:27+00:00 |
| Ended | 2026-05-20T22:41:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 155
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 534
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-20_21-58-27_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-20_21-58-27_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (55 tests) 1441ms

 Test Files  1 passed (1)
      Tests  55 passed (55)
   Start at  22:41:35
   Duration  1.61s (transform 42ms, setup 0ms, collect 43ms, tests 1.44s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 12 | ×5 | 60 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **608** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 144 |
| Functions | 6 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.83 |
| Median LOC/Function | 8.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 16 | 6.29 | 2 |
| Cognitive (SonarJS) | 17 | 7.17 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11422803 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 93.21s |
| Avg Red Phase | 36.4s |
| Avg Green Phase | 27.93s |
| Avg Refactor Phase | 28.88s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 53 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


