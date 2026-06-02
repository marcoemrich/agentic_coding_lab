# Analysis Report: 2026-05-12_22-29-17_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-06-02T08:11:56+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 525s |
| Started | 2026-05-12T22:29:17+00:00 |
| Ended | 2026-05-12T22:38:04+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 211
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 181
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-29-17_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_22-29-17_claim-office-prose_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (16 tests) 3ms

 Test Files  1 passed (1)
      Tests  16 passed (16)
   Start at  08:11:57
   Duration  371ms (transform 33ms, setup 0ms, collect 27ms, tests 3ms, environment 0ms, prepare 124ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 57 | ×2 | 114 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 10 | ×5 | 50 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **745** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 174 |
| Functions | 9 |
| Longest Function | 34 lines |
| Avg LOC/Function | 11.00 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 21 |
| Code Quality | 0 |
| **Total** | **22** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.53 | 0 |
| Cognitive (SonarJS) | 12 | 4.29 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17187305 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 54.71s |
| Avg Red Phase | 22.65s |
| Avg Green Phase | 21.66s |
| Avg Refactor Phase | 10.4s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


