# Analysis Report: 2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking-3

Generated: 2026-05-23T21:42:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1992s |
| Started | 2026-05-23T21:09:13+00:00 |
| Ended | 2026-05-23T21:42:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 231
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 621
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-09-13_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (38 tests) 7ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  21:42:28
   Duration  199ms (transform 46ms, setup 0ms, collect 47ms, tests 7ms, environment 0ms, prepare 56ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 12 | ×5 | 60 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **837** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 196 |
| Functions | 24 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.38 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 4 | 1.63 | 0 |
| Cognitive (SonarJS) | 3 | 1.64 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44246444 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 88.60s |
| Avg Red Phase | 19.3s |
| Avg Green Phase | 15.68s |
| Avg Refactor Phase | 53.62s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 73 |
| Predictions Total | 74 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


