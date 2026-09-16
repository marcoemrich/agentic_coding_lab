# Analysis Report: 2026-09-16_11-02-26_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

Generated: 2026-09-16T11:17:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6.1-naming-refactor-trial-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 917s |
| Started | 2026-09-16T11:02:26+00:00 |
| Ended | 2026-09-16T11:17:46+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 273
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 917
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_11-02-26_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_11-02-26_claim-office-example-mapping_exact-sol-v1.6.1-naming-refactor-trial-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (54 tests) 2067ms

 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  11:17:47
   Duration  2.37s (transform 82ms, setup 0ms, collect 86ms, tests 2.07s, environment 0ms, prepare 78ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **640** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 223 |
| Functions | 22 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.45 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 4 | 1.60 | 0 |
| Cognitive (SonarJS) | 3 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13085189 |
| Context Utilization | 65% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 14.20s |
| Avg Red Phase | 14.2s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 57 |
| Predictions Total | 58 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


