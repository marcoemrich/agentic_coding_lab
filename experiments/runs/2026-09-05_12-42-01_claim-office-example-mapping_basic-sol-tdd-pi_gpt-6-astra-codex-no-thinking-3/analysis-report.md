# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-3

Generated: 2026-09-05T13:13:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1864s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T13:13:14+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 69
- **Test files**: office.spec.ts
- **Test LOC** (total): 150
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking-3

 ✓ src/office.spec.ts  (39 tests) 14590ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  13:13:16
   Duration  15.30s (transform 188ms, setup 0ms, collect 213ms, tests 14.59s, environment 0ms, prepare 168ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 5 | ×5 | 25 |
| Assignments | 32 | ×6 | 192 |
| **Total Mass** | | | **400** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 69 |
| Functions | 8 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.25 |
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
| McCabe (Cyclomatic) | 4 | 1.93 | 0 |
| Cognitive (SonarJS) | 3 | 2.17 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6742072 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 39 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 44 |
| Predictions Total | 44 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 39 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


