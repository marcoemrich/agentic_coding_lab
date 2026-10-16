# Analysis Report: 2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking-3

Generated: 2026-10-15T09:16:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1116s |
| Started | 2026-10-15T08:58:09+00:00 |
| Ended | 2026-10-15T09:16:49+00:00 |

## Code Metrics

- **Implementation files**: amounts.ts, claimOffice.ts, claims.ts, cli.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 204
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 263
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking-3

 ✓ src/claimOffice.spec.ts  (48 tests) 981ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  09:16:50
   Duration  1.27s (transform 93ms, setup 0ms, collect 83ms, tests 981ms, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **681** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 157 |
| Functions | 26 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.19 |
| Median LOC/Function | 4.00 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 3 | 1.61 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28741601 |
| Context Utilization | 78% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 10.08s |
| Avg Red Phase | 10.08s |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


