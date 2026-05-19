# Analysis Report: 2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-19T16:05:57+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2524s |
| Started | 2026-05-19T15:23:51+00:00 |
| Ended | 2026-05-19T16:05:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 155
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 789
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (39 tests) 7ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  16:05:58
   Duration  174ms (transform 44ms, setup 0ms, collect 44ms, tests 7ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 65 | ×2 | 130 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **575** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 140 |
| Functions | 10 |
| Longest Function | 18 lines |
| Avg LOC/Function | 9.40 |
| Median LOC/Function | 9.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 7 | 1.87 | 0 |
| Cognitive (SonarJS) | 9 | 2.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 47741380 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 140.05s |
| Avg Red Phase | 30.79s |
| Avg Green Phase | 40.1s |
| Avg Refactor Phase | 69.16s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 60 |
| Predictions Total | 60 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 7 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


