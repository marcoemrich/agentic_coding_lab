# Analysis Report: 2026-05-29_20-38-57_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

Generated: 2026-05-29T21:09:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 1846s |
| Started | 2026-05-29T20:38:57+00:00 |
| Ended | 2026-05-29T21:09:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 252
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 197
- **Active tests**: 24
- **Remaining todos**: 13

## Test Results

**Status**: ✅ All tests passing (24 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_20-38-57_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_20-38-57_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests | 13 skipped) 5ms

 Test Files  1 passed (1)
      Tests  24 passed | 13 todo (37)
   Start at  21:09:44
   Duration  164ms (transform 32ms, setup 0ms, collect 31ms, tests 5ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 65 | ×2 | 130 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 12 | ×5 | 60 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **722** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 20 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.80 |
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
| McCabe (Cyclomatic) | 3 | 1.57 | 0 |
| Cognitive (SonarJS) | 2 | 1.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38381692 |
| Context Utilization | 124% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 96.53s |
| Avg Red Phase | 22.33s |
| Avg Green Phase | 23.18s |
| Avg Refactor Phase | 51.02s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 48 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


