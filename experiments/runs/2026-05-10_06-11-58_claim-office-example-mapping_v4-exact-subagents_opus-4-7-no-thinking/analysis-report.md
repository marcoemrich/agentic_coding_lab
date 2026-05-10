# Analysis Report: 2026-05-10_06-11-58_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-10T15:00:26+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3402s |
| Started | 2026-05-10T06:11:58+00:00 |
| Ended | 2026-05-10T07:08:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 234
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 796
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_06-11-58_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_06-11-58_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 6ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  15:00:26
   Duration  361ms (transform 45ms, setup 1ms, collect 43ms, tests 6ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 12 | ×5 | 60 |
| Assignments | 87 | ×6 | 522 |
| **Total Mass** | | | **902** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 198 |
| Functions | 25 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.48 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 13 | 1.97 | 1 |
| Cognitive (SonarJS) | 10 | 1.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13211172 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 104.67s |
| Avg Red Phase | 34.97s |
| Avg Green Phase | 25.78s |
| Avg Refactor Phase | 43.92s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 60 |
| Predictions Total | 60 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


