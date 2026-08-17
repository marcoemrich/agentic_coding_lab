# Analysis Report: 2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-5

Generated: 2026-08-17T10:34:03+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 365s |
| Started | 2026-08-17T06:39:23+00:00 |
| Ended | 2026-08-17T06:45:30+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 437
- **Test file**: premium.spec.ts
- **Test file LOC**: 169
- **Active tests**: 20
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (47 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-5

 ✓ src/premium.spec.ts  (20 tests) 4ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms
 ✓ src/claim.spec.ts  (18 tests) 4ms
 ✓ src/cli.spec.ts  (6 tests) 921ms

 Test Files  4 passed (4)
      Tests  47 passed (47)
   Start at  10:34:04
   Duration  1.28s (transform 90ms, setup 0ms, collect 139ms, tests 932ms, environment 1ms, prepare 319ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 136 | ×2 | 272 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 16 | ×5 | 80 |
| Assignments | 74 | ×6 | 444 |
| **Total Mass** | | | **967** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 357 |
| Functions | 16 |
| Longest Function | 27 lines |
| Avg LOC/Function | 9.75 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 7 | 2.28 | 0 |
| Cognitive (SonarJS) | 7 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4602782 |
| Context Utilization | 41% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 17.70s |
| Avg Red Phase | 3.08s |
| Avg Green Phase | 14.62s |
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


