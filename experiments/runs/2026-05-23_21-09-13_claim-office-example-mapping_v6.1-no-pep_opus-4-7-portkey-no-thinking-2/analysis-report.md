# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-23T21:38:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-pep |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1731s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:38:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 201
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 548
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-pep_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (44 tests) 8ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  21:38:07
   Duration  217ms (transform 55ms, setup 0ms, collect 54ms, tests 8ms, environment 0ms, prepare 54ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 11 | ×5 | 55 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **850** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 168 |
| Functions | 28 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.79 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.50 | 0 |
| Cognitive (SonarJS) | 4 | 1.24 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35001079 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 20 |
| Avg Cycle Time | 118.09s |
| Avg Red Phase | 24.33s |
| Avg Green Phase | 19.34s |
| Avg Refactor Phase | 74.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 41 |
| Predictions Total | 41 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 8 |


