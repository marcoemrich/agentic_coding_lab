# Analysis Report: 2026-05-21_19-46-51_claim-office-lite-prose_v3-basic-tdd_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-21T19:50:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-prose |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 219s |
| Started | 2026-05-21T19:46:51+00:00 |
| Ended | 2026-05-21T19:50:32+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 184
- **Test file**: claim.spec.ts
- **Test file LOC**: 90
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_19-46-51_claim-office-lite-prose_v3-basic-tdd_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_19-46-51_claim-office-lite-prose_v3-basic-tdd_opus-4-7-portkey-no-thinking-2

 ✓ src/quote.spec.ts  (17 tests) 3ms
 ✓ src/claim.spec.ts  (7 tests) 3ms
 ✓ src/scenario.spec.ts  (4 tests) 3ms

 Test Files  3 passed (3)
      Tests  28 passed (28)
   Start at  19:50:33
   Duration  436ms (transform 45ms, setup 0ms, collect 53ms, tests 9ms, environment 0ms, prepare 132ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 60 | ×2 | 120 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 6 | ×5 | 30 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **548** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 148 |
| Functions | 10 |
| Longest Function | 23 lines |
| Avg LOC/Function | 10.20 |
| Median LOC/Function | 6.50 |
| Imports | 4 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **9** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.08 | 0 |
| Cognitive (SonarJS) | 7 | 2.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2808268 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 3.80s |
| Avg Red Phase | 1.22s |
| Avg Green Phase | 1.78s |
| Avg Refactor Phase | 0.8s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


