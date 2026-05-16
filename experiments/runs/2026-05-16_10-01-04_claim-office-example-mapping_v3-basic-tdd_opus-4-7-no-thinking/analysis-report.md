# Analysis Report: 2026-05-16_10-01-04_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

Generated: 2026-05-16T10:07:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 381s |
| Started | 2026-05-16T10:01:04+00:00 |
| Ended | 2026-05-16T10:07:26+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 358
- **Test file**: premium.spec.ts
- **Test file LOC**: 130
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-16_10-01-04_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-16_10-01-04_claim-office-example-mapping_v3-basic-tdd_opus-4-7-no-thinking

 ✓ src/claim.spec.ts  (12 tests) 4ms
 ✓ src/premium.spec.ts  (17 tests) 4ms
 ✓ src/cli.spec.ts  (3 tests) 1048ms
 ✓ src/scenario.spec.ts  (2 tests) 3ms

 Test Files  4 passed (4)
      Tests  34 passed (34)
   Start at  10:07:27
   Duration  1.61s (transform 51ms, setup 0ms, collect 71ms, tests 1.06s, environment 0ms, prepare 167ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 100 | ×1 | 100 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 16 | ×5 | 80 |
| Assignments | 76 | ×6 | 456 |
| **Total Mass** | | | **950** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 277 |
| Functions | 15 |
| Longest Function | 63 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 7.00 |
| Imports | 6 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 17 | 2.78 | 1 |
| Cognitive (SonarJS) | 19 | 4.08 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3310398 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 10.31s |
| Avg Red Phase | 2.97s |
| Avg Green Phase | 7.34s |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


