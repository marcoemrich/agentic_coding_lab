# Analysis Report: 2026-07-25_03-54-30_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

Generated: 2026-07-25T20:36:07+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | glm-5-2 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3214s |
| Started | 2026-07-25T03:54:30+00:00 |
| Ended | 2026-07-25T04:48:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 212
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 320
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-54-30_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-54-30_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

 ✓ src/claim-office.spec.ts  (37 tests) 387ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  20:36:15
   Duration  886ms (transform 48ms, setup 0ms, collect 55ms, tests 387ms, environment 0ms, prepare 182ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 13 | ×5 | 65 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **824** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 186 |
| Functions | 18 |
| Longest Function | 29 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 4.50 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 4 | 1.81 | 0 |
| Cognitive (SonarJS) | 5 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3470550 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


