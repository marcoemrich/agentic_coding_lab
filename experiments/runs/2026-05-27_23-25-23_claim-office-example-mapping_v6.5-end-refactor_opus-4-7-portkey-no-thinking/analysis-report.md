# Analysis Report: 2026-05-27_23-25-23_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

Generated: 2026-05-28T00:19:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3231s |
| Started | 2026-05-27T23:25:23+00:00 |
| Ended | 2026-05-28T00:19:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 206
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 413
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-27_23-25-23_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-27_23-25-23_claim-office-example-mapping_v6.5-end-refactor_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 7ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  00:19:16
   Duration  197ms (transform 49ms, setup 0ms, collect 51ms, tests 7ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 75 | ×2 | 150 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 8 | ×5 | 40 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **774** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 175 |
| Functions | 27 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.41 |
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
| McCabe (Cyclomatic) | 3 | 1.45 | 0 |
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 34287125 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 110.90s |
| Avg Red Phase | 19.86s |
| Avg Green Phase | 27.16s |
| Avg Refactor Phase | 63.88s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 58 |
| Accuracy | 87% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 13 |


