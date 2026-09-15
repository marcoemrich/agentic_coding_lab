# Analysis Report: 2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T23:56:00+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-tcr-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1017s |
| Started | 2026-09-14T23:38:58+00:00 |
| Ended | 2026-09-14T23:56:00+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 116
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 209
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_23-38-56_claim-office-example-mapping_exact-tcr-v1-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 3532ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  23:56:01
   Duration  3.86s (transform 125ms, setup 0ms, collect 67ms, tests 3.53s, environment 0ms, prepare 97ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 88% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **538** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 105 |
| Functions | 8 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.50 |
| Median LOC/Function | 6.00 |
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
| McCabe (Cyclomatic) | 3 | 1.41 | 0 |
| Cognitive (SonarJS) | 2 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5939156 |
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
| Predictions Correct | 68 |
| Predictions Total | 68 |
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


