# Analysis Report: 2026-09-23_05-54-11_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

Generated: 2026-09-23T05:59:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 319s |
| Started | 2026-09-23T05:54:11+00:00 |
| Ended | 2026-09-23T05:59:33+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claim.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 373
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 465
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_05-54-11_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_05-54-11_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-no-thinking

 ✓ src/claim.spec.ts  (20 tests) 6ms
 ✓ src/premium.spec.ts  (21 tests) 5ms
 ✓ src/scenario.spec.ts  (9 tests) 5ms
 ✓ src/cli.spec.ts  (7 tests) 1040ms

 Test Files  4 passed (4)
      Tests  57 passed (57)
   Start at  05:59:34
   Duration  1.94s (transform 101ms, setup 0ms, collect 137ms, tests 1.06s, environment 1ms, prepare 271ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 84 | ×1 | 84 |
| Invocations | 117 | ×2 | 234 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 16 | ×5 | 80 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **860** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 303 |
| Functions | 14 |
| Longest Function | 19 lines |
| Avg LOC/Function | 10.14 |
| Median LOC/Function | 8.00 |
| Imports | 10 |

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
| McCabe (Cyclomatic) | 6 | 2.28 | 0 |
| Cognitive (SonarJS) | 6 | 2.53 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2917155 |
| Context Utilization | 35% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
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


