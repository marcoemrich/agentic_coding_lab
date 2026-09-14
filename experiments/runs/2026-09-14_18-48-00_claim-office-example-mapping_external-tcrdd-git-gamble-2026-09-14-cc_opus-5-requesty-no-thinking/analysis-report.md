# Analysis Report: 2026-09-14_18-48-00_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:58:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 600s |
| Started | 2026-09-14T18:48:00+00:00 |
| Ended | 2026-09-14T18:58:03+00:00 |

## Code Metrics

- **Implementation files**: cli-core.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 221
- **Test files**: cli-core.spec.ts, cli.spec.ts, scenario.spec.ts
- **Test LOC** (total): 286
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-48-00_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-48-00_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/scenario.spec.ts  (15 tests) 6ms
 ✓ src/cli.spec.ts  (1 test) 169ms
 ✓ src/cli-core.spec.ts  (1 test) 3ms

 Test Files  3 passed (3)
      Tests  17 passed (17)
   Start at  18:58:04
   Duration  895ms (transform 70ms, setup 0ms, collect 90ms, tests 178ms, environment 0ms, prepare 232ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **575** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 185 |
| Functions | 8 |
| Longest Function | 25 lines |
| Avg LOC/Function | 14.50 |
| Median LOC/Function | 14.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 6 | 2.67 | 0 |
| Cognitive (SonarJS) | 8 | 3.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14817528 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 24 |
| Avg Cycle Time | 10.73s |
| Avg Red Phase | 3.6s |
| Avg Green Phase | 5.6s |
| Avg Refactor Phase | 1.53s |

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
| Tests Passed Immediately | 7 |


