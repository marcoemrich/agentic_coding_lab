# Analysis Report: 2026-09-14_17-11-19_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T17:24:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 759s |
| Started | 2026-09-14T17:11:19+00:00 |
| Ended | 2026-09-14T17:24:03+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, quote.ts, scenario.ts
- **Implementation LOC** (total): 245
- **Test files**: claim.spec.ts, cli.spec.ts, quote.spec.ts, scenario.spec.ts
- **Test LOC** (total): 208
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (10 tests) 8ms
 ✓ src/quote.spec.ts  (16 tests) 5ms
 ✓ src/cli.spec.ts  (3 tests) 1101ms
 ✓ src/scenario.spec.ts  (2 tests) 3ms

 Test Files  4 passed (4)
      Tests  31 passed (31)
   Start at  17:24:04
   Duration  2.15s (transform 99ms, setup 0ms, collect 141ms, tests 1.12s, environment 1ms, prepare 311ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 55 | ×6 | 330 |
| **Total Mass** | | | **633** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 212 |
| Functions | 12 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.00 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 2.79 | 0 |
| Cognitive (SonarJS) | 5 | 2.70 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18048692 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 8.42s |
| Avg Red Phase | 2.06s |
| Avg Green Phase | 2.19s |
| Avg Refactor Phase | 4.17s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


