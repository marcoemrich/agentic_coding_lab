# Analysis Report: 2026-07-25_04-54-56_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

Generated: 2026-07-25T20:38:11+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-terra |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 355s |
| Started | 2026-07-25T04:54:56+00:00 |
| Ended | 2026-07-25T05:00:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 101
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 55
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-54-56_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra
> vitest run

sh: 1: vitest: not found
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 4 | ×5 | 20 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **516** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 93 |
| Functions | 7 |
| Longest Function | 19 lines |
| Avg LOC/Function | 9.14 |
| Median LOC/Function | 6.00 |
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
| Total Tokens | 1485822 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 30 |
| Accuracy | 0% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


