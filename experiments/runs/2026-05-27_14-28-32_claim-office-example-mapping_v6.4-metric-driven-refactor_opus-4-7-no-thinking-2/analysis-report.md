# Analysis Report: 2026-05-27_14-28-32_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking-2

Generated: 2026-05-27T15:29:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-metric-driven-refactor |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3627s |
| Started | 2026-05-27T14:28:32+00:00 |
| Ended | 2026-05-27T15:29:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 245
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 521
- **Active tests**: 40
- **Remaining todos**: 5

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_14-28-32_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_14-28-32_claim-office-example-mapping_v6.4-metric-driven-refactor_opus-4-7-no-thinking-2

 ✓ src/claim-office.spec.ts  (45 tests | 5 skipped) 9ms
 ✓ src/cli.spec.ts  (2 tests) 717ms

 Test Files  2 passed (2)
      Tests  42 passed | 5 todo (47)
   Start at  15:29:01
   Duration  1.02s (transform 44ms, setup 0ms, collect 50ms, tests 726ms, environment 0ms, prepare 88ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 78 | ×6 | 468 |
| **Total Mass** | | | **746** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 203 |
| Functions | 26 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.58 |
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
| McCabe (Cyclomatic) | 2 | 1.35 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 80885778 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 142.72s |
| Avg Red Phase | 24.96s |
| Avg Green Phase | 26.81s |
| Avg Refactor Phase | 90.95s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 61 |
| Predictions Total | 78 |
| Accuracy | 78% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


