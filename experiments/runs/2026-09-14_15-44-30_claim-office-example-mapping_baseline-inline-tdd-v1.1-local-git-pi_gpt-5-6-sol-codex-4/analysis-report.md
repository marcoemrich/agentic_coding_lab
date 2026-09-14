# Analysis Report: 2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-4

Generated: 2026-09-14T16:01:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 258s |
| Started | 2026-09-14T15:44:32+00:00 |
| Ended | 2026-09-14T15:48:57+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 202
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 106
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (15 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-4
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_15-44-30_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-pi_gpt-5-6-sol-codex-4

 ✓ src/claim-office.spec.ts  (15 tests) 6ms

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  16:01:32
   Duration  359ms (transform 61ms, setup 0ms, collect 59ms, tests 6ms, environment 0ms, prepare 87ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 81% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 24 | ×4 | 96 |
| Loops | 11 | ×5 | 55 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **736** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 181 |
| Functions | 14 |
| Longest Function | 22 lines |
| Avg LOC/Function | 7.57 |
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
| McCabe (Cyclomatic) | 12 | 3.00 | 1 |
| Cognitive (SonarJS) | 9 | 2.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 308090 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 4 |
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


