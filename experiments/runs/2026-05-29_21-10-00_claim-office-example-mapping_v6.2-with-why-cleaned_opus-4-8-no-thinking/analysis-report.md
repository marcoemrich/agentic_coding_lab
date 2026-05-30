# Analysis Report: 2026-05-29_21-10-00_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

Generated: 2026-05-29T22:17:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 4056s |
| Started | 2026-05-29T21:10:00+00:00 |
| Ended | 2026-05-29T22:17:37+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 347
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 686
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_21-10-00_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_21-10-00_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (45 tests) 7ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  22:17:37
   Duration  174ms (transform 44ms, setup 0ms, collect 43ms, tests 7ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 11 | ×5 | 55 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **884** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 243 |
| Functions | 28 |
| Longest Function | 23 lines |
| Avg LOC/Function | 4.68 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.36 | 0 |
| Cognitive (SonarJS) | 3 | 1.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 112785023 |
| Context Utilization | 207% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 104.36s |
| Avg Red Phase | 20.56s |
| Avg Green Phase | 26.53s |
| Avg Refactor Phase | 57.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 89 |
| Predictions Total | 90 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


