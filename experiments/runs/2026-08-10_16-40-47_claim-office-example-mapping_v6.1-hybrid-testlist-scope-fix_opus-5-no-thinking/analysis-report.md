# Analysis Report: 2026-08-10_16-40-47_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

Generated: 2026-08-10T17:35:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3256s |
| Started | 2026-08-10T16:40:47+00:00 |
| Ended | 2026-08-10T17:35:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 417
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 826
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-10_16-40-47_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-10_16-40-47_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 10ms
 ✓ src/cli.spec.ts  (2 tests) 604ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  17:35:04
   Duration  952ms (transform 56ms, setup 0ms, collect 73ms, tests 614ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 86 | ×1 | 86 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 17 | ×5 | 85 |
| Assignments | 103 | ×6 | 618 |
| **Total Mass** | | | **999** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 333 |
| Functions | 27 |
| Longest Function | 18 lines |
| Avg LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 3 | 1.27 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 107931232 |
| Context Utilization | 189% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 126.00s |
| Avg Red Phase | 22.75s |
| Avg Green Phase | 31.33s |
| Avg Refactor Phase | 71.92s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 105 |
| Predictions Total | 105 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 31 |


