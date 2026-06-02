# Analysis Report: 2026-05-12_08-52-51_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

Generated: 2026-06-02T08:10:13+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | true |
| Duration | 964s |
| Started | 2026-05-12T08:52:51+00:00 |
| Ended | 2026-05-12T09:08:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 68
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 111
- **Active tests**: 6
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (6 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-52-51_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_08-52-51_claim-office-user-story_v5-exact-single-context_sonnet-4-6-portkey

 ✓ src/claim-office.spec.ts  (6 tests) 3ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  08:10:16
   Duration  340ms (transform 28ms, setup 0ms, collect 22ms, tests 3ms, environment 0ms, prepare 107ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 75% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 15 | ×2 | 30 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 33 | ×6 | 198 |
| **Total Mass** | | | **292** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 59 |
| Functions | 1 |
| Longest Function | 27 lines |
| Avg LOC/Function | 27.00 |
| Median LOC/Function | 27.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.40 | 0 |
| Cognitive (SonarJS) | 9 | 9.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15836012 |
| Context Utilization | 14% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 6 |
| Avg Cycle Time | 148.17s |
| Avg Red Phase | 32.76s |
| Avg Green Phase | 29.27s |
| Avg Refactor Phase | 86.14s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 12 |
| Predictions Total | 12 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 6 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


