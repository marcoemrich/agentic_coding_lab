# Analysis Report: 2026-05-12_05-40-48_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-06-02T08:03:07+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1560s |
| Started | 2026-05-12T05:40:48+00:00 |
| Ended | 2026-05-12T06:06:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 136
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 263
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-40-48_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-40-48_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (15 tests) 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  08:03:09
   Duration  355ms (transform 28ms, setup 0ms, collect 29ms, tests 3ms, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 36 | ×2 | 72 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 4 | ×5 | 20 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **474** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 118 |
| Functions | 7 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.57 |
| Median LOC/Function | 6.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 5 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.68 | 0 |
| Cognitive (SonarJS) | 6 | 3.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28398925 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
| Avg Cycle Time | 104.57s |
| Avg Red Phase | 25.38s |
| Avg Green Phase | 28.51s |
| Avg Refactor Phase | 50.68s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 30 |
| Accuracy | 86% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


