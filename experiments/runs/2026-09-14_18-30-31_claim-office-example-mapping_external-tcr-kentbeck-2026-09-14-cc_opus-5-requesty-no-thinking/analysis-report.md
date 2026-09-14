# Analysis Report: 2026-09-14_18-30-31_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:34:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 246s |
| Started | 2026-09-14T18:30:31+00:00 |
| Ended | 2026-09-14T18:34:40+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, premium.ts, process.ts, scenario.ts
- **Implementation LOC** (total): 241
- **Test files**: catalog.spec.ts, claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 334
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-30-31_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-30-31_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (12 tests) 8ms
 ✓ src/premium.spec.ts  (12 tests) 5ms
 ✓ src/scenario.spec.ts  (6 tests) 4ms
Unknown item type: broomstick
Negative damage amount: -200
 ✓ src/cli.spec.ts  (4 tests) 1661ms
 ✓ src/catalog.spec.ts  (3 tests) 3ms

 Test Files  5 passed (5)
      Tests  37 passed (37)
   Start at  18:34:41
   Duration  2.99s (transform 138ms, setup 0ms, collect 162ms, tests 1.68s, environment 1ms, prepare 417ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 7 | ×5 | 35 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **644** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 206 |
| Functions | 12 |
| Longest Function | 22 lines |
| Avg LOC/Function | 9.17 |
| Median LOC/Function | 7.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 6 | 2.44 | 0 |
| Cognitive (SonarJS) | 8 | 3.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3171683 |
| Context Utilization | 31% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 6.76s |
| Avg Red Phase | 3.16s |
| Avg Green Phase | 3.6s |
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
| Tests Passed Immediately | 1 |


