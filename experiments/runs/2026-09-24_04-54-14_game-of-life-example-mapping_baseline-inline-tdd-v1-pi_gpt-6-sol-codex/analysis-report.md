# Analysis Report: 2026-09-24_04-54-14_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-24T04:57:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 171s |
| Started | 2026-09-24T04:54:15+00:00 |
| Ended | 2026-09-24T04:57:09+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 34
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 60
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-54-14_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-54-14_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

 ✓ src/game-of-life.spec.ts  (10 tests) 4ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  04:57:10
   Duration  267ms (transform 55ms, setup 0ms, collect 46ms, tests 4ms, environment 0ms, prepare 82ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 8 | ×1 | 8 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 18 | ×6 | 108 |
| **Total Mass** | | | **189** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 29 |
| Functions | 2 |
| Longest Function | 23 lines |
| Avg LOC/Function | 12.50 |
| Median LOC/Function | 12.50 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 9 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 278813 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


