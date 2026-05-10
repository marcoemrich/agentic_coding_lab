# Analysis Report: 2026-05-10_14-27-28_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-10T15:33:18+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3947s |
| Started | 2026-05-10T14:27:29+00:00 |
| Ended | 2026-05-10T15:33:18+00:00 |

## Code Metrics

- **Implementation file**: cli.ts
- **Implementation LOC**: 48
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 299
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```
$ vitest run

 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-10_14-27-28_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 11ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  15:33:19
   Duration  183ms (transform 42ms, setup 1ms, collect 38ms, tests 11ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 14 | ×1 | 14 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 1 | ×5 | 5 |
| Assignments | 15 | ×6 | 90 |
| **Total Mass** | | | **167** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 39 |
| Functions | 3 |
| Longest Function | 11 lines |
| Avg LOC/Function | 8 |
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
| McCabe (Cyclomatic) | 6 | 2.20 | 0 |
| Cognitive (SonarJS) | 5 | 2.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12082845 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 113.09s |
| Avg Red Phase | 36.3s |
| Avg Green Phase | 32.73s |
| Avg Refactor Phase | 44.06s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 46 |
| Predictions Total | 48 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 26 |


