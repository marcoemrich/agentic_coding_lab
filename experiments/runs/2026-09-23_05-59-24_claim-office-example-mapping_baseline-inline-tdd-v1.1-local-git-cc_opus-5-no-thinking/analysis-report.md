# Analysis Report: 2026-09-23_05-59-24_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-23T06:03:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 266s |
| Started | 2026-09-23T05:59:24+00:00 |
| Ended | 2026-09-23T06:03:52+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 305
- **Test files**: claim.spec.ts, cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 465
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (53 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-59-24_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-59-24_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/claim.spec.ts  (15 tests) 7ms
 ✓ src/cli.spec.ts  (6 tests) 987ms
 ✓ src/premium.spec.ts  (22 tests) 4ms
 ✓ src/scenario.spec.ts  (5 tests) 4ms
 ✓ src/policy.spec.ts  (5 tests) 3ms

 Test Files  5 passed (5)
      Tests  53 passed (53)
   Start at  06:03:53
   Duration  2.18s (transform 104ms, setup 0ms, collect 148ms, tests 1.00s, environment 1ms, prepare 383ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 85 | ×2 | 170 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 11 | ×5 | 55 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **647** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 255 |
| Functions | 19 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.32 |
| Median LOC/Function | 6.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 4 | 1.96 | 0 |
| Cognitive (SonarJS) | 3 | 1.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3623061 |
| Context Utilization | 35% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
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


