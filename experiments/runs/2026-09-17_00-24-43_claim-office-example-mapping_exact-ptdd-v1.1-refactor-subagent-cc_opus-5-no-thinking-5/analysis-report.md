# Analysis Report: 2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-5

Generated: 2026-09-17T02:11:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6398s |
| Started | 2026-09-17T00:24:43+00:00 |
| Ended | 2026-09-17T02:11:33+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, price-list.ts, quote.ts
- **Implementation LOC** (total): 596
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 426
- **Active tests**: 59
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (59 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-17_00-24-43_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking-5

 ✓ src/claim-office.spec.ts  (59 tests) 4330ms

 Test Files  1 passed (1)
      Tests  59 passed (59)
   Start at  02:11:34
   Duration  4.64s (transform 88ms, setup 0ms, collect 94ms, tests 4.33s, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 79% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 94 | ×1 | 94 |
| Invocations | 131 | ×2 | 262 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 23 | ×5 | 115 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **1013** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 482 |
| Functions | 40 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.78 |
| Median LOC/Function | 3.50 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 3 | 1.42 | 0 |
| Cognitive (SonarJS) | 2 | 1.19 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 56452936 |
| Context Utilization | 143% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 59 |
| Avg Cycle Time | 77.03s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 77.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 117 |
| Predictions Total | 119 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 59 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


