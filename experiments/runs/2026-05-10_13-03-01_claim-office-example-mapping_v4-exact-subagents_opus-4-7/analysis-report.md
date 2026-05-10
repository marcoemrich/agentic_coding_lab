# Analysis Report: 2026-05-10_13-03-01_claim-office-example-mapping_v4-exact-subagents_opus-4-7

Generated: 2026-05-10T14:27:04+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 5041s |
| Started | 2026-05-10T13:03:01+00:00 |
| Ended | 2026-05-10T14:27:04+00:00 |

## Code Metrics

- **Implementation file**: cli.ts
- **Implementation LOC**: 54
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 648
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_13-03-01_claim-office-example-mapping_v4-exact-subagents_opus-4-7

 ✓ src/claim-office.spec.ts  (52 tests) 3269ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  14:27:05
   Duration  3.45s (transform 52ms, setup 0ms, collect 54ms, tests 3.27s, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 9 | ×1 | 9 |
| Invocations | 17 | ×2 | 34 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 1 | ×5 | 5 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **182** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 47 |
| Functions | 3 |
| Longest Function | 10 lines |
| Avg LOC/Function | 6 |
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
| McCabe (Cyclomatic) | 4 | 1.62 | 0 |
| Cognitive (SonarJS) | 4 | 1.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15543941 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 119.93s |
| Avg Red Phase | 39.23s |
| Avg Green Phase | 30.09s |
| Avg Refactor Phase | 50.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 74 |
| Predictions Total | 76 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


