# Analysis Report: 2026-09-16_07-36-50_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

Generated: 2026-09-16T07:57:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1222s |
| Started | 2026-09-16T07:36:51+00:00 |
| Ended | 2026-09-16T07:57:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 308
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 698
- **Active tests**: 66
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (66 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_07-36-50_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_07-36-50_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (66 tests) 1876ms

 Test Files  1 passed (1)
      Tests  66 passed (66)
   Start at  07:57:16
   Duration  2.16s (transform 91ms, setup 0ms, collect 88ms, tests 1.88s, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **714** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 254 |
| Functions | 29 |
| Longest Function | 22 lines |
| Avg LOC/Function | 5.59 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.61 | 0 |
| Cognitive (SonarJS) | 3 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 23981089 |
| Context Utilization | 82% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 16.91s |
| Avg Red Phase | 16.91s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 131 |
| Predictions Total | 133 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 66 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


