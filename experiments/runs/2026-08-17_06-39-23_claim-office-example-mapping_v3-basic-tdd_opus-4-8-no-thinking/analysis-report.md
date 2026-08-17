# Analysis Report: 2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking

Generated: 2026-08-17T10:33:17+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 460s |
| Started | 2026-08-17T06:39:23+00:00 |
| Ended | 2026-08-17T06:47:05+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, pricing.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 494
- **Test file**: premium.spec.ts
- **Test file LOC**: 147
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-08-17_06-39-23_claim-office-example-mapping_v3-basic-tdd_opus-4-8-no-thinking

 ✓ src/premium.spec.ts  (18 tests) 4ms
 ✓ src/scenario.spec.ts  (6 tests) 4ms
 ✓ src/claim.spec.ts  (19 tests) 5ms
 ✓ src/cli.spec.ts  (5 tests) 1686ms

 Test Files  4 passed (4)
      Tests  48 passed (48)
   Start at  10:33:18
   Duration  2.12s (transform 114ms, setup 0ms, collect 196ms, tests 1.70s, environment 1ms, prepare 351ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 84 | ×1 | 84 |
| Invocations | 152 | ×2 | 304 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 13 | ×5 | 65 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **1039** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 410 |
| Functions | 19 |
| Longest Function | 30 lines |
| Avg LOC/Function | 8.16 |
| Median LOC/Function | 7.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 6 | 1.92 | 0 |
| Cognitive (SonarJS) | 8 | 2.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5638478 |
| Context Utilization | 42% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 25.01s |
| Avg Red Phase | 5.51s |
| Avg Green Phase | 17.97s |
| Avg Refactor Phase | 1.53s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


