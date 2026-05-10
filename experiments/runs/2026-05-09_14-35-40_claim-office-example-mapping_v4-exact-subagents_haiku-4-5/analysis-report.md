# Analysis Report: 2026-05-09_14-35-40_claim-office-example-mapping_v4-exact-subagents_haiku-4-5

Generated: 2026-05-10T14:58:24+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5 |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 1626s |
| Started | 2026-05-09T14:35:40+00:00 |
| Ended | 2026-05-09T15:02:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 84
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 59
- **Active tests**: 17
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (17 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-35-40_claim-office-example-mapping_v4-exact-subagents_haiku-4-5
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_14-35-40_claim-office-example-mapping_v4-exact-subagents_haiku-4-5

 ✓ src/claim-office.spec.ts  (17 tests) 3ms

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  14:58:24
   Duration  330ms (transform 25ms, setup 0ms, collect 20ms, tests 3ms, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 100% |
| Branches | 100% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 25 | ×1 | 25 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 1 | ×5 | 5 |
| Assignments | 24 | ×6 | 144 |
| **Total Mass** | | | **288** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 72 |
| Functions | 10 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.80 |
| Median LOC/Function | 3.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **12** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.70 | 0 |
| Cognitive (SonarJS) | 4 | 1.78 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6884460 |
| Context Utilization | 38% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 85.55s |
| Avg Red Phase | 24.62s |
| Avg Green Phase | 28.8s |
| Avg Refactor Phase | 32.13s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 24 |
| Predictions Total | 32 |
| Accuracy | 75% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 2 |


