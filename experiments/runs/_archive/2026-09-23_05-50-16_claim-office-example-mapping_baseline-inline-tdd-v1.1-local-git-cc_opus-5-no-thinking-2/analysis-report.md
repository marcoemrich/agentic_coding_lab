# Analysis Report: 2026-09-23_05-50-16_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2

Generated: 2026-09-23T05:54:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 259s |
| Started | 2026-09-23T05:50:17+00:00 |
| Ended | 2026-09-23T05:54:39+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 268
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 431
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-50-16_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-50-16_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-2

 ✓ src/claim.spec.ts  (14 tests) 6ms
 ✓ src/scenario.spec.ts  (9 tests) 5ms
 ✓ src/premium.spec.ts  (22 tests) 7ms
 ✓ src/cli.spec.ts  (3 tests) 1494ms

 Test Files  4 passed (4)
      Tests  48 passed (48)
   Start at  05:54:40
   Duration  2.40s (transform 84ms, setup 0ms, collect 110ms, tests 1.51s, environment 1ms, prepare 296ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 10 | ×5 | 50 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **684** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 12 |
| Longest Function | 30 lines |
| Avg LOC/Function | 8.42 |
| Median LOC/Function | 6.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 6 | 2.39 | 0 |
| Cognitive (SonarJS) | 6 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3336086 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 27 |
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


