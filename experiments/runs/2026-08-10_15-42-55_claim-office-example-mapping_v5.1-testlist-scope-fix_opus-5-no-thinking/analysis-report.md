# Analysis Report: 2026-08-10_15-42-55_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T16:20:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5.1-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2246s |
| Started | 2026-08-10T15:42:55+00:00 |
| Ended | 2026-08-10T16:20:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 347
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 490
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_15-42-55_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_15-42-55_claim-office-example-mapping_v5.1-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 596ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  16:20:23
   Duration  774ms (transform 40ms, setup 0ms, collect 44ms, tests 596ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 117 | ×2 | 234 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 14 | ×5 | 70 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **770** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 271 |
| Functions | 26 |
| Longest Function | 23 lines |
| Avg LOC/Function | 5.73 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.40 | 0 |
| Cognitive (SonarJS) | 5 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 157449550 |
| Context Utilization | 239% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 74.08s |
| Avg Red Phase | 23.89s |
| Avg Green Phase | 23.68s |
| Avg Refactor Phase | 26.51s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 77 |
| Predictions Total | 78 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


