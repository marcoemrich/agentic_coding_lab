# Analysis Report: 2026-09-14_17-11-19_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-requesty-no-thinking

Generated: 2026-09-14T17:16:26+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-requesty-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 301s |
| Started | 2026-09-14T17:11:19+00:00 |
| Ended | 2026-09-14T17:16:26+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, errors.ts, parse.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 401
- **Test files**: cli.spec.ts, policy.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 561
- **Active tests**: 51
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_17-11-19_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-requesty-no-thinking

 ✓ src/policy.spec.ts  (20 tests) 7ms
 ✓ src/premium.spec.ts  (20 tests) 5ms
 ✓ src/cli.spec.ts  (6 tests) 790ms
 ✓ src/scenario.spec.ts  (5 tests) 4ms

 Test Files  4 passed (4)
      Tests  51 passed (51)
   Start at  17:16:27
   Duration  1.81s (transform 100ms, setup 0ms, collect 129ms, tests 806ms, environment 1ms, prepare 305ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 69% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 97 | ×1 | 97 |
| Invocations | 134 | ×2 | 268 |
| Conditionals | 30 | ×4 | 120 |
| Loops | 12 | ×5 | 60 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **965** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 341 |
| Functions | 19 |
| Longest Function | 24 lines |
| Avg LOC/Function | 8.58 |
| Median LOC/Function | 6.00 |
| Imports | 11 |

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
| McCabe (Cyclomatic) | 5 | 1.97 | 0 |
| Cognitive (SonarJS) | 5 | 2.24 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3169436 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 23.66s |
| Avg Red Phase | 6.15s |
| Avg Green Phase | 7.48s |
| Avg Refactor Phase | 10.03s |

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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


