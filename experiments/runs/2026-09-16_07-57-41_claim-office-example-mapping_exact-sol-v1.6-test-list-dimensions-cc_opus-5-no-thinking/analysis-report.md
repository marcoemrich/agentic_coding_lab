# Analysis Report: 2026-09-16_07-57-41_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-16T08:12:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 879s |
| Started | 2026-09-16T07:57:41+00:00 |
| Ended | 2026-09-16T08:12:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 284
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 912
- **Active tests**: 56
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (56 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_07-57-41_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_07-57-41_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (56 tests) 1358ms

 Test Files  1 passed (1)
      Tests  56 passed (56)
   Start at  08:12:24
   Duration  1.63s (transform 70ms, setup 0ms, collect 70ms, tests 1.36s, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **646** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 218 |
| Functions | 22 |
| Longest Function | 24 lines |
| Avg LOC/Function | 6.86 |
| Median LOC/Function | 5.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.69 | 0 |
| Cognitive (SonarJS) | 3 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15196195 |
| Context Utilization | 66% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 22.67s |
| Avg Red Phase | 20.3s |
| Avg Green Phase | 2.37s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 112 |
| Predictions Total | 112 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 46 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


