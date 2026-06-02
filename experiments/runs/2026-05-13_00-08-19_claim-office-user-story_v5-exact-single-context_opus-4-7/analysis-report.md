# Analysis Report: 2026-05-13_00-08-19_claim-office-user-story_v5-exact-single-context_opus-4-7

Generated: 2026-06-02T08:14:05+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 732s |
| Started | 2026-05-13T00:08:19+00:00 |
| Ended | 2026-05-13T00:20:32+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, scenario.ts
- **Implementation LOC** (total): 163
- **Test file**: scenario.spec.ts
- **Test file LOC**: 362
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-08-19_claim-office-user-story_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-08-19_claim-office-user-story_v5-exact-single-context_opus-4-7

 ✓ src/scenario.spec.ts  (18 tests) 4ms

 Test Files  1 passed (1)
      Tests  18 passed (18)
   Start at  08:14:05
   Duration  363ms (transform 29ms, setup 0ms, collect 29ms, tests 4ms, environment 0ms, prepare 113ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 49 | ×2 | 98 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 7 | ×5 | 35 |
| Assignments | 58 | ×6 | 348 |
| **Total Mass** | | | **591** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 135 |
| Functions | 12 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.08 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 13 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.84 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20979715 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 139.06s |
| Avg Red Phase | 91.25s |
| Avg Green Phase | 19.77s |
| Avg Refactor Phase | 28.04s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 10 |
| Predictions Total | 10 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


