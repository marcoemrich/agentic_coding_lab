# Analysis Report: 2026-05-30_05-27-45_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking

Generated: 2026-05-30T06:28:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-end-refactor |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3642s |
| Started | 2026-05-30T05:27:45+00:00 |
| Ended | 2026-05-30T06:28:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 259
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 509
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-30_05-27-45_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-30_05-27-45_claim-office-example-mapping_v6.5-end-refactor_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 357ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  06:28:29
   Duration  543ms (transform 52ms, setup 0ms, collect 53ms, tests 357ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **833** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 212 |
| Functions | 33 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.21 |
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
| McCabe (Cyclomatic) | 3 | 1.44 | 0 |
| Cognitive (SonarJS) | 2 | 1.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 88060526 |
| Context Utilization | 180% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 99.49s |
| Avg Red Phase | 22.42s |
| Avg Green Phase | 24.31s |
| Avg Refactor Phase | 52.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 80 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


