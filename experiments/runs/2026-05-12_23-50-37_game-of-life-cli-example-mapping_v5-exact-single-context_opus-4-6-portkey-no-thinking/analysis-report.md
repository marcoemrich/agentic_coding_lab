# Analysis Report: 2026-05-12_23-50-37_game-of-life-cli-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-13T11:34:00+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-cli-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 897s |
| Started | 2026-05-12T23:50:37+00:00 |
| Ended | 2026-05-13T00:05:35+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, game-of-life.ts
- **Implementation LOC** (total): 55
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 34
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-50-37_game-of-life-cli-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_23-50-37_game-of-life-cli-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/game-of-life.spec.ts  (8 tests) 3ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  11:34:01
   Duration  343ms (transform 24ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 81% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 34 | ×2 | 68 |
| Conditionals | 2 | ×4 | 8 |
| Loops | 7 | ×5 | 35 |
| Assignments | 25 | ×6 | 150 |
| **Total Mass** | | | **282** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 46 |
| Functions | 5 |
| Longest Function | 21 lines |
| Avg LOC/Function | 8.40 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 5 | 1.77 | 0 |
| Cognitive (SonarJS) | 7 | 3.20 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 19631161 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 111.27s |
| Avg Red Phase | 27.92s |
| Avg Green Phase | 26.85s |
| Avg Refactor Phase | 56.5s |

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
| Tests Passed Immediately | 2 |


