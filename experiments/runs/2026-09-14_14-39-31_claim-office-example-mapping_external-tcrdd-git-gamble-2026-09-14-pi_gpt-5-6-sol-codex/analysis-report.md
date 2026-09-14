# Analysis Report: 2026-09-14_14-39-31_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:59:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 592s |
| Started | 2026-09-14T14:39:32+00:00 |
| Ended | 2026-09-14T14:49:27+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node.d.ts
- **Implementation LOC** (total): 137
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 124
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (9 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-39-31_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-39-31_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (9 tests) 1311ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Start at  15:59:48
   Duration  1.71s (transform 52ms, setup 0ms, collect 51ms, tests 1.31s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 59 | ×2 | 118 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **573** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 126 |
| Functions | 8 |
| Longest Function | 17 lines |
| Avg LOC/Function | 8.62 |
| Median LOC/Function | 7.50 |
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
| McCabe (Cyclomatic) | 6 | 2.75 | 0 |
| Cognitive (SonarJS) | 8 | 3.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1296616 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 11 |
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


