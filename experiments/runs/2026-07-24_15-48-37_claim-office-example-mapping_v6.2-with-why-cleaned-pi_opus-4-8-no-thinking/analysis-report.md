# Analysis Report: 2026-07-24_15-48-37_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

Generated: 2026-07-24T16:17:49+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1751s |
| Started | 2026-07-24T15:48:37+00:00 |
| Ended | 2026-07-24T16:17:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 286
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 617
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_15-48-37_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_15-48-37_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

 ✓ src/claim-office.spec.ts  (43 tests) 8ms
 ✓ src/cli.spec.ts  (2 tests) 573ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  16:17:50
   Duration  880ms (transform 45ms, setup 0ms, collect 52ms, tests 581ms, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 11 | ×5 | 55 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **875** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 239 |
| Functions | 23 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.35 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 3 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1512451 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 86 |
| Predictions Total | 86 |
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


