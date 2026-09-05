# Analysis Report: 2026-09-04_13-54-08_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

Generated: 2026-09-04T14:43:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2948s |
| Started | 2026-09-04T13:54:08+00:00 |
| Ended | 2026-09-04T14:43:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 374
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 717
- **Active tests**: 35
- **Remaining todos**: 5

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_13-54-08_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_13-54-08_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests | 5 skipped) 16ms
 ✓ src/cli.spec.ts  (3 tests) 1569ms

 Test Files  2 passed (2)
      Tests  40 passed | 5 todo (45)
   Start at  14:43:22
   Duration  2.12s (transform 94ms, setup 0ms, collect 104ms, tests 1.58s, environment 0ms, prepare 150ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 14 | ×5 | 70 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **758** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 303 |
| Functions | 22 |
| Longest Function | 43 lines |
| Avg LOC/Function | 6.18 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.44 | 0 |
| Cognitive (SonarJS) | 3 | 1.45 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 85610683 |
| Context Utilization | 192% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 124.62s |
| Avg Red Phase | 26.07s |
| Avg Green Phase | 30.48s |
| Avg Refactor Phase | 68.07s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


