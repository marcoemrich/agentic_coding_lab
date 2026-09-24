# Analysis Report: 2026-09-24_04-55-09_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-24T04:56:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | baseline-inline-tdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 94s |
| Started | 2026-09-24T04:55:10+00:00 |
| Ended | 2026-09-24T04:56:48+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 23
- **Test files**: game-of-life.spec.ts
- **Test LOC** (total): 70
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-55-09_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-55-09_game-of-life-example-mapping_baseline-inline-tdd-v1-pi_gpt-6-sol-codex

 ✓ src/game-of-life.spec.ts  (10 tests) 14ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  04:56:49
   Duration  326ms (transform 50ms, setup 0ms, collect 54ms, tests 14ms, environment 0ms, prepare 94ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 5 | ×5 | 25 |
| Assignments | 11 | ×6 | 66 |
| **Total Mass** | | | **142** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 20 |
| Functions | 1 |
| Longest Function | 21 lines |
| Avg LOC/Function | 21.00 |
| Median LOC/Function | 21.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.00 | 0 |
| Cognitive (SonarJS) | 16 | 9.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 128904 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
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


