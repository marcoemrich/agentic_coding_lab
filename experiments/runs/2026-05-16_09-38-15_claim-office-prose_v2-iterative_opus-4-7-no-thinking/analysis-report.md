# Analysis Report: 2026-05-16_09-38-15_claim-office-prose_v2-iterative_opus-4-7-no-thinking

Generated: 2026-05-16T09:42:17+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v2-iterative |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 241s |
| Started | 2026-05-16T09:38:15+00:00 |
| Ended | 2026-05-16T09:42:17+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, pricing.ts, quote.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 344
- **Test file**: claim.spec.ts
- **Test file LOC**: 92
- **Active tests**: 7
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_09-38-15_claim-office-prose_v2-iterative_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_09-38-15_claim-office-prose_v2-iterative_opus-4-7-no-thinking

 ✓ src/quote.spec.ts  (14 tests) 3ms
 ✓ src/claim.spec.ts  (7 tests) 3ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms

 Test Files  3 passed (3)
      Tests  24 passed (24)
   Start at  09:42:18
   Duration  448ms (transform 42ms, setup 0ms, collect 59ms, tests 9ms, environment 0ms, prepare 140ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 91 | ×1 | 91 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 18 | ×5 | 90 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **823** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 278 |
| Functions | 14 |
| Longest Function | 36 lines |
| Avg LOC/Function | 12.43 |
| Median LOC/Function | 9.00 |
| Imports | 10 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 2.78 | 1 |
| Cognitive (SonarJS) | 18 | 4.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2244291 |
| Context Utilization | 6% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 60.29s |
| Avg Red Phase | 28.73s |
| Avg Green Phase | 31.56s |
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


