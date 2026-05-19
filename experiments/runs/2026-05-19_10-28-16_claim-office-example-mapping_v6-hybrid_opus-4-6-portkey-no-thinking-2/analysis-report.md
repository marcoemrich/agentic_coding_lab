# Analysis Report: 2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T11:15:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2852s |
| Started | 2026-05-19T10:28:16+00:00 |
| Ended | 2026-05-19T11:15:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 151
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 659
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_10-28-16_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (36 tests) 7ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  11:15:51
   Duration  222ms (transform 49ms, setup 0ms, collect 51ms, tests 7ms, environment 0ms, prepare 59ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **637** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 128 |
| Functions | 12 |
| Longest Function | 23 lines |
| Avg LOC/Function | 6.92 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 11 | 3.78 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 485555 |
| Context Utilization | 22% |

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


