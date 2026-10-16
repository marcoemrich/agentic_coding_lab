# Analysis Report: 2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking

Generated: 2026-10-15T09:17:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1175s |
| Started | 2026-10-15T08:58:09+00:00 |
| Ended | 2026-10-15T09:17:48+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, claimOffice.ts, cli.ts, premium.ts, priceList.ts
- **Implementation LOC** (total): 226
- **Test files**: claimOffice.spec.ts
- **Test LOC** (total): 258
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-15_08-58-09_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (47 tests) 610ms

 Test Files  1 passed (1)
      Tests  47 passed (47)
   Start at  09:17:49
   Duration  939ms (transform 90ms, setup 0ms, collect 78ms, tests 610ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **612** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 22 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.55 |
| Median LOC/Function | 3.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 3 | 1.42 | 0 |
| Cognitive (SonarJS) | 2 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31973005 |
| Context Utilization | 80% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 12.84s |
| Avg Red Phase | 12.84s |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


