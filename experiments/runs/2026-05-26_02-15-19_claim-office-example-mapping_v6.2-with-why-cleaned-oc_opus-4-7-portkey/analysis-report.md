# Analysis Report: 2026-05-26_02-15-19_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

Generated: 2026-05-26T02:51:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 2139s |
| Started | 2026-05-26T02:15:20+00:00 |
| Ended | 2026-05-26T02:51:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 264
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 368
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_02-15-19_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_02-15-19_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

 ✓ src/claim-office.spec.ts  (37 tests) 13ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  02:51:02
   Duration  373ms (transform 99ms, setup 0ms, collect 112ms, tests 13ms, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 95 | ×2 | 190 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 106 | ×6 | 636 |
| **Total Mass** | | | **1001** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 214 |
| Functions | 33 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.24 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.46 | 0 |
| Cognitive (SonarJS) | 4 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31745580 |
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
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


