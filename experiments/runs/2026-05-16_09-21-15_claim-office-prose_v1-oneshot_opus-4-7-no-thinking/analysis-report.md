# Analysis Report: 2026-05-16_09-21-15_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-16T09:26:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 321s |
| Started | 2026-05-16T09:21:15+00:00 |
| Ended | 2026-05-16T09:26:37+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 389
- **Test file**: claim.spec.ts
- **Test file LOC**: 88
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_09-21-15_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_09-21-15_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/quote.spec.ts  (9 tests) 3ms
 ✓ src/claim.spec.ts  (6 tests) 2ms
 ✓ src/scenario.spec.ts  (3 tests) 2ms

 Test Files  3 passed (3)
      Tests  18 passed (18)
   Start at  09:26:38
   Duration  422ms (transform 42ms, setup 0ms, collect 51ms, tests 7ms, environment 0ms, prepare 132ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 72% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 88 | ×1 | 88 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 14 | ×5 | 70 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **878** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 315 |
| Functions | 19 |
| Longest Function | 34 lines |
| Avg LOC/Function | 9.26 |
| Median LOC/Function | 5.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 7 | 2.12 | 0 |
| Cognitive (SonarJS) | 8 | 4.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3279079 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 83.47s |
| Avg Red Phase | 29.69s |
| Avg Green Phase | 53.78s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


