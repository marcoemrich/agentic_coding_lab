# Analysis Report: 2026-10-23_04-13-04_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

Generated: 2026-10-23T04:27:21+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 852s |
| Started | 2026-10-23T04:13:05+00:00 |
| Ended | 2026-10-23T04:27:20+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, itemCatalog.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 386
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 524
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-13-04_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-13-04_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

 ✓ src/claim-office.spec.ts  (42 tests) 839ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  04:27:22
   Duration  1.14s (transform 85ms, setup 0ms, collect 84ms, tests 839ms, environment 0ms, prepare 72ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 114 | ×2 | 228 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 15 | ×5 | 75 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **832** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 290 |
| Functions | 25 |
| Longest Function | 15 lines |
| Avg LOC/Function | 5.48 |
| Median LOC/Function | 5.00 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 5 | 1.83 | 0 |
| Cognitive (SonarJS) | 6 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 8429519 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 31 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


