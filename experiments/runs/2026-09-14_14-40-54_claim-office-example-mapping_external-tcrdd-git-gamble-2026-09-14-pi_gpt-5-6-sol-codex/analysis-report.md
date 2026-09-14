# Analysis Report: 2026-09-14_14-40-54_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T16:00:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 618s |
| Started | 2026-09-14T14:40:55+00:00 |
| Ended | 2026-09-14T14:51:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 123
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 174
- **Active tests**: 14
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (14 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-40-54_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-40-54_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (12 tests) 7ms
 ✓ src/cli.spec.ts  (2 tests) 866ms

 Test Files  2 passed (2)
      Tests  14 passed (14)
   Start at  16:00:10
   Duration  1.25s (transform 111ms, setup 0ms, collect 119ms, tests 873ms, environment 0ms, prepare 199ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 51 | ×2 | 102 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **530** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 114 |
| Functions | 6 |
| Longest Function | 19 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 9.00 |
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
| McCabe (Cyclomatic) | 6 | 1.71 | 0 |
| Cognitive (SonarJS) | 4 | 2.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2827452 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 15 |
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


