# Analysis Report: 2026-05-18_10-53-09_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking

Generated: 2026-05-18T11:06:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 783s |
| Started | 2026-05-18T10:53:09+00:00 |
| Ended | 2026-05-18T11:06:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 58
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 142
- **Active tests**: 7
- **Remaining todos**: 24

## Test Results

**Status**: ✅ All tests passing (7 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_10-53-09_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_10-53-09_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (31 tests | 24 skipped) 3ms

 Test Files  1 passed (1)
      Tests  7 passed | 24 todo (31)
   Start at  11:06:14
   Duration  177ms (transform 29ms, setup 0ms, collect 28ms, tests 3ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 63% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 17 | ×1 | 17 |
| Invocations | 24 | ×2 | 48 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 3 | ×5 | 15 |
| Assignments | 26 | ×6 | 156 |
| **Total Mass** | | | **244** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 8 |
| Longest Function | 7 lines |
| Avg LOC/Function | 3.62 |
| Median LOC/Function | 2.50 |
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
| McCabe (Cyclomatic) | 2 | 1.33 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 353159 |
| Context Utilization | 5% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


