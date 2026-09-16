# Analysis Report: 2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex-5

Generated: 2026-09-16T12:13:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1.6-test-list-dimensions-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 826s |
| Started | 2026-09-16T11:59:29+00:00 |
| Ended | 2026-09-16T12:13:23+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 135
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 74
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-16_11-59-27_claim-office-example-mapping_exact-sol-v1.6-test-list-dimensions-pi_gpt-5-6-sol-codex-5

 ✓ src/claim-office.spec.ts  (41 tests) 1191ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  12:13:24
   Duration  1.57s (transform 101ms, setup 0ms, collect 116ms, tests 1.19s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 61 | ×2 | 122 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **579** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 120 |
| Functions | 12 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.75 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 4 | 1.79 | 0 |
| Cognitive (SonarJS) | 3 | 1.88 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1876791 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 41 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 22 |
| Predictions Total | 22 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 11 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


