# Analysis Report: 2026-07-25_09-25-36_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b

Generated: 2026-07-25T20:38:32+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 426s |
| Started | 2026-07-25T09:25:36+00:00 |
| Ended | 2026-07-25T09:32:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 91
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 95
- **Active tests**: 1
- **Remaining todos**: 54

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_09-25-36_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b
> vitest run

sh: 1: vitest: not found
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 13 | ×1 | 13 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 1 | ×5 | 5 |
| Assignments | 21 | ×6 | 126 |
| **Total Mass** | | | **198** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 71 |
| Functions | 3 |
| Longest Function | 29 lines |
| Avg LOC/Function | 10.33 |
| Median LOC/Function | 1.00 |
| Imports | 1 |

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
| Total Tokens | 21568748 |
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


