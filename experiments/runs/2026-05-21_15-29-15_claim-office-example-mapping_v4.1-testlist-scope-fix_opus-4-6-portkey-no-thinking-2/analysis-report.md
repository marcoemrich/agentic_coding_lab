# Analysis Report: 2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-21T16:37:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 4095s |
| Started | 2026-05-21T15:29:15+00:00 |
| Ended | 2026-05-21T16:37:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 145
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 950
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_15-29-15_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (42 tests) 6ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  16:37:33
   Duration  183ms (transform 50ms, setup 1ms, collect 49ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **556** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 130 |
| Functions | 2 |
| Longest Function | 92 lines |
| Avg LOC/Function | 51.50 |
| Median LOC/Function | 51.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **19** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 24 | 6.40 | 1 |
| Cognitive (SonarJS) | 58 | 21.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16077222 |
| Context Utilization | 68% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 157.13s |
| Avg Red Phase | 42.46s |
| Avg Green Phase | 40.21s |
| Avg Refactor Phase | 74.46s |

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
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


