# Analysis Report: 2026-08-10_15-31-15_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

Generated: 2026-08-10T15:36:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 307s |
| Started | 2026-08-10T15:31:15+00:00 |
| Ended | 2026-08-10T15:36:23+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, premium.ts, scenario.ts, types.ts
- **Implementation LOC** (total): 342
- **Test file**: premium.spec.ts
- **Test file LOC**: 113
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-31-15_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-31-15_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking

 ✓ src/claim.spec.ts  (20 tests) 5ms
 ✓ src/premium.spec.ts  (18 tests) 4ms
 ✓ src/cli.spec.ts  (5 tests) 547ms
 ✓ src/scenario.spec.ts  (5 tests) 3ms

 Test Files  4 passed (4)
      Tests  48 passed (48)
   Start at  15:36:24
   Duration  1.17s (transform 56ms, setup 0ms, collect 75ms, tests 559ms, environment 0ms, prepare 201ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 112 | ×2 | 224 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 20 | ×5 | 100 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **871** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 285 |
| Functions | 16 |
| Longest Function | 25 lines |
| Avg LOC/Function | 7.44 |
| Median LOC/Function | 5.00 |
| Imports | 11 |

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
| McCabe (Cyclomatic) | 7 | 2.85 | 0 |
| Cognitive (SonarJS) | 9 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4033660 |
| Context Utilization | 37% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 30.84s |
| Avg Red Phase | 4.56s |
| Avg Green Phase | 14.71s |
| Avg Refactor Phase | 11.57s |

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


