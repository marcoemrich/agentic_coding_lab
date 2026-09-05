# Analysis Report: 2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2

Generated: 2026-09-04T23:02:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2648s |
| Started | 2026-09-04T22:18:15+00:00 |
| Ended | 2026-09-04T23:02:26+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 319
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 790
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-04_22-18-15_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking-2

 ✓ src/claim-office.spec.ts  (50 tests) 1072ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  23:02:27
   Duration  1.40s (transform 92ms, setup 0ms, collect 96ms, tests 1.07s, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **809** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 240 |
| Functions | 36 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.33 |
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
| McCabe (Cyclomatic) | 3 | 1.30 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 89848219 |
| Context Utilization | 169% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 92.16s |
| Avg Red Phase | 15.88s |
| Avg Green Phase | 14.63s |
| Avg Refactor Phase | 61.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 100 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


