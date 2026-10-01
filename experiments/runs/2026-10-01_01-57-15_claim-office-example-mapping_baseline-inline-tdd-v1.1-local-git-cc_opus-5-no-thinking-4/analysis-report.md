# Analysis Report: 2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-4

Generated: 2026-10-01T02:04:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 433s |
| Started | 2026-10-01T01:57:15+00:00 |
| Ended | 2026-10-01T02:04:33+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 275
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 348
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-4

 ✓ src/claim.spec.ts  (17 tests) 6ms
 ✓ src/premium.spec.ts  (16 tests) 6ms
 ✓ src/cli.spec.ts  (4 tests) 1946ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms

 Test Files  4 passed (4)
      Tests  41 passed (41)
   Start at  02:04:34
   Duration  2.84s (transform 95ms, setup 0ms, collect 112ms, tests 1.96s, environment 1ms, prepare 279ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **704** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 227 |
| Functions | 17 |
| Longest Function | 25 lines |
| Avg LOC/Function | 7.41 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.81 | 0 |
| Cognitive (SonarJS) | 5 | 2.30 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5070369 |
| Context Utilization | 39% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
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


