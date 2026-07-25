# Analysis Report: 2026-07-25_19-51-19_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

Generated: 2026-07-25T20:24:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-8-requesty |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 1978s |
| Started | 2026-07-25T19:51:19+00:00 |
| Ended | 2026-07-25T20:24:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 282
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 269
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_19-51-19_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_19-51-19_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-8-requesty

 ✓ src/claim-office.spec.ts  (37 tests) 5ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  20:24:20
   Duration  177ms (transform 36ms, setup 0ms, collect 37ms, tests 5ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 70% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 89 | ×2 | 178 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 103 | ×6 | 618 |
| **Total Mass** | | | **968** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 238 |
| Functions | 22 |
| Longest Function | 30 lines |
| Avg LOC/Function | 6.68 |
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
| McCabe (Cyclomatic) | 6 | 1.67 | 0 |
| Cognitive (SonarJS) | 7 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 29497372 |
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
| Predictions Correct | 72 |
| Predictions Total | 72 |
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


