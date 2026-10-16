# Analysis Report: 2026-10-06_04-24-45_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex-3

Generated: 2026-10-06T04:49:15+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1463s |
| Started | 2026-10-06T04:24:47+00:00 |
| Ended | 2026-10-06T04:49:15+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 141
- **Test files**: office.spec.ts
- **Test LOC** (total): 248
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-06_04-24-45_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-06_04-24-45_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex-3

 ✓ src/office.spec.ts  (57 tests) 584ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  04:49:16
   Duration  862ms (transform 65ms, setup 0ms, collect 64ms, tests 584ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 58 | ×2 | 116 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 5 | ×5 | 25 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **493** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 120 |
| Functions | 14 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.14 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 3 | 1.71 | 0 |
| Cognitive (SonarJS) | 2 | 1.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 11365684 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 113 |
| Predictions Total | 114 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 58 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


