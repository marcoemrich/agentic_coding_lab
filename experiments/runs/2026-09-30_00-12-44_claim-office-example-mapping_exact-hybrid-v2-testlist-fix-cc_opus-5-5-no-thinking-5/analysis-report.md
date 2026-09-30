# Analysis Report: 2026-09-30_00-12-44_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-5

Generated: 2026-09-30T00:41:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1698s |
| Started | 2026-09-30T00:12:44+00:00 |
| Ended | 2026-09-30T00:41:09+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 190
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 271
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-12-44_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-12-44_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-5

 ✓ src/claim-office.spec.ts  (46 tests) 321ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  00:41:10
   Duration  613ms (transform 65ms, setup 0ms, collect 79ms, tests 321ms, environment 0ms, prepare 64ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 66 | ×2 | 132 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 4 | ×5 | 20 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **655** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 148 |
| Functions | 22 |
| Longest Function | 14 lines |
| Avg LOC/Function | 3.59 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 3 | 1.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 52833923 |
| Context Utilization | 132% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 52.28s |
| Avg Red Phase | 10.49s |
| Avg Green Phase | 13.76s |
| Avg Refactor Phase | 28.03s |

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
| Tests Passed Immediately | 18 |


