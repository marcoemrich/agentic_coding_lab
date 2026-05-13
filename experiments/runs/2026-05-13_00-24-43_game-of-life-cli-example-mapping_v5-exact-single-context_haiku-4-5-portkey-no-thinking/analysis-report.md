# Analysis Report: 2026-05-13_00-24-43_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-05-13T11:35:09+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 299s |
| Started | 2026-05-13T00:24:43+00:00 |
| Ended | 2026-05-13T00:29:43+00:00 |

## Code Metrics

- **Implementation files**: gameOfLife.ts
- **Implementation LOC** (total): 63
- **Test file**: gameOfLife.spec.ts
- **Test file LOC**: 61
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-24-43_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-24-43_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/gameOfLife.spec.ts  (13 tests) 4ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  11:35:10
   Duration  358ms (transform 28ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 29 | ×1 | 29 |
| Invocations | 29 | ×2 | 58 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 7 | ×5 | 35 |
| Assignments | 19 | ×6 | 114 |
| **Total Mass** | | | **256** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 52 |
| Functions | 5 |
| Longest Function | 30 lines |
| Avg LOC/Function | 10.80 |
| Median LOC/Function | 9.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 2.86 | 0 |
| Cognitive (SonarJS) | 10 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10079013 |
| Context Utilization | 52% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
| Avg Cycle Time | 83.15s |
| Avg Red Phase | 33.27s |
| Avg Green Phase | 24.53s |
| Avg Refactor Phase | 25.35s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 8 |
| Predictions Total | 8 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


