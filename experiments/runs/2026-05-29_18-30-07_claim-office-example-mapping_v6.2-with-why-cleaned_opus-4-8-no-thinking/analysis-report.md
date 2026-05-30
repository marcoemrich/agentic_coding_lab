# Analysis Report: 2026-05-29_18-30-07_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

Generated: 2026-05-29T19:33:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-8-no-thinking |
| Model Version(s) | claude-opus-4-8 |
| Thinking | unknown |
| Duration | 3775s |
| Started | 2026-05-29T18:30:07+00:00 |
| Ended | 2026-05-29T19:33:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 360
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 405
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-29_18-30-07_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-29_18-30-07_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 6ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  19:33:04
   Duration  201ms (transform 49ms, setup 0ms, collect 50ms, tests 6ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 72% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 109 | ×2 | 218 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 23 | ×5 | 115 |
| Assignments | 84 | ×6 | 504 |
| **Total Mass** | | | **958** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 256 |
| Functions | 28 |
| Longest Function | 31 lines |
| Avg LOC/Function | 4.68 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 4 | 1.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 103809264 |
| Context Utilization | 205% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 100.80s |
| Avg Red Phase | 20.03s |
| Avg Green Phase | 24.73s |
| Avg Refactor Phase | 56.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


