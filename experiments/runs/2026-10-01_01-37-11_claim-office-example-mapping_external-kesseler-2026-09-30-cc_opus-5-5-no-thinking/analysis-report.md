# Analysis Report: 2026-10-01_01-37-11_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:46:39+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-kesseler-2026-09-30-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 565s |
| Started | 2026-10-01T01:37:11+00:00 |
| Ended | 2026-10-01T01:46:39+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 201
- **Test files**: cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 399
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-37-11_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-37-11_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

 ✓ src/scenario.spec.ts  (37 tests) 9ms
 ✓ src/premium.spec.ts  (11 tests) 4ms
 ✓ src/cli.spec.ts  (2 tests) 375ms

 Test Files  3 passed (3)
      Tests  50 passed (50)
   Start at  01:46:40
   Duration  1.19s (transform 101ms, setup 0ms, collect 123ms, tests 388ms, environment 0ms, prepare 233ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 6 | ×5 | 30 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **539** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 170 |
| Functions | 15 |
| Longest Function | 14 lines |
| Avg LOC/Function | 4.87 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.68 | 0 |
| Cognitive (SonarJS) | 3 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13807789 |
| Context Utilization | 51% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 80 |
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


