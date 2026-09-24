# Analysis Report: 2026-09-23_15-31-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-23T16:44:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4412s |
| Started | 2026-09-23T15:31:09+00:00 |
| Ended | 2026-09-23T16:44:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, item-catalog.ts, premium.ts, rounding.ts, settlement.ts
- **Implementation LOC** (total): 537
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 359
- **Active tests**: 53
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_15-31-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_15-31-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (53 tests) 2362ms

 Test Files  1 passed (1)
      Tests  53 passed (53)
   Start at  16:44:44
   Duration  2.72s (transform 108ms, setup 0ms, collect 118ms, tests 2.36s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 73 | ×1 | 73 |
| Invocations | 125 | ×2 | 250 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 32 | ×5 | 160 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **929** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 417 |
| Functions | 37 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.62 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.31 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36618495 |
| Context Utilization | 111% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 75.40s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 75.4s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 86 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 43 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


