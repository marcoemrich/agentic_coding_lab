# Analysis Report: 2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

Generated: 2026-09-23T13:27:34+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1636s |
| Started | 2026-09-23T13:00:05+00:00 |
| Ended | 2026-09-23T13:27:34+00:00 |

## Code Metrics

- **Implementation files**: claims.ts, cli.ts, pricing.ts
- **Implementation LOC** (total): 109
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 87
- **Active tests**: 1
- **Remaining todos**: 1

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (45 tests) 4773ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  13:27:35
   Duration  5.15s (transform 65ms, setup 0ms, collect 61ms, tests 4.77s, environment 0ms, prepare 103ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 56 | ×2 | 112 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **572** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 103 |
| Functions | 11 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.18 |
| Median LOC/Function | 3.00 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 4 | 1.83 | 0 |
| Cognitive (SonarJS) | 5 | 1.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4329100 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 50 |
| Predictions Total | 50 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


