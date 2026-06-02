# Analysis Report: 2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-06-02T07:59:33+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 1547s |
| Started | 2026-05-12T04:33:35+00:00 |
| Ended | 2026-05-12T04:59:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 73
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 140
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_04-33-35_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  07:59:35
   Duration  318ms (transform 26ms, setup 0ms, collect 23ms, tests 2ms, environment 0ms, prepare 61ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 29 | ×1 | 29 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 2 | ×5 | 10 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **315** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 64 |
| Functions | 1 |
| Longest Function | 38 lines |
| Avg LOC/Function | 38.00 |
| Median LOC/Function | 38.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.75 | 0 |
| Cognitive (SonarJS) | 19 | 19.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 24191839 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 168.39s |
| Avg Red Phase | 46.37s |
| Avg Green Phase | 50.33s |
| Avg Refactor Phase | 71.69s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 16 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


