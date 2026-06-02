# Analysis Report: 2026-05-12_21-35-28_claim-office-prose_v5-exact-single-context_opus-4-7-2

Generated: 2026-06-02T08:10:54+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 759s |
| Started | 2026-05-12T21:35:28+00:00 |
| Ended | 2026-05-12T21:48:12+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 133
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 249
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_21-35-28_claim-office-prose_v5-exact-single-context_opus-4-7-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_21-35-28_claim-office-prose_v5-exact-single-context_opus-4-7-2

 ✓ src/claim-office.spec.ts  (12 tests) 4ms

 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  08:10:55
   Duration  383ms (transform 29ms, setup 0ms, collect 28ms, tests 4ms, environment 0ms, prepare 106ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 31 | ×2 | 62 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 6 | ×5 | 30 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **482** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 116 |
| Functions | 6 |
| Longest Function | 22 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 19 |
| Code Quality | 0 |
| **Total** | **21** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.50 | 0 |
| Cognitive (SonarJS) | 15 | 4.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20034138 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 61.64s |
| Avg Red Phase | 23.57s |
| Avg Green Phase | 24.8s |
| Avg Refactor Phase | 13.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 13 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 12 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


