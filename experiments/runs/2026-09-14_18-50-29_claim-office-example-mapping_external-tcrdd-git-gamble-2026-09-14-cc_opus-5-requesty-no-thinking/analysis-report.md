# Analysis Report: 2026-09-14_18-50-29_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T19:02:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 706s |
| Started | 2026-09-14T18:50:29+00:00 |
| Ended | 2026-09-14T19:02:18+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 216
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 272
- **Active tests**: 22
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_18-50-29_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_18-50-29_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-cc_opus-5-requesty-no-thinking

 ✓ src/claim.spec.ts  (9 tests) 5ms
 ✓ src/premium.spec.ts  (11 tests) 4ms
 ✓ src/cli.spec.ts  (1 test) 489ms
 ✓ src/scenario.spec.ts  (1 test) 2ms

 Test Files  4 passed (4)
      Tests  22 passed (22)
   Start at  19:02:19
   Duration  1.35s (transform 68ms, setup 0ms, collect 87ms, tests 500ms, environment 1ms, prepare 279ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 11 | ×5 | 55 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **666** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 186 |
| Functions | 8 |
| Longest Function | 28 lines |
| Avg LOC/Function | 10.62 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 6 | 2.40 | 0 |
| Cognitive (SonarJS) | 8 | 2.78 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14156283 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 27 |
| Avg Cycle Time | 8.58s |
| Avg Red Phase | 4.45s |
| Avg Green Phase | 4.13s |
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
| Tests Passed Immediately | 6 |


