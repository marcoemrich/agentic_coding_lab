# Analysis Report: 2026-05-19_11-08-10_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T11:59:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.4-no-emoji |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3075s |
| Started | 2026-05-19T11:08:10+00:00 |
| Ended | 2026-05-19T11:59:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 152
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 681
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_11-08-10_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_11-08-10_claim-office-example-mapping_v6.4-no-emoji_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 8ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  11:59:28
   Duration  205ms (transform 44ms, setup 0ms, collect 46ms, tests 8ms, environment 0ms, prepare 50ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 11 | ×5 | 55 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **637** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 130 |
| Functions | 11 |
| Longest Function | 24 lines |
| Avg LOC/Function | 9.27 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 6 | 2.09 | 0 |
| Cognitive (SonarJS) | 7 | 2.45 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50115461 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 172.41s |
| Avg Red Phase | 31.56s |
| Avg Green Phase | 36.92s |
| Avg Refactor Phase | 103.93s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 74 |
| Predictions Total | 74 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 17 |


