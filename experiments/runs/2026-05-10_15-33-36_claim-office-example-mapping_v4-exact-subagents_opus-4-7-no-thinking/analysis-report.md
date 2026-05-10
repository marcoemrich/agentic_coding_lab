# Analysis Report: 2026-05-10_15-33-36_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-10T16:33:07+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3569s |
| Started | 2026-05-10T15:33:36+00:00 |
| Ended | 2026-05-10T16:33:07+00:00 |

## Code Metrics

- **Implementation file**: cli.ts
- **Implementation LOC**: 68
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 347
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_15-33-36_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 1858ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  16:33:08
   Duration  2.03s (transform 45ms, setup 0ms, collect 44ms, tests 1.86s, environment 0ms, prepare 44ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 68% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 12 | ×1 | 12 |
| Invocations | 28 | ×2 | 56 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 2 | ×5 | 10 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **224** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 61 |
| Functions | 5 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6 |
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
| McCabe (Cyclomatic) | 4 | 2.24 | 0 |
| Cognitive (SonarJS) | 5 | 2.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15581813 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 28 |
| Avg Cycle Time | 120.43s |
| Avg Red Phase | 37.03s |
| Avg Green Phase | 30.97s |
| Avg Refactor Phase | 52.43s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


