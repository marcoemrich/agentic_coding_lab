# Analysis Report: 2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-4

Generated: 2026-10-01T01:06:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1006s |
| Started | 2026-10-01T00:49:48+00:00 |
| Ended | 2026-10-01T01:06:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 187
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 294
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-4

 ✓ src/claim-office.spec.ts  (41 tests) 433ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  01:06:42
   Duration  821ms (transform 96ms, setup 0ms, collect 97ms, tests 433ms, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 47 | ×1 | 47 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **674** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 26 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.23 |
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
| McCabe (Cyclomatic) | 3 | 1.34 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 53490764 |
| Context Utilization | 119% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 33.60s |
| Avg Red Phase | 6.72s |
| Avg Green Phase | 8.83s |
| Avg Refactor Phase | 18.05s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


