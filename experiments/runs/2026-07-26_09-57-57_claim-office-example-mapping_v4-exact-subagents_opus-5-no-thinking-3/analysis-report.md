# Analysis Report: 2026-07-26_09-57-57_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-3

Generated: 2026-07-26T11:40:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4-exact-subagents |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6178s |
| Started | 2026-07-26T09:57:57+00:00 |
| Ended | 2026-07-26T11:40:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 343
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 932
- **Active tests**: 55
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (55 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-26_09-57-57_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-26_09-57-57_claim-office-example-mapping_v4-exact-subagents_opus-5-no-thinking-3

 ✓ src/claim-office.spec.ts  (55 tests) 1416ms

 Test Files  1 passed (1)
      Tests  55 passed (55)
   Start at  11:40:57
   Duration  1.60s (transform 47ms, setup 0ms, collect 55ms, tests 1.42s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 51 | ×1 | 51 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 92 | ×6 | 552 |
| **Total Mass** | | | **820** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 266 |
| Functions | 46 |
| Longest Function | 21 lines |
| Avg LOC/Function | 2.72 |
| Median LOC/Function | 2.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 3 | 1.28 | 0 |
| Cognitive (SonarJS) | 2 | 1.07 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20438592 |
| Context Utilization | 87% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 125.78s |
| Avg Red Phase | 44.03s |
| Avg Green Phase | 23.99s |
| Avg Refactor Phase | 57.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 80 |
| Predictions Total | 84 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 20 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


