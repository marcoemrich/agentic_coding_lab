# Analysis Report: 2026-08-11_13-03-30_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-17T09:34:27+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 453s |
| Started | 2026-08-11T13:03:30+00:00 |
| Ended | 2026-08-11T13:11:05+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, policy.ts, premium.ts, rounding.ts, scenario.ts
- **Implementation LOC** (total): 342
- **Test file**: premium-rules.spec.ts
- **Test file LOC**: 77
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-11_13-03-30_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-11_13-03-30_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/premium.spec.ts  (7 tests) 5ms
 ✓ src/premium-rules.spec.ts  (13 tests) 8ms
 ✓ src/rounding-direction.spec.ts  (2 tests) 2ms
 ✓ src/claim.spec.ts  (17 tests) 10ms
 ✓ src/cli.spec.ts  (5 tests) 2240ms

 Test Files  5 passed (5)
      Tests  44 passed (44)
   Start at  09:34:28
   Duration  2.84s (transform 224ms, setup 1ms, collect 378ms, tests 2.27s, environment 1ms, prepare 1.11s)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 74% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **753** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 277 |
| Functions | 14 |
| Longest Function | 25 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 5.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 5 | 1.81 | 0 |
| Cognitive (SonarJS) | 5 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5719313 |
| Context Utilization | 39% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
| Avg Cycle Time | 41.73s |
| Avg Red Phase | 4.33s |
| Avg Green Phase | 8.59s |
| Avg Refactor Phase | 28.81s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


