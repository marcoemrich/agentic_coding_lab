# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-5

Generated: 2026-09-05T13:13:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1858s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T13:13:08+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 76
- **Test files**: office.spec.ts
- **Test LOC** (total): 54
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-5

 ✓ src/office.spec.ts  (43 tests) 1534ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  13:13:10
   Duration  2.19s (transform 162ms, setup 0ms, collect 117ms, tests 1.53s, environment 0ms, prepare 249ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 46 | ×2 | 92 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 5 | ×5 | 25 |
| Assignments | 37 | ×6 | 222 |
| **Total Mass** | | | **444** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 75 |
| Functions | 8 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.38 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.93 | 0 |
| Cognitive (SonarJS) | 3 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8224138 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 50 |
| Accuracy | 94% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 43 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


