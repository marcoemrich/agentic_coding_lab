# Analysis Report: 2026-09-23_06-45-41_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

Generated: 2026-09-23T06:48:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 137s |
| Started | 2026-09-23T06:45:41+00:00 |
| Ended | 2026-09-23T06:48:01+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 239
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts
- **Test LOC** (total): 232
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_06-45-41_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_06-45-41_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

 ✓ src/claim.spec.ts  (15 tests) 5ms
 ✓ src/premium.spec.ts  (14 tests) 5ms
 ✓ src/cli.spec.ts  (7 tests) 1511ms

 Test Files  3 passed (3)
      Tests  36 passed (36)
   Start at  06:48:02
   Duration  2.19s (transform 80ms, setup 1ms, collect 102ms, tests 1.52s, environment 0ms, prepare 206ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 11 | ×5 | 55 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **784** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 200 |
| Functions | 12 |
| Longest Function | 21 lines |
| Avg LOC/Function | 8.67 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 10 | 2.36 | 0 |
| Cognitive (SonarJS) | 9 | 2.57 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1482759 |
| Context Utilization | 27% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
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


