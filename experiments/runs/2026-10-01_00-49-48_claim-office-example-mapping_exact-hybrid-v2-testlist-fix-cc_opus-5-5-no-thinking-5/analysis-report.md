# Analysis Report: 2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-5

Generated: 2026-10-01T01:09:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1150s |
| Started | 2026-10-01T00:49:48+00:00 |
| Ended | 2026-10-01T01:09:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 191
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 294
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-5

 ✓ src/claim-office.spec.ts  (42 tests) 321ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  01:09:04
   Duration  630ms (transform 78ms, setup 0ms, collect 82ms, tests 321ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 2 | ×5 | 10 |
| Assignments | 85 | ×6 | 510 |
| **Total Mass** | | | **741** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 25 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.04 |
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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 2 | 1.11 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48796895 |
| Context Utilization | 124% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 39.13s |
| Avg Red Phase | 7.16s |
| Avg Green Phase | 11.72s |
| Avg Refactor Phase | 20.25s |

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
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


