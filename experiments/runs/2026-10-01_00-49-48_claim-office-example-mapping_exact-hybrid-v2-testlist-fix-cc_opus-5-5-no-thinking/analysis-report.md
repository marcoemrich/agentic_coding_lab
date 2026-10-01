# Analysis Report: 2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:09:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1186s |
| Started | 2026-10-01T00:49:48+00:00 |
| Ended | 2026-10-01T01:09:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 260
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 294
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 312ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  01:09:40
   Duration  632ms (transform 73ms, setup 0ms, collect 76ms, tests 312ms, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 77 | ×6 | 462 |
| **Total Mass** | | | **722** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 29 |
| Longest Function | 4 lines |
| Avg LOC/Function | 2.14 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.29 | 0 |
| Cognitive (SonarJS) | 2 | 1.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 54880774 |
| Context Utilization | 123% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 38.12s |
| Avg Red Phase | 7.06s |
| Avg Green Phase | 9.28s |
| Avg Refactor Phase | 21.78s |

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
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


