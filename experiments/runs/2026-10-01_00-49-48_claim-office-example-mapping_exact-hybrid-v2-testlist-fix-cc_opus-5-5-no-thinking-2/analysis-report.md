# Analysis Report: 2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-2

Generated: 2026-10-01T01:05:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2-testlist-fix-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 950s |
| Started | 2026-10-01T00:49:48+00:00 |
| Ended | 2026-10-01T01:05:43+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 196
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 345
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_00-49-48_claim-office-example-mapping_exact-hybrid-v2-testlist-fix-cc_opus-5-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (41 tests) 12ms
 ✓ src/cli.spec.ts  (3 tests) 590ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  01:05:44
   Duration  1.16s (transform 76ms, setup 0ms, collect 85ms, tests 602ms, environment 0ms, prepare 161ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **731** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 153 |
| Functions | 23 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.26 |
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
| McCabe (Cyclomatic) | 3 | 1.43 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 42741828 |
| Context Utilization | 107% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 30 |
| Avg Cycle Time | 47.84s |
| Avg Red Phase | 9.7s |
| Avg Green Phase | 12.12s |
| Avg Refactor Phase | 26.02s |

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
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


