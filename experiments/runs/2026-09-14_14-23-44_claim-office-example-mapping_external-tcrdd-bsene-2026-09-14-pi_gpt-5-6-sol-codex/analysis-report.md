# Analysis Report: 2026-09-14_14-23-44_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:57:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 472s |
| Started | 2026-09-14T14:23:45+00:00 |
| Ended | 2026-09-14T14:31:40+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 129
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 139
- **Active tests**: 12
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (12 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-23-44_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-23-44_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (10 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 312ms

 Test Files  2 passed (2)
      Tests  12 passed (12)
   Start at  15:57:44
   Duration  707ms (transform 117ms, setup 0ms, collect 124ms, tests 319ms, environment 0ms, prepare 235ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 9 | ×5 | 45 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **584** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 118 |
| Functions | 8 |
| Longest Function | 16 lines |
| Avg LOC/Function | 8.00 |
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
| McCabe (Cyclomatic) | 5 | 2.33 | 0 |
| Cognitive (SonarJS) | 5 | 2.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1693881 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 14 |
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
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


