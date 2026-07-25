# Analysis Report: 2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-3

Generated: 2026-07-25T03:23:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | minimax-m3-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 7202s |
| Started | 2026-07-25T01:23:55+00:00 |
| Ended | 2026-07-25T03:23:58+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 161
- **Test file**: premium.spec.ts
- **Test file LOC**: 242
- **Active tests**: 19
- **Remaining todos**: 8

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-07-25_01-23-55_claim-office-example-mapping_v6.2-with-why-cleaned-pi_minimax-m3-no-thinking-3

 ✓ src/premium.spec.ts  (26 tests | 7 skipped) 3ms
 ↓ src/claim.spec.ts  (16 tests | 16 skipped)
 ↓ src/scenario.spec.ts  (8 tests | 8 skipped)

 Test Files  1 passed | 2 skipped (3)
      Tests  19 passed | 31 todo (50)
   Start at  03:24:00
   Duration  411ms (transform 41ms, setup 0ms, collect 47ms, tests 3ms, environment 0ms, prepare 130ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 21 | ×2 | 42 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 4 | ×5 | 20 |
| Assignments | 23 | ×6 | 138 |
| **Total Mass** | | | **281** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 123 |
| Functions | 7 |
| Longest Function | 36 lines |
| Avg LOC/Function | 12.71 |
| Median LOC/Function | 11.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 17 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.80 | 0 |
| Cognitive (SonarJS) | 3 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2493509 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 32 |
| Predictions Total | 32 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


