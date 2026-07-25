# Analysis Report: 2026-07-24_16-00-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

Generated: 2026-07-24T16:18:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | opus-4-8-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1032s |
| Started | 2026-07-24T16:00:47+00:00 |
| Ended | 2026-07-24T16:18:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 271
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 318
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-24_16-00-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-24_16-00-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_opus-4-8-no-thinking

Error: Unknown item type: broomstick
Error: Damage to uninsured item: amulet
Error: Damage to uninsured item: sword
Error: Negative damage amount: -200
 ✓ src/claim-office.spec.ts  (38 tests) 1455ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  16:18:01
   Duration  1.62s (transform 40ms, setup 0ms, collect 35ms, tests 1.46s, environment 0ms, prepare 47ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 73% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 79 | ×6 | 474 |
| **Total Mass** | | | **795** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 235 |
| Functions | 17 |
| Longest Function | 28 lines |
| Avg LOC/Function | 7.24 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 7 | 2.32 | 0 |
| Cognitive (SonarJS) | 9 | 3.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 717591 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 58 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


