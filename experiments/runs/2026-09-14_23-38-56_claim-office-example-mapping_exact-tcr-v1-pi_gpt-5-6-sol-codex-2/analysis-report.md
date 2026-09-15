# Analysis Report: 2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-2

Generated: 2026-09-14T23:57:48+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1125s |
| Started | 2026-09-14T23:38:58+00:00 |
| Ended | 2026-09-14T23:57:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 147
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 205
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex-2

 ✓ src/claim-office.spec.ts  (36 tests) 2818ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  23:57:49
   Duration  3.14s (transform 73ms, setup 0ms, collect 72ms, tests 2.82s, environment 0ms, prepare 86ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 81% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **604** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 133 |
| Functions | 8 |
| Longest Function | 17 lines |
| Avg LOC/Function | 10.12 |
| Median LOC/Function | 8.50 |
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
| McCabe (Cyclomatic) | 4 | 1.76 | 0 |
| Cognitive (SonarJS) | 4 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6383902 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 72 |
| Predictions Total | 72 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


