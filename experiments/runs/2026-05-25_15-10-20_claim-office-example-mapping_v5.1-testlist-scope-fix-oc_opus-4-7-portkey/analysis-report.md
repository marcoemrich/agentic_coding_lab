# Analysis Report: 2026-05-25_15-10-20_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey

Generated: 2026-05-25T15:23:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix-oc |
| Model | opus-4-7-portkey |
| Model Version(s) | N/A |
| Thinking | true |
| Duration | 769s |
| Started | 2026-05-25T15:10:20+00:00 |
| Ended | 2026-05-25T15:23:11+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts
- **Implementation LOC** (total): 305
- **Test file**: cli.spec.ts
- **Test file LOC**: 149
- **Active tests**: 10
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_15-10-20_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_15-10-20_claim-office-example-mapping_v5.1-testlist-scope-fix-oc_opus-4-7-portkey

 ✓ src/quote.spec.ts  (21 tests) 3ms
 ✓ src/claim.spec.ts  (17 tests) 4ms
 ✓ src/cli.spec.ts  (10 tests) 1118ms

 Test Files  3 passed (3)
      Tests  48 passed (48)
   Start at  15:23:11
   Duration  1.56s (transform 50ms, setup 0ms, collect 69ms, tests 1.13s, environment 0ms, prepare 125ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 94 | ×2 | 188 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **797** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 265 |
| Functions | 17 |
| Longest Function | 31 lines |
| Avg LOC/Function | 10.47 |
| Median LOC/Function | 9.00 |
| Imports | 3 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.16 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10691586 |
| Context Utilization | 0% |

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
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


