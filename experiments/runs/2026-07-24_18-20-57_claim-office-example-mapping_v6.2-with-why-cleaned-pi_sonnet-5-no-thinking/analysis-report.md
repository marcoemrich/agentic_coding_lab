# Analysis Report: 2026-07-24_18-20-57_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

Generated: 2026-07-24T19:36:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | sonnet-5-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4507s |
| Started | 2026-07-24T18:20:57+00:00 |
| Ended | 2026-07-24T19:36:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 321
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 315
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_18-20-57_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_18-20-57_claim-office-example-mapping_v6.2-with-why-cleaned-pi_sonnet-5-no-thinking

 ✓ src/claim-office.spec.ts  (32 tests) 5ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  19:36:06
   Duration  179ms (transform 35ms, setup 0ms, collect 35ms, tests 5ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 76% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 71 | ×2 | 142 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **827** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 277 |
| Functions | 18 |
| Longest Function | 32 lines |
| Avg LOC/Function | 7.17 |
| Median LOC/Function | 3.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 5 | 1.96 | 0 |
| Cognitive (SonarJS) | 8 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2749577 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 28 |
| Predictions Total | 28 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 14 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


