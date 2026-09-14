# Analysis Report: 2026-09-14_14-38-05_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:59:27+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 410s |
| Started | 2026-09-14T14:38:06+00:00 |
| Ended | 2026-09-14T14:44:59+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 138
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 99
- **Active tests**: 8
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-38-05_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-38-05_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (14 tests) 6ms
 ✓ src/cli.spec.ts  (2 tests) 360ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  15:59:28
   Duration  712ms (transform 76ms, setup 0ms, collect 85ms, tests 366ms, environment 0ms, prepare 211ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 6 | ×5 | 30 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **590** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 127 |
| Functions | 10 |
| Longest Function | 17 lines |
| Avg LOC/Function | 6.60 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 6 | 2.77 | 0 |
| Cognitive (SonarJS) | 8 | 3.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1016512 |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


