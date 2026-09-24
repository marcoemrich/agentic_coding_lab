# Analysis Report: 2026-09-24_04-57-44_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-09-24T05:23:29+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1541s |
| Started | 2026-09-24T04:57:45+00:00 |
| Ended | 2026-09-24T05:23:29+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 114
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 144
- **Active tests**: 27
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-57-44_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-57-44_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (43 tests) 8008ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  05:23:30
   Duration  8.37s (transform 89ms, setup 0ms, collect 72ms, tests 8.01s, environment 0ms, prepare 97ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 54 | ×2 | 108 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 43 | ×6 | 258 |
| **Total Mass** | | | **512** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 103 |
| Functions | 10 |
| Longest Function | 24 lines |
| Avg LOC/Function | 7.00 |
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
| McCabe (Cyclomatic) | 8 | 2.11 | 0 |
| Cognitive (SonarJS) | 5 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3045546 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 18 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


