# Analysis Report: 2026-07-24_15-50-57_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

Generated: 2026-07-25T20:24:44+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1954s |
| Started | 2026-07-24T15:50:57+00:00 |
| Ended | 2026-07-24T16:23:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 305
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 421
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_15-50-57_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_15-50-57_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 6ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  20:24:45
   Duration  343ms (transform 36ms, setup 0ms, collect 37ms, tests 6ms, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 88 | ×2 | 176 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 108 | ×6 | 648 |
| **Total Mass** | | | **1012** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 262 |
| Functions | 27 |
| Longest Function | 19 lines |
| Avg LOC/Function | 4.26 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.63 | 0 |
| Cognitive (SonarJS) | 4 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15156237 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


