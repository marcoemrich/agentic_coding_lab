# Analysis Report: 2026-05-16_09-17-37_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-16T09:20:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 201s |
| Started | 2026-05-16T09:17:37+00:00 |
| Ended | 2026-05-16T09:20:59+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 316
- **Test file**: scenario.spec.ts
- **Test file LOC**: 344
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_09-17-37_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_09-17-37_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/scenario.spec.ts  (17 tests) 5ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  09:20:59
   Duration  172ms (transform 40ms, setup 0ms, collect 39ms, tests 5ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 14 | ×5 | 70 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **757** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 247 |
| Functions | 15 |
| Longest Function | 39 lines |
| Avg LOC/Function | 9.80 |
| Median LOC/Function | 6.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.42 | 0 |
| Cognitive (SonarJS) | 10 | 3.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1567954 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 27.08s |
| Avg Red Phase | 4.76s |
| Avg Green Phase | 22.32s |
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
| Tests Passed Immediately | 1 |


