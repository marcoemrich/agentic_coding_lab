# Analysis Report: 2026-09-23_14-07-48_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-23T15:21:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4413s |
| Started | 2026-09-23T14:07:48+00:00 |
| Ended | 2026-09-23T15:21:24+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, component-block.ts, insured-item.ts, mhpcos-favor.ts, price-list.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 473
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts
- **Test LOC** (total): 499
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_14-07-48_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_14-07-48_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

 ✓ src/quote.spec.ts  (27 tests) 5ms
 ✓ src/claim.spec.ts  (16 tests) 5ms
 ✓ src/cli.spec.ts  (7 tests) 3600ms

 Test Files  3 passed (3)
      Tests  50 passed (50)
   Start at  15:21:26
   Duration  4.44s (transform 111ms, setup 1ms, collect 134ms, tests 3.61s, environment 1ms, prepare 253ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 78% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 83 | ×1 | 83 |
| Invocations | 129 | ×2 | 258 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 30 | ×5 | 150 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **961** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 330 |
| Functions | 36 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.72 |
| Median LOC/Function | 3.50 |
| Imports | 17 |

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
| McCabe (Cyclomatic) | 5 | 1.36 | 0 |
| Cognitive (SonarJS) | 5 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36283602 |
| Context Utilization | 118% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 88.23s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 88.23s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 89 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 34 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


