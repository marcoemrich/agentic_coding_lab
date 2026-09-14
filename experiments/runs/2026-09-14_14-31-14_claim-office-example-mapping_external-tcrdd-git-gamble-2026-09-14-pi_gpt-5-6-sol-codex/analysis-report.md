# Analysis Report: 2026-09-14_14-31-14_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:58:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-git-gamble-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 581s |
| Started | 2026-09-14T14:31:15+00:00 |
| Ended | 2026-09-14T14:41:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 138
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 127
- **Active tests**: 11
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (11 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-31-14_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-31-14_claim-office-example-mapping_external-tcrdd-git-gamble-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (11 tests) 259ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  15:58:48
   Duration  612ms (transform 55ms, setup 0ms, collect 51ms, tests 259ms, environment 0ms, prepare 84ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 7 | ×5 | 35 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **543** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 123 |
| Functions | 6 |
| Longest Function | 19 lines |
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
| McCabe (Cyclomatic) | 6 | 2.75 | 0 |
| Cognitive (SonarJS) | 5 | 2.71 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1287786 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
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
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


