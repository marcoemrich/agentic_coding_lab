# Analysis Report: 2026-05-26_01-20-40_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

Generated: 2026-05-26T02:25:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 3900s |
| Started | 2026-05-26T01:20:40+00:00 |
| Ended | 2026-05-26T02:25:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 318
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 442
- **Active tests**: 23
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (23 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-26_01-20-40_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-26_01-20-40_claim-office-example-mapping_v6.2-with-why-cleaned-oc_opus-4-7-portkey

 ✓ src/claim-office.spec.ts  (23 tests) 260ms

 Test Files  1 passed (1)
      Tests  23 passed (23)
   Start at  02:25:43
   Duration  625ms (transform 86ms, setup 0ms, collect 86ms, tests 260ms, environment 0ms, prepare 88ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 108 | ×2 | 216 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 113 | ×6 | 678 |
| **Total Mass** | | | **1051** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 247 |
| Functions | 36 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 1.42 | 0 |
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48030774 |
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
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


