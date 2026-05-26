# Analysis Report: 2026-05-26_01-22-21_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

Generated: 2026-05-26T02:05:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 2616s |
| Started | 2026-05-26T01:22:21+00:00 |
| Ended | 2026-05-26T02:05:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 263
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 544
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_01-22-21_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_01-22-21_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

 ✓ src/claim-office.spec.ts  (41 tests) 13ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  02:06:00
   Duration  422ms (transform 106ms, setup 0ms, collect 112ms, tests 13ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 10 | ×5 | 50 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **931** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 222 |
| Functions | 27 |
| Longest Function | 20 lines |
| Avg LOC/Function | 4.37 |
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
| McCabe (Cyclomatic) | 3 | 1.28 | 0 |
| Cognitive (SonarJS) | 3 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 37742156 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


