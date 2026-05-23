# Analysis Report: 2026-05-16_09-29-58_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

Generated: 2026-05-23T11:50:57+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v1-oneshot |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 242s |
| Started | 2026-05-16T09:29:58+00:00 |
| Ended | 2026-05-16T09:34:01+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, engine.ts, pricing.ts, types.ts
- **Implementation LOC** (total): 360
- **Test file**: claims.spec.ts
- **Test file LOC**: 88
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (22 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-29-58_claim-office-prose_v1-oneshot_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-16_09-29-58_claim-office-prose_v1-oneshot_opus-4-7-no-thinking

 ✓ src/claims.spec.ts  (6 tests) 3ms
 ✓ src/pricing.spec.ts  (12 tests) 2ms
 ✓ src/engine.spec.ts  (4 tests) 3ms

 Test Files  3 passed (3)
      Tests  22 passed (22)
   Start at  11:50:58
   Duration  416ms (transform 79ms, setup 1ms, collect 102ms, tests 8ms, environment 0ms, prepare 276ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 105 | ×1 | 105 |
| Invocations | 91 | ×2 | 182 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 15 | ×5 | 75 |
| Assignments | 82 | ×6 | 492 |
| **Total Mass** | | | **930** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 289 |
| Functions | 16 |
| Longest Function | 35 lines |
| Avg LOC/Function | 10.31 |
| Median LOC/Function | 6.50 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **14** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.17 | 0 |
| Cognitive (SonarJS) | 11 | 3.44 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2322166 |
| Context Utilization | 7% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 72.42s |
| Avg Red Phase | 28.08s |
| Avg Green Phase | 44.34s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | N/A |
| Predictions Total | N/A |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


