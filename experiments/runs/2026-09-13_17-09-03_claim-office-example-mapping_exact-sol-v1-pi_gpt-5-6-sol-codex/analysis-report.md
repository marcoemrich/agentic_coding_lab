# Analysis Report: 2026-09-13_17-09-03_claim-office-example-mapping_exact-sol-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-13T17:30:46+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-sol-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1294s |
| Started | 2026-09-13T17:09:05+00:00 |
| Ended | 2026-09-13T17:30:45+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 139
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 183
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_17-09-03_claim-office-example-mapping_exact-sol-v1-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_17-09-03_claim-office-example-mapping_exact-sol-v1-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (33 tests) 10ms
 ✓ src/cli.spec.ts  (2 tests) 1543ms

 Test Files  2 passed (2)
      Tests  35 passed (35)
   Start at  17:30:47
   Duration  2.25s (transform 95ms, setup 0ms, collect 89ms, tests 1.55s, environment 0ms, prepare 221ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 5 | ×5 | 25 |
| Assignments | 65 | ×6 | 390 |
| **Total Mass** | | | **634** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 125 |
| Functions | 12 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.92 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 4 | 1.57 | 0 |
| Cognitive (SonarJS) | 3 | 1.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6073034 |
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
| Predictions Correct | 30 |
| Predictions Total | 30 |
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


