# Analysis Report: 2026-05-12_22-29-31_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:12:06+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 765s |
| Started | 2026-05-12T22:29:31+00:00 |
| Ended | 2026-05-12T22:42:17+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 185
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 268
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-29-31_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-29-31_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (14 tests) 4ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  08:12:07
   Duration  366ms (transform 28ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 53 | ×1 | 53 |
| Invocations | 48 | ×2 | 96 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 6 | ×5 | 30 |
| Assignments | 66 | ×6 | 396 |
| **Total Mass** | | | **619** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 10 |
| Longest Function | 19 lines |
| Avg LOC/Function | 7.30 |
| Median LOC/Function | 6.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.00 | 0 |
| Cognitive (SonarJS) | 6 | 2.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 23474747 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 59.86s |
| Avg Red Phase | 24.49s |
| Avg Green Phase | 21.72s |
| Avg Refactor Phase | 13.65s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


