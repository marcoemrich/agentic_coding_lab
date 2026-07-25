# Analysis Report: 2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-5

Generated: 2026-07-25T12:59:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8 |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 1575s |
| Started | 2026-07-24T15:24:24+00:00 |
| Ended | 2026-07-24T15:50:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 257
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 329
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-5

 ✓ src/claim-office.spec.ts  (41 tests) 8ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  12:59:05
   Duration  408ms (transform 35ms, setup 0ms, collect 34ms, tests 8ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 9 | ×5 | 45 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **747** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 216 |
| Functions | 25 |
| Longest Function | 25 lines |
| Avg LOC/Function | 5.40 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.53 | 0 |
| Cognitive (SonarJS) | 3 | 1.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12279587 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 81 |
| Predictions Total | 82 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


