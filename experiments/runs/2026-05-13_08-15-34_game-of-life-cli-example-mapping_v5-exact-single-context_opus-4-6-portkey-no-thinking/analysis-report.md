# Analysis Report: 2026-05-13_08-15-34_game-of-life-cli-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-13T11:37:49+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 509s |
| Started | 2026-05-13T08:15:34+00:00 |
| Ended | 2026-05-13T08:24:05+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 38
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 41
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_08-15-34_game-of-life-cli-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_08-15-34_game-of-life-cli-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (9 tests) 3ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  11:37:50
   Duration  354ms (transform 27ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 96ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 17 | ×1 | 17 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 8 | ×5 | 40 |
| Assignments | 14 | ×6 | 84 |
| **Total Mass** | | | **207** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 33 |
| Functions | 2 |
| Longest Function | 27 lines |
| Avg LOC/Function | 18.50 |
| Median LOC/Function | 18.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 4.50 | 0 |
| Cognitive (SonarJS) | 18 | 9.67 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9103184 |
| Context Utilization | 49% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 92.03s |
| Avg Red Phase | 27.16s |
| Avg Green Phase | 27.01s |
| Avg Refactor Phase | 37.86s |

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
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


