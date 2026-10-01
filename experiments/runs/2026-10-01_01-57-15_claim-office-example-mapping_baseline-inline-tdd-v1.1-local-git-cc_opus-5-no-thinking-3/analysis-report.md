# Analysis Report: 2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-3

Generated: 2026-10-01T02:02:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 307s |
| Started | 2026-10-01T01:57:15+00:00 |
| Ended | 2026-10-01T02:02:27+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 315
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 426
- **Active tests**: 47
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking-3

 ✓ src/premium.spec.ts  (22 tests) 5ms
 ✓ src/claim.spec.ts  (14 tests) 23ms
 ✓ src/cli.spec.ts  (5 tests) 3248ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms
 ✓ src/policy.spec.ts  (13 tests) 5ms

 Test Files  5 passed (5)
      Tests  58 passed (58)
   Start at  02:02:28
   Duration  4.80s (transform 119ms, setup 0ms, collect 165ms, tests 3.29s, environment 1ms, prepare 490ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 92 | ×2 | 184 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 11 | ×5 | 55 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **752** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 250 |
| Functions | 17 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.06 |
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
| McCabe (Cyclomatic) | 7 | 2.22 | 0 |
| Cognitive (SonarJS) | 8 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3261978 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
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


