# Analysis Report: 2026-05-27_03-39-46_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking

Generated: 2026-05-27T05:03:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 5000s |
| Started | 2026-05-27T03:39:46+00:00 |
| Ended | 2026-05-27T05:03:07+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 310
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 655
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_03-39-46_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_03-39-46_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 11ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  05:03:08
   Duration  184ms (transform 48ms, setup 0ms, collect 50ms, tests 11ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 83 | ×2 | 166 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 13 | ×5 | 65 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **819** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 261 |
| Functions | 30 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.03 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 4 | 1.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 106637536 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 132.50s |
| Avg Red Phase | 22.29s |
| Avg Green Phase | 21.56s |
| Avg Refactor Phase | 88.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 76 |
| Predictions Total | 76 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


