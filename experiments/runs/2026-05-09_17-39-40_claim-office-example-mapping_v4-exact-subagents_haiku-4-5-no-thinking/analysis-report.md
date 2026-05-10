# Analysis Report: 2026-05-09_17-39-40_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T14:58:53+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 2708s |
| Started | 2026-05-09T17:39:40+00:00 |
| Ended | 2026-05-09T18:24:50+00:00 |

## Code Metrics

- **Implementation files**: mhpco.ts
- **Implementation LOC** (total): 187
- **Test file**: mhpco.spec.ts
- **Test file LOC**: 141
- **Active tests**: 28
- **Remaining todos**: 11

## Test Results

**Status**: ✅ All tests passing (28 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_17-39-40_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_17-39-40_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ✓ src/mhpco.spec.ts  (39 tests | 11 skipped) 6ms

 Test Files  1 passed (1)
      Tests  28 passed | 11 todo (39)
   Start at  14:58:54
   Duration  359ms (transform 29ms, setup 0ms, collect 27ms, tests 6ms, environment 0ms, prepare 67ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 97% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 84 | ×1 | 84 |
| Invocations | 39 | ×2 | 78 |
| Conditionals | 25 | ×4 | 100 |
| Loops | 1 | ×5 | 5 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **537** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 145 |
| Functions | 16 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.56 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 2.30 | 0 |
| Cognitive (SonarJS) | 6 | 1.47 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12959581 |
| Context Utilization | 53% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
| Avg Cycle Time | 90.57s |
| Avg Red Phase | 27.06s |
| Avg Green Phase | 24.99s |
| Avg Refactor Phase | 38.52s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 45 |
| Predictions Total | 48 |
| Accuracy | 93% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


