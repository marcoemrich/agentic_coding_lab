# Analysis Report: 2026-10-01_03-10-16_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

Generated: 2026-10-01T03:27:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1053s |
| Started | 2026-10-01T03:10:16+00:00 |
| Ended | 2026-10-01T03:27:52+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, claims.ts, cli.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 223
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 278
- **Active tests**: 49
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (49 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_03-10-16_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_03-10-16_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (44 tests) 10ms
 ✓ src/cli.spec.ts  (5 tests) 2410ms

 Test Files  2 passed (2)
      Tests  49 passed (49)
   Start at  03:27:53
   Duration  2.93s (transform 117ms, setup 0ms, collect 125ms, tests 2.42s, environment 0ms, prepare 131ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 57 | ×6 | 342 |
| **Total Mass** | | | **692** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 179 |
| Functions | 26 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.08 |
| Median LOC/Function | 3.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 3 | 1.49 | 0 |
| Cognitive (SonarJS) | 2 | 1.21 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26339913 |
| Context Utilization | 71% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 11.15s |
| Avg Red Phase | 9.91s |
| Avg Green Phase | 1.24s |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


