# Analysis Report: 2026-05-19_18-19-31_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T18:48:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6-hybrid |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1712s |
| Started | 2026-05-19T18:19:31+00:00 |
| Ended | 2026-05-19T18:48:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 116
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 294
- **Active tests**: 19
- **Remaining todos**: 19

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_18-19-31_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_18-19-31_claim-office-example-mapping_v6-hybrid_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests | 19 skipped) 4ms

 Test Files  1 passed (1)
      Tests  19 passed | 19 todo (38)
   Start at  18:48:05
   Duration  163ms (transform 35ms, setup 0ms, collect 33ms, tests 4ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 5 | ×5 | 25 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **410** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 97 |
| Functions | 7 |
| Longest Function | 27 lines |
| Avg LOC/Function | 7.14 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 4 | 1.83 | 0 |
| Cognitive (SonarJS) | 4 | 2.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 377985 |
| Context Utilization | 19% |

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


