# Analysis Report: 2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-3

Generated: 2026-07-24T16:04:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8 |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 2375s |
| Started | 2026-07-24T15:24:24+00:00 |
| Ended | 2026-07-24T16:04:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 257
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 316
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_15-24-24_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-3

 ✓ src/claim-office.spec.ts  (40 tests) 6ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  16:04:02
   Duration  168ms (transform 42ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 9 | ×5 | 45 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **848** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 183 |
| Functions | 26 |
| Longest Function | 25 lines |
| Avg LOC/Function | 4.62 |
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
| McCabe (Cyclomatic) | 3 | 1.54 | 0 |
| Cognitive (SonarJS) | 3 | 1.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2159286 |
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
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 27 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


