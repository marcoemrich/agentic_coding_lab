# Analysis Report: 2026-10-01_02-22-19_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-01T03:07:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 2678s |
| Started | 2026-10-01T02:22:19+00:00 |
| Ended | 2026-10-01T03:07:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, scenario.ts
- **Implementation LOC** (total): 450
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 542
- **Active tests**: 58
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (58 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_02-22-19_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_02-22-19_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (58 tests) 4138ms

 Test Files  1 passed (1)
      Tests  58 passed (58)
   Start at  03:07:02
   Duration  4.50s (transform 116ms, setup 0ms, collect 113ms, tests 4.14s, environment 0ms, prepare 79ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 79 | ×1 | 79 |
| Invocations | 131 | ×2 | 262 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 13 | ×5 | 65 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **878** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 299 |
| Functions | 35 |
| Longest Function | 12 lines |
| Avg LOC/Function | 5.09 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.37 | 0 |
| Cognitive (SonarJS) | 2 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 32737586 |
| Context Utilization | 89% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 73.35s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 73.35s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 49 |
| Predictions Total | 50 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


