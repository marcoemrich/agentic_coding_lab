# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-06-02T08:05:46+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 2614s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T08:05:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 82
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 165
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (17 tests) 4ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:05:48
   Duration  354ms (transform 27ms, setup 0ms, collect 25ms, tests 4ms, environment 0ms, prepare 103ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 52% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 22 | ×2 | 44 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 1 | ×5 | 5 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **410** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 73 |
| Functions | 8 |
| Longest Function | 2 lines |
| Avg LOC/Function | 1.50 |
| Median LOC/Function | 1.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 12 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.12 | 0 |
| Cognitive (SonarJS) | 6 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 42797184 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 154.07s |
| Avg Red Phase | 38.97s |
| Avg Green Phase | 24.35s |
| Avg Refactor Phase | 90.75s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 34 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


