# Analysis Report: 2026-09-04_14-08-47_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

Generated: 2026-09-04T15:29:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.4-continuation-guard-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4860s |
| Started | 2026-09-04T14:08:47+00:00 |
| Ended | 2026-09-04T15:29:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 505
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 913
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_14-08-47_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_14-08-47_claim-office-example-mapping_v6.1.4-continuation-guard-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (48 tests) 1491ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  15:29:50
   Duration  1.82s (transform 92ms, setup 0ms, collect 96ms, tests 1.49s, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 107 | ×6 | 642 |
| **Total Mass** | | | **1041** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 273 |
| Functions | 38 |
| Longest Function | 16 lines |
| Avg LOC/Function | 3.08 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.48 | 0 |
| Cognitive (SonarJS) | 2 | 1.24 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 155677876 |
| Context Utilization | 242% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 115.38s |
| Avg Red Phase | 23.49s |
| Avg Green Phase | 27.51s |
| Avg Refactor Phase | 64.38s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 94 |
| Predictions Total | 97 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 47 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 24 |


