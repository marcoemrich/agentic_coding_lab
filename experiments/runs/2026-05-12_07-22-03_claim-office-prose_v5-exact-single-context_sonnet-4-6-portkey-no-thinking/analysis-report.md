# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-06-02T08:05:34+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1303s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T07:43:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 116
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 99
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (13 tests) 2ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  08:05:36
   Duration  375ms (transform 29ms, setup 0ms, collect 26ms, tests 2ms, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 60% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 3 | ×5 | 15 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **433** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 100 |
| Functions | 3 |
| Longest Function | 11 lines |
| Avg LOC/Function | 6.00 |
| Median LOC/Function | 5.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.89 | 0 |
| Cognitive (SonarJS) | 6 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26264398 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
| Avg Cycle Time | 94.54s |
| Avg Red Phase | 30.47s |
| Avg Green Phase | 18.83s |
| Avg Refactor Phase | 45.24s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 25 |
| Predictions Total | 26 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


