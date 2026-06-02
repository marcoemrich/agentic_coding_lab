# Analysis Report: 2026-05-12_08-28-23_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T08:08:48+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2166s |
| Started | 2026-05-12T08:28:23+00:00 |
| Ended | 2026-05-12T09:04:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 94
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 364
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-28-23_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-28-23_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (19 tests) 3ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  08:08:51
   Duration  316ms (transform 50ms, setup 0ms, collect 39ms, tests 3ms, environment 0ms, prepare 137ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 45 | ×1 | 45 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 5 | ×5 | 25 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **436** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 88 |
| Functions | 4 |
| Longest Function | 28 lines |
| Avg LOC/Function | 17.00 |
| Median LOC/Function | 14.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 14 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 9 | 3.57 | 0 |
| Cognitive (SonarJS) | 14 | 6.50 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 43041881 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 124.83s |
| Avg Red Phase | 31.6s |
| Avg Green Phase | 30.49s |
| Avg Refactor Phase | 62.74s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 38 |
| Predictions Total | 38 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 3 |


