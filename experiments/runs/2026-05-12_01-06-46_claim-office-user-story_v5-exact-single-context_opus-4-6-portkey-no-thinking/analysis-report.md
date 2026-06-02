# Analysis Report: 2026-05-12_01-06-46_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:56:37+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1576s |
| Started | 2026-05-12T01:06:46+00:00 |
| Ended | 2026-05-12T01:33:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 175
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 301
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-46_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-06-46_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (14 tests) 3ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  07:56:39
   Duration  364ms (transform 28ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 56 | ×6 | 336 |
| **Total Mass** | | | **530** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 155 |
| Functions | 4 |
| Longest Function | 28 lines |
| Avg LOC/Function | 20.50 |
| Median LOC/Function | 21.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 3.00 | 0 |
| Cognitive (SonarJS) | 12 | 6.25 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35110955 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 114.10s |
| Avg Red Phase | 38.91s |
| Avg Green Phase | 29.21s |
| Avg Refactor Phase | 45.98s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 27 |
| Predictions Total | 28 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


