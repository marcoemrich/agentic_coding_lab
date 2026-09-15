# Analysis Report: 2026-09-15_12-58-34_claim-office-example-mapping_exact-tcr-v1.3-domain-boundary-trial-pi_gpt-5-6-sol-codex

Generated: 2026-09-15T13:24:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1.3-domain-boundary-trial-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1552s |
| Started | 2026-09-15T12:58:35+00:00 |
| Ended | 2026-09-15T13:24:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 171
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 223
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-15_12-58-34_claim-office-example-mapping_exact-tcr-v1.3-domain-boundary-trial-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-15_12-58-34_claim-office-example-mapping_exact-tcr-v1.3-domain-boundary-trial-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (37 tests) 2914ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  13:24:31
   Duration  3.21s (transform 64ms, setup 0ms, collect 67ms, tests 2.91s, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 6 | ×5 | 30 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **552** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 148 |
| Functions | 16 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.62 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.42 | 0 |
| Cognitive (SonarJS) | 3 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4620901 |
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
| Predictions Correct | 69 |
| Predictions Total | 70 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


