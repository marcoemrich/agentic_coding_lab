# Analysis Report: 2026-05-10_04-51-56_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

Generated: 2026-05-10T15:00:14+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4780s |
| Started | 2026-05-10T04:51:56+00:00 |
| Ended | 2026-05-10T06:11:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 327
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 590
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_04-51-56_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-10_04-51-56_claim-office-example-mapping_v4-exact-subagents_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 890ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  15:00:14
   Duration  1.24s (transform 40ms, setup 0ms, collect 37ms, tests 890ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 99 | ×2 | 198 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 13 | ×5 | 65 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **869** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 275 |
| Functions | 28 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.61 |
| Median LOC/Function | 5.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 1.68 | 0 |
| Cognitive (SonarJS) | 8 | 2.13 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15781899 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 117.00s |
| Avg Red Phase | 33.98s |
| Avg Green Phase | 28.36s |
| Avg Refactor Phase | 54.66s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 49 |
| Predictions Total | 49 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


