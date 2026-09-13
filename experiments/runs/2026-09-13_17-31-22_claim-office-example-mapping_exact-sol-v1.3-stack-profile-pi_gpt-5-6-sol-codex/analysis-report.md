# Analysis Report: 2026-09-13_17-31-22_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

Generated: 2026-09-13T17:48:50+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.3-stack-profile-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1042s |
| Started | 2026-09-13T17:31:24+00:00 |
| Ended | 2026-09-13T17:48:50+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 119
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 199
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (29 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_17-31-22_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_17-31-22_claim-office-example-mapping_exact-sol-v1.3-stack-profile-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (29 tests) 1555ms

 Test Files  1 passed (1)
      Tests  29 passed (29)
   Start at  17:48:52
   Duration  2.07s (transform 119ms, setup 0ms, collect 120ms, tests 1.55s, environment 0ms, prepare 163ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 61 | ×1 | 61 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 7 | ×5 | 35 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **498** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 108 |
| Functions | 6 |
| Longest Function | 18 lines |
| Avg LOC/Function | 8.33 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 5 | 1.75 | 0 |
| Cognitive (SonarJS) | 5 | 2.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4711023 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 29 |
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
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


