# Analysis Report: 2026-07-25_09-32-54_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b

Generated: 2026-07-25T13:12:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 734s |
| Started | 2026-07-25T09:32:54+00:00 |
| Ended | 2026-07-25T09:45:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 113
- **Tests**: Not found

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> @ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_09-32-54_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b
> vitest run

sh: 1: vitest: not found
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 9 | ×5 | 45 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **308** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 86 |
| Functions | 4 |
| Longest Function | 36 lines |
| Avg LOC/Function | 21.00 |
| Median LOC/Function | 20.00 |
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
| Total Tokens | 2924806 |
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
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


