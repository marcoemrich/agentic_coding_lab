# Analysis Report: 2026-05-21_10-49-45_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking

Generated: 2026-05-21T10:56:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 387s |
| Started | 2026-05-21T10:49:45+00:00 |
| Ended | 2026-05-21T10:56:13+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, engine.ts, pricing.ts, quote.ts
- **Implementation LOC** (total): 340
- **Test file**: engine.spec.ts
- **Test file LOC**: 465
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (70 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_10-49-45_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_10-49-45_claim-office-example-mapping_v3-basic-tdd_opus-4-6-portkey-no-thinking

 ✓ src/engine.spec.ts  (21 tests) 2082ms
 ✓ src/claim.spec.ts  (17 tests) 4ms
 ✓ src/quote.spec.ts  (16 tests) 3ms
 ✓ src/pricing.spec.ts  (16 tests) 2ms

 Test Files  4 passed (4)
      Tests  70 passed (70)
   Start at  10:56:14
   Duration  2.65s (transform 58ms, setup 0ms, collect 76ms, tests 2.09s, environment 0ms, prepare 165ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 102 | ×2 | 204 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 17 | ×5 | 85 |
| Assignments | 75 | ×6 | 450 |
| **Total Mass** | | | **913** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 268 |
| Functions | 12 |
| Longest Function | 55 lines |
| Avg LOC/Function | 14.83 |
| Median LOC/Function | 6.50 |
| Imports | 10 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 3.93 | 0 |
| Cognitive (SonarJS) | 14 | 5.90 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2931347 |
| Context Utilization | 34% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 10.04s |
| Avg Red Phase | 1.31s |
| Avg Green Phase | 3.2s |
| Avg Refactor Phase | 5.53s |

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


