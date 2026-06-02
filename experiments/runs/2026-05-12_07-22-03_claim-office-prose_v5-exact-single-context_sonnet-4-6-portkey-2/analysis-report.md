# Analysis Report: 2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-2

Generated: 2026-06-02T08:05:11+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 1566s |
| Started | 2026-05-12T07:22:03+00:00 |
| Ended | 2026-05-12T07:48:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 112
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 144
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (8 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-22-03_claim-office-prose_v5-exact-single-context_sonnet-4-6-portkey-2

 ✓ src/claim-office.spec.ts  (8 tests) 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  08:05:13
   Duration  345ms (transform 26ms, setup 0ms, collect 24ms, tests 2ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 16 | ×2 | 32 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 3 | ×5 | 15 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **346** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 94 |
| Functions | 1 |
| Longest Function | 26 lines |
| Avg LOC/Function | 26.00 |
| Median LOC/Function | 26.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.86 | 0 |
| Cognitive (SonarJS) | 14 | 14.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20970332 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 198.99s |
| Avg Red Phase | 65.3s |
| Avg Green Phase | 42.86s |
| Avg Refactor Phase | 90.83s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 13 |
| Predictions Total | 14 |
| Accuracy | 92% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


