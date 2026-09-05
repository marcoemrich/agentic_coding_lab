# Analysis Report: 2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-3

Generated: 2026-09-05T12:02:45+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3342s |
| Started | 2026-09-05T11:07:00+00:00 |
| Ended | 2026-09-05T12:02:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 319
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 817
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (48 tests) 1077ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  12:02:46
   Duration  1.38s (transform 103ms, setup 0ms, collect 94ms, tests 1.08s, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 64 | ×6 | 384 |
| **Total Mass** | | | **712** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 208 |
| Functions | 22 |
| Longest Function | 23 lines |
| Avg LOC/Function | 4.68 |
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
| McCabe (Cyclomatic) | 4 | 1.53 | 0 |
| Cognitive (SonarJS) | 4 | 1.91 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 85356963 |
| Context Utilization | 167% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 127.23s |
| Avg Red Phase | 20.06s |
| Avg Green Phase | 25.38s |
| Avg Refactor Phase | 81.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 98 |
| Predictions Total | 98 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


