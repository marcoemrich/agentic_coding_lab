# Analysis Report: 2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-3

Generated: 2026-09-23T13:06:33+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 376s |
| Started | 2026-09-23T13:00:04+00:00 |
| Ended | 2026-09-23T13:06:33+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 108
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 83
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-3

 ✓ src/claim-office.spec.ts  (45 tests) 1407ms

 Test Files  1 passed (1)
      Tests  45 passed (45)
   Start at  13:06:35
   Duration  1.89s (transform 110ms, setup 1ms, collect 117ms, tests 1.41s, environment 0ms, prepare 155ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 52 | ×2 | 104 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 6 | ×5 | 30 |
| Assignments | 42 | ×6 | 252 |
| **Total Mass** | | | **496** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 97 |
| Functions | 10 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.80 |
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
| McCabe (Cyclomatic) | 4 | 1.76 | 0 |
| Cognitive (SonarJS) | 3 | 1.86 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 732743 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 3 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 6 |
| Predictions Total | 6 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


