# Analysis Report: 2026-08-16_21-17-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T21:21:05+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v3-basic-tdd-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 242s |
| Started | 2026-08-16T21:17:01+00:00 |
| Ended | 2026-08-16T21:21:05+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 185
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 65
- **Active tests**: 5
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (5 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-17-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-17-01_claim-office-example-mapping_v3-basic-tdd-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (5 tests) 4ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  21:21:06
   Duration  216ms (transform 33ms, setup 0ms, collect 31ms, tests 4ms, environment 0ms, prepare 58ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 90 | ×2 | 180 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 7 | ×5 | 35 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **675** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 164 |
| Functions | 14 |
| Longest Function | 19 lines |
| Avg LOC/Function | 7.71 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 6 | 2.94 | 0 |
| Cognitive (SonarJS) | 4 | 2.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 216962 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


