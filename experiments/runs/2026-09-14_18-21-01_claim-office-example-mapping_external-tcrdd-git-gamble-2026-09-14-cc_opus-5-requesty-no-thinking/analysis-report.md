# Analysis Report: 2026-09-14_18-21-01_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T18:34:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 788s |
| Started | 2026-09-14T18:21:01+00:00 |
| Ended | 2026-09-14T18:34:13+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 237
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 275
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-21-01_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-21-01_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 6ms
 ✓ src/cli.spec.ts  (1 test) 637ms

 Test Files  2 passed (2)
      Tests  17 passed (17)
   Start at  18:34:14
   Duration  1.40s (transform 141ms, setup 0ms, collect 92ms, tests 643ms, environment 0ms, prepare 272ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **555** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 199 |
| Functions | 10 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.80 |
| Median LOC/Function | 6.50 |
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
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 5 | 2.57 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 18103900 |
| Context Utilization | 65% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 9.61s |
| Avg Red Phase | 4s |
| Avg Green Phase | 5.61s |
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


