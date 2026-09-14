# Analysis Report: 2026-09-14_18-40-12_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:44:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 256s |
| Started | 2026-09-14T18:40:12+00:00 |
| Ended | 2026-09-14T18:44:31+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 256
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 339
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-40-12_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-40-12_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (15 tests) 8ms
 ✓ src/premium.spec.ts  (13 tests) 7ms
 ✓ src/cli.spec.ts  (3 tests) 1491ms
 ✓ src/scenario.spec.ts  (4 tests) 4ms

 Test Files  4 passed (4)
      Tests  35 passed (35)
   Start at  18:44:32
   Duration  2.55s (transform 138ms, setup 0ms, collect 153ms, tests 1.51s, environment 1ms, prepare 313ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 98 | ×2 | 196 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 9 | ×5 | 45 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **747** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 222 |
| Functions | 16 |
| Longest Function | 25 lines |
| Avg LOC/Function | 8.75 |
| Median LOC/Function | 6.50 |
| Imports | 5 |

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
| McCabe (Cyclomatic) | 6 | 2.50 | 0 |
| Cognitive (SonarJS) | 8 | 3.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3637713 |
| Context Utilization | 32% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 7.64s |
| Avg Red Phase | 2.37s |
| Avg Green Phase | 5.27s |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


