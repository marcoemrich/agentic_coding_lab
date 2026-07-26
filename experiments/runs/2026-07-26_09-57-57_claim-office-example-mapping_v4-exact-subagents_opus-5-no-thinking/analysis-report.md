# Analysis Report: 2026-07-26_09-57-57_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking

Generated: 2026-07-26T11:38:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6031s |
| Started | 2026-07-26T09:57:57+00:00 |
| Ended | 2026-07-26T11:38:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 408
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 641
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_09-57-57_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_09-57-57_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (55 tests) 1152ms

 Test Files  1 passed (1)
      Tests  55 passed (55)
   Start at  11:38:31
   Duration  1.34s (transform 53ms, setup 0ms, collect 56ms, tests 1.15s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 78 | ×1 | 78 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 13 | ×5 | 65 |
| Assignments | 102 | ×6 | 612 |
| **Total Mass** | | | **963** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 268 |
| Functions | 37 |
| Longest Function | 16 lines |
| Avg LOC/Function | 3.51 |
| Median LOC/Function | 2.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 4 | 1.38 | 0 |
| Cognitive (SonarJS) | 3 | 1.23 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 31150294 |
| Context Utilization | 116% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 55 |
| Avg Cycle Time | 128.74s |
| Avg Red Phase | 43.01s |
| Avg Green Phase | 29.44s |
| Avg Refactor Phase | 56.29s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 110 |
| Predictions Total | 111 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 25 |


