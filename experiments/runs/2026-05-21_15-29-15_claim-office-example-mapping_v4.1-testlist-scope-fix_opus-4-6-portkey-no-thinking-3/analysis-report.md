# Analysis Report: 2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-21T16:43:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4459s |
| Started | 2026-05-21T15:29:15+00:00 |
| Ended | 2026-05-21T16:43:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 215
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 1050
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (44 tests) 8ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  16:43:36
   Duration  197ms (transform 63ms, setup 0ms, collect 63ms, tests 8ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 13 | ×5 | 65 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **682** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 178 |
| Functions | 13 |
| Longest Function | 20 lines |
| Avg LOC/Function | 8.31 |
| Median LOC/Function | 8.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.58 | 0 |
| Cognitive (SonarJS) | 7 | 2.79 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16128256 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 175.16s |
| Avg Red Phase | 41.19s |
| Avg Green Phase | 42.08s |
| Avg Refactor Phase | 91.89s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 89 |
| Predictions Total | 89 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


