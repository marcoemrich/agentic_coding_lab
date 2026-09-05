# Analysis Report: 2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T13:09:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1619s |
| Started | 2026-09-05T12:42:01+00:00 |
| Ended | 2026-09-05T13:09:11+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 69
- **Test files**: office.spec.ts
- **Test LOC** (total): 52
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-42-01_claim-office-example-mapping_basic-sol-tdd-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (41 tests) 2488ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  13:09:14
   Duration  3.36s (transform 320ms, setup 0ms, collect 297ms, tests 2.49s, environment 0ms, prepare 262ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 4 | ×5 | 20 |
| Assignments | 34 | ×6 | 204 |
| **Total Mass** | | | **415** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 69 |
| Functions | 6 |
| Longest Function | 18 lines |
| Avg LOC/Function | 9.00 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 4 | 2.25 | 0 |
| Cognitive (SonarJS) | 3 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8150982 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 48 |
| Predictions Total | 48 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 41 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


