# Analysis Report: 2026-05-12_06-27-47_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey-no-thinking

Generated: 2026-06-02T08:04:02+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 449s |
| Started | 2026-05-12T06:27:47+00:00 |
| Ended | 2026-05-12T06:35:18+00:00 |

## Code Metrics

- **Implementation files**: quote.ts
- **Implementation LOC** (total): 67
- **Test file**: quote.spec.ts
- **Test file LOC**: 104
- **Active tests**: 10
- **Remaining todos**: 5

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_06-27-47_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_06-27-47_claim-office-user-story_v5-exact-single-context_haiku-4-5-portkey-no-thinking

 ✓ src/quote.spec.ts  (15 tests | 5 skipped) 2ms

 Test Files  1 passed (1)
      Tests  10 passed | 5 todo (15)
   Start at  08:04:04
   Duration  336ms (transform 36ms, setup 0ms, collect 21ms, tests 2ms, environment 0ms, prepare 123ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 78% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 33 | ×1 | 33 |
| Invocations | 11 | ×2 | 22 |
| Conditionals | 5 | ×4 | 20 |
| Loops | 3 | ×5 | 15 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **168** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 49 |
| Functions | 3 |
| Longest Function | 18 lines |
| Avg LOC/Function | 14.33 |
| Median LOC/Function | 15.00 |
| Imports | 0 |

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
| McCabe (Cyclomatic) | 7 | 3.25 | 0 |
| Cognitive (SonarJS) | 4 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17411006 |
| Context Utilization | 70% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 45.02s |
| Avg Red Phase | 12.8s |
| Avg Green Phase | 14.19s |
| Avg Refactor Phase | 18.03s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 20 |
| Predictions Total | 20 |
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


