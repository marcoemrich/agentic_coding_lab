# Analysis Report: 2026-05-09_23-33-37_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

Generated: 2026-05-10T14:59:13+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | haiku-4-5-no-thinking |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | unknown |
| Duration | 1189s |
| Started | 2026-05-09T23:33:37+00:00 |
| Ended | 2026-05-09T23:53:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 65
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 64
- **Active tests**: 15
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_23-33-37_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-09_23-33-37_claim-office-example-mapping_v4-exact-subagents_haiku-4-5-no-thinking

 ✓ src/claim-office.spec.ts  (15 tests) 3ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  14:59:13
   Duration  337ms (transform 24ms, setup 0ms, collect 19ms, tests 3ms, environment 0ms, prepare 68ms)
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
| Invocations | 17 | ×2 | 34 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 1 | ×5 | 5 |
| Assignments | 13 | ×6 | 78 |
| **Total Mass** | | | **158** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 57 |
| Functions | 5 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.20 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 2 | 1.50 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3074523 |
| Context Utilization | 33% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 16 |
| Avg Cycle Time | 81.90s |
| Avg Red Phase | 41.02s |
| Avg Green Phase | 15.58s |
| Avg Refactor Phase | 25.3s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 27 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


