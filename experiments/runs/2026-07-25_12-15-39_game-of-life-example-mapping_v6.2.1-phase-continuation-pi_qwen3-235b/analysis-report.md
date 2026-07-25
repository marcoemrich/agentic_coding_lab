# Analysis Report: 2026-07-25_12-15-39_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b

Generated: 2026-07-25T20:20:28+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 758s |
| Started | 2026-07-25T12:15:39+00:00 |
| Ended | 2026-07-25T12:28:19+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts, setupTest.ts
- **Implementation LOC** (total): 57
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 44
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@1.0.0 test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_12-15-39_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b
> vitest run

sh: 1: vitest: not found
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 37 | ×1 | 37 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 13 | ×5 | 65 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **238** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 2 |
| Longest Function | 53 lines |
| Avg LOC/Function | 28.00 |
| Median LOC/Function | 28.00 |
| Imports | 0 |

## Code Smells

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 0 | 0 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5113355 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 15 |
| Predictions Total | 20 |
| Accuracy | 75% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


