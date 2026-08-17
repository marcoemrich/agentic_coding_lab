# Analysis Report: 2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-2

Generated: 2026-08-17T10:33:31+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 301s |
| Started | 2026-08-17T06:39:23+00:00 |
| Ended | 2026-08-17T06:44:26+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, node-shims.d.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 428
- **Test file**: premium.spec.ts
- **Test file LOC**: 140
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking-2

 ✓ src/scenario.spec.ts  (6 tests) 2ms
 ✓ src/claim.spec.ts  (19 tests) 3ms
 ✓ src/premium.spec.ts  (21 tests) 4ms

 Test Files  3 passed (3)
      Tests  46 passed (46)
   Start at  10:33:32
   Duration  360ms (transform 79ms, setup 0ms, collect 109ms, tests 9ms, environment 0ms, prepare 251ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 130 | ×2 | 260 |
| Conditionals | 21 | ×4 | 84 |
| Loops | 15 | ×5 | 75 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **987** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 340 |
| Functions | 19 |
| Longest Function | 28 lines |
| Avg LOC/Function | 10.42 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 7 | 2.19 | 0 |
| Cognitive (SonarJS) | 10 | 3.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4017954 |
| Context Utilization | 36% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 46.07s |
| Avg Red Phase | 0s |
| Avg Green Phase | 3.87s |
| Avg Refactor Phase | 42.2s |

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
| Tests Passed Immediately | 0 |


