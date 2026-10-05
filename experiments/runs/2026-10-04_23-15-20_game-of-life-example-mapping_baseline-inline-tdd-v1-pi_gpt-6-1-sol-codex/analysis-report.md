# Analysis Report: 2026-10-04_23-15-20_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex

Generated: 2026-10-04T23:18:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 209s |
| Started | 2026-10-04T23:15:21+00:00 |
| Ended | 2026-10-04T23:18:52+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 27
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 91
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-15-20_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-15-20_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-1-sol-codex

 ✓ src/game-of-life.spec.ts  (24 tests) 6ms

 Test Files  1 passed (1)
      Tests  24 passed (24)
   Start at  23:18:53
   Duration  266ms (transform 57ms, setup 1ms, collect 43ms, tests 6ms, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 12 | ×1 | 12 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 9 | ×6 | 54 |
| **Total Mass** | | | **143** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 23 |
| Functions | 1 |
| Longest Function | 25 lines |
| Avg LOC/Function | 25.00 |
| Median LOC/Function | 25.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 6.00 | 1 |
| Cognitive (SonarJS) | 17 | 17.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 282959 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


