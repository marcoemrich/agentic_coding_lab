# Analysis Report: 2026-09-23_13-26-00_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-23T14:07:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2479s |
| Started | 2026-09-23T13:26:00+00:00 |
| Ended | 2026-09-23T14:07:22+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 372
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 562
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (54 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-26-00_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-26-00_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

The MHPCO does not insure items of type broomstick
 ✓ src/claim-office.spec.ts  (54 tests) 1612ms

 Test Files  1 passed (1)
      Tests  54 passed (54)
   Start at  14:07:23
   Duration  1.96s (transform 81ms, setup 0ms, collect 89ms, tests 1.61s, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 107 | ×2 | 214 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 11 | ×5 | 55 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **689** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 247 |
| Functions | 30 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.57 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 3 | 1.45 | 0 |
| Cognitive (SonarJS) | 2 | 1.31 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25148536 |
| Context Utilization | 86% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 49 |
| Avg Cycle Time | 80.01s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 80.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 94 |
| Predictions Total | 98 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


