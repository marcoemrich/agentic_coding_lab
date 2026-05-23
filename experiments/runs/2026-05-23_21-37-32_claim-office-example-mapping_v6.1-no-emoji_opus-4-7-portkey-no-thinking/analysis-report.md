# Analysis Report: 2026-05-23_21-37-32_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking

Generated: 2026-05-23T22:06:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-no-emoji |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 1737s |
| Started | 2026-05-23T21:37:32+00:00 |
| Ended | 2026-05-23T22:06:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 243
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 510
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-23_21-37-32_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-23_21-37-32_claim-office-example-mapping_v6.1-no-emoji_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 366ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  22:06:31
   Duration  538ms (transform 43ms, setup 0ms, collect 45ms, tests 366ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 76 | ×2 | 152 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 90 | ×6 | 540 |
| **Total Mass** | | | **861** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 185 |
| Functions | 22 |
| Longest Function | 15 lines |
| Avg LOC/Function | 4.50 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 4 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 1.73 | 0 |
| Cognitive (SonarJS) | 6 | 2.07 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 46176730 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 85.10s |
| Avg Red Phase | 18.34s |
| Avg Green Phase | 20.71s |
| Avg Refactor Phase | 46.05s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 75 |
| Predictions Total | 78 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


