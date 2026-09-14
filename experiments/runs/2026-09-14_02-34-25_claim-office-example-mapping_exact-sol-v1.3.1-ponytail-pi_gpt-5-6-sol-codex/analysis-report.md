# Analysis Report: 2026-09-14_02-34-25_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T02:54:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3.1-ponytail-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1173s |
| Started | 2026-09-14T02:34:27+00:00 |
| Ended | 2026-09-14T02:54:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 97
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 216
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_02-34-25_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_02-34-25_claim-office-example-mapping_exact-sol-v1.3.1-ponytail-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (33 tests) 2812ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  02:54:05
   Duration  3.18s (transform 86ms, setup 0ms, collect 85ms, tests 2.81s, environment 0ms, prepare 109ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 83% |
| Branches | 83% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 5 | ×5 | 25 |
| Assignments | 44 | ×6 | 264 |
| **Total Mass** | | | **481** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 89 |
| Functions | 5 |
| Longest Function | 19 lines |
| Avg LOC/Function | 8.60 |
| Median LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 7 | 1.94 | 0 |
| Cognitive (SonarJS) | 5 | 3.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7253235 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 33 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


