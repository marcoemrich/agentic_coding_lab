# Analysis Report: 2026-09-14_14-13-45_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:55:37+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 564s |
| Started | 2026-09-14T14:13:47+00:00 |
| Ended | 2026-09-14T14:23:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 185
- **Test files**: claim-office.spec.ts, cli.spec.ts, scenario.spec.ts
- **Test LOC** (total): 164
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-13-45_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-13-45_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/scenario.spec.ts  (6 tests) 7ms
 ✓ src/claim-office.spec.ts  (21 tests) 10ms
 ✓ src/cli.spec.ts  (2 tests) 519ms

 Test Files  3 passed (3)
      Tests  29 passed (29)
   Start at  15:55:39
   Duration  933ms (transform 156ms, setup 0ms, collect 185ms, tests 536ms, environment 2ms, prepare 430ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 85% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 116 | ×2 | 232 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 12 | ×5 | 60 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **879** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 16 |
| Longest Function | 29 lines |
| Avg LOC/Function | 7.56 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 7 | 2.90 | 0 |
| Cognitive (SonarJS) | 6 | 2.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 846992 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 7 |
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


