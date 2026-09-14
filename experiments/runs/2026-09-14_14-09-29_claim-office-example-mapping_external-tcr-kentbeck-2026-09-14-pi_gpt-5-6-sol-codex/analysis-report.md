# Analysis Report: 2026-09-14_14-09-29_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:55:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 473s |
| Started | 2026-09-14T14:09:30+00:00 |
| Ended | 2026-09-14T14:17:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, input.ts
- **Implementation LOC** (total): 227
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 248
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-09-29_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-09-29_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (15 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests) 735ms

 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  15:55:17
   Duration  1.13s (transform 128ms, setup 0ms, collect 165ms, tests 743ms, environment 0ms, prepare 231ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 61% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 90 | ×1 | 90 |
| Invocations | 117 | ×2 | 234 |
| Conditionals | 28 | ×4 | 112 |
| Loops | 11 | ×5 | 55 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **851** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 202 |
| Functions | 16 |
| Longest Function | 16 lines |
| Avg LOC/Function | 8.81 |
| Median LOC/Function | 9.00 |
| Imports | 3 |

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
| McCabe (Cyclomatic) | 6 | 2.71 | 0 |
| Cognitive (SonarJS) | 6 | 2.62 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 853260 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


