# Analysis Report: 2026-08-10_08-24-25_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

Generated: 2026-08-10T08:43:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix-pi |
| Model | gpt-5-6-sol |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1153s |
| Started | 2026-08-10T08:24:25+00:00 |
| Ended | 2026-08-10T08:43:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 116
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 136
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_08-24-25_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_08-24-25_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix-pi_gpt-5-6-sol

 ✓ src/claim-office.spec.ts  (29 tests) 5ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  08:43:40
   Duration  175ms (transform 33ms, setup 1ms, collect 36ms, tests 5ms, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 40 | ×2 | 80 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **450** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 106 |
| Functions | 5 |
| Longest Function | 21 lines |
| Avg LOC/Function | 11.20 |
| Median LOC/Function | 13.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 16 |
| Code Quality | 0 |
| **Total** | **16** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.58 | 0 |
| Cognitive (SonarJS) | 4 | 2.10 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5047610 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


