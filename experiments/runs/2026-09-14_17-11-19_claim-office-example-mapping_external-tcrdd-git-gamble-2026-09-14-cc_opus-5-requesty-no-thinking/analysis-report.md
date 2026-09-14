# Analysis Report: 2026-09-14_17-11-19_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T17:22:10+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 645s |
| Started | 2026-09-14T17:11:19+00:00 |
| Ended | 2026-09-14T17:22:10+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 250
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 193
- **Active tests**: 21
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (21 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/premium.spec.ts  (11 tests) 5ms
 ✓ src/claim.spec.ts  (8 tests) 4ms
 ✓ src/cli.spec.ts  (1 test) 563ms
 ✓ src/scenario.spec.ts  (1 test) 3ms

 Test Files  4 passed (4)
      Tests  21 passed (21)
   Start at  17:22:11
   Duration  1.53s (transform 78ms, setup 1ms, collect 110ms, tests 575ms, environment 1ms, prepare 296ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 7 | ×5 | 35 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **647** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 218 |
| Functions | 13 |
| Longest Function | 28 lines |
| Avg LOC/Function | 8.92 |
| Median LOC/Function | 7.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 6 | 2.24 | 0 |
| Cognitive (SonarJS) | 7 | 2.30 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12466054 |
| Context Utilization | 48% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 9.77s |
| Avg Red Phase | 3.71s |
| Avg Green Phase | 6.06s |
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
| Tests Passed Immediately | 7 |


