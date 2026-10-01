# Analysis Report: 2026-09-23_06-43-20_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

Generated: 2026-09-23T06:45:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 121s |
| Started | 2026-09-23T06:43:20+00:00 |
| Ended | 2026-09-23T06:45:24+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, items.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 222
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 294
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_06-43-20_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_06-43-20_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

 ✓ src/claim.spec.ts  (19 tests) 5ms
 ✓ src/premium.spec.ts  (17 tests) 5ms
 ✓ src/scenario.spec.ts  (6 tests) 6ms
 ✓ src/cli.spec.ts  (3 tests) 492ms

 Test Files  4 passed (4)
      Tests  45 passed (45)
   Start at  06:45:26
   Duration  1.47s (transform 93ms, setup 0ms, collect 135ms, tests 508ms, environment 1ms, prepare 306ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 107 | ×2 | 214 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 10 | ×5 | 50 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **748** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 189 |
| Functions | 14 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.64 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 6 | 2.73 | 0 |
| Cognitive (SonarJS) | 8 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1487781 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


