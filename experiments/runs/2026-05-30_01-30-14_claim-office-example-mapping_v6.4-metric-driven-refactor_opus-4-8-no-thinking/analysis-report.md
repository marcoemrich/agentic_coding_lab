# Analysis Report: 2026-05-30_01-30-14_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T02:27:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3439s |
| Started | 2026-05-30T01:30:14+00:00 |
| Ended | 2026-05-30T02:27:34+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 237
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 689
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_01-30-14_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_01-30-14_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 440ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  02:27:34
   Duration  611ms (transform 45ms, setup 0ms, collect 44ms, tests 440ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 11 | ×5 | 55 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **816** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 196 |
| Functions | 28 |
| Longest Function | 16 lines |
| Avg LOC/Function | 3.93 |
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
| McCabe (Cyclomatic) | 4 | 1.38 | 0 |
| Cognitive (SonarJS) | 4 | 1.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 97225575 |
| Context Utilization | 195% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 106.75s |
| Avg Red Phase | 23.11s |
| Avg Green Phase | 26.37s |
| Avg Refactor Phase | 57.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 89 |
| Predictions Total | 89 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 31 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


