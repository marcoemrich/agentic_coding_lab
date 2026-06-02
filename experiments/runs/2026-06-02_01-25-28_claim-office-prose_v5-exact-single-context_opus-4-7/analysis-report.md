# Analysis Report: 2026-06-02_01-25-28_claim-office-prose_v5-exact-single-context_opus-4-7

Generated: 2026-06-02T08:15:39+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 2212s |
| Started | 2026-06-02T01:25:28+00:00 |
| Ended | 2026-06-02T02:02:21+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 180
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 309
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-06-02_01-25-28_claim-office-prose_v5-exact-single-context_opus-4-7
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-06-02_01-25-28_claim-office-prose_v5-exact-single-context_opus-4-7

 ✓ src/claim-office.spec.ts  (15 tests) 4ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  08:15:40
   Duration  331ms (transform 42ms, setup 0ms, collect 27ms, tests 4ms, environment 0ms, prepare 101ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 5 | ×5 | 25 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **619** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 158 |
| Functions | 16 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.25 |
| Median LOC/Function | 5.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.39 | 0 |
| Cognitive (SonarJS) | 2 | 1.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 57854235 |
| Context Utilization | 30% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 144.29s |
| Avg Red Phase | 38.88s |
| Avg Green Phase | 42.03s |
| Avg Refactor Phase | 63.38s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


