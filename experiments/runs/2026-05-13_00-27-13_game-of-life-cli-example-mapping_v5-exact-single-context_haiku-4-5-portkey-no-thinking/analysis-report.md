# Analysis Report: 2026-05-13_00-27-13_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-05-13T11:02:56+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 490s |
| Started | 2026-05-13T00:27:13+00:00 |
| Ended | 2026-05-13T00:35:24+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 85
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 74
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-27-13_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-13_00-27-13_game-of-life-cli-example-mapping_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:02:57
   Duration  345ms (transform 24ms, setup 0ms, collect 21ms, tests 3ms, environment 0ms, prepare 68ms)
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
| Invocations | 36 | ×2 | 72 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 11 | ×5 | 55 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **318** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 66 |
| Functions | 8 |
| Longest Function | 10 lines |
| Avg LOC/Function | 4.38 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.60 | 0 |
| Cognitive (SonarJS) | 9 | 3.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15423355 |
| Context Utilization | 66% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 59.25s |
| Avg Red Phase | 14.77s |
| Avg Green Phase | 9.9s |
| Avg Refactor Phase | 34.58s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


