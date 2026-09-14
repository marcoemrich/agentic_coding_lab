# Analysis Report: 2026-09-14_14-28-01_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:58:03+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 657s |
| Started | 2026-09-14T14:28:02+00:00 |
| Ended | 2026-09-14T14:39:03+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 127
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 179
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-28-01_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-28-01_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (16 tests) 11ms
 ✓ src/cli.spec.ts  (2 tests) 392ms

 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  15:58:04
   Duration  751ms (transform 77ms, setup 0ms, collect 126ms, tests 403ms, environment 0ms, prepare 188ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 89% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **534** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 116 |
| Functions | 4 |
| Longest Function | 20 lines |
| Avg LOC/Function | 11.00 |
| Median LOC/Function | 11.00 |
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
| McCabe (Cyclomatic) | 5 | 1.80 | 0 |
| Cognitive (SonarJS) | 4 | 2.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2391092 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 18 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


