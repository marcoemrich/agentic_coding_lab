# Analysis Report: 2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-10-01T02:02:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 295s |
| Started | 2026-10-01T01:57:15+00:00 |
| Ended | 2026-10-01T02:02:15+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 240
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 410
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-57-15_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/quote.spec.ts  (30 tests) 8ms
 ✓ src/claim.spec.ts  (13 tests) 5ms
 ✓ src/cli.spec.ts  (5 tests) 817ms
 ✓ src/scenario.spec.ts  (3 tests) 3ms

 Test Files  4 passed (4)
      Tests  51 passed (51)
   Start at  02:02:16
   Duration  1.87s (transform 146ms, setup 1ms, collect 156ms, tests 833ms, environment 1ms, prepare 303ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 11 | ×5 | 55 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **712** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 198 |
| Functions | 17 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.59 |
| Median LOC/Function | 5.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 4 | 1.81 | 0 |
| Cognitive (SonarJS) | 3 | 1.85 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3072484 |
| Context Utilization | 35% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


