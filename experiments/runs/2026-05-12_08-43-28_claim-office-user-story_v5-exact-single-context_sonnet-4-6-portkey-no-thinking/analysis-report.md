# Analysis Report: 2026-05-12_08-43-28_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-06-02T08:09:31+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1707s |
| Started | 2026-05-12T08:43:28+00:00 |
| Ended | 2026-05-12T09:11:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 76
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 346
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-43-28_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-43-28_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:09:34
   Duration  357ms (transform 33ms, setup 0ms, collect 28ms, tests 3ms, environment 0ms, prepare 85ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 41 | ×1 | 41 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 3 | ×5 | 15 |
| Assignments | 36 | ×6 | 216 |
| **Total Mass** | | | **328** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 68 |
| Functions | 3 |
| Longest Function | 32 lines |
| Avg LOC/Function | 12.00 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 8 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 10 | 2.38 | 0 |
| Cognitive (SonarJS) | 11 | 7.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 36181726 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 92.84s |
| Avg Red Phase | 24.2s |
| Avg Green Phase | 20.96s |
| Avg Refactor Phase | 47.68s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 34 |
| Predictions Total | 34 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 18 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


