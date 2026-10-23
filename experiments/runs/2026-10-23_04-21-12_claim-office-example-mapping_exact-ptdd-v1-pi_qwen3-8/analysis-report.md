# Analysis Report: 2026-10-23_04-21-12_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

Generated: 2026-10-23T04:31:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | qwen3-8 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 638s |
| Started | 2026-10-23T04:21:13+00:00 |
| Ended | 2026-10-23T04:31:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 285
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 507
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-23_04-21-12_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-23_04-21-12_claim-office-example-mapping_exact-ptdd-v1-pi_qwen3-8

 ✓ src/claim-office.spec.ts  (42 tests) 551ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  04:31:55
   Duration  845ms (transform 83ms, setup 0ms, collect 75ms, tests 551ms, environment 0ms, prepare 81ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 86% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 93 | ×2 | 186 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 12 | ×5 | 60 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **732** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 250 |
| Functions | 19 |
| Longest Function | 20 lines |
| Avg LOC/Function | 7.63 |
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
| McCabe (Cyclomatic) | 6 | 2.46 | 0 |
| Cognitive (SonarJS) | 6 | 2.25 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9593094 |
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
| Predictions Correct | 47 |
| Predictions Total | 47 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 22 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


