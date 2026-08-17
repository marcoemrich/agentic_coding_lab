# Analysis Report: 2026-08-17_00-24-28_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T00:45:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1242s |
| Started | 2026-08-17T00:24:28+00:00 |
| Ended | 2026-08-17T00:45:11+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 99
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 162
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_00-24-28_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_00-24-28_claim-office-example-mapping_v6.2.1-phase-continuation-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 6ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  00:45:12
   Duration  177ms (transform 37ms, setup 0ms, collect 36ms, tests 6ms, environment 0ms, prepare 46ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 42 | ×2 | 84 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **480** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 90 |
| Functions | 4 |
| Longest Function | 9 lines |
| Avg LOC/Function | 5.75 |
| Median LOC/Function | 6.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **13** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 1.93 | 0 |
| Cognitive (SonarJS) | 11 | 3.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5597706 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
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
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


