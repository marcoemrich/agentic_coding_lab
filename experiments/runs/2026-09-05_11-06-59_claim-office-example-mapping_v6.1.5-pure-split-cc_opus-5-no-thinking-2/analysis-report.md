# Analysis Report: 2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

Generated: 2026-09-05T11:47:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2441s |
| Started | 2026-09-05T11:06:59+00:00 |
| Ended | 2026-09-05T11:47:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 365
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 943
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (45 tests) 1619ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  11:47:47
   Duration  1.98s (transform 103ms, setup 0ms, collect 100ms, tests 1.62s, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **789** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 284 |
| Functions | 30 |
| Longest Function | 22 lines |
| Avg LOC/Function | 4.07 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 82864841 |
| Context Utilization | 168% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 93.71s |
| Avg Red Phase | 19.98s |
| Avg Green Phase | 17.68s |
| Avg Refactor Phase | 56.05s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 89 |
| Predictions Total | 90 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


