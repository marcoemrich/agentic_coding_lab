# Analysis Report: 2026-07-24_16-04-17_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

Generated: 2026-07-24T16:30:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1582s |
| Started | 2026-07-24T16:04:17+00:00 |
| Ended | 2026-07-24T16:30:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 287
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 623
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_16-04-17_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_16-04-17_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 7ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  16:30:41
   Duration  172ms (transform 41ms, setup 0ms, collect 41ms, tests 7ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 12 | ×5 | 60 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **848** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 246 |
| Functions | 22 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.59 |
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
| McCabe (Cyclomatic) | 4 | 1.66 | 0 |
| Cognitive (SonarJS) | 4 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1437085 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

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
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


