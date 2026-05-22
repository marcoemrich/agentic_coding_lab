# Analysis Report: 2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking-2

Generated: 2026-05-21T23:45:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-lite-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3018s |
| Started | 2026-05-21T22:55:29+00:00 |
| Ended | 2026-05-21T23:45:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 206
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 441
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_22-55-29_claim-office-lite-example-mapping_v4.1-testlist-scope-fix_opus-4-7-portkey-no-thinking-2

 ✓ src/claim-office.spec.ts  (37 tests) 877ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  23:45:50
   Duration  1.05s (transform 40ms, setup 0ms, collect 40ms, tests 877ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 9 | ×5 | 45 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **605** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 180 |
| Functions | 20 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.85 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 1.75 | 0 |
| Cognitive (SonarJS) | 4 | 1.83 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19968233 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 97.79s |
| Avg Red Phase | 37.4s |
| Avg Green Phase | 22.97s |
| Avg Refactor Phase | 37.42s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 45 |
| Predictions Total | 46 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 23 |


