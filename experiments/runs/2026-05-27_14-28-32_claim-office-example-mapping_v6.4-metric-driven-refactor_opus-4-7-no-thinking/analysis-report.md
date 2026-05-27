# Analysis Report: 2026-05-27_14-28-32_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking

Generated: 2026-05-27T17:01:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 9197s |
| Started | 2026-05-27T14:28:32+00:00 |
| Ended | 2026-05-27T17:01:51+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 224
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 571
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_14-28-32_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_14-28-32_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 6ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  17:01:52
   Duration  176ms (transform 43ms, setup 0ms, collect 44ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 10 | ×5 | 50 |
| Assignments | 101 | ×6 | 606 |
| **Total Mass** | | | **876** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 184 |
| Functions | 23 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.22 |
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
| McCabe (Cyclomatic) | 2 | 1.23 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 127606173 |
| Context Utilization | 43% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 217.49s |
| Avg Red Phase | 95.71s |
| Avg Green Phase | 16.61s |
| Avg Refactor Phase | 105.17s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 62 |
| Predictions Total | 84 |
| Accuracy | 73% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


