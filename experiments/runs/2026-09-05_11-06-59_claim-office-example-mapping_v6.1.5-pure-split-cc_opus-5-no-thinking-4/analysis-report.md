# Analysis Report: 2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-4

Generated: 2026-09-05T11:47:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2445s |
| Started | 2026-09-05T11:07:00+00:00 |
| Ended | 2026-09-05T11:47:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 277
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 663
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-4

 ✓ src/claim-office.spec.ts  (42 tests) 1806ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  11:47:50
   Duration  2.18s (transform 101ms, setup 0ms, collect 104ms, tests 1.81s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **728** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 208 |
| Functions | 27 |
| Longest Function | 18 lines |
| Avg LOC/Function | 3.52 |
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
| McCabe (Cyclomatic) | 3 | 1.43 | 0 |
| Cognitive (SonarJS) | 2 | 1.45 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 80038724 |
| Context Utilization | 167% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 94.65s |
| Avg Red Phase | 20.81s |
| Avg Green Phase | 21.63s |
| Avg Refactor Phase | 52.21s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 82 |
| Predictions Total | 82 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 21 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


