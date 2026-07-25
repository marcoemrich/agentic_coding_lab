# Analysis Report: 2026-07-25_12-02-24_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b

Generated: 2026-07-25T14:38:28+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 376s |
| Started | 2026-07-25T12:02:24+00:00 |
| Ended | 2026-07-25T12:08:41+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 48
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 30
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@1.0.0 test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_12-02-24_game-of-life-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b
> vitest run

sh: 1: vitest: not found
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 22 | ×1 | 22 |
| Invocations | 26 | ×2 | 52 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 10 | ×5 | 50 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **220** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 1 |
| Longest Function | 49 lines |
| Avg LOC/Function | 49.00 |
| Median LOC/Function | 49.00 |
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
| Total Tokens | 3764215 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


