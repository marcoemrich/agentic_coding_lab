# Analysis Report: 2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex

Generated: 2026-08-17T14:14:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-app-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1189s |
| Started | 2026-08-17T13:54:51+00:00 |
| Ended | 2026-08-17T14:14:41+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 167
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 247
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-17_13-54-51_claim-office-example-mapping_basic-sol-tdd-app-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (35 tests) 2709ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  14:14:42
   Duration  2.93s (transform 54ms, setup 0ms, collect 51ms, tests 2.71s, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 11 | ×5 | 55 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **546** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 147 |
| Functions | 9 |
| Longest Function | 12 lines |
| Avg LOC/Function | 6.44 |
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
| McCabe (Cyclomatic) | 6 | 1.90 | 0 |
| Cognitive (SonarJS) | 4 | 2.12 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4480025 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 26 |
| Predictions Total | 26 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


