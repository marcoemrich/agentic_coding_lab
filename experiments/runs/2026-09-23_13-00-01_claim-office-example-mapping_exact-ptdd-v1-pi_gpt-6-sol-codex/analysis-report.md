# Analysis Report: 2026-09-23_13-00-01_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-23T13:24:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1453s |
| Started | 2026-09-23T13:00:06+00:00 |
| Ended | 2026-09-23T13:24:33+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, examples.ts, quote.ts
- **Implementation LOC** (total): 177
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 46
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-00-01_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-00-01_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (41 tests) 5195ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  13:24:35
   Duration  5.56s (transform 113ms, setup 0ms, collect 85ms, tests 5.20s, environment 0ms, prepare 110ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 43% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 284 | ×1 | 284 |
| Invocations | 186 | ×2 | 372 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 9 | ×5 | 45 |
| Assignments | 61 | ×6 | 366 |
| **Total Mass** | | | **1139** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 19 |
| Longest Function | 38 lines |
| Avg LOC/Function | 6.05 |
| Median LOC/Function | 2.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 5 | 1.96 | 0 |
| Cognitive (SonarJS) | 4 | 2.56 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 6007889 |
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
| Predictions Correct | 82 |
| Predictions Total | 82 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 41 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


