# Analysis Report: 2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-5

Generated: 2026-05-21T16:54:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 5128s |
| Started | 2026-05-21T15:29:15+00:00 |
| Ended | 2026-05-21T16:54:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 156
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 840
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-5

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  16:54:45
   Duration  191ms (transform 46ms, setup 1ms, collect 51ms, tests 6ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **567** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 143 |
| Functions | 7 |
| Longest Function | 22 lines |
| Avg LOC/Function | 11.57 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 3.08 | 0 |
| Cognitive (SonarJS) | 9 | 4.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19716582 |
| Context Utilization | 80% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 157.78s |
| Avg Red Phase | 42.02s |
| Avg Green Phase | 32.56s |
| Avg Refactor Phase | 83.2s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 18 |


