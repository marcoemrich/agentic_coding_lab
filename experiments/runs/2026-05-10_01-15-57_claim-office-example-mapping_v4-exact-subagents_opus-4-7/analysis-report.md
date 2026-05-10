# Analysis Report: 2026-05-10_01-15-57_claim-office-example-mapping_v4-exact-subagents_opus-4-7

Generated: 2026-05-10T14:59:33+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 4531s |
| Started | 2026-05-10T01:15:57+00:00 |
| Ended | 2026-05-10T02:31:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 194
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 534
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_01-15-57_claim-office-example-mapping_v4-exact-subagents_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_01-15-57_claim-office-example-mapping_v4-exact-subagents_opus-4-7

 ✓ src/claim-office.spec.ts  (45 tests) 1455ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  14:59:33
   Duration  1.79s (transform 46ms, setup 0ms, collect 43ms, tests 1.46s, environment 0ms, prepare 103ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 82% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 10 | ×5 | 50 |
| Assignments | 71 | ×6 | 426 |
| **Total Mass** | | | **710** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 158 |
| Functions | 21 |
| Longest Function | 21 lines |
| Avg LOC/Function | 4.90 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.58 | 0 |
| Cognitive (SonarJS) | 4 | 1.69 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 14535077 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
| Avg Cycle Time | 112.75s |
| Avg Red Phase | 34.14s |
| Avg Green Phase | 28.16s |
| Avg Refactor Phase | 50.45s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 70 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


