# Analysis Report: 2026-05-12_05-53-15_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-06-02T08:03:30+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 1814s |
| Started | 2026-05-12T05:53:15+00:00 |
| Ended | 2026-05-12T06:23:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 89
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 279
- **Active tests**: 13
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (13 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-53-15_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-53-15_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (13 tests) 3ms

 Test Files  1 passed (1)
      Tests  13 passed (13)
   Start at  08:03:32
   Duration  365ms (transform 28ms, setup 0ms, collect 26ms, tests 3ms, environment 0ms, prepare 73ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 34 | ×1 | 34 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 4 | ×5 | 20 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **412** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 82 |
| Functions | 1 |
| Longest Function | 48 lines |
| Avg LOC/Function | 48.00 |
| Median LOC/Function | 48.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **2** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.56 | 0 |
| Cognitive (SonarJS) | 5 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32520090 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 13 |
| Avg Cycle Time | 133.53s |
| Avg Red Phase | 35.25s |
| Avg Green Phase | 45.01s |
| Avg Refactor Phase | 53.27s |

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
| Refactorings Applied | 13 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


