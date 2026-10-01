# Analysis Report: 2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-3

Generated: 2026-10-01T01:11:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1292s |
| Started | 2026-10-01T00:49:48+00:00 |
| Ended | 2026-10-01T01:11:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-env.d.ts
- **Implementation LOC** (total): 280
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 340
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (42 tests) 347ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  01:11:27
   Duration  638ms (transform 78ms, setup 0ms, collect 78ms, tests 347ms, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 89 | ×6 | 534 |
| **Total Mass** | | | **843** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 232 |
| Functions | 31 |
| Longest Function | 16 lines |
| Avg LOC/Function | 2.94 |
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
| McCabe (Cyclomatic) | 4 | 1.45 | 0 |
| Cognitive (SonarJS) | 4 | 1.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 54911185 |
| Context Utilization | 127% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 44.65s |
| Avg Red Phase | 8.43s |
| Avg Green Phase | 12.83s |
| Avg Refactor Phase | 23.39s |

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
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


