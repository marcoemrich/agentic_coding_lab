# Analysis Report: 2026-05-13_05-43-50_game-of-life-cli-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-10-15T08:14:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 671s |
| Started | 2026-05-13T05:43:50+00:00 |
| Ended | 2026-05-13T05:55:04+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 40
- **Test files**: cli.spec.ts, game-of-life.spec.ts
- **Test LOC** (total): 50
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-13_05-43-50_game-of-life-cli-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-13_05-43-50_game-of-life-cli-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 9ms
 ✓ src/cli.spec.ts  (1 test) 488ms

 Test Files  2 passed (2)
      Tests  9 passed (9)
   Start at  08:14:09
   Duration  846ms (transform 51ms, setup 0ms, collect 65ms, tests 497ms, environment 0ms, prepare 164ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 77% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 20 | ×1 | 20 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 17 | ×6 | 102 |
| **Total Mass** | | | **211** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 35 |
| Functions | 2 |
| Longest Function | 23 lines |
| Avg LOC/Function | 15.00 |
| Median LOC/Function | 15.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 2 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.00 | 1 |
| Cognitive (SonarJS) | 17 | 6.33 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10830541 |
| Context Utilization | 55% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 126.83s |
| Avg Red Phase | 36.46s |
| Avg Green Phase | 28.87s |
| Avg Refactor Phase | 61.5s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 17 |
| Predictions Total | 18 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


