# Analysis Report: 2026-05-12_05-00-12_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-06-02T08:00:44+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 1706s |
| Started | 2026-05-12T05:00:12+00:00 |
| Ended | 2026-05-12T05:28:39+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 79
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 274
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-00-12_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_05-00-12_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  08:00:46
   Duration  350ms (transform 32ms, setup 0ms, collect 32ms, tests 3ms, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 35 | ×1 | 35 |
| Invocations | 25 | ×2 | 50 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 2 | ×5 | 10 |
| Assignments | 38 | ×6 | 228 |
| **Total Mass** | | | **351** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 64 |
| Functions | 8 |
| Longest Function | 13 lines |
| Avg LOC/Function | 5.00 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 7 |
| Code Quality | 0 |
| **Total** | **7** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 1.92 | 0 |
| Cognitive (SonarJS) | 6 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31503953 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 109.02s |
| Avg Red Phase | 34.84s |
| Avg Green Phase | 23.61s |
| Avg Refactor Phase | 50.57s |

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
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


