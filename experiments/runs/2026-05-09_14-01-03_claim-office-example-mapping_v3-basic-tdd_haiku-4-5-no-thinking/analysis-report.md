# Analysis Report: 2026-05-09_14-01-03_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

Generated: 2026-05-10T14:57:11+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001, <synthetic> |
| Thinking | unknown |
| Duration | 51s |
| Started | 2026-05-09T14:01:03+00:00 |
| Ended | 2026-05-09T14:01:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.test.ts
- **Implementation LOC** (total): 561
- **Tests**: Not found

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-01-03_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-01-03_claim-office-example-mapping_v3-basic-tdd_haiku-4-5-no-thinking

include: src/**/*.spec.ts
exclude:  **/node_modules/**, **/dist/**, **/cypress/**, **/.{idea,git,cache,output,temp}/**, **/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*
watch exclude:  **/node_modules/**, **/dist/**

No test files found, exiting with code 1
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 568 | ×1 | 568 |
| Invocations | 202 | ×2 | 404 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 24 | ×5 | 120 |
| Assignments | 129 | ×6 | 774 |
| **Total Mass** | | | **1878** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 492 |
| Functions | 1 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2.00 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| Total Tokens | 614456 |
| Context Utilization | 20% |

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
| Tests Passed Immediately | 1 |


