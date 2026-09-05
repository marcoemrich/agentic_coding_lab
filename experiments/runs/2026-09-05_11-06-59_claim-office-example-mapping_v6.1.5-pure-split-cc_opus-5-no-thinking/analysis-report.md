# Analysis Report: 2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

Generated: 2026-09-05T12:10:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1.5-pure-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3781s |
| Started | 2026-09-05T11:06:59+00:00 |
| Ended | 2026-09-05T12:10:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 524
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 987
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_11-06-59_claim-office-example-mapping_v6.1.5-pure-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 9ms
 ✓ src/cli.spec.ts  (6 tests) 2736ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  12:10:06
   Duration  3.23s (transform 86ms, setup 0ms, collect 97ms, tests 2.75s, environment 0ms, prepare 134ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 72 | ×1 | 72 |
| Invocations | 103 | ×2 | 206 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 13 | ×5 | 65 |
| Assignments | 122 | ×6 | 732 |
| **Total Mass** | | | **1139** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 356 |
| Functions | 31 |
| Longest Function | 23 lines |
| Avg LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 5 | 1.48 | 0 |
| Cognitive (SonarJS) | 4 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 125266000 |
| Context Utilization | 239% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 133.24s |
| Avg Red Phase | 27.07s |
| Avg Green Phase | 32.52s |
| Avg Refactor Phase | 73.65s |

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
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


