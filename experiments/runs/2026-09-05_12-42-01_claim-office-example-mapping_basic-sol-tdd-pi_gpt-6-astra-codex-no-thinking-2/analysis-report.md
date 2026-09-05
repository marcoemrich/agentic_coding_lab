# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-2

Generated: 2026-09-05T13:12:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1791s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T13:12:01+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 82
- **Test files**: office.spec.ts
- **Test LOC** (total): 175
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-2

 ✓ src/office.spec.ts  (40 tests) 8473ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  13:12:03
   Duration  9.29s (transform 179ms, setup 0ms, collect 174ms, tests 8.47s, environment 0ms, prepare 355ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 5 | ×5 | 25 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **438** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 77 |
| Functions | 7 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.71 |
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
| McCabe (Cyclomatic) | 5 | 2.17 | 0 |
| Cognitive (SonarJS) | 4 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7033520 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


